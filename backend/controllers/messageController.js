import messageModel from "../models/messageModel.js";
import conversationModel from "../models/conversationModel.js";

const sendMessage = async (req, res) => {
  try {
    const { userId } = req.headers;
    const { recipientId, content, conversationId } = req.body;

    if (!recipientId || !content) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let conversation;

    if (conversationId) {
      conversation = await conversationModel.findById(conversationId);
    } else {
      conversation = await conversationModel.findOne({
        participants: { $all: [userId, recipientId] }
      });

      if (!conversation) {
        conversation = await conversationModel.create({
          participants: [userId, recipientId],
          createdAt: Date.now()
        });
      }
    }

    const message = await messageModel.create({
      conversationId: conversation._id,
      senderId: userId,
      recipientId,
      content,
      createdAt: Date.now()
    });

    await conversationModel.findByIdAndUpdate(conversation._id, {
      lastMessage: content,
      lastMessageTime: Date.now(),
      lastMessageSenderId: userId
    });

    res.json({ success: true, message });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId, limit = 50, page = 1 } = req.body;

    if (!conversationId) {
      return res.json({ success: false, message: "Conversation ID required" });
    }

    const skip = (page - 1) * limit;

    const messages = await messageModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await messageModel.countDocuments({ conversationId });

    res.json({
      success: true,
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const { userId } = req.headers;

    const conversations = await conversationModel
      .find({ participants: userId })
      .sort({ lastMessageTime: -1 });

    res.json({ success: true, conversations });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      return res.json({ success: false, message: "Conversation ID required" });
    }

    await messageModel.deleteMany({ conversationId });

    await conversationModel.findByIdAndDelete(conversationId);

    res.json({ success: true, message: "Conversation deleted" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { sendMessage, getMessages, getConversations, deleteConversation };
