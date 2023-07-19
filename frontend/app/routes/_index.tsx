import type { V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import prisma from "~/lib/db.server";
// import sendEmail from "~/lib/sendEmail";
import React from "react";
import Confetti from "react-confetti";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Slack Kit" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// routes/index.js
export const loader = async () => {
  const data = {
    threads: await prisma.favoriteThreads.findMany({
      orderBy: [{ timestamp: "asc" }],
    }),
  };
  return data;
};

const humanizeTime = (ts: number) => {
  // Convert the epoch timestamp to a Date object
  const date = new Date(ts * 1000); // Multiply by 1000 because JavaScript uses milliseconds

  // Get the components of the date (year, month, day, hours, minutes, seconds)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so we add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Create a human-readable date string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const EmailTemplate = ({ selectedThreads }) => {
  const emailStyle = {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f2f2f2",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const logoContainerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const logoStyle = {
    maxWidth: "40px",
  };

  const bodyTextStyle = {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "20px",
  };

  const threadStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e6e6e6",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={emailStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoContainerStyle}>
          <img src="/images/logo.png" alt="Company Logo" style={logoStyle} />
        </div>
        <h1>Highlights from our community!</h1>
      </div>

      {/* Body Text */}
      <p style={bodyTextStyle}>
        Hey there,
        <br />
        Here are the top threads from this week that you don't want to miss.
        Check it out!
      </p>

      {/* Selected Threads */}
      {selectedThreads.map((thread) => (
        <div key={thread.id} style={threadStyle}>
          <h3>
            <a href={thread.link} target="_blank" rel="noopener noreferrer">
              {thread.content}
            </a>
          </h3>
          <p>By: {thread.user}</p>
        </div>
      ))}

      {/* Footer */}
      <p style={{ fontSize: "14px", textAlign: "center", marginTop: "20px" }}>
        Thank you for being a part of our vibrant Slack community!
      </p>
    </div>
  );
};

export default function Index() {
  const { threads } = useLoaderData();
  const [selectedThreads, setSelectedThreads] = React.useState([]);
  const [showEmailTemplate, setShowEmailTemplate] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  // Function to handle checkbox selection
  const handleCheckboxChange = (thread) => {
    setSelectedThreads((prevSelectedThreads) => {
      if (prevSelectedThreads.some((pst) => pst.id === thread.id)) {
        // Remove the threadId from the selectedThreads array
        return prevSelectedThreads.filter(({ id }) => id !== thread.id);
      } else {
        // Add the threadId to the selectedThreads array
        return [...prevSelectedThreads, thread];
      }
    });
  };

  // Function to navigate to the email template screen and pass selected threads as data
  const handleShareClick = async () => {
    // Call the sendEmail function when the "Send Email" button is clicked
    // const response = await sendEmail();
    const response = { success: true };

    // Handle the response if needed
    if (response.success) {
      setShowConfetti(true); // Show confetti
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      alert("Failed to send email. Please try again later.");
    }
  };

  const threadStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "10px",
    border: "1px solid #e6e6e6",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  };

  const threadHeaderStyle = {
    fontSize: "18px",
    marginBottom: "5px",
    color: "#2a2a2a",
  };

  const userStyle = {
    fontSize: "14px",
    color: "#888",
    marginBottom: "2px",
  };

  const replyStyle = {
    fontSize: "14px",
    color: "#888",
  };

  // If showEmailTemplate is true, render the EmailTemplate component
  if (showEmailTemplate) {
    return (
      <div>
        <div>
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Email Template
          </h1>
        </div>
        {/* Share with community button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px",
          }}
        >
          <button
            disabled={selectedThreads.length === 0}
            onClick={() => setShowEmailTemplate(false)}
          >
            Back
          </button>
        </div>
        <EmailTemplate selectedThreads={selectedThreads} />
        {/* Send email button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px",
          }}
        >
          <button
            disabled={selectedThreads.length === 0}
            onClick={handleShareClick}
          >
            Send Email
          </button>
        </div>
        {/* Show confetti if email is sent successfully */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            gravity={0.6}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Bookmarked Messages
        </h1>
      </div>
      <div>
        {/* Share with community button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px",
          }}
        >
          <button
            disabled={selectedThreads.length === 0}
            onClick={() => setShowEmailTemplate(true)}
          >
            Share with community
          </button>
        </div>
        {/* Saved threads list */}
        {threads.map((thread) => (
          <div key={thread.id} style={threadStyle}>
            <input
              type="checkbox"
              checked={selectedThreads.some(({ id }) => id === thread.id)}
              onChange={() => handleCheckboxChange(thread)}
            />
            <h3 style={threadHeaderStyle}>
              <a href={thread.link} target="_blank" rel="noopener noreferrer">
                {thread.content}
              </a>
            </h3>
            <p style={userStyle}>
              By: <strong>{thread.user}</strong> on{" "}
              <i>{humanizeTime(thread.timestamp)}</i>
            </p>
            <p style={replyStyle}>Replies: {thread.reply_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
