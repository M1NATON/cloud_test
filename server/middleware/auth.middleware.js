const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('err');
            return res.status(401).json({ message: 'Auth error: Token is missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('err'); // Добавьте логирование здесь, чтобы проверить, что токен успешно расшифрован

            return res.status(401).json({ message: 'Auth error: Token is missing or invalid' });
        }

        const decoded = jwt.verify(token, config.get('secretKey'));
        console.log('decoded token:', decoded); // Добавьте логирование здесь, чтобы проверить, что токен успешно расшифрован
        req.user = decoded;
        next();
    } catch (e) {
        console.log('err');
        return res.status(401).json({ message: 'Auth error: Invalid token' });
    }
};
