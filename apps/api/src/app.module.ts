import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NytimesService } from './services/nytimes.service';
import { GuardianService } from './services/guardian.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [AppController],
  providers: [AppService, NytimesService, GuardianService],
})
export class AppModule {}
