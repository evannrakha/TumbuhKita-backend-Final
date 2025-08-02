require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const posyanduRoutes = require('./routes/posyandu.routes');
const orangTuaRoutes = require('./routes/orangTua.routes');
const tenagaKesehatanRoutes = require('./routes/tenagaKesehatan.routes');
const { swaggerUi, specs } = require('./swagger/swagger');

// Middleware
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posyandu', posyanduRoutes);
app.use('/api/orangtua', orangTuaRoutes);
app.use('/api/tenagakesehatan', tenagaKesehatanRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('TumbuhKita API is running');
});

// Sync database and start server
const PORT = process.env.PORT || 3000;
db.sequelize.sync({force: true}).then(async() => {
     // ====== DATA DUMMY ======
    const bcrypt = require('bcryptjs');
    const { User, OrangTua, TenagaKesehatan, Posyandu, Kategori, Artikel, Balita, BalitaJadwalVaksinasi, JadwalVaksin } = db;

    // Hash password dummy
    const passwordHash = await bcrypt.hash('password123', 10);

    // Users
    const admin = await User.create({
        username: 'admin',
        email: 'admin@mail.com',
        passwordHash,
        is_approved: true,
        role: 'admin'
    });
    const orangTua = await User.create({
        username: 'budi',
        email: 'budi@mail.com',
        passwordHash,
        is_approved: true,
        role: 'orangTua'
    });
    const tenagaKesehatan = await User.create({
        username: 'siti',
        email: 'siti@mail.com',
        passwordHash,
        is_approved: true,
        role: 'tenagaKesehatan'
    });
    const posyanduUser = await User.create({
        username: 'posyandu1',
        email: 'pos1@mail.com',
        passwordHash,
        is_approved: true,
        role: 'posyandu'
    });

    // Orang Tua
    const orangTuaData = await OrangTua.create({
        id_user: orangTua.id,
        kontak: '08123456789',
        jumlahAnak: 2
    });

    // Tenaga Kesehatan
    const tenagaKesehatanData = await TenagaKesehatan.create({
        id_user: tenagaKesehatan.id,
        NIP: '1234567890',
        spesialisasi: 'Dokter Anak',
        STR: 'STR12345',
        pendidikan: 'S1 Kedokteran',
        kontak: '08129876543'
    });

    // Posyandu
    const posyanduData = await Posyandu.create({
        id_user: posyanduUser.id,
        desa: 'Desa Maju',
        alamat: 'Jl. Sehat No.1'
    });

    // Kategori
    const kategori1 = await Kategori.create({ nama: 'Kesehatan Anak' });
    const kategori2 = await Kategori.create({ nama: 'Imunisasi' });

    // Artikel
    await Artikel.create({
        penulis: 'dr. Siti',
        judul: 'Pentingnya Imunisasi',
        deskripsi: 'Imunisasi sangat penting untuk balita...',
        status: 'publish',
        dilihat: 10,
        image_path: null,
    });

    // Balita
    const balita1 = await Balita.create({
        id_orang_tua: orangTuaData.id,
        id_posyandu: posyanduData.id,
        nama: 'Andi',
        tanggal_lahir: '2021-01-01',
        gender: 'laki-laki',
        berat: 10.5,
        lingkar_kepala: 45.0,
        tinggi: 75.0,
        tipe_darah: 'O+',
        catatan: 'Sehat',
        image_path: null,
        is_verified: true
    });

    const balita2 = await Balita.create({
        id_orang_tua: orangTuaData.id,
        id_posyandu: posyanduData.id,
        nama: 'Siti',
        tanggal_lahir: '2022-05-10',
        gender: 'perempuan',
        berat: 9.2,
        lingkar_kepala: 43.0,
        tinggi: 70.0,
        tipe_darah: 'A+',
        catatan: 'Perlu kontrol rutin',
        image_path: null,
        is_verified: false
    });

    // Jadwal Vaksinasi (by posyandu)
    const jadwal1 = await JadwalVaksin.create({
        id_posyandu: posyanduData.id,
        nama_vaksin: 'Campak',
        tanggal: '2024-08-10'
    });
    const jadwal2 = await JadwalVaksin.create({
        id_posyandu: posyanduData.id,
        nama_vaksin: 'Polio',
        tanggal: '2024-09-15'
    });

    // Assign balita ke jadwal vaksinasi (many-to-many)
    await BalitaJadwalVaksinasi.create({
        id_balita: balita1.id,
        id_jadwal_vaksinasi: jadwal1.id,
        status: 'pending'
    });
    await BalitaJadwalVaksinasi.create({
        id_balita: balita1.id,
        id_jadwal_vaksinasi: jadwal2.id,
        status: 'pending'
    });
    await BalitaJadwalVaksinasi.create({
        id_balita: balita2.id,
        id_jadwal_vaksinasi: jadwal1.id,
        status: 'pending'
    });

    // ====== END DATA DUMMY ======

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});