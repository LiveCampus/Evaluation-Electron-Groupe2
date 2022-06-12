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

  window.api.receive("async:task:add", (data) => {
    console.log("ok");
    console.log(data);
  });
});
