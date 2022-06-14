const { register, check_account_mail, login } = require("./../users/user.query");

module.exports = function (app, bcrypt) {
  app.post("/api/register", (req, res) => {
    var email = req.body.email;
    var lastname = req.body.lastname;
    var firstname = req.body.firstname;
    var password = req.body.password;
    var errors = []

    if (
      email === undefined ||
      lastname === undefined ||
      firstname === undefined ||
      password === undefined
    ) {
      res.status(500).json({ success:false, error: "All fields are required" });
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
    if (errors.length != 0){
      res.status(500).json({ success: false, errors: errors });
      return;
    }
    check_account_mail(res, email, function (number) {
      if (number === 1) {
        res.status(409).json({ success: false, error: "email already in use !" });
        return;
      } else {
        register(res, email, pass, lastname, firstname);
        return;
      }
    });
  });

  app.post("/api/login", (req, res) => {
    var mail = req.body["email"];
    var password = req.body["password"];
    if (mail === undefined || password === undefined) {
      res.status(500).json({ success: false, error: "All fields are required !" });
      return;
    }
    login(res, mail, password, bcrypt, function (nbr) {
      if (nbr == 1) {
        res.status(401).json({ success: false, error: "Invalid Credentials !" });
      }
      return;
    });
  });
};

