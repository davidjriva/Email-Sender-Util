const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

// Function to execute AppleScript for sending email via Outlook
function sendEmailWithOutlook(name, email, text) {
  const htmlTemplate = `
        <html>
            <body>
                <h1>Hello ${name},</h1>
                <p>Thank you for providing your email address: ${email}.</p>
                <p>Here is some text:</p>
                <p>${text.replace(/\*/g, "•")}</p>
                <p>Best regards,<br>Your Company</p>
            </body>
        </html>
    `.trim(); // Trim to remove extra whitespace

  const appleScript = `
    set {ccName01, ccAddress01} to {"LocalDispatch", "change-Alias@change-email.com"} -- 'Cc:' recipient.
    set {ccName02, ccAddress02} to {"ChangeName", "change-Alias@change-email.com"} -- 'Cc:' recipient.
    set {ccName03, ccAddress03} to {"ChangeName", "change-Alias@change-email.com"} -- 'Cc:' recipient.
    set the_Subject to "Dispatch Complaint Email"
    set the_Content to ("<b>" & "Date:" & "</b>" & "<br><br>" & "<b>" & "Complaint Department:" & "</b>" & "<br><br><br>" & "<b>" & "Call received on 311 or 911:" & "</b>" & "<br><br><br>" & "<b>" & "Person Identifying Complaint:" & "</b>" & "<br><br><br>" & "<b>" & "Complaint:" & "</b>")

    tell application "Microsoft Outlook"
        
    set ComplaintMessage to make new outgoing message with properties {subject:the_Subject, content:the_Content}
    
    make new cc recipient at ComplaintMessage with properties {email address:{name:ccName01, address:ccAddress01}}
    make new cc recipient at ComplaintMessage with properties {email address:{name:ccName02, address:ccAddress02}}
    make new cc recipient at ComplaintMessage with properties {email address:{name:ccName03, address:ccAddress03}}

    open ComplaintMessage

    end tell
    `;

  // HTML CODE:
  // set content of newMessage to "<html><body>${htmlTemplate
  //     .replace(/"/g, '\\"')
  //     .replace(/\n/g, "")}</body></html>"

  // Execute AppleScript
  exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing AppleScript: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`AppleScript error: ${stderr}`);
      return;
    }
    console.log(`AppleScript output: ${stdout}`);
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Optional: Preload script
      nodeIntegration: true, // Enable Node integration in renderer
      contextIsolation: false, // Ensure context isolation is off for IPC
    },
  });

  // Load your Next.js app
  mainWindow.loadURL("file://" + path.join(__dirname, "/out/index.html")); // Adjust based on your app build output
}

// Listen for the IPC event from the renderer process
ipcMain.on("send-email", (event, { name, email, text }) => {
  sendEmailWithOutlook(name, email, text);
});

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
