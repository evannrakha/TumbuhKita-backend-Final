module.exports = (sequelize, DataTypes) => {
    const JadwalVaksin = sequelize.define('JadwalVaksin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nama_vaksin: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_posyandu: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tanggal: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'jadwal_vaksin',
        timestamps: true
    });

    JadwalVaksin.associate = (models) => {
        JadwalVaksin.belongsToMany(models.Balita, {
            through: models.BalitaJadwalVaksinasi,
            foreignKey: 'id_jadwal_vaksinasi',
            as: 'balita'
        });
        JadwalVaksin.belongsTo(models.Posyandu, {
            foreignKey: 'id_posyandu',
            as: 'posyandu'
        });
        JadwalVaksin.hasMany(models.BalitaJadwalVaksinasi, {
            foreignKey: 'id_jadwal_vaksinasi',
            as: 'balita_jadwal_vaksinasis' // <-- pakai "s"
        });
    };

    return JadwalVaksin;
}