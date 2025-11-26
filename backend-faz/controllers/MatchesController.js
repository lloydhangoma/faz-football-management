import Match from '../models/Match.js';

/**
 * GET /api/matches - Get matches for the authenticated club
 */
export const getMatches = async (req, res) => {
  try {
    const clubId = req.clubId;
    const { status, competition, season } = req.query;

    const filter = {
      $or: [
        { homeTeamId: clubId },
        { awayTeamId: clubId },
      ],
    };

    if (status) filter.status = status;
    if (competition) filter.competition = competition;
    if (season) filter.season = season;

    const matches = await Match.find(filter)
      .populate('homeTeamId', 'club.name club.abbreviation club.logo')
      .populate('awayTeamId', 'club.name club.abbreviation club.logo')
      .sort({ date: -1 });

    return res.status(200).json({ ok: true, matches });
  } catch (err) {
    console.error('❌ Get matches error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch matches' });
  }
};

/**
 * GET /api/matches/:matchId - Get a single match
 */
export const getMatchById = async (req, res) => {
  try {
    const { matchId } = req.params;
    const clubId = req.clubId;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { homeTeamId: clubId },
        { awayTeamId: clubId },
      ],
    })
      .populate('homeTeamId')
      .populate('awayTeamId');

    if (!match) {
      return res.status(404).json({ ok: false, message: 'Match not found' });
    }

    return res.status(200).json({ ok: true, match });
  } catch (err) {
    console.error('❌ Get match by ID error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to fetch match' });
  }
};

/**
 * POST /api/matches - Create a new match
 */
export const createMatch = async (req, res) => {
  try {
    const clubId = req.clubId;
    const { homeTeamId, awayTeamId, date, venue, competition, season, round } = req.body;

    if (!homeTeamId || !awayTeamId || !date || !venue) {
      return res.status(400).json({
        ok: false,
        message: 'Missing required fields: homeTeamId, awayTeamId, date, venue',
      });
    }

    // Check if club is either home or away team
    if (clubId !== homeTeamId.toString() && clubId !== awayTeamId.toString()) {
      return res.status(403).json({
        ok: false,
        message: 'You can only create matches for your club',
      });
    }

    const match = new Match({
      homeTeamId,
      awayTeamId,
      date,
      venue,
      competition: competition || 'League',
      season,
      round,
      status: 'Scheduled',
    });

    await match.save();
    await match.populate('homeTeamId', 'club.name club.abbreviation club.logo');
    await match.populate('awayTeamId', 'club.name club.abbreviation club.logo');

    return res.status(201).json({
      ok: true,
      message: 'Match created successfully',
      match,
    });
  } catch (err) {
    console.error('❌ Create match error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to create match' });
  }
};

/**
 * PUT /api/matches/:matchId - Update a match
 */
export const updateMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const clubId = req.clubId;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.homeTeamId;
    delete updates.awayTeamId;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { homeTeamId: clubId },
        { awayTeamId: clubId },
      ],
    });

    if (!match) {
      return res.status(404).json({ ok: false, message: 'Match not found' });
    }

    // Update fields
    Object.assign(match, updates);
    await match.save();

    await match.populate('homeTeamId', 'club.name club.abbreviation club.logo');
    await match.populate('awayTeamId', 'club.name club.abbreviation club.logo');

    return res.status(200).json({
      ok: true,
      message: 'Match updated successfully',
      match,
    });
  } catch (err) {
    console.error('❌ Update match error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to update match' });
  }
};

/**
 * PUT /api/matches/:matchId/score - Update match score
 */
export const updateMatchScore = async (req, res) => {
  try {
    const { matchId } = req.params;
    const clubId = req.clubId;
    const { homeTeamScore, awayTeamScore, status } = req.body;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { homeTeamId: clubId },
        { awayTeamId: clubId },
      ],
    });

    if (!match) {
      return res.status(404).json({ ok: false, message: 'Match not found' });
    }

    if (homeTeamScore !== undefined) match.homeTeamScore = homeTeamScore;
    if (awayTeamScore !== undefined) match.awayTeamScore = awayTeamScore;
    if (status) match.status = status;
    if (status === 'Completed' && !match.completionDate) {
      match.completionDate = new Date();
    }

    await match.save();
    await match.populate('homeTeamId', 'club.name club.abbreviation club.logo');
    await match.populate('awayTeamId', 'club.name club.abbreviation club.logo');

    return res.status(200).json({
      ok: true,
      message: 'Match score updated successfully',
      match,
    });
  } catch (err) {
    console.error('❌ Update match score error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to update match score' });
  }
};

/**
 * DELETE /api/matches/:matchId - Delete a match
 */
export const deleteMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const clubId = req.clubId;

    const match = await Match.findOneAndDelete({
      _id: matchId,
      $or: [
        { homeTeamId: clubId },
        { awayTeamId: clubId },
      ],
    });

    if (!match) {
      return res.status(404).json({ ok: false, message: 'Match not found' });
    }

    return res.status(200).json({
      ok: true,
      message: 'Match deleted successfully',
    });
  } catch (err) {
    console.error('❌ Delete match error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to delete match' });
  }
};
