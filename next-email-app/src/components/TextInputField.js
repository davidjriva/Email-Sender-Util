import { TextField, Button, Box } from "@mui/material";
import React from "react";

const TextInputField = ({ text, setText }) => {
  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleAddBulletPoint = () => {
    setText((prevText) => `${prevText}\n• `); // Add bullet point
  };

  const handleAddNumberedPoint = () => {
    const pointCount =
      text.split("\n").filter((line) => line.trim() !== "").length + 1;
    setText((prevText) => `${prevText}\n${pointCount}. `); // Add numbered point
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
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="outlined"
          onClick={handleAddBulletPoint}
          sx={{ marginRight: 1 }}
        >
          Add Bullet Point
        </Button>
        <Button variant="outlined" onClick={handleAddNumberedPoint}>
          Add Numbered Point
        </Button>
      </Box>
    </>
  );
};

export default TextInputField;
