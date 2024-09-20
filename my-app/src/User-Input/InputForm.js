import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import InputField from "./InputField";

const InputForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Name: ${name}, Email: ${email}`);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "300px",
        margin: "0 auto",
        gap: "1rem",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <InputForm
        label="name"
        value={name}
        setValue={setName}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        type="email"
        required
      />
      <Button variant="contained" color="primary" type="submit">
        Create Email
      </Button>
    </Box>
  );
};

export default InputForm;
