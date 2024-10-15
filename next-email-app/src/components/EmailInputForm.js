"use client"; // Ensure the component is client-side only in Next.js

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import InputField from "./InputField";
import TextInputField from "./TextInputField";
import DOMPurify from "dompurify";

const EmailInputForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !text) {
      alert("Please fill in all fields.");
      return;
    }

    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedText = DOMPurify.sanitize(text);

    try {
      if (window && window.electronAPI) {
        // Send form data to the Electron main process via IPC
        window.electronAPI.send("send-email", { sanitizedName, sanitizedEmail, sanitizedText });
      } else {
        console.error("window or window.electronAPI is not available.");
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

      {typeof window !== "undefined" && window.electronAPI && (
        <Button variant="contained" type="submit" color="primary">
          Send Email
        </Button>
      )}
    </Box>
  );
};

export default EmailInputForm;
