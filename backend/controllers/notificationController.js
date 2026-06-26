import notificationModel from "../models/notificationModel.js";

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }

    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.json({ success: false, message: "Notification ID required" });
    }

    await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }

    await notificationModel.updateMany({ userId }, { isRead: true });

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;

    await notificationModel.findByIdAndDelete(notificationId);

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }

    const count = await notificationModel.countDocuments({ userId, isRead: false });

    res.json({ success: true, unreadCount: count });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount };
