module.exports = {
    Registro_compras: {
        id_registro_compras: Number,
        fecha_de_compra: String,
        fk_cliente: Number,
        productos_comprados: String,
        cantidad_por_producto: Number,
        precio_total_de_compra: Number,
    },
};
module.exports = Registro_compras;