const jwt = require("jsonwebtoken");

// one more way is to send it via queries in url
module.exports = (req, res, next) => {
    if (req.headers.authorization == null) {
        return next(new Error("Not allowed"));
    }
    if (req.method === "OPTIONS") {
        return next();
    }
    // Authorization : 'Bearer TOKEN'
    let token;
    try {
        token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("Auth Failed");
        }
        // .verify returns payload that we stored
        const decodedToken = jwt.verify(token, "my-key");
        req.user = { id: decodedToken.id };
        next();
    } catch (err) {
        return next(err);
    }
};
