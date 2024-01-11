const { Sequelize, Model, DataTypes } = require("sequelize");


const sequelize = new Sequelize("pruebaBRM", "root", "12345", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});



class User extends Model {}
User.init({
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: true,
    },
    user_role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize,
    modelName: "User",
});


module.exports = User;

// async function testConnection() {
//     try {
//         await sequelize.authenticate();
//         console.log("Conexion establecida.");
//     } catch (error) {
//         console.error("Error, algo paso!!", error);
//     }
// }

// testConnection();