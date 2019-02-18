const { User } = require('../models/user')

module.exports = async function(req, res, next) {
    if (!req.user.isAdmin) {
        console.log("==================")
        console.log(req.user)
        console.log("==================")
        // TODO: error handling
        res.status(403).send('Accecc denied')
    }
    next()
}  