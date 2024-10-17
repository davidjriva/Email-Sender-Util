const { app, BrowserWindow, ipcMain, protocol, net } = require("electron");
const path = require("path");
const { pathToFileURL } = require("url");
const sendEmail = require(path.join(__dirname, "sendEmail.js"));
const fs = require("fs");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SETUP FILE LOADING PROTOCOL
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Register the custom protocol
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

function setupProtocol() {
  protocol.handle("app", async (req) => {
    const { pathname } = new URL(req.url);

    const safeBasePath = path.resolve(__dirname, "out"); // Base directory for files
    const filePath = path.resolve(safeBasePath, "." + pathname); // Resolve file path

    // Ensure the resolved path is within the allowed base directory
    if (!filePath.startsWith(safeBasePath)) {
      return new Response("Access denied", {
        status: 403,
        headers: { "content-type": "text/html" },
      });
    }

    // Only allow access to `index.html` or files in `_next/static/chunks` or `_next/static/chunks/app`
    const isIndexHtml = filePath === path.join(safeBasePath, "index.html");
    const isInNextChunks = filePath.startsWith(
      path.join(safeBasePath, "_next/static/chunks")
    );
    const isInNextChunksApp = filePath.startsWith(
      path.join(safeBasePath, "_next/static/chunks/app")
    );

    if (!(isIndexHtml || isInNextChunks || isInNextChunksApp)) {
      return new Response("File not allowed", {
        status: 400,
        headers: { "content-type": "text/html" },
      });
    }

    // Check for file existence before serving
    if (!fs.existsSync(filePath)) {
      return new Response("File not found", {
        status: 404,
        headers: { "content-type": "text/html" },
      });
    }

    // Serve the requested file
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

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
  mainWindow.loadURL("app://bundle/index.html"); // Adjust based on your app build output
}

app.commandLine.appendSwitch("disable-network-access"); // Disables network access entirely

app.enableSandbox(); // Enable sandbox for all processes

app.whenReady().then(() => {
  setupProtocol();
  createWindow();
}); // Electron initialization

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
