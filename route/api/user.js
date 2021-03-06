const express = require('express')
const router = express.Router()
const { User, validate } = require('../../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const auth = require('../../middleware/auth')
const admin = require('../../middleware/admin')

router.post('/', [auth, admin], async (req, res) => {
    const { error } = validate(req.body)
    if (error) res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered')

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    res.header('x-auth-token', user.generateAuthToken())

    res.send(_.pick(user, ['name', 'email', 'isAdmin']))
})


module.exports = router