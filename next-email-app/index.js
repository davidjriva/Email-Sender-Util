const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sendEmail = require(path.join(__dirname, "sendEmail.js"));

// ~~~~~~~~~~~~~~~~~~
// APP INITIALIZATION
// ~~~~~~~~~~~~~~~~~~

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disables Node integration in renderer
      contextIsolation: true, // Isolates context for security
      enableRemoteModule: false, // Disables remote module
      webviewTag: false, // Block all web view tags
      preload: path.join(__dirname, "preload.js"), // Use a secure preloading script for IPC
      sandbox: true,
      disableBlinkFeatures: "AuxClick",
    },
  });

  mainWindow.webContents.openDevTools();

  // Load your Next.js app
  mainWindow.loadURL("file://" + path.join(__dirname, "/out/index.html")); // Adjust based on your app build output
}

app.commandLine.appendSwitch("disable-network-access"); // Disables network access entirely

app.enableSandbox(); // Enable sandbox for all processes

app.whenReady().then(createWindow); // Electron initialization

// ~~~~~~~~~~~~~~~~~~~
// APP EVENT LISTENERS
// ~~~~~~~~~~~~~~~~~~~

ipcMain.on(
  "send-email",
  (event, { sanitizedName, sanitizedEmail, sanitizedText }) => {
    sendEmail(sanitizedName, sanitizedEmail, sanitizedText);
  }
); // Listen for the IPC event from the renderer process

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
}); // Quit when all windows are closed

app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    event.preventDefault();
  });
}); // Prevent any website page redirects

app.on("web-contents-created", (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    return { action: "deny" };
  });
}); // Prevent any additional windows from opening

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
}); // Logging unhandled rejections
