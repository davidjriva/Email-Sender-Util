"use client"; // Ensure the component is client-side only in Next.js

import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import InputField from "./InputField";
import TextInputField from "./TextInputField";

let ipcRenderer;
if (typeof window !== "undefined") {
  ipcRenderer = window.require("electron").ipcRenderer; // Access ipcRenderer only in the client
}

const EmailInputForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (ipcRenderer) {
        // Send form data to the Electron main process via IPC
        ipcRenderer.send("send-email", { name, email, text });
        alert("Email is being processed in Outlook.");
      } else {
        console.error("ipcRenderer is not available.");
        alert("Email sending functionality is not available.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the email. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "450px",
        margin: "0 auto",
        gap: "1rem",
        padding: "2rem",
        backgroundColor: "#F1F3F4",
        borderRadius: "8px",
        boxShadow: "0 0 15px rgba(128, 128, 128, 0.5)",
      }}
    >
      <InputField label="Name" value={name} setValue={setName} />
      <InputField label="Email" value={email} setValue={setEmail} />

      <TextInputField text={text} setText={setText} />

      <Button variant="contained" type="submit" color="primary">
        Send Email
      </Button>
    </Box>
  );
};

export default EmailInputForm;
