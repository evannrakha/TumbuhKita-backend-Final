module.exports = (sequelize, DataTypes) => {
    const Balita = sequelize.define('Balita', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_orang_tua: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_posyandu: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tanggal_lahir: {
            type: DataTypes.DATE,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('laki-laki', 'perempuan'),
            allowNull: false
        },
        berat: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        lingkar_kepala: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tinggi: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tipe_darah: {
            type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
            allowNull: false
        },
        catatan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image_path: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'balita',
        timestamps: true
    });

    Balita.associate = (models) => {
        Balita.belongsTo(models.OrangTua, {
            foreignKey: 'id_orang_tua',
            as: 'orang_tua'
        });
        Balita.belongsTo(models.Posyandu, {
            foreignKey: 'id_posyandu',
            as: 'posyandu'
        });
        Balita.belongsToMany(models.JadwalVaksin, {
            through: models.BalitaJadwalVaksinasi,
            foreignKey: 'id_balita',
            as: 'jadwal_vaksinasi'
        });
        Balita.hasMany(models.LogPertumbuhan, {
            foreignKey: 'id_balita',
            as: 'log_pertumbuhan'
        });
    };

    return Balita;
}