// src/user-preferences/user-preferences.controller.ts
import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { UserPreferencesService } from './user-preferences.service';
  import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
  
  @Controller('preferences')
  @UseGuards(FirebaseAuthGuard)
  export class UserPreferencesController {
    constructor(
      private readonly userPreferencesService: UserPreferencesService,
    ) {}
  
    @Get()
    async getPreferences(@Req() req) {
      const userId = req.user.uid;
      const prefs = await this.userPreferencesService.getPreferences(userId);
      return prefs || { showTips: true }; // default value
    }
  
    @Put()
    async updatePreferences(@Req() req, @Body() body: { showTips: boolean }) {
      const userId = req.user.uid;
      const updated = await this.userPreferencesService.updatePreferences(
        userId,
        body.showTips,
      );
      return updated;
    }
  }
  