const express = require('express')
const router = express.Router();
const Notes = require('../models/Notes')
var fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator') // for validating request

//ROUTE 1:Get all the notes using: GET "/api/notes/fetchAllNotes"
router.get('/fetchAllNotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})

//ROUTE 2:Add new notes using: POST "/api/notes/addNotes"
router.post('/addNotes', fetchUser, [
    body('title', 'Title must be atleast 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // if there are errors, return bad request and the errors 
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    })

//ROUTE 3:Update the existing notes using: PUT "/api/notes/updateNotes".Login required
router.put('/updateNotes/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create a new notes object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("not found")
        }
        if (note.user.toString() !== req.user.id) {//note id and user id should match for update bcoz they are mapped
            return res.status(401).send("not allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})
//ROUTE 4:Delete the existing notes using: DELETE "/api/notes/deleteNotes".Login required
router.delete('/deleteNotes/:id', fetchUser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("not found")
        }
        //Allow deletion only if user owns the notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Sucess": "Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})
module.exports = router;