// controllers/phoneController.js
const { phoneService } = require('../services');

async function getAllPhones(req, res) {
  try {
    const phones = await phoneService.getAllPhones();
    res.status(200).json(phones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPhoneById(req, res) {
  try {
    const { id } = req.params;
    const phone = await phoneService.getPhoneById(id);
    res.status(200).json(phone);
  } catch (error) {
    if (error.message === 'Phone not found' || error.message === 'Invalid phone ID') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

async function createPhone(req, res) {
  try {
    const phoneData = req.body;
    const newPhone = await phoneService.createPhone(phoneData);
    res.status(201).json(newPhone);
  } catch (error) {
    if (error.message.includes('Missing required fields')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create phone' });
    }
  }
}

async function updatePhone(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedPhone = await phoneService.updatePhone(id, updateData);
    res.status(200).json(updatedPhone);
  } catch (error) {
    if (error.message === 'Phone not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update phone' });
    }
  }
}

async function deletePhone(req, res) {
  try {
    const { id } = req.params;
    const result = await phoneService.deletePhone(id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Phone not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete phone' });
    }
  }
}

module.exports = {
  getAllPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone
};