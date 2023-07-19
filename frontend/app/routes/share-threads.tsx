import React from "react";
import { useLocation } from "react-router";

const EmailTemplate = ({ selectedThreads }) => {
  return (
    <div>
      <h2>Email Template</h2>
      <p>Selected Threads:</p>
      <ul>
        {selectedThreads.map((thread) => (
          <li key={thread.id}>
            <p>{thread}</p>
            <p>{thread.content}</p>
            <p>By: {thread.user}</p>
            <p>Replies: {thread.reply_count}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function ShareThreads() {
  const location = useLocation(); // Get the current location, including state (selectedThreads)

  // Extract the selectedThreads from location.state
  const selectedThreads = location.state?.selectedThreads || [];

  return (
    <div>
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Email Template
        </h1>
      </div>
      <EmailTemplate selectedThreads={selectedThreads} />
    </div>
  );
}
