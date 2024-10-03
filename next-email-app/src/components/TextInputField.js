import React from "react";
import { TextField } from "@mui/material";

const TextInputField = ({text, setText}) => {
  const handleChange = (e) => {
    setText(e.target.value)
  };

  return (
    <>
      <TextField
        label="Enter your text"
        variant="outlined"
        fullWidth
        multiline
        minRows={3}
        maxRows={10}
        value={text}
        onChange={handleChange}
      />
    </>
  );
};

export default TextInputField;
