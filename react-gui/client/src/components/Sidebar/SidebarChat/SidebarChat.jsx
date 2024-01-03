import { useState, useRef, useEffect } from "react";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MdChatBubbleOutline } from "react-icons/md";

import chatService from "../../../utils/chatService";

import styles from "./SidebarChat.module.css";

export default function SidebarChat({
  chat,
  currentChat,
  setCurrentChat,
  onDeleteIconClick,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [chatTitle, setChatTitle] = useState(chat.title);
  const isCurrentChat = chat._id === currentChat?._id;

  const chatRef = useRef(null);

  async function handleChatClick() {
    const updatedChat = await chatService.getChat(chat._id);

    if (updatedChat.error) {
      console.error("Error getting chat:", updatedChat.error);
      return;
    }

    setCurrentChat(updatedChat);
  }

  function handleEditChatTitle(event) {
    event.preventDefault();
    if (isEditing) return;
    setIsEditing(true);
  }

  async function handleTitleSubmit(event) {
    event.preventDefault();

    setCurrentChat({ ...currentChat, title: chatTitle });
    await chatService.renameChat(chat._id, { title: chatTitle });
    setIsEditing(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div
      ref={chatRef}
      key={chat._id}
      className={
        isCurrentChat ? styles.conversationSelected : styles.conversation
      }
      onClick={handleChatClick}
    >
      <div className={styles.chatTitleContainer}>
        <MdChatBubbleOutline size={16} />
        {isEditing ? (
          <form onSubmit={handleTitleSubmit}>
            <input
              type="text"
              className={styles.chatTitleInput}
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
            />
          </form>
        ) : (
          chat.title
        )}
      </div>
      {isCurrentChat && (
        <div className={styles.iconContainer}>
          <button className={styles.editIcon} onClick={handleEditChatTitle}>
            <AiOutlineEdit size={17} />
          </button>
          <button
            className={styles.deleteIcon}
            onClick={() => onDeleteIconClick()}
          >
            <AiOutlineDelete size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
