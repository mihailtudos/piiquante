const Sauce = require('../model/souce');

exports.getAllProducts = ((req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      if (!sauces) {
        res.status(500).json({
          message: 'No products found'
        });
      }
      res.status(200).json({
        sauces
      })
    })
    .catch((error) => {
      res.status(500).json({
        error
      })
    })
});

exports.getOneProduct = ((req, res, next) => {
  const productId = req.params.id;

  Sauce.findOne({ _id: productId})
    .then((sauce) => {
      res.status(200).json({
        sauce
      })
    })
    .catch((error) => {
      res.status(404).json({
        message: 'Product not found'
      })
    });
});