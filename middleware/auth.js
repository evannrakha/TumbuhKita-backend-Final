const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_tumbuhkita';

// Middleware autentikasi: cek token JWT
exports.authenticate = async (req, res, next) => {
    console.log('Authorization header:', req.headers.authorization);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token tidak ditemukan' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token tidak valid' });
    }
};


// Untuk testing saja: Bypass JWT auth
/*exports.authenticate = async (req, res, next) => {
    req.user = { id: 1, role: 'orangTua' }; // Bypass: anggap user orang tua login
    next();
}; */

// Middleware otorisasi: hanya admin yang boleh akses
exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses hanya untuk admin' });
    }
    next();
};

// Middleware: pastikan user adalah posyandu 
exports.isPosyandu = (req, res, next) => {
    if (!req.user || req.user.role !== 'posyandu') {
        return res.status(403).json({ message: 'Akses hanya untuk posyandu' });
    }
    next();
};

exports.isOrangTua = (req, res, next) => {
    if (!req.user || req.user.role !== 'orangTua') {
        return res.status(403).json({ message: 'Akses hanya untuk orang tua' });
    }
    next();
};

exports.isTenagaKesehatan = (req, res, next) => {
    if (!req.user || req.user.role !== 'tenagaKesehatan') {
        return res.status(403).json({ message: 'Akses hanya untuk tenaga kesehatan' });
    }
    next();
}