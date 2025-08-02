const { Balita, OrangTua, Posyandu, LogPertumbuhan, JadwalVaksin, BalitaJadwalVaksinasi, Artikel, PertanyaanForum, JawabanForum, TenagaKesehatan, sequelize, User} = require('../models');
const { Op } = require('sequelize');

// Tambah data anak
exports.createBalita = async (req, res) => {
    try {
        const orangTua = await OrangTua.findOne({ where: { id_user: req.user.id } });
        if (!orangTua) return res.status(404).json({ message: 'Data orang tua tidak ditemukan' });

        // Hitung jumlah anak yang sudah didaftarkan
        const jumlahAnakSekarang = await Balita.count({ where: { id_orang_tua: orangTua.id } });

        // Jika lebih dari jumlahAnak, increment jumlahAnak
        if (jumlahAnakSekarang >= orangTua.jumlahAnak) {
            orangTua.jumlahAnak += 1;
            await orangTua.save();
        }

        // Pastikan posyandu valid
        const posyandu = await Posyandu.findByPk(req.body.id_posyandu);
        if (!posyandu) return res.status(400).json({ message: 'Posyandu tidak valid' });

        const balita = await Balita.create({
            ...req.body,
            id_orang_tua: orangTua.id,
            is_verified: false
        });

        res.status(201).json({ message: 'Data anak berhasil ditambahkan, menunggu verifikasi posyandu', balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menambah data anak', error: err.message });
    }
};

exports.getAllBalita = async (req, res) => {
    try {
        const orangTua = await OrangTua.findOne({ where: { id_user: req.user.id } });
        if (!orangTua) return res.status(404).json({ message: 'Data orang tua tidak ditemukan' });

        const balitas = await Balita.findAll({
            where: { id_orang_tua: orangTua.id, is_verified: true },
            include: [
                { model: LogPertumbuhan, as: 'log_pertumbuhan', order: [['tanggal', 'DESC']] }
            ]
        });

        const result = balitas.map(balita => {
            // Hitung umur
            const now = new Date();
            const tglLahir = new Date(balita.tanggal_lahir);
            let tahun = now.getFullYear() - tglLahir.getFullYear();
            let bulan = now.getMonth() - tglLahir.getMonth();
            if (bulan < 0) { tahun--; bulan += 12; }
            // Tanggal pemeriksaan terakhir
            let tglTerakhir = balita.log_pertumbuhan.length > 0
                ? balita.log_pertumbuhan[balita.log_pertumbuhan.length - 1].tanggal
                : balita.createdAt;
            return {
                id: balita.id,
                nama: balita.nama,
                gender: balita.gender,
                umur: `${tahun} tahun ${bulan} bulan`,
                tanggal_lahir: balita.tanggal_lahir,
                berat: balita.berat,
                tinggi: balita.tinggi,
                tanggal_pemeriksaan_terakhir: tglTerakhir
            };
        });

        res.json({ balitas: result });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data balita', error: err.message });
    }
};

exports.updateBalita = async (req, res) => {
    try {
        const { id } = req.params;
        // Cari id_orang_tua dari tabel OrangTua berdasarkan id_user dari JWT
        const orangTua = await OrangTua.findOne({ where: { id_user: req.user.id } });
        if (!orangTua) return res.status(404).json({ message: 'Data orang tua tidak ditemukan' });

        // Cari balita milik orang tua yang sedang login
        const balita = await Balita.findOne({
            where: {
                id,
                id_orang_tua: orangTua.id
            }
        });
        if (!balita) return res.status(404).json({ message: 'Data balita tidak ditemukan atau bukan milik Anda' });

        // Jangan izinkan update id_orang_tua
        const { id_orang_tua, ...updateData } = req.body;

        await balita.update(updateData);
        res.json({ message: 'Data balita berhasil diupdate', balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update data balita', error: err.message });
    }
};

// Melihat log tinggi badan balita
exports.getLogTinggiBalita = async (req, res) => {
    try {
        const { id } = req.params;
        // Pastikan balita milik orang tua yang login
        const orangTua = await OrangTua.findOne({ where: { id_user: req.user.id } });
        if (!orangTua) return res.status(404).json({ message: 'Data orang tua tidak ditemukan' });

        const balita = await Balita.findOne({ where: { id, id_orang_tua: orangTua.id } });
        if (!balita) return res.status(404).json({ message: 'Data balita tidak ditemukan' });

        const logTinggi = await LogPertumbuhan.findAll({
            where: { id_balita: id },
            order: [['tanggal', 'ASC']],
            attributes: ['tanggal', 'tinggi']
        });

        res.json({ id_balita: id, nama: balita.nama, log_tinggi: logTinggi });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil log tinggi', error: err.message });
    }
};

// Melihat log berat badan balita
exports.getLogBeratBalita = async (req, res) => {
    try {
        const { id } = req.params;
        const orangTua = await OrangTua.findOne({ where: { id_user: req.user.id } });
        if (!orangTua) return res.status(404).json({ message: 'Data orang tua tidak ditemukan' });

        const balita = await Balita.findOne({ where: { id, id_orang_tua: orangTua.id } });
        if (!balita) return res.status(404).json({ message: 'Data balita tidak ditemukan' });

        const logBerat = await LogPertumbuhan.findAll({
            where: { id_balita: id },
            order: [['tanggal', 'ASC']],
            attributes: ['tanggal', 'berat']
        });

        res.json({ id_balita: id, nama: balita.nama, log_berat: logBerat });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil log berat', error: err.message });
    }
};

// Melihat log lingkar kepala balita
exports.getLogLingkarKepalaBalita = async (req, res) => {
    try {
        const { id } = req.params;
        const orangTua = await OrangTua.findOne({ where: { id_user: req.user.id } });
        if (!orangTua) return res.status(404).json({ message: 'Data orang tua tidak ditemukan' });

        const balita = await Balita.findOne({ where: { id, id_orang_tua: orangTua.id } });
        if (!balita) return res.status(404).json({ message: 'Data balita tidak ditemukan' });

        const logLingkarKepala = await LogPertumbuhan.findAll({
            where: { id_balita: id },
            order: [['tanggal', 'ASC']],
            attributes: ['tanggal', 'lingkar_kepala']
        });

        res.json({ id_balita: id, nama: balita.nama, log_lingkar_kepala: logLingkarKepala });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil log lingkar kepala', error: err.message });
    }
};

exports.getJadwalImunisasiBalita = async (req, res) => {
    try {
        const { id } = req.params;
        // Pastikan balita milik orang tua ini
        const balita = await Balita.findOne({ where: { id, id_orang_tua: req.user.id } });
        if (!balita) return res.status(404).json({ message: 'Data balita tidak ditemukan' });

        const jadwal = await BalitaJadwalVaksinasi.findAll({
            where: { id_balita: id },
            include: [{ model: JadwalVaksin, as: 'jadwal_vaksin' }]
        });

        const upcoming = jadwal.filter(j => new Date(j.jadwal_vaksin.tanggal) >= new Date());
        const history = jadwal.filter(j => new Date(j.jadwal_vaksin.tanggal) < new Date());

        res.json({
            upcoming: upcoming.map(j => ({
                tanggal: j.jadwal_vaksin.tanggal,
                nama_vaksin: j.jadwal_vaksin.nama_vaksin,
                status: j.status
            })),
            history: history.map(j => ({
                tanggal: j.jadwal_vaksin.tanggal,
                nama_vaksin: j.jadwal_vaksin.nama_vaksin,
                status: j.status
            }))
        });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil jadwal imunisasi', error: err.message });
    }
};

exports.getAllArtikel = async (req, res) => {
    try {
        const { judul } = req.query;
        const where = judul ? { judul: { [Op.like]: `%${judul}%` } } : {};
        const artikel = await Artikel.findAll({ where });
        res.json({ artikel });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil artikel', error: err.message });
    }
};

exports.getArtikelDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const artikel = await Artikel.findByPk(id);
        if (!artikel) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        artikel.dilihat += 1;
        await artikel.save();
        res.json({ artikel });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil detail artikel', error: err.message });
    }
};

exports.createPertanyaanForum = async (req, res) => {
    try {
        const orangTua = await OrangTua.findOne({ where: { id_user: req.user.id } });
        if (!orangTua) return res.status(404).json({ message: 'Data orang tua tidak ditemukan' });

        const pertanyaan = await PertanyaanForum.create({
            id_user: req.user.id,
            nama: req.body.nama,
            pertanyaan: req.body.pertanyaan,
            id_kategori: req.body.id_kategori
        });
        res.status(201).json({ message: 'Pertanyaan berhasil dibuat', pertanyaan });
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat pertanyaan', error: err.message });
    }
};

exports.getAllPertanyaanSendiri = async (req, res) => {
    try {
        const pertanyaan = await PertanyaanForum.findAll({
            where: { id_user: req.user.id },
            attributes: ['id', 'createdAt', 'nama', 'pertanyaan', 'status']
        });
        res.json({ pertanyaan });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil pertanyaan', error: err.message });
    }
};

exports.getJawabanPertanyaan = async (req, res) => {
    try {
        const { id } = req.params;
        const pertanyaan = await PertanyaanForum.findOne({
            where: { id, id_user: req.user.id },
            include: [{
                model: JawabanForum,
                as: 'jawaban_forum',
                include: [{
                    model: TenagaKesehatan,
                    as: 'tenaga_kesehatan',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    }],
                    attributes: ['id', 'id_user', 'NIP', 'spesialisasi', 'STR', 'pendidikan', 'kontak']
                }]
            }]
        });
        if (!pertanyaan) return res.status(404).json({ message: 'Pertanyaan tidak ditemukan' });

        // Format respons agar nama tenaga kesehatan mudah diakses
        const jawaban = (pertanyaan.jawaban_forum || []).map(j => ({
            ...j.toJSON(),
            tenaga_kesehatan: j.tenaga_kesehatan
                ? {
                    ...j.tenaga_kesehatan.toJSON(),
                    nama: j.tenaga_kesehatan.user ? j.tenaga_kesehatan.user.username : null
                }
                : null
        }));

        res.json({ jawaban });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil jawaban', error: err.message });
    }
};