// src/user-preferences/user-preferences.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔍 Get user preferences or return null
  async getPreferences(userId: string) {
    return this.prisma.userPreference.findUnique({
      where: { userId },
    });
  }

  // 🛠️ Get or create preferences (used in transcribe logic)
  async getOrCreatePreferences(userId: string) {
    let prefs = await this.getPreferences(userId);

    if (!prefs) {
      prefs = await this.prisma.userPreference.create({
        data: { userId, showTips: true },
      });
    }

    return prefs;
  }

  // ✏️ Update user preferences
  async updatePreferences(userId: string, showTips: boolean) {
    return this.prisma.userPreference.upsert({
      where: { userId },
      update: { showTips },
      create: { userId, showTips },
    });
  }
}
