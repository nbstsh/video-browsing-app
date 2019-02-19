const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const Joi = require('joi')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        // TODO error handling
        return res.status(400).send(error.details[0].message)
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        // TODO : failure pattern
        return res.status(400).send('Invalid email or password')
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        // TODO : failure pattern
        return res.status(400).send('Invalid email or password')
    }

    res.send(user.generateAuthToken())
})


function validate(input) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }

    return Joi.validate(input, schema)
}



module.exports = router