import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { FirebaseModule } from './firebase/firebase.module';
import { TranscribeModule } from './transcribe/transcribe.module';
import { OpenaiService } from './openai/openai.service';
import { OpenaiModule } from './openai/openai.module';


@Module({
  imports: [TasksModule, FirebaseModule, TranscribeModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}
