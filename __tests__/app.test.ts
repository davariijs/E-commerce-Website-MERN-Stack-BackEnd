import request from 'supertest';
import app from '../src/index';

describe('App', () => {
  it('should return "App is Working" on the root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe("App is Working");
  });
});