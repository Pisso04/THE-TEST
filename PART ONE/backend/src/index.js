const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require("dotenv").config();
const port = process.env.PORT;

app.get ("/", (req, res) => {
    res.send ("Hello world !");
});

app.use(express.json());
require("./routes/auth/auth")(app, bcrypt);
app.use(express.json());
require("./routes/users/user")(app, bcrypt);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});