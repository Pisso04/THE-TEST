const { all_user, update_user_by_id, delete_user_by_id, get_user_by_id_or_mail, check_account_id, check_account_mail, create_user } = require("./user.query");
const auth = require("../../middleware/auth");

module.exports = function(app, bcrypt) {
  app.get("/api/users", auth, (req, res) => {
    all_user(res);
  });

  app.post("/api/user", (req, res) => {
    var email = req.body.email;
    var lastname = req.body.lastname;
    var firstname = req.body.firstname;
    var password = req.body.password;
    var errors = [];

    if (
      email === undefined ||
      lastname === undefined ||
      firstname === undefined ||
      password === undefined
    ) {
      res
        .status(500)
        .json({ success: false, error: "All fields are required" });
      return;
    }
    const regexpEmail = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (!regexpEmail.test(email)) errors.push("Invalid email address");
    const regexpPass = new RegExp(
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/
    );
    if (password.length < 8)
      errors.push("Password must be at least 8 charcacters");
    else if (!regexpPass.test(password))
      errors.push(
        "Invalid password your password must contain at least 1 number, uppercase letter and special chars"
      );
    pass = bcrypt.hashSync(password, 10);
    if (errors.length != 0) {
      res.status(500).json({ success: false, errors: errors });
      return;
    }
    check_account_mail(res, email, function (number) {
      if (number === 1) {
        res
          .status(409)
          .json({ success: false, error: "email already in use !" });
        return;
      } else {
        create_user(res, email, pass, lastname, firstname);
        return;
      }
    });
  });

  app.get("/api/user/:data", auth, (req, res) => {
    var data = req.params.data;

    get_user_by_id_or_mail(res, data);
  });

  app.delete("/api/user/:id", auth, (req, res) => {
    var id = req.params.id;
    check_account_id(res, id, function (number) {
      if (number === 1) {
        res.status(404).json({ success: false, error: "User not found !" });
        return;
      } else {
        delete_user_by_id(res, id);
        return;
      }
    });
  });

  app.put("/api/user/:id", auth, (req, res) => {
    var id = req.params.id;
    var mail = req.body["email"];
    var lname = req.body["lastname"];
    var fname = req.body["firstname"];
    var pwd = req.body["password"];

    if (
      mail === undefined ||
      lname === undefined ||
      fname === undefined ||
      pwd === undefined
    ) {
      res
        .status(500)
        .json({ success: false, error: "All fields are required !" });
      return;
    }
    check_account_id(res, id, function (number) {
      if (number === 1) {
        res.status(404).json({ success: false, error: "User not found !" });
        return;
      } else {
        pwd = bcrypt.hashSync(pwd, 10);
        update_user_by_id(res, id, mail, pwd, lname, fname);
        return;
      }
    });
  });
}