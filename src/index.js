const { request } = require('express')
const express = require('express')

const port = 3001

const app = express()
app.use(express.json())

app.get('/', (resquest, response) => {
    response.json({'': ''})
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})