import EmailInputForm from "../components/EmailInputForm";
import ParticleBackground from "./particles/ParticleBackground";

const EmailContainer = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height of the viewport
        width: "100vw", // Full width of the viewport
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <ParticleBackground />
      </div>

      <div style={{ zIndex: 1 }}>
        <EmailInputForm />
      </div>
    </div>
  );
};

export default EmailContainer;
