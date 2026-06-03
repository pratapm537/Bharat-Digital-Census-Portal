import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { get, run } from '../config/db.js';

// Simple in-memory OTP store (in production, use Redis or DB with expiry)
const otpStore = new Map();

export const checkAadhaar = async (req, res, next) => {
  const { aadhaar } = req.body;

  if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
    return res.status(400).json({ message: 'Invalid Aadhaar number. Must be exactly 12 digits.' });
  }

  try {
    const existingUser = await get('SELECT * FROM users WHERE aadhaar = ?', [aadhaar]);
    
    if (existingUser) {
      return res.status(200).json({
        exists: true,
        message: 'Aadhaar registered. Please verify via OTP to log in.',
        fullName: existingUser.fullName
      });
    } else {
      return res.status(200).json({
        exists: false,
        message: 'Aadhaar not registered yet. Please proceed to signup.'
      });
    }
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res) => {
  const { phone, aadhaar } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Invalid mobile number. Must be exactly 10 digits.' });
  }

  // Generate a mock 6-digit OTP
  const mockOtp = '123456'; 
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  // Store OTP associated with the phone number
  otpStore.set(phone, { otp: mockOtp, expiresAt, aadhaar });

  console.log(`[OTP SIMULATOR] Sent OTP ${mockOtp} to phone ${phone} for Aadhaar ${aadhaar}`);

  return res.status(200).json({
    message: 'OTP sent successfully (Simulated). Use 123456 to verify.',
    phone
  });
};

export const verifyOtp = async (req, res, next) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required.' });
  }

  const storedData = otpStore.get(phone);

  if (!storedData) {
    return res.status(400).json({ message: 'No OTP requested for this phone number.' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ message: 'OTP has expired.' });
  }

  if (otp !== storedData.otp) {
    return res.status(400).json({ message: 'Invalid OTP code.' });
  }

  // OTP verified successfully, clear it
  otpStore.delete(phone);

  try {
    let user = await get('SELECT * FROM users WHERE aadhaar = ?', [storedData.aadhaar]);

    if (!user) {
      return res.status(400).json({ message: 'Citizen user not found. Please complete signup first.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, aadhaar: user.aadhaar, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET || 'supersecure_bharatcensus_secret_key_2026_goi',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        aadhaar: user.aadhaar,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const registerCitizen = async (req, res, next) => {
  const { aadhaar, phone, fullName, dob, gender } = req.body;

  if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
    return res.status(400).json({ message: 'Valid 12-digit Aadhaar number is required.' });
  }
  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({ message: 'Full name is required.' });
  }

  try {
    const existingUser = await get('SELECT * FROM users WHERE aadhaar = ?', [aadhaar]);
    if (existingUser) {
      return res.status(400).json({ message: 'This Aadhaar is already registered. Please log in.' });
    }

    // Create user
    const result = await run(
      'INSERT INTO users (aadhaar, role, fullName) VALUES (?, ?, ?)',
      [aadhaar, 'CITIZEN', fullName]
    );
    const userId = result.id;

    // Pre-create a blank census draft response for this user
    await run(
      `INSERT INTO census_responses (
        userId, step, status, personal_fullName, personal_dob, personal_gender, contact_phone, identity_aadhaar
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, 1, 'DRAFT', fullName, dob || '', gender || '', phone || '', aadhaar]
    );

    // Auto-login after registration
    const token = jwt.sign(
      { id: userId, aadhaar, role: 'CITIZEN', fullName },
      process.env.JWT_SECRET || 'supersecure_bharatcensus_secret_key_2026_goi',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: userId,
        aadhaar,
        fullName,
        role: 'CITIZEN'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginOfficer = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user || user.role !== 'OFFICER') {
      return res.status(401).json({ message: 'Invalid credentials or access denied.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET || 'supersecure_bharatcensus_secret_key_2026_goi',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Officer login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await get('SELECT id, aadhaar, username, role, fullName, createdAt FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
