const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, OrangTua, TenagaKesehatan, Posyandu } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_tumbuhkita';

// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, role: 'admin', is_approved: true });

        res.status(201).json({ message: 'Admin berhasil didaftarkan', user });
    } catch (err) {
        res.status(500).json({ message: 'Gagal registrasi admin', error: err.message });
    }
};

// Register Orang Tua
exports.registerOrangTua = async (req, res) => {
    try {
        const { username, email, password, kontak, jumlahAnak } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, role: 'orangTua', is_approved: false });
        await OrangTua.create({ id_user: user.id, kontak, jumlahAnak: jumlahAnak || 0 });

        res.status(201).json({ message: 'Orang Tua berhasil didaftarkan', user });
    } catch (err) {
        res.status(500).json({ message: 'Gagal registrasi orang tua', error: err.message });
    }
};

// Register Tenaga Kesehatan
exports.registerTenagaKesehatan = async (req, res) => {
    try {
        const { username, email, password, NIP, spesialisasi, STR, pendidikan, kontak } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, role: 'tenagaKesehatan', is_approved: false });
        await TenagaKesehatan.create({ id_user: user.id, NIP, spesialisasi, STR, pendidikan, kontak});

        res.status(201).json({ message: 'Tenaga Kesehatan berhasil didaftarkan', user });
    } catch (err) {
        res.status(500).json({ message: 'Gagal registrasi tenaga kesehatan', error: err.message });
    }
};

// Register Posyandu
exports.registerPosyandu = async (req, res) => {
    try {
        const { username, email, password, desa, alamat } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, role: 'posyandu', is_approved: false });
        await Posyandu.create({ id_user: user.id, desa, alamat });

        res.status(201).json({ message: 'Posyandu berhasil didaftarkan', user });
    } catch (err) {
        res.status(500).json({ message: 'Gagal registrasi posyandu', error: err.message });
    }
};

// Login (tetap satu endpoint)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email tidak ditemukan' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(400).json({ message: 'Password salah' });

        const approved = user.is_approved;
        if (!approved) return res.status(403).json({ message: 'Akun belum disetujui' });
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Login berhasil', token, user });
    } catch (err) {
        res.status(500).json({ message: 'Gagal login', error: err.message });
    }
};