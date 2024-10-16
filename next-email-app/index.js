const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const validator = require("validator");

// Setup DOMPurify instance with JSDOM
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Sanitize HTML content
function sanitizeHTML(input) {
  return purify.sanitize(input);
}

// Function to validate email format
function isValidEmail(email) {
  return validator.isEmail(email);
}

function isValidName(name) {
  return /^[a-zA-Z\s]*$/.test(name);
}

function containsHTMLTags(input) {
  const htmlTagRegex = /<[^>]+>/; // Regex to detect HTML tags
  return htmlTagRegex.test(input); // Returns true if HTML tags are found
}

// Function to spawn child process for sending email
function sendEmail(name, email, text) {
  // Sanitize inputs
  const safeName = isValidName(name) ? name : "";
  const safeEmail = isValidEmail(email) ? email : "";

  if (containsHTMLTags(text)) {
    console.log(`HTML tags are not allowed in text: ${text}.`);
    return;
  }

  const formattedText = text.replace(/\n/g, "<br>"); // Replace newlines with breaks.
  const safeText = sanitizeHTML(formattedText).replace(/"/g, '\\"'); // Sanitize any HTML in the body

  // Spawn a child process for sending the email
  const child = spawn("node", [
    path.join(__dirname, "sendEmail.js"),
    safeName,
    safeEmail,
    safeText,
  ]);

  child.stdout.on("data", (data) => {
    console.log(`Child process output: ${data}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`Child process error: ${data}`);
  });

  child.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
  });
}

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
    },
  });

  mainWindow.webContents.openDevTools();

  // Load your Next.js app
  mainWindow.loadURL("file://" + path.join(__dirname, "/out/index.html")); // Adjust based on your app build output
}

// Listen for the IPC event from the renderer process
ipcMain.on(
  "send-email",
  (event, { sanitizedName, sanitizedEmail, sanitizedText }) => {
    sendEmail(sanitizedName, sanitizedEmail, sanitizedText);
  }
);

// Disables network access entirely
app.commandLine.appendSwitch("disable-network-access");

// Enable sandbox for all processes
app.enableSandbox();

// Electron initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
