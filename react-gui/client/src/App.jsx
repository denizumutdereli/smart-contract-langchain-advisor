import { useState, createContext, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "./pages/AuthPages/LoginPage/LoginPage";
import RegisterPage from "./pages/AuthPages/RegisterPage/RegisterPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import ChatPage from "./pages/ChatPage/ChatPage";

import userService from "./utils/userService";

import "./App.css";

export const UserContext = createContext();

export default function App() {
  const [user, setUser] = useState(userService.getUser());

  const handleSignupOrLogin = () => {
    setUser(userService.getUser());
  };

  const handleLogout = () => {
    userService.logout();
    setUser(null);
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/login"
          element={<LoginPage onSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onSignupOrLogin={handleSignupOrLogin} />}
        />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <UserContext.Provider value={{ user, handleLogout }}>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </UserContext.Provider>
  );
}
