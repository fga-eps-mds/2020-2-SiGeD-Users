const index = (request, response) =>{ 
    return response.json({user: 'user'})
}

module.exports = {index}