// main/index.js or main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional: Preload script
        },
    });

    // Load your Next.js app
    mainWindow.loadURL('file://' + path.join(__dirname, '/out/index.html')); // Change this according to your exported app location
}

// This event fires when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed (on macOS, we want to keep the app open until the user explicitly quits)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
