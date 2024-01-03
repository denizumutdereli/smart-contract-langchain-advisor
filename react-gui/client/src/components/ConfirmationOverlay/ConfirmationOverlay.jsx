import styles from "./ConfirmationOverlay.module.css";

export default function ConfirmationOverlay({
  title,
  prompt,
  onCancel,
  onConfirm,
}) {
  return (
    <div className={styles.confirmationOverlay}>
      <div className={styles.confirmationPopup}>
        <h2>{title}</h2>
        <div style={{ borderBottom: "1px solid #4d4d4f" }}></div>
        <p>{prompt}</p>
        <div className={styles.buttonsContainer}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.deleteButton} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
