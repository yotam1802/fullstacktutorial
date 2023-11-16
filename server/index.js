const express = require('express')
const app = express()
const PORT = 3001 
const db = require('./models')
const cors = require('cors')

app.use(cors())
app.use(express.json())

// Routers
app.use('/posts', require('./routes/Posts'))

app.use('/comments', require('./routes/Comments'))

app.use('/auth', require('./routes/Users'))

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})