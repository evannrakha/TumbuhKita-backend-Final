module.exports = (sequelize, DataTypes) => {
    const Kategori = sequelize.define('Kategori', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'kategori',
        timestamps: false
    });

    Kategori.associate = (models) => {
        Kategori.hasMany(models.PertanyaanForum, {
            foreignKey: 'id_kategori',
            as: 'pertanyaan_forum'
        });
    };

    return Kategori;
}