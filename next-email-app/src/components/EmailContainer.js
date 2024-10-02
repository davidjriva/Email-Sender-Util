import { Box } from "@mui/material";
import EmailInputForm from "../components/EmailInputForm";

const EmailContainer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Full height of the viewport
      }}
    >
      <EmailInputForm />
    </Box>
  );
};

export default EmailContainer;