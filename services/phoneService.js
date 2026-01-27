// services/phoneService.js
const phoneRepository = require('../repositories/phone.repository');

class PhoneService {
  async getAllPhones() {
    return await phoneRepository.findAll();
  }

  async getPhoneById(id) {
    if (!id || isNaN(id)) {
      throw new Error('Invalid phone ID');
    }
    const phone = await phoneRepository.findById(id);
    if (!phone) {
      throw new Error('Phone not found');
    }
    return phone;
  }

  async createPhone(phoneData) {
    // Validate dữ liệu (có thể mở rộng sau)
    if (!phoneData.name || !phoneData.brand || phoneData.price == null) {
      throw new Error('Missing required fields: name, brand, price');
    }

    // Kiểm tra nếu sản phẩm giống tên + giá đã tồn tại
    const existingPhone = await phoneRepository.findByNameAndPrice(
      phoneData.name.trim(),
      phoneData.price
    );

    if (existingPhone) {
      // Cập nhật số lượng thay vì thêm mới
      const newQuantity = (existingPhone.quantity || 0) + (phoneData.quantity || 1);
      return await this.updatePhone(existingPhone.id, {
        quantity: newQuantity,
        updated_at: new Date()
      });
    }

    return await phoneRepository.create(phoneData);
  }

  async updatePhone(id, updateData) {
    const exists = await phoneRepository.findById(id);
    if (!exists) {
      throw new Error('Phone not found');
    }
    const success = await phoneRepository.updateById(id, updateData);
    if (!success) {
      throw new Error('Failed to update phone');
    }
    return await phoneRepository.findById(id);
  }

  async deletePhone(id) {
    const exists = await phoneRepository.findById(id);
    if (!exists) {
      throw new Error('Phone not found');
    }
    const success = await phoneRepository.deleteById(id);
    if (!success) {
      throw new Error('Failed to delete phone');
    }
    return { message: 'Phone deleted successfully' };
  }

  async getPhoneCount() {
    return await phoneRepository.countAll();
  }
}

module.exports = new PhoneService();