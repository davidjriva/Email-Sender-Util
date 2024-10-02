import { TextField } from "@mui/material";

const InputField = ({ label, value, setValue }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      variant="outlined"
      required
    />
  );
};

export default InputField;
