const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // get token from header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'login please'});
    }

    const token = authHeader.split(' ')[1];

    // check token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // // 把使用者資訊掛到 req 上，後續路由可以使用
        next();
    } catch(error) {
        return res.status(401).json({error: 'token is invalid or expired'});
    }
}

module.exports = authenticate;