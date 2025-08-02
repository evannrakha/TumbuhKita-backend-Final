const { PertanyaanForum, JawabanForum, Kategori, User, OrangTua } = require('../models');

// Melihat semua pertanyaan forum (beserta status terjawab/belum)
exports.getAllPertanyaanForum = async (req, res) => {
    try {
        const pertanyaan = await PertanyaanForum.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
                { model: Kategori, as: 'kategori', attributes: ['id', 'nama'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ pertanyaan });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil pertanyaan', error: err.message });
    }
};

exports.jawabPertanyaan = async (req, res) => {
    try {
        const { id } = req.params; // id pertanyaan
        const { jawaban } = req.body;
        // Cek apakah pertanyaan ada
        const pertanyaan = await PertanyaanForum.findByPk(id);
        if (!pertanyaan) return res.status(404).json({ message: 'Pertanyaan tidak ditemukan' });

        // Buat jawaban
        const jawabanForum = await JawabanForum.create({
            id_user: req.user.id, // id_user tenaga kesehatan dari JWT
            id_pertanyaan: id,
            jawaban
        });

        // Update status pertanyaan menjadi terjawab
        pertanyaan.status = true;
        pertanyaan.id_jawaban_forum = jawabanForum.id;
        await pertanyaan.save();

        res.status(201).json({ message: 'Jawaban berhasil dikirim', jawaban: jawabanForum });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menjawab pertanyaan', error: err.message });
    }
};

const { Op, fn, col } = require('sequelize');

exports.getStatistikPertanyaan = async (req, res) => {
    try {
        const total = await PertanyaanForum.count();
        const terjawab = await PertanyaanForum.count({ where: { status: true } });
        const belumTerjawab = await PertanyaanForum.count({ where: { status: false } });

        res.json({ total, terjawab, belumTerjawab });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil statistik', error: err.message });
    }
};

// Filter pertanyaan berdasarkan status
exports.getPertanyaanByStatus = async (req, res) => {
    try {
        const { status } = req.query; // status=true/false
        const where = {};
        if (status !== undefined) where.status = status === 'true';
        const pertanyaan = await PertanyaanForum.findAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
                { model: Kategori, as: 'kategori', attributes: ['id', 'nama'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ pertanyaan });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil pertanyaan', error: err.message });
    }
};

exports.getStatistikPertanyaanPerKategori = async (req, res) => {
    try {
        const data = await PertanyaanForum.findAll({
            attributes: [
                'id_kategori',
                [fn('COUNT', col('id')), 'jumlah']
            ],
            include: [
                { model: Kategori, as: 'kategori', attributes: ['nama'] }
            ],
            group: ['id_kategori', 'kategori.id'],
            order: [[fn('COUNT', col('id')), 'DESC']]
        });

        // Format hasil agar mudah dibaca
        const result = data.map(item => ({
            kategori: item.kategori ? item.kategori.nama : null,
            jumlah: item.dataValues.jumlah
        }));

        res.json({ statistik: result });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil statistik kategori', error: err.message });
    }
};