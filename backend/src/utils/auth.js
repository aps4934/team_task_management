import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export { hashPassword, comparePasswords, generateToken };
