import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DATABASE_FILE || 'database.sqlite';
const dbPath = path.resolve(__dirname, '../../', dbFile);

// Ensure uploads directory exists
const uploadDir = path.resolve(__dirname, '../../', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Helper wrapper for async query executions
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Database Initialization
export const initDb = async () => {
  console.log('Initializing database schemas...');

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aadhaar TEXT UNIQUE,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'CITIZEN',
      fullName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS census_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER UNIQUE,
      step INTEGER DEFAULT 1,
      status TEXT DEFAULT 'DRAFT',
      officerComments TEXT,
      personal_fullName TEXT,
      personal_dob TEXT,
      personal_gender TEXT,
      personal_maritalStatus TEXT,
      personal_nationality TEXT DEFAULT 'Indian',
      identity_aadhaar TEXT,
      identity_verified INTEGER DEFAULT 0,
      contact_email TEXT,
      contact_phone TEXT,
      address_state TEXT,
      address_district TEXT,
      address_subDistrict TEXT,
      address_pinCode TEXT,
      address_houseDetails TEXT,
      education_literacy TEXT,
      education_highestLevel TEXT,
      education_languages TEXT,
      employment_occupation TEXT,
      employment_industry TEXT,
      housing_type TEXT,
      housing_lighting TEXT,
      housing_water TEXT,
      housing_ownership TEXT,
      health_disabilities TEXT,
      health_illnesses TEXT,
      health_insurance TEXT,
      submittedAt TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      censusResponseId INTEGER,
      fullName TEXT NOT NULL,
      dob TEXT,
      gender TEXT,
      relationship TEXT,
      aadhaar TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (censusResponseId) REFERENCES census_responses (id) ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS uploaded_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      censusResponseId INTEGER,
      documentType TEXT NOT NULL,
      fileName TEXT NOT NULL,
      filePath TEXT NOT NULL,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (censusResponseId) REFERENCES census_responses (id) ON DELETE CASCADE
    )
  `);

  // Seed default admin/officer if not exists
  const adminUsername = 'admin';
  const existingAdmin = await get('SELECT * FROM users WHERE username = ?', [adminUsername]);
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await run(
      'INSERT INTO users (username, password, role, fullName) VALUES (?, ?, ?, ?)',
      [adminUsername, hashedPassword, 'OFFICER', 'National Census Officer']
    );
    console.log('Seeded default admin officer account (username: admin, password: admin123).');
  }

  console.log('Database initialization complete.');
};

export default db;
