import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext } from 'react';

const NoteItem = (props) => {
    const context = useContext(noteContext)
    const { deleteNote } = context
    const { note, updateNote} = props;
    return (
        <div className='col-md-3'>

            <div className="card" >
                {/* <img src="..." className="card-img-top" alt="..."> */}
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="far fa-trash-alt mx-2" onClick={() => { deleteNote(note._id) }}></i>
                        <i className="fa-regular fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                </div>
            </div>
        </div>
    )
}

export default NoteItem