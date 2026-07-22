import { verifyToken } from '../authMiddleware.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('verifyToken middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header is provided', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the authorization header has no token', () => {
    const req = { headers: { authorization: 'Bearer' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() when the token is valid', () => {
    jwt.verify.mockReturnValue({ userId: 1, email: 'alfredo@test.com' });

    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(req.user).toEqual({ userId: 1, email: 'alfredo@test.com' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 when the token is invalid or expired', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    const req = { headers: { authorization: 'Bearer expired-token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
