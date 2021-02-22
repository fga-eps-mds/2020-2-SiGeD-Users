const { request } = require('express')
const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')

const port = 3001

// mongoose.connect(
//     'mongodb://localhost',
//     {useNewUrlParser: true, useUnifiedTopology: true}
// )

const app = express()

app.use(express.json())
app.use(routes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})