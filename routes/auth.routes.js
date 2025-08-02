const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * /auth/register/admin:
 *   post:
 *     summary: Register admin baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin berhasil didaftarkan
 *       400:
 *         description: Email sudah terdaftar
 */
router.post('/register/admin', authController.registerAdmin);

/**
 * @swagger
 * /auth/register/orangtua:
 *   post:
 *     summary: Register orang tua baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, kontak]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               kontak:
 *                 type: string
 *               jumlahAnak:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Orang Tua berhasil didaftarkan
 *       400:
 *         description: Email sudah terdaftar
 */
router.post('/register/orangtua', authController.registerOrangTua);

/**
 * @swagger
 * /auth/register/tenagakesehatan:
 *   post:
 *     summary: Register tenaga kesehatan baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, NIP, spesialisasi, STR, pendidikan]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               NIP:
 *                 type: integer
 *               spesialisasi:
 *                 type: string
 *               STR:
 *                 type: string
 *               pendidikan:
 *                 type: string
 *               kontak:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tenaga Kesehatan berhasil didaftarkan
 *       400:
 *         description: Email sudah terdaftar
 */
router.post('/register/tenagakesehatan', authController.registerTenagaKesehatan);

/**
 * @swagger
 * /auth/register/posyandu:
 *   post:
 *     summary: Register posyandu baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, desa, alamat]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               desa:
 *                 type: string
 *               alamat:
 *                 type: string
 *     responses:
 *       201:
 *         description: Data posyandu berhasil diperbarui
 *       400:
 *         description: Email sudah terdaftar
 */
router.post('/register/posyandu', authController.registerPosyandu);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Email tidak ditemukan atau password salah
 */
router.post('/login', authController.login);

module.exports = router;