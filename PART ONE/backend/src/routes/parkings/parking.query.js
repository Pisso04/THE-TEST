var db = require("../../config/db");

exports.create = function (res, title, description, adress, nbr_place, price) {
  db.execute(
    "INSERT INTO `Parkings` (title, description, adress, nbr_place, price) VALUES (?, ?, ?, ?, ?)",
    [title, description, adress, nbr_place, price],
    function (err, results, fields) {
      res.status(201).json({ success: true, msg: "Parking created successfully" });
    }
  );
};

exports.check_parking_adress = function (res, adress, callback) {
  db.execute(
    "SELECT * FROM `Parkings` WHERE adress = ?",
    [adress],
    function (err, results, fields) {
      if (results.length > 0) {
        callback(1);
      } else {
        callback(0);
      }
    }
  );
};

exports.check_parking_id = function (res, id, callback) {
  db.execute(
    "SELECT * FROM `Parkings` WHERE id = ?",
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

exports.all_parkings = function (res) {
  db.query("SELECT * FROM `Parkings`", function (err, results, fields) {
    res.status(200).json({ success: true, data: results });
  });
};

exports.delete_parking_by_id = function (res, id) {
  db.execute(
    "DELETE FROM `Parkings` WHERE id = ?",
    [id],
    function (err, results, fields) {
      res
        .status(200)
        .json({ success: true, msg: `succesfully deleted parking number: ${id}` });
    }
  );
};

exports.update_parking_by_id = function (res, id, title, description, adress, nbr_place, price) {
  db.execute(
    "UPDATE `Parkings` SET title = ?, description = ?, adress = ?, nbr_place = ?, price = ? WHERE id = ?",
    [title, description, adress, nbr_place, price, id],
    function (err, results, fields) {
      db.execute(
        "SELECT * FROM `Parkings` WHERE id = ?",
        [id],
        function (err, results, fields) {
          res.status(200).json({ success: true, data: results });
        }
      );
    }
  );
};

exports.get_parking_by_id = function (res, id) {
  db.execute(
    "SELECT * FROM `Parkings` WHERE id = ?",
    [id],
    function (err, results, fields) {
      if (results.length > 0) {
        res.status(200).json({ sucess: true, data: results });
      } else {
        res.status(404).json({ sucess: false, msg: "Parking not found !" });
      }
    }
  );
};