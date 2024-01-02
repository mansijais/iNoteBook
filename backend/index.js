const connectToMongo = require('./db')
const express = require('express') 
var cors=require('cors')
connectToMongo();
const app = express()
const port = 5000   // AT PORT 3000, REACT APP WILL RUN

app.use(cors())
app.use(express.json()) //if we want to use request.body we have to use this middleware 

//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
    console.log(`iNotebook backend listening on port ${port}`)
})

