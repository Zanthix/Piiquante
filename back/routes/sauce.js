const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');
const sauce = require('../models/sauce');

router.post('/', sauceController.createSauce);
router.put('/:id', sauceController.modifySauce);
router.delete('/:id', sauceController.deleteSauce);
router.get('/:id', sauceController.getOneSauce);
router.get('/', sauceController.getAllSauces);

module.exports = router;