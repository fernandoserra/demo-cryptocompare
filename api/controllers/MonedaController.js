/**
 * MonedaController
 *
 * @description :: Server-side logic for managing monedas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  find: function (req, res) {
    console.log("ver registros de la base de datos")
    Moneda.find().exec(function (error, resp) {
      if (!error) {
        var rowAgregar = []
        resp.forEach(element => {
          rowAgregar.push([element.time, element.high])
        });
        console.log(rowAgregar)
        return res.send(rowAgregar)
      } else {
        console.log(error)
        return res.json(error)
      }
    })
  }
};

