const Sauce = require('../model/souce');
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.getAllProducts = ((req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces)
    })
    .catch((error) => {
      res.status(400).json({
        error
      })
    })
});

exports.getOneProduct = ((req, res, next) => {
  const productId = req.params.id;
  Sauce.findById(productId)
    .then((sauce) => {
      res.status(200).json(sauce)
    })
    .catch((error) => {
      res.status(404).json({
        message: 'Product not found'
      })
    });
});

exports.createProduct = ((req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');

  const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + '/images/' + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => {
      res.status(201).json({
        message: 'Post saved successfully'
      })
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
})

exports.updateProduct = ((req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  let prevImgUrl = '';

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    Sauce.findById(req.params.id)
      .then((oldSauce) => {
        prevImgUrl = oldSauce.imageUrl;
      })
      .catch(e => {
        throw new Error("Something went wrong!")
      });

    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat,
    }
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      if (prevImgUrl) {
        const filename = prevImgUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {});
      }
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
});

exports.deleteProduct = ((req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decodedToken.userId;

  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (sauce.userId !== userId) {
        throw new Error('You are not allowed to delete this product!');
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({ _id: sauce.id})
          .then(() => {
            res.status(200).json({
              message: 'Deleted!'
            });
          })
          .catch(
            (error) => {
              res.status(400).json({
                error: error
              });
            }
          );
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Something went wrong please try again later'
      })
    })
});

exports.likeProduct = ((req, res, next) => {
  const userId = req.body.userId;
  Sauce.findById(req.params.id)
    .then((sauce) => {
      const alreadyLiked = sauce.userLiked.indexOf(userId);
      const alreadyDisliked = sauce.userDisliked.indexOf(userId);
      console.log(alreadyLiked, alreadyDisliked, res.body.like);

      sauce.likes = sauce.userLiked.length;
      sauce.dislikes = sauce.userDisliked.length;
      sauce.save()
        .then(() => {
          res.status(201).json({
            message: 'Updated successfully'
          });
        })
        .catch((error) => {
          console.log(error);
        })
    })
    .catch((error) => {
      res.status(400).json({
        message: 'Something went wrong'
      });
    });
})