module.exports = (sequelize, DataTypes) => {
    const Artikel = sequelize.define('Artikel', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        penulis: {
            type: DataTypes.STRING,
            allowNull: false
        },
        judul: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('draft', 'publish'),
            allowNull: false,
            defaultValue: 'draft'
        },
        dilihat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        image_path: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'artikel',
        timestamps: true // otomatis menambah createdAt dan updatedAt
    });
    
    return Artikel;
}