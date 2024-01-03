import { useContext } from "react";
import { UserContext } from "../../App";
import Message from "../Message/Message";
import styles from "./Chat.module.css";
import scrollStyles from "./ChatScroll.module.css";

export default function Chat({ currentChat }) {
  const { user } = useContext(UserContext);

  const placeholderImageUrl = './profile.png';

  return (
    <div className={`${styles.chatContainer} ${scrollStyles.chatContainer}`}>
      {currentChat.messages.map((msg, index) => (
        <Message 
          userPhoto={user.photoUrl || placeholderImageUrl}
          key={index} 
          message={msg}
          source_contracts={msg.source_contracts || []} // Pass source_contracts to Message component
        />
      ))}
    </div>
  );
}
