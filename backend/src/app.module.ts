// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Repository,
  repositoryConfigurationFactory,
} from './infrastructure/repository';

@Module({
  imports: [ConfigModule.forRoot({ load: [repositoryConfigurationFactory] })],
  controllers: [AppController],
  providers: [AppService, Repository],
})
export class AppModule {}
