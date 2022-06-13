const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = (parent, taskId, tasks) => {
  const updateTaskWindow = new BrowserWindow({
    height: 480,
    width: 720,
    parent,
    webPreferences: {
      preload: path.join(__dirname, "preloads/preload.updateTask.js"),
    },
  });

  updateTaskWindow.setMenuBarVisibility(false);
  updateTaskWindow.loadFile(path.join(__dirname, "views/updateTask.html"));

  ipcMain.on("task:update", async () => {
    let task = await tasks.getOne(taskId);

    updateTaskWindow.webContents.send("async:task:update", task);
  });

  return updateTaskWindow;
};

module.exports = { createUpdateTaskWindow: createWindow };
