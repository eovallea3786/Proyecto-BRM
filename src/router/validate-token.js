const jwt = require("jsonwebtoken");
const validateToken = (req, res, next) => {
    const headerToken = req.headers["authorization"];
    console.log("validando token");
    console.log(headerToken);

    if (headerToken != undefined && headerToken.startsWith("Bearer")) {
        try {
            const bearerToken = headerToken.slice(7, headerToken.length);
            jwt.verify(bearerToken, process.env.SECRET_KEY || "pepito123", {
                expiresIn: "1800000",
            }); //expira en 30 minutos
            next();
        } catch (error) {
            res.status(401).json({
                message: "No autorizado",
            });
        }

    } else {
        res.status(401).json({
            message: "No autorizado",
        });
    }
};
module.exports = validateToken;