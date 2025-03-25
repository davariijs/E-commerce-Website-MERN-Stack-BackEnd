import request from 'supertest';
import app from '../src/index';
import jwt from 'jsonwebtoken';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn()
  },
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    })
  })
}));

describe('Auth Routes', () => {
  it('should exchange Firebase token for JWT', async () => {
    const response = await request(app)
      .post('/api/auth/token')
      .send({ firebaseToken: 'test-firebase-token' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });



  it('should verify a valid JWT token', async () => {
    // Generate a valid token for testing
    const testUid = 'test-user-id';
    const testToken = jwt.sign(
      { userId: testUid, email: 'test@example.com' },
      process.env.JWT_SECRET || 'test-secret', 
      { expiresIn: '1h' }
    );
    
    const response = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', `Bearer ${testToken}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Token verified successfully');
    expect(response.body).toHaveProperty('user');
  });
  
  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .get('/api/auth/verify');
  
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Authentication token is required');
  });
});
