const { create, check_parking_adress, check_parking_id, all_parkings, delete_parking_by_id, update_parking_by_id, get_parking_by_id } = require('./parking.query')
const auth = require("../../middleware/auth");

module.exports = function(app) {
    app.get("/api/parkings", auth, (req, res) => {
      all_parkings(res);
    });

    app.post("/api/parking", (req, res) => {
      var title = req.body.title;
      var description = req.body.description;
      var adress = req.body.adress;
      var nbr_place = req.body.nbr_place;
      var price = req.body.price;

      if (
        title === undefined ||
        description === undefined ||
        adress === undefined ||
        nbr_place === undefined ||
        price === undefined
      ) {
        res
          .status(500)
          .json({ success: false, error: "All fields are required" });
        return;
      }
      check_parking_adress(res, adress, function (number) {
        if (number === 1) {
          res
            .status(409)
            .json({ success: false, error: "Parking already exists at this address" });
          return;
        } else {
          create(res, title, description, adress, nbr_place, price);
          return;
        }
      });
    });

    app.get("/api/parking/:id", auth, (req, res) => {
      var id = req.params.id;

      get_parking_by_id(res, id);
    });

    app.delete("/api/parking/:id", auth, (req, res) => {
      var id = req.params.id;
      check_parking_id(res, id, function (number) {
        if (number === 1) {
          res.status(404).json({ success: false, error: "Parking not found !" });
          return;
        } else {
          delete_parking_by_id(res, id);
          return;
        }
      });
    });

    app.put("/api/parking/:id", auth, (req, res) => {
      var id = req.params.id;
      var title = req.body.title;
      var description = req.body.description;
      var adress = req.body.adress;
      var nbr_place = req.body.nbr_place;
      var price = req.body.price;

      if (
        title === undefined ||
        description === undefined ||
        adress === undefined ||
        nbr_place === undefined ||
        price === undefined
      ) {
        res
          .status(500)
          .json({ success: false, error: "All fields are required !" });
        return;
      }
      check_parking_id(res, id, function (number) {
        if (number === 1) {
          res.status(404).json({ success: false, error: "Parking not found !" });
          return;
        } else {
          update_parking_by_id(res, id, title, description, adress, nbr_place, price)
          return;
        }
      });
    });
}