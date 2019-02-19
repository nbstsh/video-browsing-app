const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const Joi = require('joi')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res, next) => {
    const { error } = validate(req.body)
    if (error) next()

    const user = await User.findOne({ email: req.body.email })
    if (!user) next()

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) next()

    res.cookie('token', user.generateAuthToken(), {
        maxAge: 86400000, // 1day in milliseconds
        // secure: true,
        httpOnly: true,
        path: '/admin'
    })
    res.redirect('/admin/videos')

}, errorHandler)


function errorHandler(req, res) {
    res.render('login', { errorMessage: 'Invalid email or password' })
}

function validate(input) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    }

    return Joi.validate(input, schema)
}



module.exports = router