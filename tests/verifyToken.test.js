const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/jwtMiddleware');

describe('verifyToken', () => {
  it('should return a 401 status code if no token is provided', () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    verifyToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authorization token is required' });
  });

  it('should return a 401 status code if an invalid token is provided', () => {
    const req = { headers: { authorization: 'invalid-token' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    verifyToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should call next if a valid token is provided', () => {
    const token = jwt.sign({ userId: 123, email: 'test@example.com' }, process.env.JWT_SECRET);
    console.log(token)
    const req = { headers: { authorization: token } };
    const res = {};
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('test 4', () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImEiLCJpYXQiOjE2NzY0NzEyMTB9.TOGEEKiP0kTAnE02dgk6wrEPXaV194p1rb_FH4Yodcc"
    const req = { headers: { authorization: token } };
    const res = {};
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
