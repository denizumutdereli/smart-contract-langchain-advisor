import styles from "./Chat.module.css";

export default function NewChat() {
  return (
    <div className={styles.newChat}>
      <h1
        style={{
          fontWeight: "bold",
          fontSize: "2rem",
          color: "white",
          marginBottom: "20vh",
        }}
      >
        Smart-Contract Assistant
      </h1>
    </div>
  );
}
