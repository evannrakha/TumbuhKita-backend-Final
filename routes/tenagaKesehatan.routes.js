const express = require('express');
const router = express.Router();
const tenagaKesehatanController = require('../controllers/tenagaKesehatan.controller');
const { authenticate, isTenagaKesehatan } = require('../middleware/auth');

router.use(authenticate, isTenagaKesehatan);

/**
 * @swagger
 * /tenagakesehatan/forum/pertanyaan:
 *   get:
 *     summary: Melihat semua pertanyaan forum beserta status terjawab/belum
 *     tags: [TenagaKesehatan]
 *     responses:
 *       200:
 *         description: Daftar pertanyaan forum
 */
router.get('/forum/pertanyaan', tenagaKesehatanController.getAllPertanyaanForum);

/**
 * @swagger
 * /tenagakesehatan/forum/pertanyaan/{id}/jawab:
 *   post:
 *     summary: Menjawab pertanyaan forum
 *     tags: [TenagaKesehatan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID pertanyaan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jawaban:
 *                 type: string
 *     responses:
 *       201:
 *         description: Jawaban berhasil dikirim
 */
router.post('/forum/pertanyaan/:id/jawab', tenagaKesehatanController.jawabPertanyaan);

/**
 * @swagger
 * /tenagakesehatan/forum/statistik:
 *   get:
 *     summary: Melihat statistik total, terjawab, dan belum terjawab
 *     tags: [TenagaKesehatan]
 *     responses:
 *       200:
 *         description: Statistik pertanyaan forum
 */
router.get('/forum/statistik', tenagaKesehatanController.getStatistikPertanyaan);

/**
 * @swagger
 * /tenagakesehatan/forum/pertanyaan/filter:
 *   get:
 *     summary: Melihat pertanyaan berdasarkan status terjawab/belum
 *     tags: [TenagaKesehatan]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter status (true=terjawab, false=belum terjawab)
 *     responses:
 *       200:
 *         description: Daftar pertanyaan terfilter
 */
router.get('/forum/pertanyaan/filter', tenagaKesehatanController.getPertanyaanByStatus);

/**
 * @swagger
 * /tenagakesehatan/forum/statistik-per-kategori:
 *   get:
 *     summary: Melihat statistik jumlah pertanyaan per kategori (urut terbanyak)
 *     tags: [TenagaKesehatan]
 *     responses:
 *       200:
 *         description: Statistik pertanyaan per kategori
 */
router.get('/forum/statistik-per-kategori', tenagaKesehatanController.getStatistikPertanyaanPerKategori);

module.exports = router;