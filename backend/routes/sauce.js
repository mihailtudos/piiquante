const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controller/sauce');

router.get('/', auth, sauceCtrl.getAllProducts);
router.post('/', auth, multer, sauceCtrl.createProduct);
router.get('/:id', auth, sauceCtrl.getOneProduct);
router.put('/:id', auth, multer, sauceCtrl.updateProduct)
router.delete('/:id', auth, sauceCtrl.deleteProduct)
router.post('/:id/like', auth, sauceCtrl.likeProduct)
module.exports = router;