const express = require('express');
const router = express.Router();
const posyanduController = require('../controllers/posyandu.controller');
const { authenticate, isPosyandu } = require('../middleware/auth');

// Semua endpoint di bawah ini hanya untuk role posyandu
router.use(authenticate, isPosyandu);

/**
 * @swagger
 * /posyandu/balita:
 *   get:
 *     summary: Melihat semua data balita di posyandu ini
 *     tags: [Posyandu]
 *     responses:
 *       200:
 *         description: Daftar balita
 */
router.get('/balita', posyanduController.getAllBalita);

/**
 * @swagger
 * /posyandu/balita:
 *   post:
 *     summary: Menambah data balita baru di posyandu ini
 *     tags: [Posyandu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Balita'
 *     responses:
 *       201:
 *         description: Balita berhasil ditambahkan
 */
router.post('/balita', posyanduController.createBalita);

/**
 * @swagger
 * /posyandu/balita/{id}:
 *   put:
 *     summary: Update data balita di posyandu ini
 *     tags: [Posyandu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Balita'
 *     responses:
 *       200:
 *         description: Balita berhasil diupdate
 */
router.put('/balita/:id', posyanduController.updateBalita);

/**
 * @swagger
 * /posyandu/balita/{id}:
 *   delete:
 *     summary: Hapus data balita di posyandu ini
 *     tags: [Posyandu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita
 *     responses:
 *       200:
 *         description: Balita berhasil dihapus
 */
router.delete('/balita/:id', posyanduController.deleteBalita);

/**
 * @swagger
 * /posyandu/balita/{id}/tumbuh-kembang:
 *   put:
 *     summary: Update tumbuh kembang balita dan simpan ke log pertumbuhan
 *     tags: [Posyandu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               berat:
 *                 type: number
 *               tinggi:
 *                 type: number
 *               lingkar_kepala:
 *                 type: number
 *               catatan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Data tumbuh kembang berhasil diupdate
 */
router.put('/balita/:id/tumbuh-kembang', posyanduController.updateTumbuhKembang);

/**
 * @swagger
 * /posyandu/jadwal-vaksinasi:
 *   post:
 *     summary: Membuat jadwal vaksinasi baru
 *     tags: [Posyandu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_vaksin:
 *                 type: string
 *               tanggal:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Jadwal vaksinasi berhasil dibuat
 */
router.post('/jadwal-vaksinasi', posyanduController.createJadwalVaksinasi);

/**
 * @swagger
 * /posyandu/jadwal-vaksinasi/assign:
 *   post:
 *     summary: Assign balita ke jadwal vaksinasi
 *     tags: [Posyandu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_jadwal_vaksinasi:
 *                 type: integer
 *               id_balita:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Balita berhasil di-assign ke jadwal vaksinasi
 */
router.post('/jadwal-vaksinasi/assign', posyanduController.assignBalitaToJadwal);

/**
 * @swagger
 * /posyandu/jadwal-vaksinasi/status/{id}:
 *   put:
 *     summary: Update status vaksinasi balita pada jadwal tertentu
 *     tags: [Posyandu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita_jadwal_vaksinasi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, selesai, terlewat]
 *     responses:
 *       200:
 *         description: Status vaksinasi berhasil diupdate
 */
router.put('/jadwal-vaksinasi/status/:id', posyanduController.updateStatusVaksinasi);

/**
 * @swagger
 * /posyandu/jadwal-vaksinasi:
 *   get:
 *     summary: Melihat semua jadwal vaksinasi yang dibuat oleh posyandu ini (lengkap tanggal dan jumlah anak terjadwal)
 *     tags: [Posyandu]
 *     responses:
 *       200:
 *         description: Daftar jadwal vaksinasi beserta jumlah anak terjadwal
 */
router.get('/jadwal-vaksinasi', posyanduController.getAllJadwalVaksinasi);

/**
 * @swagger
 * /posyandu/jadwal-vaksinasi/{id}:
 *   put:
 *     summary: Edit jadwal vaksinasi
 *     tags: [Posyandu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID jadwal vaksinasi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_vaksin:
 *                 type: string
 *               tanggal:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Jadwal vaksinasi berhasil diupdate
 */
router.put('/jadwal-vaksinasi/:id', posyanduController.updateJadwalVaksinasi);

/**
 * @swagger
 * /posyandu/jadwal-vaksinasi/{id}:
 *   delete:
 *     summary: Hapus jadwal vaksinasi beserta semua relasi balita yang terjadwal
 *     tags: [Posyandu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID jadwal vaksinasi
 *     responses:
 *       200:
 *         description: Jadwal vaksinasi dan semua relasi balita berhasil dihapus
 */
router.delete('/jadwal-vaksinasi/:id', posyanduController.deleteJadwalVaksinasi);

/**
 * @swagger
 * /posyandu/balita/count:
 *   get:
 *     summary: Mendapatkan jumlah balita di posyandu ini
 *     tags: [Posyandu]
 *     responses:
 *       200:
 *         description: Jumlah balita berhasil dihitung
 */
router.get('/balita/count', posyanduController.countBalita);

/**
 * @swagger
 * /posyandu/jadwal-vaksinasi/count:
 *   get:
 *     summary: Mendapatkan jumlah jadwal vaksinasi di posyandu ini
 *     tags: [Posyandu]
 *     responses:
 *       200:
 *         description: Jumlah jadwal vaksinasi berhasil dihitung
 */
router.get('/jadwal-vaksinasi/count', posyanduController.countJadwalVaksinasi);

module.exports = router;
