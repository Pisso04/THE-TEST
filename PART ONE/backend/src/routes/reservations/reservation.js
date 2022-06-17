const { create_reservation, check_parking_place, all_reservations, check_reservation_id, delete_reservation_by_id, update_reservation_by_id, get_reservation_by_id } = require('./reservation.query')
const { check_account_id } = require('../users/user.query')
const { check_parking_id } = require('../parkings/parking.query')
const auth = require("../../middleware/auth");

module.exports = function(app) {
    app.get("/api/reservations", auth, (req, res) => {
      all_reservations(res);
    });

    app.post("/api/reservation", auth, (req, res) => {
        var u_id = req.body.u_id;
        var parking_id = req.body.parking_id;
        var date = req.body.date;
        var new_date = new Date(date)

        if (
          u_id === undefined ||
          parking_id === undefined ||
          date === undefined
        ) {
          res
            .status(500)
            .json({ success: false, error: "All fields are required" });
          return;
        }

        check_account_id(res, u_id, function (number) {
          if (number === 1) {
            res.status(404).json({ success: false, error: "User not found !" });
            return;
          } else {
            check_parking_id(res, parking_id, function (number) {
              if (number === 1) {
                res
                  .status(404)
                  .json({ success: false, error: "Parking not found !" });
                return;
              } else {
                check_parking_place(res, parking_id, new_date, function (number) {
                  if (number === 1) {
                    res
                      .status(404)
                      .json({ success: false, error: "No parking space available for this date !" });
                    return;
                  } else {
                    create_reservation(res, u_id, parking_id, new_date);
                    return;
                  }
                });
              }
            });
          }
        });
    })

    app.get("/api/reservation/:id", auth, (req, res) => {
      var id = req.params.id;

      get_reservation_by_id(res, id);
    });

    app.delete("/api/reservation/:id", auth, (req, res) => {
      var id = req.params.id;
      check_reservation_id(res, id, function (number) {
        if (number === 1) {
          res
            .status(404)
            .json({ success: false, error: "Reservation not found !" });
          return;
        } else {
          delete_reservation_by_id(res, id);
          return;
        }
      });
    });

    app.put("/api/parking/:id", auth, (req, res) => {
        var id = req.params.id;
        var u_id = req.body.u_id;
        var parking_id = req.body.parking_id;
        var date = req.body.date;
        var new_date = new Date(date);

        if (
          u_id === undefined ||
          parking_id === undefined ||
          date === undefined
        ) {
          res
            .status(500)
            .json({ success: false, error: "All fields are required" });
          return;
        }

        check_reservation_id(res, id, function (number) {
          if (number === 1) {
            res
              .status(404)
              .json({ success: false, error: "Reservation not found !" });
            return;
          } else {
            check_account_id(res, u_id, function (number) {
              if (number === 1) {
                res
                  .status(404)
                  .json({ success: false, error: "User not found !" });
                return;
              } else {
                check_parking_id(res, parking_id, function (number) {
                  if (number === 1) {
                    res
                      .status(404)
                      .json({ success: false, error: "Parking not found !" });
                    return;
                  } else {
                  update_reservation_by_id(res, id, u_id, parking_id, new_date);
                  }
                });
              }
            });
          }
        });

    })
}