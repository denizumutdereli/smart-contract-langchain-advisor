import { useState, useEffect, useRef } from "react";

import ConfirmationOverlay from "../ConfirmationOverlay/ConfirmationOverlay";
import chatService from "../../utils/chatService";

import {
  AiOutlineUser,
  AiOutlineClear,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";

import styles from "./OptionsPopup.module.css";

export default function OptionsPopup({
  isPopupOpen,
  setPopupOpen,
  onLogout,
  buttonRef,
  setCurrentChat,
}) {
  const [isClearChatConfirmationOpen, setIsClearChatConfirmationOpen] =
    useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !buttonRef.current.contains(event.target) &&
        !popupRef.current.contains(event.target)
      ) {
        setPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isPopupOpen]);

  const toggleClearChatClick = () => {
    setIsClearChatConfirmationOpen(!isClearChatConfirmationOpen);
  };

  const handleCancelClear = () => {
    toggleClearChatClick();
  };

  const handleClearChats = async () => {
    await chatService.deleteAllChats();
    setCurrentChat(null);
    toggleClearChatClick();
  };

  return (
    <div
      ref={popupRef}
      className={`${styles.popupMenu} ${isPopupOpen ? styles.active : ""}`}
    >
      <div className={styles.popupOption}>
        <AiOutlineInfoCircle /> About
      </div>
      <div className={styles.popupOption}>
        <AiOutlineUser /> Edit User
      </div>
      <div
        className={`${styles.popupOption} ${styles.clearChatButton}`}
        onClick={toggleClearChatClick}
      >
        <AiOutlineClear /> Clear Chats
      </div>
      <div className={styles.seperator}></div>
      <div className={styles.popupOption} onClick={onLogout}>
        <MdOutlineLogout />
        Logout
      </div>
      {isClearChatConfirmationOpen && (
        <ConfirmationOverlay
          title="Clear Chats?"
          prompt="Are you sure you want to clear all chats?"
          onCancel={handleCancelClear}
          onConfirm={handleClearChats}
        />
      )}
    </div>
  );
}
