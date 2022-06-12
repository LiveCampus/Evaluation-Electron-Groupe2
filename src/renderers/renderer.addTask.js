window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      title: this.elements.title.value,
      //description: this.elements.desc.value,
      idList: this.elements.list.value,
    };

    window.api.send("task:add", data);
  });
});

window.api.receive("async:task:add", (data) => {
  console.log(data);
  console.log("ok");
});
