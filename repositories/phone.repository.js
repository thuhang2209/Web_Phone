// repositories/phone.repository.js
const { getDB } = require('../config/db');

class PhoneRepository {
  async findAll() {
    const db = getDB();
    const result = await db.collection('phonelist').find({ is_deleted: false });
    return await result.toArray();
  }

  async findById(id) {
    const db = getDB();
    return await db.collection('phonelist').findOne({ id: parseInt(id), is_deleted: false });
  }

  async findByNameAndPrice(name, price) {
    const db = getDB();
    return await db.collection('phonelist').findOne({ 
      name: name.trim(), 
      price: parseInt(price), 
      is_deleted: false 
    });
  }

  async create(phoneData) {
    const db = getDB();
    const result = await db.collection('phonelist').insertOne({
      name: phoneData.name,
      brand: phoneData.brand,
      price: phoneData.price,
      quantity: phoneData.quantity || 1,
      image: phoneData.image || null,
      imei_list: phoneData.imeiList || [],
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false
    });
    return result;
  }

  async updateById(id, updateData) {
    const db = getDB();
    const result = await db.collection('phonelist').updateOne(
      { id: parseInt(id) },
      { $set: { ...updateData, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async deleteById(id) {
    const db = getDB();
    const result = await db.collection('phonelist').updateOne(
      { id: parseInt(id) },
      { $set: { is_deleted: true, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async countAll() {
    const db = getDB();
    return await db.collection('phonelist').countDocuments({ is_deleted: false });
  }
}

module.exports = new PhoneRepository();