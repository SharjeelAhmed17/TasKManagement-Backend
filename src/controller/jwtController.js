const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.API_SECRET);

        if (decodedToken.id !== req.body.userId) {
            return res.status(403).send('Forbidden');
        }

        next();
    } catch (error) {
        return res.status(401).send('Unauthorized');
    }
};
