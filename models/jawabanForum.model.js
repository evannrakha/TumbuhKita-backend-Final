module.exports = (sequelize, DataTypes) => {
    const JawabanForum = sequelize.define('JawabanForum', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_pertanyaan: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        jawaban: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'jawaban_forum',
        timestamps: true // otomatis menambah createdAt dan updatedAt
    });

    JawabanForum.associate = (models) => {
        JawabanForum.belongsTo(models.User, {
            foreignKey: 'id_user',
            as: 'user'
        });
        JawabanForum.belongsTo(models.PertanyaanForum, {
            foreignKey: 'id_pertanyaan',
            as: 'pertanyaan_forum'
        });
        JawabanForum.belongsTo(models.TenagaKesehatan, {
            foreignKey: 'id_user',
            targetKey: 'id_user',
            as: 'tenaga_kesehatan'
        });
    };

    return JawabanForum;
}