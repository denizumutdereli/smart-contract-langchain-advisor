import { useRef, useState } from "react";

import OptionsPopup from "../../OptionsPopup/OptionsPopup";

import { SlOptions } from "react-icons/sl";

import styles from "./UserProfile.module.css";

export default function UserProfile({ onLogout, user, setCurrentChat }) {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleContainerClick = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <div className={styles.userProfileContainer}>
      <OptionsPopup
        isPopupOpen={isPopupOpen}
        setPopupOpen={setPopupOpen}
        onLogout={onLogout}
        buttonRef={buttonRef}
        setCurrentChat={setCurrentChat}
      />
      <button
        ref={buttonRef}
        onClick={handleContainerClick}
        className={`${styles.containerButton} ${
          isPopupOpen ? styles.containerButtonSelected : ""
        }`}
      >
        {/* <div className={styles.avatarContainer}>
          <img className={styles.userAvatar} src={user.photoUrl} alt="User" />
        </div> */}
        <div className={styles.userEmail}>{user.email}</div>
        <div className={styles.optionsButton}>
          <SlOptions />
        </div>
      </button>
    </div>
  );
}
