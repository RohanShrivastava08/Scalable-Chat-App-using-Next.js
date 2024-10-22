"use client";

import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className={classes.container}>
      {/* Header */}
      <header className={classes.header}>
        <h1>Scalable Chat App</h1>
      </header>

      {/* Website Info */}
      <section className={classes["about-section"]}>
        <p>
          Welcome to Scalable Chat App! A classy, modern platform to chat in real-time.
        </p>
      </section>

      {/* Chat Area */}
      <div className={classes["chat-container"]}>
        <div className={classes["chat-box"]}>
          <ul className={classes["message-list"]}>
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`${classes["message-item"]} ${
                  index % 2 === 0 ? classes.sent : classes.received
                }`}
              >
                {msg}
              </li>
            ))}
          </ul>
        </div>

        {/* Input Area */}
        <div className={classes["input-container"]}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={classes["chat-input"]}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className={classes["send-button"]}>
            <span className={classes["send-icon"]}>➤</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className={classes.footer}>
        <p>&copy; 2024 ChatBox Messenger. All rights reserved.</p>
      </footer>
    </div>
  );
}
