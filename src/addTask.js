const { BrowserWindow } = require("electron");
const path = require("path");

const createWindow = (parent) => {
  const addTaskWindow = new BrowserWindow({
    height: 480,
    width: 720,
    parent,
    webPreferences: {
      preload: path.join(__dirname, "preloads/preload.addTask.js"),
    },
  });

  addTaskWindow.setMenuBarVisibility(false);
  addTaskWindow.loadFile(path.join(__dirname, "views/addTask.html"));

  return addTaskWindow;
};

module.exports = { createAddTaskWindow: createWindow };
