const { queryGPT } = require("../services/openaiService");
const { ChatHistory, Message } = require("../models/chat");
const mongoose = require("mongoose");

module.exports = {
  getAllChats,
  getChat,
  addMessage,
  createChat,
  deleteChat,
  renameChat,
  createTitleName,
  deleteAllChats,
};

async function getAllChats(req, res) {
  try {
    const chats = await ChatHistory.find({ userID: req.user._id }).sort({
      updatedAt: -1,
    });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getChat(req, res) {
  try {
    const chat = await ChatHistory.findById(req.params.id).populate("messages");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    if (String(chat.userID) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ error: "You are not authorized to access this chat." });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function createChat(req, res) {
  try {
    const { title } = req.body;
    console.log(req.body);
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const newChat = new ChatHistory({
      userID: mongoose.Types.ObjectId(req.user._id.toString()),
      title: title,
      messages: [],
    });

    await newChat.save();

    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function addMessage(req, res) {
  const model = req.body.model;

  try {
    const chat = await ChatHistory.findById(req.body.chatID).populate("messages");
    if (!chat) throw new Error("Chat not found.");

    const userMessage = new Message({
      content: req.body.messageContent,
      role: "user",
    });

    let gptResponse;

    try {
      gptResponse = await queryGPT([userMessage], model);

      if (!gptResponse || !gptResponse.result) {
        throw new Error("Invalid GPT response.");
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }

    await userMessage.save();
    chat.messages.push(userMessage._id);

    const assistantMessage = new Message({
      content: gptResponse.result,  
      source_contracts: gptResponse.source_contracts,
      role: "assistant" 
    });
    await assistantMessage.save();
    chat.messages.push(assistantMessage._id);

    await chat.save();

    res.status(200).json({
      chatID: chat._id,
      userMessage: userMessage,
      //sourceCodes: gptResponse.sourceCodes,
      sourceContracts: gptResponse.source_contracts,
      assistantMessage: assistantMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteChat(req, res) {
  try {
    const { chatID } = req.body;
    if (!chatID) {
      return res.status(400).json({ error: "Chat ID is required." });
    }

    const chat = await ChatHistory.findById(chatID);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    if (String(chat.userID) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this chat." });
    }

    await Message.deleteMany({ _id: { $in: chat.messages } });

    await ChatHistory.findByIdAndRemove(chatID);

    res.status(200).json({ message: "Chat deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function renameChat(req, res) {
  try {
    const { chatID, newTitle } = req.body;
    const renamedChat = await ChatHistory.findByIdAndUpdate(
      chatID,
      { title: newTitle.title },
      { new: true }
    );
    res.status(200).json(renamedChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function createTitleName(req, res) {
  try {
    const { message } = req.body;
    const prompt = `Provide a just the concise title for a chat conversation based on the following message (no quotes please): ${message}`;
    const titleName = await queryGPT(prompt, "gpt-3.5-turbo");

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteAllChats(req, res) {
  try {
    await ChatHistory.deleteMany({ userID: req.user._id });
    res.status(200).json({ message: "All chats deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
