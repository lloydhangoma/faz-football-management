import ClubsAdminPortalLogin from '../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js';

/**
 * GET /api/clubs/:clubId - Get club details
 */
export const getClubById = async (req, res) => {
  try {
    const { clubId } = req.params;
    const requestingClubId = req.clubId;

    // Only allow clubs to view their own details
    if (clubId !== requestingClubId) {
      return res.status(403).json({
        ok: false,
        message: 'You do not have permission to view this club\'s details',
      });
    }

    const club = await ClubsAdminPortalLogin.findById(clubId).select('-password');

    if (!club) {
      return res.status(404).json({ ok: false, message: 'Club not found' });
    }

    return res.status(200).json({ ok: true, club });
  } catch (err) {
    console.error('❌ Get club by ID error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch club' });
  }
};

/**
 * PUT /api/clubs/:clubId - Update club profile
 */
export const updateClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const requestingClubId = req.clubId;

    // Only allow clubs to update their own details
    if (clubId !== requestingClubId) {
      return res.status(403).json({
        ok: false,
        message: 'You do not have permission to update this club\'s details',
      });
    }

    const updates = req.body;

    // Prevent updating certain fields
    delete updates._id;
    delete updates.email; // Email should not be updated
    delete updates.password; // Password should not be updated here
    delete updates.role; // Role should not be updated here

    // Only allow updating club profile fields
    const allowedFields = [
      'club.name',
      'club.abbreviation',
      'club.homeStadium',
      'club.province',
      'club.foundingYear',
      'club.league',
      'club.currentLeaguePosition',
      'club.previousLeaguePosition',
      'club.leagueTitles',
      'club.cupsWon',
      'club.presidentName',
      'club.contactPhone',
      'club.websiteUrl',
      'club.socialMediaLinks',
    ];

    // Filter to only allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key) || key.startsWith('club.')) {
        filteredUpdates[key] = updates[key];
      }
    });

    const club = await ClubsAdminPortalLogin.findByIdAndUpdate(
      clubId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!club) {
      return res.status(404).json({ ok: false, message: 'Club not found' });
    }

    return res.status(200).json({
      ok: true,
      message: 'Club profile updated successfully',
      club,
    });
  } catch (err) {
    console.error('❌ Update club error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to update club' });
  }
};

/**
 * GET /api/clubs/:clubId/stats - Get club statistics
 */
export const getClubStats = async (req, res) => {
  try {
    const { clubId } = req.params;
    const requestingClubId = req.clubId;

    if (clubId !== requestingClubId) {
      return res.status(403).json({
        ok: false,
        message: 'You do not have permission to view this club\'s stats',
      });
    }

    const club = await ClubsAdminPortalLogin.findById(clubId);

    if (!club) {
      return res.status(404).json({ ok: false, message: 'Club not found' });
    }

    // Return club information structured as stats
    return res.status(200).json({
      ok: true,
      stats: {
        clubName: club.club.name,
        province: club.club.province,
        league: club.club.league,
        currentLeaguePosition: club.club.currentLeaguePosition,
        previousLeaguePosition: club.club.previousLeaguePosition,
        leagueTitles: club.club.leagueTitles,
        cupsWon: club.club.cupsWon,
        presidentName: club.club.presidentName,
        contactPhone: club.club.contactPhone,
        websiteUrl: club.club.websiteUrl,
        foundingYear: club.club.foundingYear,
      },
    });
  } catch (err) {
    console.error('❌ Get club stats error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch club stats' });
  }
};

/**
 * GET /api/clubs/:clubId/profile - Get full club profile
 */
export const getClubProfile = async (req, res) => {
  try {
    const { clubId } = req.params;
    const requestingClubId = req.clubId;

    if (clubId !== requestingClubId) {
      return res.status(403).json({
        ok: false,
        message: 'You do not have permission to view this club\'s profile',
      });
    }

    const club = await ClubsAdminPortalLogin.findById(clubId).select('-password');

    if (!club) {
      return res.status(404).json({ ok: false, message: 'Club not found' });
    }

    return res.status(200).json({
      ok: true,
      profile: {
        admin: {
          _id: club._id,
          name: club.name,
          email: club.email,
          role: club.role,
        },
        club: club.club,
      },
    });
  } catch (err) {
    console.error('❌ Get club profile error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch club profile' });
  }
};
