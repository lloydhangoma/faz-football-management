import Player from '../../models/Player.js';

/**
 * GET /api/public/players - Public listing of players across all clubs
 * Query params: status, position, nationality, registrationStatus, search, limit
 */
export const getPublicPlayers = async (req, res) => {
  try {
    const { status, position, nationality, registrationStatus, search, limit } = req.query;

    // Build filter without club scoping
    const filter = {};

    if (status) filter.status = status;
    if (position) filter.position = position;
    if (nationality) filter.nationality = nationality;
    if (registrationStatus) filter['currentStatus.registrationStatus'] = registrationStatus;

    // Only show players that are approved/active by default
    if (!status && !registrationStatus) {
      filter.$or = [
        { 'currentStatus.registrationStatus': 'Approved' },
        { status: 'Active' },
      ];
    }

    if (search) {
      filter.$or = filter.$or || [];
      filter.$or.push(
        { name: { $regex: search, $options: 'i' } },
        { nrc: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      );
    }

    const lim = Math.min(100, parseInt(limit || '100', 10));

    const players = await Player.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(lim);

    return res.status(200).json({ ok: true, players });
  } catch (err) {
    console.error('❌ Get public players error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch public players' });
  }
};

/**
 * GET /api/public/players/:id - Get a single public player by ID
 */
export const getPublicPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id).select('-__v');
    if (!player) return res.status(404).json({ ok: false, message: 'Player not found' });
    return res.status(200).json({ ok: true, player });
  } catch (err) {
    console.error('❌ Get public player by ID error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch player' });
  }
};
