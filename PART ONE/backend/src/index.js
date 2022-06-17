const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require("dotenv").config();
const cors = require("cors");
const swaggerUI = require("swagger-ui-express"), swaggerDocument = require("../swagger.json")
const port = process.env.PORT;

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(cors())
app.get ("/", (req, res) => {
    res.send ("Hello world !");
});
app.use(express.json());
require("./routes/auth/auth")(app, bcrypt);
require("./routes/users/user")(app, bcrypt);
require("./routes/parkings/parking")(app);
require("./routes/reservations/reservation")(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});