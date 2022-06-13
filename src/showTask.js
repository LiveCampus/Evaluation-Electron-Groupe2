const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = (parent, taskId, tasks) => {
    const showTaskWindow = new BrowserWindow({
      height: 480,
      width: 720,
      parent,
      webPreferences: {
        preload: path.join(__dirname, "preloads/preload.showTask.js"),
      },
    });
    showTaskWindow.setMenuBarVisibility(false);
    showTaskWindow.loadFile(path.join(__dirname, "views/showTask.html"));

    ipcMain.on("task:show", async () => {
        let task = await tasks.getOne(taskId);
    
        showTaskWindow.webContents.send("async:task:show", task);
      });

  return showTaskWindow;
};

module.exports = { createShowTaskWindow: createWindow };
