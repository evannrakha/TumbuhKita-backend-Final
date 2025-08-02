const { User, TenagaKesehatan, Posyandu, Artikel, Desa, Balita } = require('../models');
const bcrypt = require('bcryptjs');


// ==================== CRUD ARTIKEL ====================
// Membuat artikel
exports.createArtikel = async (req, res) => {
    try {
        const artikel = await Artikel.create(req.body);
        res.status(201).json({ message: 'Artikel berhasil dibuat', artikel });
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat artikel', error: err.message });
    }
};

// Melihat semua artikel
exports.getAllArtikel = async (req, res) => {
    try {
        const artikel = await Artikel.findAll();
        res.json({ artikel });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil artikel', error: err.message });
    }
};

// Mengupdate artikel
exports.updateArtikel = async (req, res) => {
    try {
        const { id } = req.params;
        const artikel = await Artikel.findByPk(id);
        if (!artikel) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        await artikel.update(req.body);
        res.json({ message: 'Artikel berhasil diupdate', artikel });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update artikel', error: err.message });
    }
};

// Menghapus artikel
exports.deleteArtikel = async (req, res) => {
    try {
        const { id } = req.params;
        const artikel = await Artikel.findByPk(id);
        if (!artikel) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        await artikel.destroy();
        res.json({ message: 'Artikel berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus artikel', error: err.message });
    }
};

// ==================== CRUD POSYANDU ====================
exports.createPosyandu = async (req, res) => {
    try {
        const { username, email, password, desa, alamat } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, passwordHash, role: 'posyandu', is_approved: true });
        await Posyandu.create({ id_user: user.id, desa, alamat });

        res.status(201).json({ message: 'Posyandu berhasil didaftarkan', user });
    } catch (err) {
        res.status(500).json({ message: 'Gagal registrasi posyandu', error: err.message });
    }
};

exports.getAllPosyandu = async (req, res) => {
    try {
        const posyandu = await Posyandu.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['username', 'is_approved'] // hanya ambil field yang diperlukan
            }
        });

        res.json({ posyandu });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil posyandu', error: err.message });
    }
};

exports.updatePosyandu = async (req, res) => {
    const id_user = req.params.id_user; // ✅ FIXED
    const { username, email, password, desa, alamat, is_approved } = req.body;

    try {
        const posyandu = await Posyandu.findOne({ where: { id_user } });
        if (!posyandu) {
        return res.status(404).json({ message: 'Posyandu tidak ditemukan' });
        }

        const userUpdateData = {};
        if (username) userUpdateData.username = username;
        if (email) userUpdateData.email = email;
        if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userUpdateData.passwordHash = hashedPassword;
        }
        if (typeof is_approved !== 'undefined') {
        userUpdateData.is_approved = is_approved;
        }

        await User.update(userUpdateData, { where: { id: id_user } });
        await Posyandu.update({ desa, alamat }, { where: { id_user } });

        res.status(200).json({ message: 'Data posyandu berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui data posyandu', error: error.message });
    }
};

exports.deletePosyandu = async (req, res) => {
   try {
        const { id } = req.params;
        const posyandu = await Posyandu.findByPk(id);
        if (!posyandu) return res.status(404).json({ message: 'Posyandu tidak ditemukan' });

        const relatedChildren = await Balita.count({ where: { id_posyandu: id } });
        if (relatedChildren > 0) {
            return res.status(400).json({ message: 'Tidak bisa menghapus posyandu karena masih memiliki balita terkait' });
        }

        await posyandu.destroy();
        res.json({ message: 'Posyandu berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus posyandu', error: err.message });
    }
};

// ==================== CRUD TENAGA KESEHATAN ====================
exports.createTenagaKesehatan = async (req, res) => {
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

exports.getAllTenagaKesehatan = async (req, res) => {
    try {
        const tenagaKesehatan = await TenagaKesehatan.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['username', 'is_approved'] // hanya ambil field yang diperlukan
            }
        });
        res.json({ tenagaKesehatan });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil tenaga kesehatan', error: err.message });
    }
};

exports.updateTenagaKesehatan = async (req, res) => {
    const id = req.params.id_user; // dari route param
    const { username, email, password, is_approved, NIP, STR, spesialisasi, pendidikan, kontak } = req.body;

    try {
        const tenagaKesehatan = await TenagaKesehatan.findOne({ where: { id_user: id } });
        if (!tenagaKesehatan) {
            return res.status(404).json({ message: 'Tenaga kesehatan tidak ditemukan' });
        }

        // Update data user (akun)
        const userUpdateData = {};
        if (username) userUpdateData.username = username;
        if (email) userUpdateData.email = email;
        if (password) userUpdateData.passwordHash = await bcrypt.hash(password, 10);
        if (typeof is_approved !== 'undefined') userUpdateData.is_approved = is_approved;

        await User.update(userUpdateData, { where: { id } });

        // Update data tenaga kesehatan
        await TenagaKesehatan.update(
            { NIP, STR, spesialisasi, pendidikan, kontak },
            { where: { id_user: id } }
        );

        res.json({ message: 'Tenaga kesehatan berhasil diupdate' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update tenaga kesehatan', error: err.message });
    }
};

exports.deleteTenagaKesehatan = async (req, res) => {
    try {
        const { id } = req.params;
        const tenagaKesehatan = await TenagaKesehatan.findByPk(id);
        if (!tenagaKesehatan) return res.status(404).json({ message: 'Tenaga kesehatan tidak ditemukan' });
        await tenagaKesehatan.destroy();
        res.json({ message: 'Tenaga kesehatan berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus tenaga kesehatan', error: err.message });
    }
};

/* // ==================== CRUD DESA ====================
exports.createDesa = async (req, res) => {
    try {
        const desa = await Desa.create(req.body);
        res.status(201).json({ message: 'Desa berhasil dibuat', desa });
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat desa', error: err.message });
    }
};

exports.getAllDesa = async (req, res) => {
    try {
        const desa = await Desa.findAll();
        res.json({ desa });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil desa', error: err.message });
    }
};

exports.updateDesa = async (req, res) => {
    try {
        const { id } = req.params;
        const desa = await Desa.findByPk(id);
        if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });
        await desa.update(req.body);
        res.json({ message: 'Desa berhasil diupdate', desa });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update desa', error: err.message });
    }
};

exports.deleteDesa = async (req, res) => {
    try {
        const { id } = req.params;
        const desa = await Desa.findByPk(id);
        if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });
        await desa.destroy();
        res.json({ message: 'Desa berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus desa', error: err.message });
    }
};  */

// ==================== CRUD BALITA ====================
exports.createBalita = async (req, res) => {
    try {
        const balita = await Balita.create(req.body);
        res.status(201).json({ message: 'Balita berhasil dibuat', balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat balita', error: err.message });
    }
};

exports.getAllBalita = async (req, res) => {
    try {
        const balita = await Balita.findAll();
        res.json({ balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil balita', error: err.message });
    }
};

exports.updateBalita = async (req, res) => {
    try {
        const { id } = req.params;
        const balita = await Balita.findByPk(id);
        if (!balita) return res.status(404).json({ message: 'Balita tidak ditemukan' });
        await balita.update(req.body);
        res.json({ message: 'Balita berhasil diupdate', balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update balita', error: err.message });
    }
};

exports.deleteBalita = async (req, res) => {
    try {
        const { id } = req.params;
        const balita = await Balita.findByPk(id);
        if (!balita) return res.status(404).json({ message: 'Balita tidak ditemukan' });
        await balita.destroy();
        res.json({ message: 'Balita berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus balita', error: err.message });
    }
};

// ==================== TOTAL TIAP ROLE ====================
exports.getTotalRole = async (req, res) => {
    try {
        const totalAdmin = await User.count({ where: { role: 'admin' } });
        const totalOrangTua = await User.count({ where: { role: 'orangTua' } });
        const totalTenagaKesehatan = await User.count({ where: { role: 'tenagaKesehatan' } });
        const totalPosyandu = await User.count({ where: { role: 'posyandu' } });
        res.json({
            admin: totalAdmin,
            orangTua: totalOrangTua,
            tenagaKesehatan: totalTenagaKesehatan,
            posyandu: totalPosyandu
        });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil total role', error: err.message });
    }
};