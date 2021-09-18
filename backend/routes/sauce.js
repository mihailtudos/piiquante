const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controller/sauce');

router.get('/', sauceCtrl.getAllProducts);
router.get('/:id', sauceCtrl.getOneProduct);

module.exports = router;