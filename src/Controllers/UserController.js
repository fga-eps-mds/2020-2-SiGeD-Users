const accounts = []

const signUpGet = (req, res) => {
    return res.json(accounts)
}

const signUpPost = (req, res) => {
    const {name, email, enroll, pass} = req.body;

    const user = {
        name: name,
        email: email,
        email: enroll,
        pass: pass
    }

    accounts.push(user)

    return res.json(accounts)
}

const signUpPut = (req, res) => {
    const id = req.params.id

    const {name, email, enroll, pass} = req.body;

    accounts[id - 1].name = name
    accounts[id - 1].email = email
    accounts[id - 1].enroll = enroll
    accounts[id - 1].pass = pass

    return res.json(contas)
}

const signUpDelete = (req, res) => {
    const id = req.params.id

    if (id >= 1) {
        contas.splice(id - 1, 1)
    }

    return res.json(contas);
}

module.exports = {signUpGet, signUpPost, signUpPut, signUpDelete}
