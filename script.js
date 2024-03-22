function radioButtonState() {
  const stateOfRadioButtons = {
    allButton: true,
    doneButton: false,
    openButton: false,
  };
  localStorage.setItem(
    "stateOfRadioButtons",
    JSON.stringify(stateOfRadioButtons)
  );
}

radioButtonState();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const urlOfBackend = "http://localhost:4730/todos/";

async function getToDosFromBackend() {
  try {
    const response = await fetch(urlOfBackend);
    const data = await response.json();
    localStorage.setItem("ToDoList", JSON.stringify(data));
    renderTodos();
  } catch (xxx) {
    alert("No Todos found!!!");
  }
}
getToDosFromBackend();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function createNewLi(currentLi, browserToDoList) {
  const newLi = document.createElement("li");
  const newToDoText = document.createElement("label");
  newToDoText.innerText = currentLi.description;
  newToDoText.setAttribute("for", currentLi.id);
  if (currentLi.done === true) {
    newToDoText.classList.add("checkedToDo");
  }
  newLi.appendChild(newToDoText);
  const newCheckbox = document.createElement("input");
  newCheckbox.type = "checkbox";
  newCheckbox.checked = currentLi.done;
  newCheckbox.id = currentLi.id;
  newLi.appendChild(newCheckbox);
  browserToDoList.appendChild(newLi);
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const toDoListInBrowser = document.body.querySelector("#browserList");

function renderTodos() {
  console.log("ööööööööööööööööööööööööö");
  const toDoList = JSON.parse(localStorage.getItem("ToDoList"));
  toDoListInBrowser.innerHTML = "";
  const stateOfRadioButtons = JSON.parse(
    localStorage.getItem("stateOfRadioButtons")
  );
  if (toDoListInBrowser !== null) {
    toDoList.forEach((element) => {
      if (stateOfRadioButtons.allButton === true) {
        createNewLi(element, toDoListInBrowser);
      } else if (
        stateOfRadioButtons.doneButton === true &&
        element.done === true
      ) {
        createNewLi(element, toDoListInBrowser);
      } else if (
        stateOfRadioButtons.openButton === true &&
        element.done === false
      ) {
        createNewLi(element, toDoListInBrowser);
      }
    });
  }
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const theRadioButtons = document.body.querySelector("#theRadioButtons");

theRadioButtons.addEventListener("click", function (event) {
  changeRadioButtons(event);
});

function changeRadioButtons(whichEvent) {
  const allButton = document.body.querySelector("#allButton");
  const doneButton = document.body.querySelector("#doneButton");
  const openButton = document.body.querySelector("#openButton");

  const stateOfRadioButtons = JSON.parse(
    localStorage.getItem("stateOfRadioButtons")
  );

  if (whichEvent.target === allButton) {
    stateOfRadioButtons.allButton = true;
    stateOfRadioButtons.doneButton = false;
    stateOfRadioButtons.openButton = false;
  } else if (whichEvent.target === doneButton) {
    stateOfRadioButtons.allButton = false;
    stateOfRadioButtons.doneButton = true;
    stateOfRadioButtons.openButton = false;
  } else if (whichEvent.target === openButton) {
    stateOfRadioButtons.allButton = false;
    stateOfRadioButtons.doneButton = false;
    stateOfRadioButtons.openButton = true;
  }
  localStorage.setItem(
    "stateOfRadioButtons",
    JSON.stringify(stateOfRadioButtons)
  );
  renderTodos();
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const addNewToDo = document.querySelector("#addNewToDo");

addNewToDo.addEventListener("click", function (event) {
  const wrightNewTodos = document.querySelector("#wrightNewTodos");
  if (wrightNewTodos.value.length >= 5) {
    const newToDo = {
      description: wrightNewTodos.value,
      done: false,
    };

    fetch(urlOfBackend, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newToDo),
    })
      .then((response) => {
        if (response.ok === true) {
          return response.json();
        } else {
          alert("Error: New ToDo could not be added!!!");
        }
      })
      .then((data) => {
        const toDoList = JSON.parse(localStorage.getItem("ToDoList"));
        toDoList.push(data);
        localStorage.setItem("ToDoList", JSON.stringify(toDoList));
        wrightNewTodos.value = "";
        renderTodos();
      });
  }
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

toDoListInBrowser.addEventListener("click", function (event) {
  console.log(event.target);
  console.log(event.target.type);
  console.log(event.target.checked);
  console.log(event.target.id);
  if (event.target.type === "checkbox") {
    event.preventDefault();
    console.log("qqqqqqqqqqqqqqqqqqqs");
    const toDoList = JSON.parse(localStorage.getItem("ToDoList"));
    for (let toDo of toDoList) {
      if (toDo.id == event.target.id) {
        console.log(toDo);
        const changedToDo = toDo;
        console.log(changedToDo);
        if (changedToDo.done === false) {
          changedToDo.done = true;
        } else {
          changedToDo.done = false;
        }
        console.log(changedToDo);
        toDo = changedToDo;
        console.log(toDo);
        fetch(urlOfBackend + changedToDo.id, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(changedToDo),
        })
          .then((response) => {
            if (response.ok === true) {
              return response.json();
            } else {
              alert(
                "Error: Your changed ToDo could not be send to the backend!!!"
              );
            }
          })
          .then((data) => {
            console.log(data);
            localStorage.setItem("ToDoList", JSON.stringify(toDoList));
            renderTodos();
          });
      }
    }
  }
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const removeButton = document.querySelector("#removeButton");

removeButton.addEventListener("click", function (event) {
  console.log("rrrrrrrrrrrrrrrrrrrrrrr");
  const toDoList = JSON.parse(localStorage.getItem("ToDoList"));
  console.log(toDoList);
  const idsOfDoneTodos = [];
  for (let toDo of toDoList) {
    if (toDo.done === true) {
      idsOfDoneTodos.push(toDo.id);
    }
  }
  console.log(idsOfDoneTodos);
  for (let index = 0; index < idsOfDoneTodos.length; index++) {
    fetch(urlOfBackend + idsOfDoneTodos[index], {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok === true) {
          console.log("Jaaaaa");
          return response.json();
        } else {
          console.log("Neeeiiinn");
        }
      })
      .then((data) => {
        if (index === idsOfDoneTodos.length - 1) {
          console.log("xxxxxxxxxxxxxx");
          getToDosFromBackend();
        }
      });
  }
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
