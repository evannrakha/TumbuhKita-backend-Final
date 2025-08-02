module.exports = (sequelize, DataTypes) => {
    const PertanyaanForum = sequelize.define('PertanyaanForum', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_jawaban_forum: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pertanyaan: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        id_kategori: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'pertanyaan_forum',
        timestamps: true // otomatis menambah createdAt dan updatedAt
    });

    PertanyaanForum.associate = (models) => {
        PertanyaanForum.belongsTo(models.User, {
            foreignKey: 'id_user',
            as: 'user'
        });
        PertanyaanForum.belongsTo(models.JawabanForum, {
            foreignKey: 'id_jawaban_forum',
            as: 'jawaban_forum'
        });
        PertanyaanForum.belongsTo(models.Kategori, {
            foreignKey: 'id_kategori',
            as: 'kategori'
        });
    };

    return PertanyaanForum;
}