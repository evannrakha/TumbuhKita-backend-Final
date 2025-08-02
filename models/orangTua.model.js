module.exports = (sequelize, DataTypes) => {
    const OrangTua = sequelize.define('OrangTua', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        kontak: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        jumlahAnak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        tableName: 'orang_tua',
        timestamps: true
    });

    OrangTua.associate = (models) => {
        OrangTua.hasMany(models.Balita, {
            foreignKey: 'id_orang_tua',
            as: 'balita'
        });
        OrangTua.belongsTo(models.User, {
            foreignKey: 'id_user',
            as: 'user'
        });
    };
    return OrangTua;
}