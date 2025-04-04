import { Module } from '@nestjs/common';
import { TranscribeController } from './transcribe.controller';
import { TranscribeService } from './transcribe.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [TranscribeController],
  providers: [TranscribeService]
})
export class TranscribeModule {}
