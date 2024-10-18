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
    const safeBasePath = path.resolve(__dirname, "out");
    const filePath = path.join(safeBasePath, pathname);

    if (!filePath.startsWith(safeBasePath)) {
      return createResponse("Access denied", 403);
    }

    const allowedPaths = [
      path.join(safeBasePath, "index.html"),
      path.join(safeBasePath, "_next", "static", "chunks"),
      path.join(safeBasePath, "_next", "static", "chunks", "app"),
    ];

    if (!allowedPaths.some((allowedPath) => filePath.startsWith(allowedPath))) {
      return createResponse("File not allowed", 400);
    }

    try {
      // Check for file existence before serving
      if (!fs.existsSync(filePath)) {
        return new Response("File not found", {
          status: 404,
          headers: { "content-type": "text/html" },
        });
      }

      return net.fetch(pathToFileURL(filePath).toString());
    } catch (error) {
      return createResponse("File not found", 404);
    }
  });
}

function createResponse(message, status) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/html" },
  });
}

// ~~~~~~~~~~~~~~~~~~
// APP INITIALIZATION
// ~~~~~~~~~~~~~~~~~~

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
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

  // mainWindow.webContents.openDevTools();

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
