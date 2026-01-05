import Player from '../../models/Player.js';
import ClubsAdminPortalLogin from '../../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js';
import { getNextLeagueRegistrationNumber } from '../../utils/registrationCounter.js';

export const listPending = async (req, res) => {
  try {
    const pending = await Player.find({ 'currentStatus.registrationStatus': 'Pending Approval' }).populate('clubId', 'name email');
    res.json({ ok: true, pending });
  } catch (err) {
    console.error('List pending players error', err);
    res.status(500).json({ ok: false, message: 'Failed to list pending players' });
  }
};

export const getById = async (req, res) => {
  try {
    const p = await Player.findById(req.params.id).populate('clubId', 'name email');
    if (!p) return res.status(404).json({ ok: false, message: 'Player not found' });
    res.json({ ok: true, player: p });
  } catch (err) {
    console.error('Get player by id error', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch player' });
  }
};

export const approve = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, force } = req.body || {};
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    player.currentStatus.registrationStatus = 'Approved';
    player.currentStatus.lastVerificationDate = new Date();
    if (note) player.currentStatus.verificationNotes = note;
    player.currentStatus.verificationHistory = player.currentStatus.verificationHistory || [];
    player.currentStatus.verificationHistory.push({
      action: 'Approved',
      by: req.user?._id,
      role: req.user?.role,
      note,
      force: !!force,
      date: new Date(),
    });

    // Assign a league registration number if this is a FAZ Super Admin approval
    // and the player does not already have one (idempotent).
    try {
      if (!player.leagueRegistrationNumber && req.user?.role === 'Super Admin') {
        // derive league code from club if possible
        let leagueCode = 'GEN';
        try {
          const club = await ClubsAdminPortalLogin.findById(player.clubId).select('club.abbreviation club.league').lean();
          if (club) leagueCode = (club.club?.abbreviation || club.club?.league || leagueCode).toString().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'GEN';
        } catch (e) {
          console.warn('Failed to derive league code, using GEN', e);
        }

        const { registrationNumber } = await getNextLeagueRegistrationNumber(leagueCode);
        player.leagueRegistrationNumber = registrationNumber;
        player.registrationLeague = leagueCode;
        player.registrationAssignedAt = new Date();
        player.registrationAssignedBy = req.user?._id;

        // also add to registrationHistory for record
        player.registrationHistory = player.registrationHistory || [];
        player.registrationHistory.push({
          association: 'FAZ',
          registrationNumber: registrationNumber,
          season: `${new Date().getFullYear()}`,
          startDate: new Date(),
          status: 'Active',
        });
      }

      await player.save();
      return res.json({ ok: true, message: 'Player approved', player });
    } catch (saveErr) {
      // Handle duplicate key (race assigning same registration number or unique constraint)
      if (saveErr?.code === 11000) {
        try {
          const reloaded = await Player.findById(id);
          return res.json({ ok: true, message: 'Player approved (concurrent)', player: reloaded });
        } catch (reloadErr) {
          console.error('Failed to reload player after duplicate key', reloadErr);
          return res.status(500).json({ ok: false, message: 'Failed to approve player after race' });
        }
      }
      throw saveErr;
    }
  } catch (err) {
    console.error('Approve player error', err);
    res.status(500).json({ ok: false, message: 'Failed to approve player' });
  }
};

export const rejectPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { note, force } = req.body || {};
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });

    player.currentStatus.registrationStatus = 'Rejected';
    player.currentStatus.lastVerificationDate = new Date();
    if (note) player.currentStatus.verificationNotes = note;
    player.currentStatus.verificationHistory = player.currentStatus.verificationHistory || [];
    player.currentStatus.verificationHistory.push({
      action: 'Rejected',
      by: req.user?._id,
      role: req.user?.role,
      note,
      force: !!force,
      date: new Date(),
    });

    await player.save();

    res.json({ ok: true, message: 'Player rejected', player });
  } catch (err) {
    console.error('Reject player error', err);
    res.status(500).json({ ok: false, message: 'Failed to reject player' });
  }
};

export default { listPending, getById, approve, rejectPlayer };
