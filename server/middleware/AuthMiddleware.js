const {verify} = require("jsonwebtoken")

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")

    if (!accessToken) return res.json({Error: "User Not Logged In"})

    try {
        const validToken = verify(accessToken, "importantsecret")
        req.user = validToken
        if (validToken) {
            return next()
        }
    } catch (err) {
        return res.json({Error: err})
    }
}

module.exports = {validateToken}