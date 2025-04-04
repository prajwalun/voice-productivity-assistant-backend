import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { FirebaseModule } from './firebase/firebase.module';
import { TranscribeModule } from './transcribe/transcribe.module';


@Module({
  imports: [TasksModule, FirebaseModule, TranscribeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
