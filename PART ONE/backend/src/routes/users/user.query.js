var db = require("../../config/db");
const jwt = require("jsonwebtoken");

exports.register = function (res, email, password, lastname, firstname) {
  db.execute(
    "INSERT INTO `Users` (email, password, lastname, firstname) VALUES (?, ?, ?, ?)",
    [email, password, lastname, firstname],
    function (err, results, fields) {
      const token = jwt.sign(
        { email: email },
        process.env.SECRET
      );
      res.status(201).json({ success: true, token: token });
    }
  );
};

exports.create_user = function (res, email, password, lastname, firstname) {
  db.execute(
    "INSERT INTO `Users` (email, password, lastname, firstname) VALUES (?, ?, ?, ?)",
    [email, password, lastname, firstname],
    function (err, results, fields) {
      res.status(201).json({ success: true, msg: "User created successfully" });
    }
  );
};

exports.check_account_mail = function (res, mail, callback) {
  db.execute(
    "SELECT * FROM `Users` WHERE email = ?",
    [mail],
    function (err, results, fields) {
      if (results.length > 0) {
        callback(1);
      } else {
        callback(0);
      }
    }
  );
};

exports.check_account_id = function (res, id, callback) {
  db.execute(
    "SELECT * FROM `Users` WHERE id = ?",
    [id],
    function (err, results, fields) {
      if (results.length > 0) {
        callback(0);
      } else {
        callback(1);
      }
    }
  );
};

exports.all_user = function (res) {
  db.query("SELECT * FROM `Users`", function (err, results, fields) {
    res.status(200).json({success: true, data: results});
  });
};

exports.login = function(res, mail, pwd, bcrypt, callback) {
  db.execute(
    "SELECT password, id FROM `Users` WHERE email = ?",
    [mail],
    function (err, results, fields) {
      if (results.length > 0) {
        var pwd2 = results[0].password;
        var id2 = results[0].id;
        if (bcrypt.compareSync(pwd, pwd2)) {
          const token = jwt.sign({ email: mail }, process.env.SECRET);
          res.json({ success: true, token: token });
          callback(0);
        } else {
          callback(1);
        }
      } else {
        callback(1);
      }
    }
  );
}

exports.delete_user_by_id = function(res, id) {
    db.execute('DELETE FROM `Users` WHERE id = ?', [id], function(err, results, fields) {
        res.status(200).json({ success: true, msg:`succesfully deleted user number: ${id}`});
    });
}

exports.update_user_by_id = function(res, id, email, pwd, fname, lname) {
  db.execute('UPDATE `Users` SET email = ?, password = ?, lastname = ?, firstname = ? WHERE id = ?', [email, pwd, lname, fname, id], function(err, results, fields) {
      db.execute('SELECT * FROM `Users` WHERE id = ?', [id], function(err, results, fields) {
          res.status(200).json({success: true, data: results});
      });
  });
}

exports.get_user_by_id_or_mail = function (res, data) {
  db.execute(
    "SELECT * FROM `Users` WHERE email = ?",
    [data],
    function (err, results, fields) {
      if (results.length > 0) {
        res.status(200).json({ sucess: true, data: results });
      } else {
        db.execute(
          "SELECT * FROM `Users` WHERE id = ?",
          [data],
          function (err, results, fields) {
            if (results.length > 0) {
              res.status(200).json({ sucess: true, data: results });
            } else {
              res.status(404).json({ sucess: false, msg: "User not found !" });
            }
          }
        );
      }
    }
  );
};
