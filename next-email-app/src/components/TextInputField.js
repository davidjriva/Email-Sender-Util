import { TextField, IconButton, Box } from "@mui/material";
import React, { useState } from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

const TextInputField = ({ text, setText }) => {
  const [numberedCount, setNumberedCount] = useState(0); // State to track number of numbered points

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleAddBulletPoint = () => {
    setText((prevText) => `${prevText}\n• `);
  };

  const handleAddNumberedPoint = () => {
    const newCount = numberedCount + 1;
    setNumberedCount(newCount);
    setText((prevText) => `${prevText}\n${newCount}. `);
  };

  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        <IconButton onClick={handleAddBulletPoint} sx={{ marginRight: 1 }}>
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton onClick={handleAddNumberedPoint}>
          <FormatListNumberedIcon />
        </IconButton>
      </Box>
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
