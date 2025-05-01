require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../index');
const supabase = require('../supabaseClient');

describe("Auth Routes", () => {
   const testEmail = `user${Date.now()}@test.com`;
   const testPassword = 'Test@123';
   const testName = 'Test User';

   it('should sign up a new user', async () => {
       const res = await request(app)
           .post('/auth/email-signup')
           .send({ email: testEmail, password: testPassword, full_name: testName });

       expect(res.statusCode).toBe(200);
       expect(res.body.user).toHaveProperty('email', testEmail);
   });

   it('should log in the user', async () => {
      const res = await request(app)
          .post('/auth/email-login')
          .send({ email: testEmail, password: testPassword });

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty('email', testEmail);
      expect(res.headers['set-cookie'][0]).toContain('sb-access-token');
   });

   it('should not log in with wrong password', async () => {
      const res = await request(app)
          .post('/auth/email-login')
          .send({ email: testEmail, password: 'wrong-password' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
   });
});