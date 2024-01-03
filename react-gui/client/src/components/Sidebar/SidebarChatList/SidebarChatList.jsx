import SidebarChat from "../SidebarChat/SidebarChat";

import styles from "./SidebarChatList.module.css";
import scrollingStyles from "../SidebarScrolling.module.css";

export default function SidebarChatList({
  chats,
  currentChat,
  setCurrentChat,
  onDeleteIconClick,
}) {
  return (
    <div className={`${styles.chatHistory} ${scrollingStyles.chatHistory}`}>
      {chats.map((chat) => (
        <SidebarChat
          key={chat._id}
          chat={chat}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          onDeleteIconClick={onDeleteIconClick}
        />
      ))}
    </div>
  );
}
