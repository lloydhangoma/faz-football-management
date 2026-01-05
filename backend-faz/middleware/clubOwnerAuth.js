import ClubsAdminPortalLogin from '../models/Clubs-Management-Panel/Clubs-AdminPortalLogin.js';

/**
 * Middleware to verify that a club admin can only access their own club's data
 * Usage: router.get('/clubs/:clubId/...', protectAdmin, clubOwnerCheck, controller)
 * Assumes req.user is set by protectAdmin middleware
 * Compares req.user.club._id with req.params.clubId
 */
export const clubOwnerCheck = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ ok: false, message: 'User not authenticated' });
    }

    // Get the club ID from the authenticated user.
    // Some user documents store the club as an embedded object (req.user.club)
    // and some store a clubId field. As a final fallback, use the user's own _id
    // because clubs are represented by the admin documents in this schema.
    const userClubId =
      req.user.club?._id?.toString?.() ||
      req.user.clubId?.toString?.() ||
      req.user._id?.toString?.();

    if (!userClubId) {
      return res.status(403).json({ ok: false, message: 'User has no club assigned' });
    }

    // Check if the requested clubId matches the user's club
    if (clubId && userClubId !== clubId) {
      return res.status(403).json({
        ok: false,
        message: 'You do not have permission to access this club\'s data',
      });
    }

    // Store clubId in req for easy access in controllers
    req.clubId = userClubId;
    next();
  } catch (err) {
    console.error('❌ Club owner check error:', err);
    return res.status(500).json({ ok: false, message: 'Authorization check failed' });
  }
};

/**
 * Simplified middleware for club-scoped endpoints that don't have clubId in params
 * Automatically injects clubId from authenticated user
 */
export const injectClubId = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: 'User not authenticated' });
    }

    req.clubId = req.user.club?._id?.toString?.() || req.user.clubId?.toString?.() || req.user._id?.toString?.();

    if (!req.clubId) {
      return res.status(403).json({ ok: false, message: 'User has no club assigned' });
    }

    next();
  } catch (err) {
    console.error('❌ Inject club ID error:', err);
    return res.status(500).json({ ok: false, message: 'Failed to inject club ID' });
  }
};
