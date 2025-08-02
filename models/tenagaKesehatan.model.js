module.exports = (sequelize, DataTypes) => {
    const TenagaKesehatan = sequelize.define('TenagaKesehatan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        NIP: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spesialisasi: {
            type: DataTypes.STRING,
            allowNull: false
        },
        STR: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pendidikan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kontak: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'tenaga_kesehatan',
        timestamps: true
    });

    TenagaKesehatan.associate = (models) => {
        TenagaKesehatan.belongsTo(models.User, {
            foreignKey: 'id_user',
            as: 'user'
        });
    };

    return TenagaKesehatan;
}