import Settings from '../models/Settings.js';

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });

    // Create default settings if not exists
    if (!settings) {
      settings = await Settings.create({
        userId: req.user.id
      });
    }

    res.json({
      success: true,
      settings: {
        theme: settings.theme,
        aiEnabled: settings.aiEnabled,
        notifications: settings.notifications,
        preferences: settings.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = await Settings.create({
        userId: req.user.id,
        ...req.body
      });
    } else {
      const { theme, aiEnabled, notifications, preferences } = req.body;

      if (theme) {
        settings.theme = { ...settings.theme, ...theme };
      }
      if (aiEnabled !== undefined) {
        settings.aiEnabled = aiEnabled;
      }
      if (notifications) {
        settings.notifications = { ...settings.notifications, ...notifications };
      }
      if (preferences) {
        settings.preferences = { ...settings.preferences, ...preferences };
      }

      await settings.save();
    }

    res.json({
      success: true,
      settings: {
        theme: settings.theme,
        aiEnabled: settings.aiEnabled,
        notifications: settings.notifications,
        preferences: settings.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};
