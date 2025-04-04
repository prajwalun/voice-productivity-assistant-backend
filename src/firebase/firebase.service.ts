import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(idToken);
  }
}
