const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middleware/auth');

/**
 * Semua endpoint di bawah ini hanya bisa diakses oleh admin yang sudah login
 */
router.use(authenticate, isAdmin);



/**
 * @swagger
 * /admin/artikel:
 *   post:
 *     summary: Membuat artikel baru
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artikel'
 *     responses:
 *       201:
 *         description: Artikel berhasil dibuat
 */
router.post('/artikel', adminController.createArtikel);

/**
 * @swagger
 * /admin/artikel:
 *   get:
 *     summary: Melihat semua artikel
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Daftar artikel
 */
router.get('/artikel', adminController.getAllArtikel);

/**
 * @swagger
 * /admin/artikel/{id}:
 *   put:
 *     summary: Update artikel
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID artikel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Artikel'
 *     responses:
 *       200:
 *         description: Artikel berhasil diupdate
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.put('/artikel/:id', adminController.updateArtikel);

/**
 * @swagger
 * /admin/artikel/{id}:
 *   delete:
 *     summary: Hapus artikel
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID artikel
 *     responses:
 *       200:
 *         description: Artikel berhasil dihapus
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.delete('/artikel/:id', adminController.deleteArtikel);

/**
 * @swagger
 * /admin/posyandu:
 *   post:
 *     summary: Membuat posyandu baru
 *     tags: [Admin]
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
 *         description: Posyandu berhasil didaftarkan
 *       400:
 *         description: Email sudah terdaftar
 */
router.post('/posyandu', adminController.createPosyandu);

/**
 * @swagger
 * /admin/posyandu:
 *   get:
 *     summary: Melihat semua posyandu
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Daftar posyandu
 */
router.get('/posyandu', adminController.getAllPosyandu);

/**
 * @swagger
 * /admin/posyandu/{id}:
 *   put:
 *     summary: Update posyandu
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID User Posyandu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: posyandu_desa1
 *               email:
 *                 type: string
 *                 example: desa1@posyandu.com
 *               password:
 *                 type: string
 *                 example: newsecurepassword123
 *               is_approved:
 *                 type: boolean
 *                 example: true
 *               desa:
 *                 type: string
 *                 example: Desa Mekarsari
 *               alamat:
 *                 type: string
 *                 example: Jl. Kesehatan No. 12
 *     responses:
 *       200:
 *         description: Data posyandu berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data posyandu berhasil diperbarui
 *       404:
 *         description: User atau data posyandu tidak ditemukan
 *       500:
 *         description: Gagal memperbarui data posyandu
 */
router.put('/posyandu/:id_user', adminController.updatePosyandu);

/**
 * @swagger
 * /admin/posyandu/{id}:
 *   delete:
 *     summary: Hapus posyandu
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID posyandu
 *     responses:
 *       200:
 *         description: Posyandu berhasil dihapus
 *       404:
 *         description: Posyandu tidak ditemukan
 *       400:
 *         description: Tidak bisa menghapus posyandu karena masih memiliki balita terkait
 */
router.delete('/posyandu/:id', adminController.deletePosyandu);

/**
 * @swagger
 * /admin/tenagakesehatan:
 *   post:
 *     summary: Membuat tenaga kesehatan baru
 *     tags: [Admin]
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
router.post('/tenagakesehatan', adminController.createTenagaKesehatan);

/**
 * @swagger
 * /admin/tenagakesehatan:
 *   get:
 *     summary: Melihat semua tenaga kesehatan
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Daftar tenaga kesehatan
 */
router.get('/tenagakesehatan', adminController.getAllTenagaKesehatan);

/**
 * @swagger
 * /admin/tenagakesehatan/{id}:
 *   put:
 *     summary: Update tenaga kesehatan
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID User tenaga kesehatan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenagaKesehatan'
 *     responses:
 *       200:
 *         description: Tenaga kesehatan berhasil diupdate
 *       404:
 *         description: Tenaga kesehatan tidak ditemukan
 */
router.put('/tenagakesehatan/:id_user', adminController.updateTenagaKesehatan);

/**
 * @swagger
 * /admin/tenagakesehatan/{id}:
 *   delete:
 *     summary: Hapus tenaga kesehatan
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID tenaga kesehatan
 *     responses:
 *       200:
 *         description: Tenaga kesehatan berhasil dihapus
 *       404:
 *         description: Tenaga kesehatan tidak ditemukan
 */
router.delete('/tenagakesehatan/:id', adminController.deleteTenagaKesehatan);

/**
 * @swagger
 * /admin/balita:
 *   post:
 *     summary: Membuat balita baru
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Balita'
 *     responses:
 *       201:
 *         description: Balita berhasil dibuat
 */
router.post('/balita', adminController.createBalita);

/**
 * @swagger
 * /admin/balita:
 *   get:
 *     summary: Melihat semua balita
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Daftar balita
 */
router.get('/balita', adminController.getAllBalita);

/**
 * @swagger
 * /admin/balita/{id}:
 *   put:
 *     summary: Update balita
 *     tags: [Admin]
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
 *       404:
 *         description: Balita tidak ditemukan
 */
router.put('/balita/:id', adminController.updateBalita);

/**
 * @swagger
 * /admin/balita/{id}:
 *   delete:
 *     summary: Hapus balita
 *     tags: [Admin]
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
 *       404:
 *         description: Balita tidak ditemukan
 */
router.delete('/balita/:id', adminController.deleteBalita);

/**
 * @swagger
 * /admin/total-role:
 *   get:
 *     summary: Melihat total user tiap role
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Total user tiap role
 */
router.get('/total-role', adminController.getTotalRole);

module.exports = router;