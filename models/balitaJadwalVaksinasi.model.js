module.exports = (sequelize, DataTypes) => {
    const BalitaJadwalVaksinasi = sequelize.define('BalitaJadwalVaksinasi', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_balita: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_jadwal_vaksinasi: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'selesai', 'terlewat'),
            allowNull: false,
            defaultValue: 'pending'
        }
    }, {
        tableName: 'balita_jadwal_vaksinasi',
        timestamps: true
    });

    BalitaJadwalVaksinasi.associate = (models) => {
        BalitaJadwalVaksinasi.belongsTo(models.JadwalVaksin, {
            foreignKey: 'id_jadwal_vaksinasi',
            as: 'jadwal_vaksin'
        });
        BalitaJadwalVaksinasi.belongsTo(models.Balita, {
            foreignKey: 'id_balita',
            as: 'balita'
        });
    };

    return BalitaJadwalVaksinasi;
}