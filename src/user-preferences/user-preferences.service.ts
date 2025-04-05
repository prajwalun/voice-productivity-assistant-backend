// src/user-preferences/user-preferences.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserPreferencesService {
  private preferences: Record<string, { showTips: boolean }> = {};

  getPreference(userId: string) {
    return this.preferences[userId] || { showTips: true }; // default: showTips = true
  }

  setPreference(userId: string, showTips: boolean) {
    this.preferences[userId] = { showTips };
  }
}
