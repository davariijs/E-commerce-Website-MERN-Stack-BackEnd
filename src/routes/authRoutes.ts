import express, { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

// JWT middleware to protect routes
export const authenticateJWT = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Authentication token is required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};

// Exchange Firebase token for custom JWT
router.post("/token", async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      res.status(400).json({ message: "Firebase token is required" });
      return;
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const userId = decodedToken.uid;

    // Create custom JWT with user info
    const token = jwt.sign(
      { 
        userId, 
        email: decodedToken.email,
        name: decodedToken.name || '',
        picture: decodedToken.picture || ''
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Authentication failed', error });
  }
});

// Example of a protected route using the JWT middleware
router.get("/verify", authenticateJWT, (req: Request, res: Response): void => {
  res.status(200).json({ 
    message: "Token verified successfully", 
    user: req.body.user 
  });
});

export default router;