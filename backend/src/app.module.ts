// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  repositoryConfigurationFactory,
  TalksRepository,
} from './infrastructure/talks_repository';
import { TalksService } from './application/talks_service';

@Module({
  imports: [ConfigModule.forRoot({ load: [repositoryConfigurationFactory] })],
  controllers: [AppController],
  providers: [AppService, TalksRepository, TalksService],
})
export class AppModule {}
