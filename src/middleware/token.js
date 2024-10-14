const { config } = require("dotenv");
const jwt = require("jsonwebtoken")

config()

function tokenVerify(req, res, next) {
    const { authorization } = req.headers;


    if (!authorization) {
        return res.status(401).json({
            errors: ['Login required']
        })
    }
    const [, token] = authorization.split(' ');

    try {
        const data = jwt.verify(token, process.env.TOKEN_SECRET)
        req.data = data
        // eslint-disable-next-line
    } catch (_e) {
        return res.status(401).json({
            errors: ['token expired or invalid']
        })
    }

    next();
}

module.exports = tokenVerify