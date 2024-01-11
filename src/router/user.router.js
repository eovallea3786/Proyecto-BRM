const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../model/user.model");
const jwt = require("jsonwebtoken");
const validateToken = require("./validate-token");

//const { faker } = require("@faker-js/faker");

router.get("/users", validateToken, async(req, res) => {
    //trae todos los usuarios
    try {
        const users = await Users.findAll();
        res.status(200).json({
            ok: true,
            status: 200,
            message: "Consulta exitosa",
            body: users,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            status: 400,
            message: "Upps Error al consultar los usuarios",
            error,
        });
    }
});

router.get("/users/:user_id", async(req, res) => {
    //filtro por id
    const param_user_id = req.params.user_id;
    try {
        const user = await Users.findOne({
            where: {
                user_id: param_user_id,
            },
        });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Usuario" + param_user_id + "encontrado correctamente",
            body: user,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            status: 400,
            message: "Upps Error al consultar el usuario",
            error,
        });
    }
});

// Pruebas con Faker para llenado de datos en la BD
// router.post("/users", async(req, res) => {
//     await Users.sync();
//     const createUsers = await Users.create({
//         user_name: faker.name.firstName(),
//         role: faker.name.jobTitle(),
//         password: faker.internet.password(),
//     });
//     res.status(201).json({
//         ok: true,
//         status: 201,
//         message: "User created successfully",
//     });
// });

router.post("/users", async(req, res) => {
    const dataUsers = req.body;

    try {
        // Generar un hash de la contraseña
        const hashedPassword = await bcrypt.hash(dataUsers.user_password, 10);

        await Users.sync();
        const createUsers = await Users.create({
            user_name: dataUsers.user_name,
            user_email: dataUsers.user_email,
            user_role: dataUsers.user_role,
            user_password: hashedPassword,
            user_status: dataUsers.user_status,
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Usuario " + dataUsers.user_name + " creado correctamente",
            body: createUsers,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            status: 400,
            message: "Upps Error al crear el usuario",
            error,
        });
    }
});

//metodo put para actualizar datos en la BD
router.put("/users/:user_id", async(req, res) => {
    const id = req.params.user_id;
    const dataUsers = req.body;
    const param_user_password = dataUsers.user_password;
    const hashedPassword = await bcrypt.hash(param_user_password, 10);

    try {
        const updateUser = await Users.update({
            user_name: dataUsers.user_name,
            user_role: dataUsers.user_role,
            user_email: dataUsers.user_email,
            user_password: hashedPassword,
            user_status: dataUsers.user_status,
        }, {
            where: {
                user_id: id,
            },
        });
        res.status(200).json({
            ok: true,
            status: 200,
            body: updateUser,
            data: dataUsers,
            message: "Usuario " + dataUsers.user_name + " actualizado correctamente",
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            status: 400,
            message: "Upps Error al actualizar el usuario",
            error,
        });
    }
});

router.delete("/users/:user_id", async(req, res) => {
    const id = req.params.user_id;
    try {
        const deleteUser = await Users.destroy({
            where: {
                user_id: id,
            },
        });
        res.status(200).json({
            ok: true,
            status: 204,
            message: "Cantidad de usuarios eliminados: " + deleteUser,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            status: 400,
            message: "Upps Error al eliminar el usuario",
            error,
        });
    }
});

router.post("/users/login", async(req, res) => {
    const dataUsers = req.body;
    const param_user_email = dataUsers.user_email;
    const param_user_password = dataUsers.user_password;

    const user = await Users.findOne({
        where: {
            user_email: param_user_email,
        },
    });

    if (!user) {
        return res.status(400).json({
            message: "Usuario con correo" + user_email + "no encontrado",
        });
    }

    const passwordMatch = await bcrypt.compare(
        param_user_password,
        user.user_password
    );
    if (!passwordMatch) {
        console.log("contraseña incorrecta");
        return res.status(400).json({
            message: "Contraseña incorrecta",
        });
    }
    const token = jwt.sign({
            user_name: dataUsers.user_name,
        },
        process.env.SECRET_KEY || "pepito123"
    );
    res.json({
        token,
    });
});

//try {
//validar que el usuario exista
// const probador = await Users.findOne({
//     where: {
//         user_email: param_user_email,
//     },
// });

// if (!probador) {
//     return res.status(400).json({
//         message: "Usuario con correo" + user_email + "no encontrado",
//     })
// } else {
//     const passwordMatch = await bcrypt.compare(param_user_password, user_passwordss);
//     console.log(passwordMatch);
//     //             if (!passwordMatch) {
//                 console.log("contraseña incorrecta");
//                 return res.status(400).json({
//                     message: "Contraseña incorrecta",
//                 });

//             } else {
//                 const loginUser = await Users.findOne({
//                     where: {
//                         user_email: user_email,
//                         user_password: user_password,
//                     },
//                 });
//                 res.status(200).json({
//                     ok: true,
//                     status: 200,
//                     message: "Usuario " + user_email + " con login exitoso",
//                     data: loginUser,
//                 });
//             }
//         }
//     }

//     //validar que el usuario este activo

//     //validar que la contraseña sea correcta

//     //generar token

//     // Verificar una contraseña
//     catch (error) {
//         res.status(400).json({
//             ok: false,
//             status: 400,
//             message: "Upps Error en el login del usuario",
//             error,
//         });
//     }
//

module.exports = router;