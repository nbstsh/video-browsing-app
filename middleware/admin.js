
module.exports = async function(req, res, next) {
    if (!req.user.isAdmin) {
        return res.render('login', { errorMessage: 'No authorization'})
    }
    next()
}  