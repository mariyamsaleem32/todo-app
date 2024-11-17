import { db, collection, addDoc, onSnapshot, deleteDoc, doc} from "./firebase.js"; // Import doc here

const list = document.getElementById('todo-list');
const add = async () => {
  const todo = document.getElementById('todo-input');
  
  if (todo.value.trim() === "") {  // Validate if the input is not empty
    alert("Please enter a todo!");
    return;
  }

  let ref = collection(db, "todos");

  try {
    await addDoc(ref, {
      todo: todo.value
    });
    console.log("todo added");
    todo.value = ""; // Clear the input
  } catch (error) {
    console.error("Error adding todo: ", error);
  }
};

const addTodo = document.getElementById("add-button");
addTodo.addEventListener("click", add);

let getTodos = () => {
  onSnapshot(collection(db, "todos"), (snapshot) => {
    list.innerHTML = ""; // Clear the list before rendering
    snapshot.docChanges().forEach((change) => {
      console.log("change", change.type);
      // handle different types of changes (added, modified, removed)
      if (change.type === "added") {
        console.log("New todo added: ", change.doc.data());
      } else if (change.type === "modified") {
        console.log("Todo modified: ", change.doc.data());
      } else if (change.type === "removed") {
        console.log("Todo removed: ", change.doc.data());
      }
    });

    snapshot.forEach((doc) => {
      let { todo } = doc.data();
      list.innerHTML += 
      `<li>${todo}
         <button onclick="deleteTodo('${doc.id}')">Delete</button>
      </li>`;
    });
  });
};

const deleteTodo = async (id) => {
  try {
    await deleteDoc(doc(db, "todos", id)); // Correct doc reference
    console.log("Todo deleted succesfully");
  } catch (error) {
    console.error("Error deleting todo: ", error);
  }
};

getTodos();

window.deleteTodo = deleteTodo; // Expose deleteTodo globally to use in onclick
