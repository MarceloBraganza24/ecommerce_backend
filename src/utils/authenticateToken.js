import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Espera "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ status: 'error', error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.privateKeyJWT);
        req.user = decoded.user; // Lo que guardaste en el payload
        next();
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Invalid or expired token' });
    }
};
