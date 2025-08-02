const express = require('express');
const router = express.Router();
const orangTuaController = require('../controllers/orangTua.controller');
const { authenticate, isOrangTua } = require('../middleware/auth');

// Semua endpoint di bawah ini hanya untuk role orang tua
router.use(authenticate, isOrangTua);

/**
 * @swagger
 * /orangtua/balita:
 *   post:
 *     summary: Menambah data anak (balita)
 *     tags: [OrangTua]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Balita'
 *     responses:
 *       201:
 *         description: Data anak berhasil ditambahkan
 */
router.post('/balita', orangTuaController.createBalita);

/**
 * @swagger
 * /orangtua/balita:
 *   get:
 *     summary: Melihat cuplikan semua anak yang telah diverifikasi
 *     tags: [OrangTua]
 *     responses:
 *       200:
 *         description: Daftar balita
 */
router.get('/balita', orangTuaController.getAllBalita);

/**
 * @swagger
 * /orangtua/balita/{id}/log-tinggi:
 *   get:
 *     summary: Melihat log tinggi badan balita
 *     tags: [OrangTua]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita
 *     responses:
 *       200:
 *         description: Log tinggi badan balita
 */
router.get('/balita/:id/log-tinggi', orangTuaController.getLogTinggiBalita);

/**
 * @swagger
 * /orangtua/balita/{id}/log-berat:
 *   get:
 *     summary: Melihat log berat badan balita
 *     tags: [OrangTua]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita
 *     responses:
 *       200:
 *         description: Log berat badan balita
 */
router.get('/balita/:id/log-berat', orangTuaController.getLogBeratBalita);

/**
 * @swagger
 * /orangtua/balita/{id}/log-lingkar-kepala:
 *   get:
 *     summary: Melihat log lingkar kepala balita
 *     tags: [OrangTua]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita
 *     responses:
 *       200:
 *         description: Log lingkar kepala balita
 */
router.get('/balita/:id/log-lingkar-kepala', orangTuaController.getLogLingkarKepalaBalita);

/**
 * @swagger
 * /orangtua/balita/{id}:
 *   put:
 *     summary: Edit data balita milik orang tua (tanpa mengubah orang tua)
 *     tags: [OrangTua]
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
 *         description: Data balita berhasil diupdate
 */
router.put('/balita/:id', orangTuaController.updateBalita);

/**
 * @swagger
 * /orangtua/balita/{id}/jadwal-imunisasi:
 *   get:
 *     summary: Melihat jadwal imunisasi mendatang dan riwayat imunisasi balita
 *     tags: [OrangTua]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID balita
 *     responses:
 *       200:
 *         description: Jadwal imunisasi balita
 */
router.get('/balita/:id/jadwal-imunisasi', orangTuaController.getJadwalImunisasiBalita);

/**
 * @swagger
 * /orangtua/artikel:
 *   get:
 *     summary: Melihat semua artikel atau mencari artikel berdasarkan judul
 *     tags: [OrangTua]
 *     parameters:
 *       - in: query
 *         name: judul
 *         schema:
 *           type: string
 *         required: false
 *         description: Judul artikel (opsional, untuk pencarian)
 *     responses:
 *       200:
 *         description: Daftar artikel
 */
router.get('/artikel', orangTuaController.getAllArtikel);

/**
 * @swagger
 * /orangtua/artikel/{id}:
 *   get:
 *     summary: Melihat detail artikel (dilihat akan bertambah 1)
 *     tags: [OrangTua]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID artikel
 *     responses:
 *       200:
 *         description: Detail artikel
 */
router.get('/artikel/:id', orangTuaController.getArtikelDetail);

/**
 * @swagger
 * /orangtua/forum/pertanyaan:
 *   post:
 *     summary: Membuat pertanyaan forum
 *     tags: [OrangTua]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               pertanyaan:
 *                 type: string
 *               id_kategori:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Pertanyaan berhasil dibuat
 */
router.post('/forum/pertanyaan', orangTuaController.createPertanyaanForum);

/**
 * @swagger
 * /orangtua/forum/pertanyaan:
 *   get:
 *     summary: Melihat semua pertanyaan yang dibuat sendiri
 *     tags: [OrangTua]
 *     responses:
 *       200:
 *         description: Daftar pertanyaan
 */
router.get('/forum/pertanyaan', orangTuaController.getAllPertanyaanSendiri);

/**
 * @swagger
 * /orangtua/forum/pertanyaan/{id}/jawaban:
 *   get:
 *     summary: Melihat semua jawaban pada suatu pertanyaan beserta nama tenaga kesehatan yang menjawab
 *     tags: [OrangTua]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pertanyaan
 *     responses:
 *       200:
 *         description: Daftar jawaban
 */
router.get('/forum/pertanyaan/:id/jawaban', orangTuaController.getJawabanPertanyaan);

module.exports = router;