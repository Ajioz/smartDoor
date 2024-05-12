import "./App.css";
// import React, { useState } from "react";
import React, { useCallback, useState, useEffect } from "react";
import MQTTDisplay from "./MQTTDisplay";
import { Auth } from "aws-amplify";
import Form from "./Form";
import { useNavigate } from "react-router-dom";


const Dashboard = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  async function signOut() {
    try {
      await Auth.signOut({ global: true });
      navigate("/");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  const Info = () => {
    navigate("/info")
  }

  const isToken = useCallback(async () => {
    const token = localStorage.getItem("CognitoIdentityServiceProvider.6b51c7g9c6qvkkn6l097rfe3vk.LastAuthUser");
    if (token === "") return "null";
    try {
      setUsername(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return "invalid";
    }
  }, [setUsername]);

  useEffect(() => {
    isToken();
  }, [isToken]);

  return (
    <div className="App">
      <header className="app-header">
        <h3 style={{ textTransform: "capitalize" }}>{username}</h3>
        <h2 onClick={Info}>Go to Info</h2>
        <h2 onClick={signOut}>Logout</h2>
      </header>
      <div className="container">
        <MQTTDisplay
          setIsConnected={setIsConnected}
          isConnected={isConnected}
          credentials={props.credentials}
        />
        <Form isConnected={isConnected} />
      </div>
    </div>
  );
};

export default Dashboard;

