import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

import SidebarChatList from "./SidebarChatList/SidebarChatList";
import UserProfile from "./UserProfile/UserProfile";
import ConfimationOverlay from "../ConfirmationOverlay/ConfirmationOverlay";

import chatService from "../../utils/chatService";

import { FaPlus } from "react-icons/fa";

import styles from "./Sidebar.module.css";

export default function Sidebar({ currentChat, setCurrentChat }) {
  const { user, handleLogout } = useContext(UserContext);

  const [chats, setChats] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  async function getChats() {
    const chats = await chatService.getAllChats();
    setChats(chats);
  }

  useEffect(() => {
    getChats();
  }, [currentChat]);

  function toggleDeleteConfirmation() {
    setShowDeleteConfirmation(!showDeleteConfirmation);
  }

  async function handleDeleteChat() {
    await chatService.deleteChat(currentChat._id);
    setCurrentChat(null);
    setShowDeleteConfirmation(false);
  }

  return (
    <nav className={styles.sidebar}>
      <button
        onClick={() => setCurrentChat(null)}
        className={`${
          currentChat
            ? `${styles.addChatButton} ${styles.addChatButtonInactive}`
            : `${styles.addChatButton} ${styles.addChatButtonActive}`
        }`}
      >
        <FaPlus /> New Chat
      </button>

      <SidebarChatList
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        onDeleteIconClick={toggleDeleteConfirmation}
      />

      <UserProfile
        user={user}
        onLogout={handleLogout}
        setCurrentChat={setCurrentChat}
      />

      {showDeleteConfirmation && (
        <ConfimationOverlay
          title="Delete Chat?"
          prompt={
            <>
              Are you sure you want to delete{" "}
              <strong>{currentChat.title}</strong>?
            </>
          }
          onCancel={toggleDeleteConfirmation}
          onConfirm={handleDeleteChat}
        />
      )}
    </nav>
  );
}
