import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  // add note 
  const addNote = async (title, description, tag) => {
    //TODO:API CALL
    const response = await fetch(`${host}/api/notes/addNotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')

      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    const note = await response.json(); // parses JSON response into native JavaScript objects
    setNotes(notes.concat(note))

  }

  //get all notes
  const getAllNote = async () => {
    //TODO:API CALL
    const response = await fetch(`${host}/api/notes/fetchAllNotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')

      }
      // body: JSON.stringify({title, description, tag}), // body data type must match "Content-Type" header
    });
    const json = await response.json()
    setNotes(json)
  }

  //delete note
  const deleteNote = async (id) => {
    //TODO:API CALL
    const response = await fetch(`${host}/api/notes/deleteNotes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')

      }
    });
    const json = await response.json()
    // setNotes(json)
    console.log(json)
    console.log("deleteing note with id " + id)
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);

  }

  //edit note 
  const editNote = async (id, title, description, tag) => {
    //TODO:API CALL
    const response = await fetch(`${host}/api/notes/updateNotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects
    console.log(json)
    let newNotes = JSON.parse(JSON.stringify(notes))

    //Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes)
  }

  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getAllNote }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;