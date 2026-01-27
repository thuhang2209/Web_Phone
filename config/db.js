// config/db.js
const { Pool } = require('pg');

let pool = null;

function initPostgres() {
  if (pool) return;
  
  // Thêm options để đặt schema mặc định
  const connectionString = process.env.POSTGRES_URL;

  pool = new Pool({ connectionString });

  pool.on('connect', () => {
    console.log('✅ [POSTGRES] Kết nối thành công');
  });

  pool.on('error', (err) => {
    console.error('❌ [POSTGRES] Lỗi kết nối:', err);
  });
}

function createCollection(tableName) {
  return {
    async find(query = {}) {
      let whereClause = '';
      const values = [];
      let index = 1;

      if (Object.keys(query).length > 0) {
        const conditions = [];
        for (const key in query) {
          if (['$regex', '$gte', '$lte', '$options'].includes(key)) continue;
          conditions.push(`"${key}" = $${index}`);
          values.push(query[key]);
          index++;
        }
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }

      // ✅ BỎ DẤU NGOẶC KÉP QUANH TÊN BẢNG
      const sql = `SELECT * FROM phones.${tableName} ${whereClause} ORDER BY id`;
      
      if (!pool) {
        throw new Error('Database connection not initialized');
      }
      
      const result = await pool.query(sql, values);

      let data = result.rows;

      return {
        toArray: () => Promise.resolve(data),
        sort(sortObj) {
          const sortKey = Object.keys(sortObj)[0];
          const sortOrder = sortObj[sortKey];
          data.sort((a, b) => {
            if (a[sortKey] > b[sortKey]) return sortOrder;
            if (a[sortKey] < b[sortKey]) return -sortOrder;
            return 0;
          });
          return this;
        },
        skip(n) {
          data = data.slice(n);
          return this;
        },
        limit(n) {
          data = data.slice(0, n);
          return this;
        }
      };
    },

    async findOne(query = {}) {
      let whereClause = '';
      const values = [];
      let index = 1;

      if (Object.keys(query).length > 0) {
        const conditions = [];
        for (const key in query) {
          if (['$regex', '$gte', '$lte', '$options'].includes(key)) continue;
          conditions.push(`"${key}" = $${index}`);
          values.push(query[key]);
          index++;
        }
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }

      const sql = `SELECT * FROM phones.${tableName} ${whereClause} LIMIT 1`;
      const result = await pool.query(sql, values);
      return result.rows[0] || null;
    },

    async insertOne(doc) {
      const keys = Object.keys(doc);
      const values = Object.values(doc);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const columns = keys.map(k => `"${k}"`).join(', ');

      const sql = `INSERT INTO phones.${tableName} (${columns}) VALUES (${placeholders}) RETURNING id`;
      const result = await pool.query(sql, values);
      return { insertedId: result.rows[0].id };
    },

    async updateOne(query, update) {
      const setFields = update.$set || {};
      const setKeys = Object.keys(setFields);
      if (setKeys.length === 0) return { modifiedCount: 0 };

      const whereConditions = [];
      const whereValues = [];
      let paramIndex = 1;

      for (const key in query) {
        if (['$regex', '$gte', '$lte', '$options'].includes(key)) continue;
        whereConditions.push(`"${key}" = $${paramIndex}`);
        whereValues.push(query[key]);
        paramIndex++;
      }

      const setClauses = setKeys.map((key, i) => `"${key}" = $${paramIndex + i}`);
      const setValues = setKeys.map(key => setFields[key]);

      const sql = `
        UPDATE phones.${tableName}
        SET ${setClauses.join(', ')}
        ${whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : ''}
      `;
      const result = await pool.query(sql, [...whereValues, ...setValues]);
      return { modifiedCount: result.rowCount };
    },

    async deleteOne(query) {
      const whereConditions = [];
      const values = [];
      let index = 1;

      for (const key in query) {
        if (['$regex', '$gte', '$lte', '$options'].includes(key)) continue;
        whereConditions.push(`"${key}" = $${index}`);
        values.push(query[key]);
        index++;
      }

      const sql = `
        DELETE FROM phones.${tableName}
        ${whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : ''}
      `;
      const result = await pool.query(sql, values);
      return { deletedCount: result.rowCount };
    },

    async countDocuments(query = {}) {
      let whereClause = '';
      const values = [];

      if (Object.keys(query).length > 0) {
        const conditions = [];
        let index = 1;
        for (const key in query) {
          if (['$regex', '$gte', '$lte', '$options'].includes(key)) continue;
          conditions.push(`"${key}" = $${index}`);
          values.push(query[key]);
          index++;
        }
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }

      const sql = `SELECT COUNT(*) FROM phones.${tableName} ${whereClause}`;
      const result = await pool.query(sql, values);
      return parseInt(result.rows[0].count, 10);
    }
  };
}

async function connectDB() {
  initPostgres();
  return { collection: (name) => createCollection(name) };
}

function getDB() {
  initPostgres();
  return { collection: (name) => createCollection(name) };
}

function initDemoMode() {
  console.warn('⚠️ [DEMO MODE] Không hỗ trợ trong phiên bản PostgreSQL. Đang dùng DB thật.');
  initPostgres();
}

async function closeDB() {
  if (pool) {
    await pool.end();
    console.log('[DB] Đã đóng kết nối PostgreSQL');
  }
}

module.exports = { connectDB, getDB, initDemoMode, closeDB };