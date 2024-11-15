import {db,collection, addDoc,onSnapshot,deleteDoc } from "./firebase.js";

const list = document.getElementById("todo-list");
 const add = async () => {
 let todo = document.getElementById("todo-input");
 let ref = collection(db, "todos");

 await addDoc(ref, {
    todo:todo.value
 })
 console.log("todo added");
 todo.value = "";
 }

 const addTodo  = document.getElementById("add-btn");
 addTodo.addEventListener("click", add);

 let getTodos = () => {
   list.innerHTML = "" ;
  onSnapshot(collection(db, "todos"), (chats) => {
   chats.docChanges().forEach( (change) => {
      let {todo} = change.doc.data()
      list.innerHTML += `<li> ${todo} </li>` 
      console.log("change",change.type);
      
   });
  });
}
 getTodos();

//  let deletbtn = document.createElement("button")
//  deletbtn.addEventListener("click", () => {
// console.log("id",change.doc.id);
//  })

//  const deleteTodo = () => {
   
//  }