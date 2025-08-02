module.exports = (sequelize, DataTypes) => {
    const LogPertumbuhan = sequelize.define('LogPertumbuhan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_balita: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_posyandu: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tanggal: {
            type: DataTypes.DATE,
            allowNull: false
        },
        berat: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tinggi: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        lingkar_kepala: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        catatan: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'log_pertumbuhan',
        timestamps: true
    });

    LogPertumbuhan.associate = (models) => {
        LogPertumbuhan.belongsTo(models.Balita, {
            foreignKey: 'id_balita',
            as: 'balita'
        });
        LogPertumbuhan.belongsTo(models.Posyandu, {
            foreignKey: 'id_posyandu',
            as: 'posyandu'
        });
    };

    return LogPertumbuhan;
}