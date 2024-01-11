"use strict";
const app = require("../src/app/app.ts");
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server is up on port ' + port + '.');
});

const nombre = "edward";
console.log(nombre);