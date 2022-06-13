window.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector('[name="title"]');
  const description = document.querySelector('[name="desc"]');
  const list = document.querySelector('[name="list"]');

  window.api.send("task:update");
  window.api.receive("async:task:update", (data) => {
    title.value = data.title;
    description.value = data.description;
    list.value = data.idList;
    console.log("async task update ", data);
  });
});
