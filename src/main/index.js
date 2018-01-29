'use strict'

import { app, BrowserWindow, dialog, ipcMain } from 'electron'

import fs from 'fs'

// import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 1600
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// 保存json文件 打开保存选择框
ipcMain.on('open-save-dialog', function (event, content, cityId) {
  dialog.showSaveDialog({
    title: '保存',
    message: cityId,
    defaultPath: cityId,
    filters: [
      {name: '', extensions: ['json']}
    ]
  }, function (name) {
    if (!name) {
      return
    }
    // fs.writeFileSync(name, content)
    fs.writeFile(name, content, () => {
      console.log('异步写入文件')
    })
  })
})

ipcMain.on('open-select-dialog', function (event, options) {
  dialog.showOpenDialog({
    filters: [
      {name: 'Images', extensions: ['jpg', 'png', 'gif']}
    ],
    properties: ['openFile', 'showHiddenFiles']
  }, function (filePath) {
    // console.log(event, filePath, '******')
    if (!filePath) {
      return
    }
    event.sender.send('image-selected', filePath[0])
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
