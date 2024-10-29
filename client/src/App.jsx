import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import axios from "axios";
import { GET_USER_INFO_ROUTE, HOST } from "./utils/constant";
import { useAppStore } from "./store";
import Profile from "./pages/profile";
import { SkeletonTheme } from "react-loading-skeleton";
import ChatLoading from "./components/Loading/ChatLoading";
import "react-loading-skeleton/dist/skeleton.css";

axios.defaults.baseURL = HOST;
axios.defaults.withCredentials = true;

const ProtecedRoute = ({ isProtected, children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  if (isProtected) {
    return isAuthenticated ? children : <Navigate to="/auth" />;
  } else {
    return isAuthenticated ? <Navigate to="/" /> : children;
  }
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get(GET_USER_INFO_ROUTE);
        setUserInfo(data);
      } catch (error) {
        setUserInfo(undefined);
        console.error("Error getting user info:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserInfo();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return (
      <>
        <SkeletonTheme baseColor="#292b34" highlightColor="#444">
          <ChatLoading />
        </SkeletonTheme>
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <ProtecedRoute>
              <Auth />
            </ProtecedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtecedRoute isProtected>
              <Chat />
            </ProtecedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtecedRoute isProtected>
              <Profile />
            </ProtecedRoute>
          }
        />
        <Route path="/*" element={<Navigate to={"/auth"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
