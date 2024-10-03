"use client";

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import InputField from "./InputField";
import TextInputField from "./TextInputField";

const EmailInputForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const template = `
      Hello ${name},

      Thank you for providing your email address: ${email}.

      Here is some text:

      ${text}

      Best regards,

      Your Company
      `;

      const ccEmail = "exampleCC@gmail.com";
      // Encode the populated email template for use in the mailto link
      const mailtoLink = `mailto:${email}?cc=${ccEmail}&subject=Example%20Subject&body=${encodeURIComponent(
        template
      )}`;

      // Open the default email client with the populated email
      window.location.href = mailtoLink;
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

      <Button variant="contained" color="primary" type="submit">
        Create Email
      </Button>
    </Box>
  );
};

export default EmailInputForm;
