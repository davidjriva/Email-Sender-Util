import { Box } from "@mui/material";
import EmailInputForm from "../components/EmailInputForm";

const EmailContainer = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height of the viewport
        width: "100vw", // Full width of the viewport
        backgroundColor: "#202124", // Set the background color
      }}
    >
      <EmailInputForm />
    </div>
  );
};

export default EmailContainer;
