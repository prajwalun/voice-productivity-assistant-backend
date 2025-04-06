// src/user-preferences/user-preferences.module.ts
import { Module } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module'; // ✅ Add this

@Module({
  imports: [
    PrismaModule,
    FirebaseModule, // ✅ Import FirebaseModule here!
  ],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
