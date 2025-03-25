import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../src/index';

const generateToken = (uid: string) => {
  return jwt.sign({ userId: uid }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
};

describe('Cart Routes', () => {
  const testUid = 'test-user-id';
  const testToken = generateToken(testUid);
  let createdItemId: string; 
  
  beforeAll(async () => {
    const testMongoURI = process.env.TEST_MONGO_URI || process.env.MONGO_URI;
    await mongoose.connect(testMongoURI as string, {
      dbName: 'test-db'
    });
  });

  beforeEach(async () => {
    // Clear test data before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  // POST test - Add item to cart
  it('should add an item to cart', async () => {
    const testItem = {
      title: 'Test Product',
      image: 'test-image.jpg',
      price: 29.99,
      color: 'Red',
      quantity: 1,
      webID: 12345
    };

    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ uid: testUid, item: testItem });

    expect(response.status).toBe(200);
    expect(response.body.uid).toBe(testUid);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].title).toBe(testItem.title);
    
    // Save the item ID for later tests
    createdItemId = response.body.items[0]._id;
  });

  // GET test - Retrieve cart
  it('should retrieve the user cart', async () => {
    // First create a cart item
    const testItem = {
      title: 'Test Product',
      image: 'test-image.jpg',
      price: 29.99,
      color: 'Red',
      quantity: 1,
      webID: 12345
    };

    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ uid: testUid, item: testItem });
    
    // Now test the GET endpoint
    const response = await request(app)
      .get(`/api/cart/${testUid}`)
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uid', testUid);
    expect(response.body.items).toHaveLength(1);
    
    // Save the item ID for PUT tests
    createdItemId = response.body.items[0]._id;
  });

  // PUT test - Increase item quantity
  it('should increase item quantity', async () => {
    // First create a cart item
    const testItem = {
      title: 'Test Product',
      image: 'test-image.jpg',
      price: 29.99,
      color: 'Red',
      quantity: 1,
      webID: 12345
    };

    const createResponse = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ uid: testUid, item: testItem });
    
    const itemId = createResponse.body.items[0]._id;
    
    // Test the increase endpoint
    const response = await request(app)
      .put(`/api/cart/increase/${testUid}/${itemId}`)
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.items[0].quantity).toBe(2);
  });

  // PUT test - Decrease item quantity
  it('should decrease item quantity', async () => {
    // First create a cart item with quantity 2
    const testItem = {
      title: 'Test Product',
      image: 'test-image.jpg',
      price: 29.99,
      color: 'Red',
      quantity: 2, // Start with 2
      webID: 12345
    };

    const createResponse = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ uid: testUid, item: testItem });
    
    const itemId = createResponse.body.items[0]._id;
    
    // Test the decrease endpoint
    const response = await request(app)
      .put(`/api/cart/decrease/${testUid}/${itemId}`)
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.items[0].quantity).toBe(1);
  });


    // DELETE test - Delete item
    it('should remove an item from cart', async () => {
        // First create a cart item
        const testItem = {
          title: 'Test Product',
          image: 'test-image.jpg',
          price: 29.99,
          color: 'Red',
          quantity: 1,
          webID: 12345
        };
      
        const createResponse = await request(app)
          .post('/api/cart')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ uid: testUid, item: testItem });
        
        const itemId = createResponse.body.items[0]._id;
        
        const response = await request(app)
          .delete(`/api/cart/${testUid}/${itemId}`)
          .set('Authorization', `Bearer ${testToken}`);
        
        expect(response.status).toBe(200);
        
        expect(response.body).toHaveProperty('message'); 


        const getResponse = await request(app)
          .get(`/api/cart/${testUid}`)
          .set('Authorization', `Bearer ${testToken}`);
        
        if (getResponse.body && getResponse.body.items) {
          expect(getResponse.body.items.length).toBe(0);
        } else {

          expect(getResponse.body.items || []).toHaveLength(0);
        }
      });


      it('should delete entire cart', async () => {
        
        const testItem = {
          title: 'Test Product',
          image: 'test-image.jpg',
          price: 29.99,
          color: 'Red',
          quantity: 1,
          webID: 12345
        };
      
        const createResponse = await request(app)
          .post('/api/cart')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ uid: testUid, item: testItem });
        
        const cartId = createResponse.body._id;
        
        const response = await request(app)
          .delete(`/api/cart/${cartId}`)
          .set('Authorization', `Bearer ${testToken}`);
        
        expect(response.status).toBe(200);
        
        expect(response.body).toHaveProperty('message'); 


        const getResponse = await request(app)
          .get(`/api/cart/${testUid}`)
          .set('Authorization', `Bearer ${testToken}`);
        
        // The response should be null or empty
            if (getResponse.body === null) {
                expect(getResponse.body).toBeNull();
            } else {
                expect(getResponse.body.items || []).toHaveLength(0);
            }
      });

  // Error case - Unauthorized access
  it('should prevent unauthorized access to increase route', async () => {

    const otherToken = generateToken('other-user-id');
    
 
    const testItem = {
      title: 'Test Product',
      image: 'test-image.jpg',
      price: 29.99,
      color: 'Red',
      quantity: 1,
      webID: 12345
    };

    const createResponse = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ uid: testUid, item: testItem });
    
    const itemId = createResponse.body.items[0]._id;
    
    // Try to access with wrong user's token
    const response = await request(app)
      .put(`/api/cart/increase/${testUid}/${itemId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('error');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});