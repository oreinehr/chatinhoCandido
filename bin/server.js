require("dotenv").config();
const app = require("../src/api");      
const salaController = require('../src/controllers/salaController');


app.use((req, res, next) => {
    next();
});

let port = process.env.API_PORT || 3005;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`DB HOST: ${process.env.DB_HOST}`);
});
