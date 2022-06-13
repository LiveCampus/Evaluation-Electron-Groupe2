window.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const title = document.querySelector('[name="title"]');
  const description = document.querySelector('[name="desc"]');
  const list = document.querySelector('[name="list"]');

  window.api.send("task:update");
  window.api.receive("async:task:update", (data) => {
    title.value = data.title;
    description.value = data.description;
    list.value = data.idList;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const modifiedData = {
        title: this.elements.title.value,
        description: this.elements.desc.value,
        idList: this.elements.list.value,
      };

      window.api.send("task:updated", { id: data.id, data: modifiedData });
    });
  });
});
