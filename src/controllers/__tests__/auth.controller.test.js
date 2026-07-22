import { login } from '../auth.controller.js';
import pool from '../../config/db.js';
import bcrypt from 'bcrypt';

jest.mock('../../config/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-jwt-token'),
}));

describe('login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when credentials are correct', async () => {
    const mockUser = {
      id: 1,
      email: 'alfredo@test.com',
      password_hash: 'hashed_password',
    };
    pool.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(true); // simulate: password matches

    const req = { body: { email: 'alfredo@test.com', password: 'miClave123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'fake-jwt-token',
    });
  });

  it('should return 401 when the password is incorrect', async () => {
    const mockUser = {
      id: 1,
      email: 'alfredo@test.com',
      password_hash: 'hashed_password',
    };
    pool.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(false); // simulate: password does NOT match

    const req = {
      body: { email: 'alfredo@test.com', password: 'wrongPassword' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid email or password',
    });
  });

  it('should return 401 when the user does not exist', async () => {
    pool.query.mockResolvedValue({ rows: [] }); // simulate: no user found

    const req = { body: { email: 'noexiste@test.com', password: 'anything' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
