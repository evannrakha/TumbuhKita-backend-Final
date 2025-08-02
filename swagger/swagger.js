const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TumbuhKita API',
      version: '1.0.0',
      description: 'Dokumentasi API TumbuhKita',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Artikel: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID artikel',
            },
            penulis: {
              type: 'string',
              description: 'Nama penulis artikel',
            },
            judul: {
              type: 'string',
              description: 'Judul artikel',
            },
            deskripsi: {
              type: 'string',
              description: 'Deskripsi artikel',
            },
            status: {
              type: 'string',
              enum: ['draft', 'publish'],
              description: 'Status artikel',
            },
            dilihat: {
              type: 'integer',
              description: 'Jumlah tampilan artikel',
            },
            image_path: {
              type: 'string',
              description: 'Path gambar artikel',
            },
          },
          required: ['penulis', 'judul', 'deskripsi', 'status'],
        },
        TenagaKesehatan: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID tenaga kesehatan',
            },
            id_user: {
              type: 'integer',
              description: 'Relasi ke tabel user',
            },
            username: {
              type: 'string',
              description: 'Username tenaga kesehatan',
            },
            password: {
              type: 'string',
              description: 'Password tenaga kesehatan',
            },
            NIP: {
              type: 'integer',
              description: 'NIP tenaga kesehatan',
            },
            spesialisasi: {
              type: 'string',
              description: 'Spesialisasi tenaga kesehatan',
            },
            STR: {
              type: 'string',
              description: 'STR tenaga kesehatan',
            },
            pendidikan: {
              type: 'string',
              description: 'Pendidikan tenaga kesehatan',
            },
            kontak: {
              type: 'string',
              description: 'Kontak tenaga kesehatan',
            },
            is_approved: {
              type: 'boolean',
              description: 'Status persetujuan tenaga kesehatan',
            },
          },
          required: ['id_user', 'NIP', 'spesialisasi', 'STR', 'pendidikan', 'kontak'],
        },
        Posyandu: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID posyandu',
            },
            id_user: {
              type: 'integer',
              description: 'Relasi ke tabel user',
            },
            desa: {
              type: 'string',
              description: 'Nama desa posyandu',
            },
            alamat: {
              type: 'string',
              description: 'Alamat posyandu',
            },
          },
          required: ['id_user', 'desa', 'alamat'],
        },
        Balita: {
          type: 'object',
          properties: {
            id_posyandu: {
              type: 'integer',
              description: 'Relasi ke tabel posyandu',
            },
            id_orang_tua: {
              type: 'integer',
              description: 'Relasi ke tabel orang tua',
            },
            nama: {
              type: 'string',
              description: 'Nama balita',
            },
            tanggal_lahir: {
              type: 'string',
              format: 'date',
              description: 'Tanggal lahir balita',
            },
            gender: {
              type: 'string',
              enum: ['laki-laki', 'perempuan'],
              description: 'Jenis kelamin balita',
            },
            berat: {
              type: 'number',
              format: 'float',
              description: 'Berat balita',
            },
            lingkar_kepala: {
              type: 'number',
              format: 'float',
              description: 'Lingkar kepala balita',
            },
            tinggi: {
              type: 'number',
              format: 'float',
              description: 'Tinggi balita',
            },
            tipe_darah: {
              type: 'string',
              enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
              description: 'Tipe darah balita',
            },
            catatan: {
              type: 'string',
              description: 'Catatan kesehatan balita',
            },
            image_path: {
              type: 'string',
              description: 'Path gambar balita',
            },
            is_verified: {
              type: 'boolean',
              description: 'Status verifikasi balita',
            }
          },
          required: ['id_posyandu', 'id_orang_tua', 'nama', 'tanggal_lahir', 'gender', 'berat', 'lingkar_kepala', 'tinggi', 'tipe_darah', 'is_verified'],
        },
        OrangTua: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID orang tua',
            },
            id_user: {
              type: 'integer',
              description: 'Relasi ke tabel user',
            },
            kontak: {
              type: 'string',
              description: 'Kontak orang tua',
            },
            jumlahAnak: {
              type: 'integer',
              description: 'Jumlah anak yang dimiliki orang tua',
            },
          },
          required: ['id_user', 'kontak', 'jumlahAnak'],
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID user',
            },
            username: {
              type: 'string',
              description: 'Username user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email user',
            },
            password: {
              type: 'string',
              description: 'Password user',
            },
            role: {
              type: 'string',
              enum: ['admin', 'tenaga_kesehatan', 'posyandu', 'orang_tua'],
              description: 'Role user',
            },
          },
          required: ['username', 'email', 'password', 'role'],
        },
        PertanyaanForum : {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID pertanyaan',
            },
            id_user: {
              type: 'integer',
              description: 'Relasi ke tabel user',
            },
            id_jawaban_forum: {
              type: 'integer',
              description: 'Relasi ke tabel jawaban forum',
            },
            nama: {
              type: 'string',
              description: 'Nama penanya',
            },
            pertanyaan: {
              type: 'string',
              description: 'Isi pertanyaan',
            },
            status: {
              type: 'boolean',
              description: 'Status pertanyaan (terjawab/tidak)',
            },
            id_kategori: {
              type: 'integer',
              description: 'ID kategori pertanyaan',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Waktu pembuatan pertanyaan',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Waktu pembaruan pertanyaan',
            },
          },
          required: ['id_user', 'pertanyaan', 'status', 'id_kategori', 'createdAt', 'updatedAt'],
        },
        JawabanForum : {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID jawaban',
            },
            id_user: {
              type: 'integer',
              description: 'Relasi ke tabel user',
            },
            id_pertanyaan: {
              type: 'integer',
              description: 'Relasi ke tabel pertanyaan',
            },
            jawaban: {
              type: 'string',
              description: 'Isi jawaban',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Waktu pembuatan jawaban',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Waktu pembaruan jawaban',
            },
          },
          required: ['id_user', 'id_pertanyaan', 'jawaban', 'createdAt', 'updatedAt'],
        },
        LogPertumbuhan : {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID log pertumbuhan',
            },
            id_balita: {
              type: 'integer',
              description: 'Relasi ke tabel balita',
            },
            id_posyandu: {
              type: 'integer',
              description: 'Relasi ke tabel posyandu',
            },
            tanggal: {
              type: 'string',
              format: 'date',
              description: 'Tanggal pencatatan pertumbuhan',
            },
            berat: {
              type: 'number',
              format: 'float',
              description: 'Berat balita pada tanggal tersebut',
            },
            tinggi: {
              type: 'number',
              format: 'float',
              description: 'Tinggi balita pada tanggal tersebut',
            },
            lingkar_kepala: {
              type: 'number',
              format: 'float',
              description: 'Lingkar kepala balita pada tanggal tersebut',
            },
            catatan: {
              type: 'string',
              description: 'Catatan pengecekan pertumbuhan'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Waktu pembuatan jawaban',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Waktu pembaruan jawaban',
            },
          },
        },
        JadwalVaksin: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'id jadwal vaksin'
            },
            id_balita: {
              type: 'integer',
              description:'Relasi ke tabel balita'
            },
            id_posyandu: {
              type: 'integer',
              description: 'relasi ke tabel posyandu'
            },
            tanggal: {
              type: 'string',
              format: 'date',
              description: 'jadwal tanggal vaksin'
            },
            nama_balita: {
              type: 'string',
              example: 'Raka Aditya'
            },
            status: {
              type: 'string',
              enum: ['pending', 'selesai', 'terlewat'],
              example: 'pending'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-01T10:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-01T10:00:00Z'
            }
          }
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './routes/*.js', // Path ke file routes untuk dokumentasi otomatis
  ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};