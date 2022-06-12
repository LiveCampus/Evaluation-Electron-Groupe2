window.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      title: this.elements.title.value,
      idList: this.elements.list.value,
    };

    window.api.send("task:add", data);
  });

  document.querySelector('#cancel').addEventListener('click', () => {
    window.api.send('window:addTask:close')
  })
});
