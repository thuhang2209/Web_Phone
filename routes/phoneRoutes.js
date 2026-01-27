// routes/phoneRoutes.js
const express = require('express');
const phoneController = require('../controllers/phoneController'); // ← import trực tiếp

const router = express.Router();

// GET /api/phones
router.get('/', phoneController.getAllPhones);

// GET /api/phones/:id
router.get('/:id', phoneController.getPhoneById);

// POST /api/phones
router.post('/', phoneController.createPhone);

// PUT /api/phones/:id
router.put('/:id', phoneController.updatePhone);

// DELETE /api/phones/:id
router.delete('/:id', phoneController.deletePhone);

module.exports = router;