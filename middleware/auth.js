const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const token = req.cookies.token
    if (!token) return res.redirect('/login')

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decoded
        next()
    }
    catch(ex) {
        return res.redirect('/login')
    }

}