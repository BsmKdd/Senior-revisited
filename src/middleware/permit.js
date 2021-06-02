function permit(...permittedRoles) {
    return (req, res, next) => {
        const { user } = req
        if (user && (permittedRoles.includes(user.userType) || user.userType == "Admin")) {
            next()
        } else {
            res.status(403).send({ error: "Forbidden"})
        }
    }
}

module.exports = permit