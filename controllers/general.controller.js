const { User, TenagaKesehatan, Posyandu, Artikel, Balita } = require('../models');

exports.FindOrangTuaByID = async (req, res) => {
    try {
        const { id } = req.params;
        const orangTua = await User.findOne({
            where: { id, role: 'orangTua' },
            include: [{ model: Balita, as: 'balitas' }]
        });

        if (!orangTua) {
            return res.status(404).json({ message: 'Orang Tua tidak ditemukan' });
        }

        res.json(orangTua);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil data Orang Tua', error: err.message });
    }
}