// const { VITE_API_URL } = import.meta.env;
const API_URL = "http://localhost:3001/api/chats/";

import tokenService from "./tokenService";

// get all chats
async function getAllChats() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    const chats = await response.json();
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return []; 
  }
}

async function getChat(chatID) {
  try {
    const response = await fetch(API_URL + chatID, {
      headers: {
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat");
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error("Error fetching chat:", error);
    return { error: error.message };
  }
}

async function startChat(message) {
  try {
    const response = await fetch(API_URL + "create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
      body: JSON.stringify({
        title: message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error("Error creating chat:", error);
    return { error: error.message };
  }
}

async function deleteChat(chatID) {
  try {
    const response = await fetch(API_URL + "delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
      body: JSON.stringify({ chatID: chatID }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete chat");
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { error: error.message };
  }
}

async function sendPrompt(chatID, messageContent, model) {
  try {
    const response = await fetch(API_URL + "addMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
      body: JSON.stringify({
        chatID: chatID,
        messageContent: messageContent,
        model: model,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send prompt");
    }

    const prompt = await response.json();
    return prompt;
  } catch (error) {
    console.error("Error sending prompt:", error);
    return { error: error.message };
  }
}

async function renameChat(chatID, newTitle) {
  try {
    const response = await fetch(API_URL + "rename", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
      body: JSON.stringify({ chatID: chatID, newTitle: newTitle }),
    });

    if (!response.ok) {
      throw new Error("Failed to rename chat");
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error("Error renaming chat:", error);
    return { error: error.message };
  }
}

async function deleteAllChats() {
  try {
    const response = await fetch(API_URL + "deleteAll", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete all chats");
    }

    const chat = await response.json();
    return chat;
  } catch (error) {
    console.error("Error deleting all chats:", error);
    return { error: error.message };
  }
}

export default {
  getAllChats,
  startChat,
  deleteChat,
  sendPrompt,
  getChat,
  renameChat,
  deleteAllChats,
};
