module.exports = (sequelize, DataTypes) => {
    const Posyandu = sequelize.define('Posyandu', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        desa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alamat: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'posyandu',
        timestamps: true
    });

    Posyandu.associate = (models) => {
        Posyandu.belongsTo(models.User, {
            foreignKey: 'id_user',
            as: 'user'
        });
    };

    return Posyandu;
}