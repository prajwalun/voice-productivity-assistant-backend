import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
  providers: [FirebaseService],   // Register service
  exports: [FirebaseService],     // 👈 Export it so other modules can use it
})
export class FirebaseModule {}
