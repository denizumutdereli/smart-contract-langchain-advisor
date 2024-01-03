import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WelcomePage.module.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className={styles.centeredContainer}>
      <div className={styles.title}>Welcome to Smart Contract Advisor</div>
      <div className={styles.subtitle}>By Deniz Umut</div>
      <div className={styles.instructions}>
        Please log in with an account to proceed
      </div>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          type="ghost"
          onClick={handleLoginClick}
        >
          Login
        </Button>
        <Button
          className={styles.button}
          type="ghost"
          onClick={handleRegisterClick}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
