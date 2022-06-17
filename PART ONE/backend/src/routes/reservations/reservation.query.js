var db = require("../../config/db");

exports.create_reservation = function (res, u_id, parking_id, date) {
  db.execute(
    "INSERT INTO `Reservations` (u_id, parking_id, date) VALUES (?, ?, ?)",
    [u_id, parking_id, date],
    function (err, results, fields) {
      res
        .status(201)
        .json({ success: true, msg: "Reservation created successfully" });
    }
  );
};

exports.check_parking_place = function (res, parking_id, date, callback) {
  db.execute(
    "SELECT * FROM `Reservations` WHERE parking_id = ? AND date = ?",
    [parking_id, date],
    function (err, results, fields) {
      if (results.length > 0) {
        db.execute(
          "SELECT * FROM `Parkings` WHERE id = ?",
          [parking_id],
          function (err, rows, fields) {
            if (results.length < rows[0].nbr_place) {
                callback(0)
            } else {
              callback(1);
            }
          }
        );
      } else {
        callback(0);
      }
    }
  );
};

exports.check_reservation_id = function (res, id, callback) {
  db.execute(
    "SELECT * FROM `Reservations` WHERE id = ?",
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

exports.all_reservations = function (res) {
  db.query("SELECT * FROM `Reservations`", function (err, results, fields) {
    res.status(200).json({ success: true, data: results });
  });
};

exports.delete_reservation_by_id = function (res, id) {
  db.execute(
    "DELETE FROM `Reservations` WHERE id = ?",
    [id],
    function (err, results, fields) {
      res
        .status(200)
        .json({ success: true, msg: `succesfully deleted reservation number: ${id}` });
    }
  );
};

exports.update_reservation_by_id = function (res, id, u_id, parking_id, date) {
  db.execute(
    "UPDATE `Parkings` SET u_id = ?, parking_id = ?, date = ? WHERE id = ?",
    [u_id, parking_id, date],
    function (err, results, fields) {
      db.execute(
        "SELECT * FROM `Reservations` WHERE id = ?",
        [id],
        function (err, results, fields) {
          res.status(200).json({ success: true, data: results });
        }
      );
    }
  );
};

exports.get_reservation_by_id = function (res, id) {
  db.execute(
    "SELECT * FROM `Reservations` WHERE id = ?",
    [id],
    function (err, results, fields) {
      if (results.length > 0) {
        res.status(200).json({ sucess: true, data: results });
      } else {
        res.status(404).json({ sucess: false, msg: "Reservation not found !" });
      }
    }
  );
};