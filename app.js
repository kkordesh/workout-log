require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

app.use(Express.json());

const controllers = require("./controllers");

app.use("/log", controllers.logController);
app.use("/user", controllers.userController)

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(5000, () => {
        console.log(`[Server]: App is listening on 5000.`);
    });
})
.catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
})

app.listen(3000, () => {
    console.log(`[Server]: App is listening on 5000.`);
});