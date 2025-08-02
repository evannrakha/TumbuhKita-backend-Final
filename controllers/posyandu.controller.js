const { Balita, OrangTua, LogPertumbuhan, JadwalVaksin, User, BalitaJadwalVaksinasi, sequelize } = require('../models');


// 1. Melihat semua data anak di posyandu ini
exports.getAllBalita = async (req, res) => {
    try {
        const balitas = await Balita.findAll({
            where: { id_posyandu: req.user.id },
            include: [{ model: OrangTua, as: 'orang_tua' }]
        });
        res.json({ balitas });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data balita', error: err.message });
    }
};

// 2. CRUD data balita (anak) di posyandu ini
exports.createBalita = async (req, res) => {
    try {
        const data = { ...req.body, id_posyandu: req.user.id, is_verified: true };
        const balita = await Balita.create(data);
        res.status(201).json({ message: 'Balita berhasil ditambahkan', balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menambah balita', error: err.message });
    }
};

exports.updateBalita = async (req, res) => {
    try {
        const { id } = req.params;
        const balita = await Balita.findOne({ where: { id, id_posyandu: req.user.id } });
        if (!balita) return res.status(404).json({ message: 'Balita tidak ditemukan di posyandu Anda' });
        await balita.update(req.body);
        res.json({ message: 'Balita berhasil diupdate', balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update balita', error: err.message });
    }
};

exports.deleteBalita = async (req, res) => {
    try {
        const { id } = req.params;
        const balita = await Balita.findOne({ where: { id, id_posyandu: req.user.id } });
        if (!balita) return res.status(404).json({ message: 'Balita tidak ditemukan di posyandu Anda' });
        await balita.destroy();
        res.json({ message: 'Balita berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus balita', error: err.message });
    }
};

// 3. Update tumbuh kembang anak & simpan ke logPertumbuhan
exports.updateTumbuhKembang = async (req, res) => {
    try {
        const { id } = req.params; // id balita
        const { berat, tinggi, lingkar_kepala, catatan } = req.body;
        const balita = await Balita.findOne({ where: { id, id_posyandu: req.user.id } });
        if (!balita) return res.status(404).json({ message: 'Balita tidak ditemukan di posyandu Anda' });

        // Simpan log pertumbuhan
        await LogPertumbuhan.create({
            id_balita: balita.id,
            id_posyandu: req.user.id,
            tanggal: new Date(),
            berat,
            tinggi,
            lingkar_kepala,
            catatan
        });

        // Update data balita terakhir
        await balita.update({ berat, tinggi, lingkar_kepala });
        res.json({ message: 'Data tumbuh kembang berhasil diupdate', balita });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update tumbuh kembang', error: err.message });
    }
};

// 4. Membuat jadwal imunisasi
exports.createJadwalVaksinasi = async (req, res) => {
    try {
        const { nama_vaksin, tanggal } = req.body;
        const jadwal = await JadwalVaksin.create({
            id_posyandu: req.user.id,
            nama_vaksin,
            tanggal
        });
        res.status(201).json({ message: 'Jadwal vaksinasi berhasil dibuat', jadwal });
    } catch (err) {
        res.status(500).json({ message: 'Gagal membuat jadwal vaksinasi', error: err.message });
    }
};

exports.assignBalitaToJadwal = async (req, res) => {
    try {
        const { id_jadwal_vaksinasi, id_balita } = req.body;
        // Pastikan jadwal dan balita ada dan milik posyandu ini
        const jadwal = await JadwalVaksin.findOne({ where: { id: id_jadwal_vaksinasi, id_posyandu: req.user.id } });
        const balita = await Balita.findOne({ where: { id: id_balita, id_posyandu: req.user.id } });
        if (!jadwal || !balita) return res.status(404).json({ message: 'Jadwal atau balita tidak ditemukan di posyandu Anda' });

        const assign = await BalitaJadwalVaksinasi.create({
            id_balita,
            id_jadwal_vaksinasi,
            status: 'pending'
        });
        res.status(201).json({ message: 'Balita berhasil di-assign ke jadwal vaksinasi', assign });
    } catch (err) {
        res.status(500).json({ message: 'Gagal assign balita ke jadwal vaksinasi', error: err.message });
    }
};

// 5. Update status vaksinasi anak
exports.updateStatusVaksinasi = async (req, res) => {
    try {
        const { id } = req.params; // id balita_jadwal_vaksinasi
        const { status } = req.body;
        const data = await BalitaJadwalVaksinasi.findByPk(id, {
            include: [{
                model: JadwalVaksin,
                as: 'jadwal_vaksin',
                where: { id_posyandu: req.user.id }
            }]
        });
        if (!data) return res.status(404).json({ message: 'Data vaksinasi tidak ditemukan di posyandu Anda' });

        await data.update({ status });
        res.json({ message: 'Status vaksinasi berhasil diupdate', data });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update status vaksinasi', error: err.message });
    }
};

// Mendapatkan semua jadwal vaksinasi beserta jumlah anak yang terjadwal
exports.getAllJadwalVaksinasi = async (req, res) => {
    try {
        const jadwalList = await JadwalVaksin.findAll({
            where: { id_posyandu: req.user.id },
            attributes: [
                'id',
                'nama_vaksin',
                'tanggal',
                [sequelize.fn('COUNT', sequelize.col('balita_jadwal_vaksinasis.id')), 'jumlah_anak']
            ],
            include: [
                {
                    model: BalitaJadwalVaksinasi,
                    as: 'balita_jadwal_vaksinasis',
                    attributes: []
                }
            ],
            group: ['JadwalVaksin.id'],
            order: [['tanggal', 'ASC']]
        });
        res.json({ jadwal: jadwalList });
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil jadwal vaksinasi', error: err.message });
    }
};

exports.updateJadwalVaksinasi = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_vaksin, tanggal } = req.body;
        const jadwal = await JadwalVaksin.findOne({ where: { id, id_posyandu: req.user.id } });
        if (!jadwal) return res.status(404).json({ message: 'Jadwal vaksinasi tidak ditemukan di posyandu Anda' });

        await jadwal.update({ nama_vaksin, tanggal });
        res.json({ message: 'Jadwal vaksinasi berhasil diupdate', jadwal });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update jadwal vaksinasi', error: err.message });
    }
};

exports.deleteJadwalVaksinasi = async (req, res) => {
    try {
        const { id } = req.params;
        const jadwal = await JadwalVaksin.findOne({ where: { id, id_posyandu: req.user.id } });
        if (!jadwal) return res.status(404).json({ message: 'Jadwal vaksinasi tidak ditemukan di posyandu Anda' });

        // Hapus semua relasi balita ke jadwal vaksinasi ini
        await BalitaJadwalVaksinasi.destroy({ where: { id_jadwal_vaksinasi: id } });

        // Hapus jadwal vaksinasi
        await jadwal.destroy();

        res.json({ message: 'Jadwal vaksinasi dan semua relasi balita berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus jadwal vaksinasi', error: err.message });
    }
};

exports.countBalita = async (req, res) => {
  try {
    const jumlahBalita = await Balita.count({
      where: { id_posyandu: req.user.id }
    });

    res.json({ message: 'Jumlah balita berhasil dihitung', total: jumlahBalita });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghitung jumlah balita', error: err.message });
  }
};


exports.countJadwalVaksinasi = async (req, res) => {
  try {
    const jumlahJadwal = await JadwalVaksin.count({
      where: { id_posyandu: req.user.id }
    });

    res.json({ message: 'Jumlah jadwal vaksinasi berhasil dihitung', total: jumlahJadwal });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghitung jumlah jadwal vaksinasi', error: err.message });
  }
};
