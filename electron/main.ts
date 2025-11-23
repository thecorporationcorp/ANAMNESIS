import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) app.quit()

let mainWindow: BrowserWindow | null = null

const isDev = !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    frame: false, // Frameless for immersive experience
    transparent: false,
    backgroundColor: '#000000',
    icon: join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false // Required for better-sqlite3
    },
    show: false // Don't show until ready
  })

  // Maximize on start for full billboard effect
  mainWindow.maximize()

  // Show when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// App lifecycle
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers for window controls
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false
})

// IPC Handlers for database operations
ipcMain.handle('db:getMemories', async (_event, options) => {
  // Will be implemented with database service
  return []
})

ipcMain.handle('db:searchMemories', async (_event, query) => {
  // Will be implemented with MeiliSearch
  return []
})

ipcMain.handle('db:getMemory', async (_event, id) => {
  // Will be implemented with database service
  return null
})

ipcMain.handle('db:importExport', async (_event, filePath) => {
  // Will be implemented with importer service
  return { success: false, message: 'Not implemented' }
})

// IPC Handlers for file operations
ipcMain.handle('file:selectExport', async () => {
  const { dialog } = require('electron')
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'Export Files', extensions: ['json', 'zip'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  return result.canceled ? null : result.filePaths[0]
})

// IPC Handler for app info
ipcMain.handle('app:getInfo', () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    platform: process.platform,
    isDev
  }
})
