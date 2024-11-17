import { db, collection, addDoc, onSnapshot, deleteDoc, doc} from "./firebase.js";

const list = document.getElementById('todo-list');
const add = async () => {
  const todo = document.getElementById('todo-input');
  
  if (todo.value.trim() === "") {
    alert("Please enter a todo!");
    return;
  }

  let ref = collection(db, "todos");
  try {
    await addDoc(ref, {
      todo: todo.value
    });
    console.log("todo added");
    todo.value = ""; 
  } catch (error) {
    console.error("Error adding todo: ", error);
  }
};

const addTodo = document.getElementById("add-button");
addTodo.addEventListener("click", add);

let getTodos = () => {
  onSnapshot(collection(db, "todos"), (snapshot) => {
    list.innerHTML = ""; 
    snapshot.docChanges().forEach((change) => {
      console.log("change", change.type);
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
    await deleteDoc(doc(db, "todos", id)); 
    console.log("Todo deleted succesfully");
  } catch (error) {
    console.error("Error deleting todo: ", error);
  }
};

getTodos();

window.deleteTodo = deleteTodo; 