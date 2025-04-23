// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Repository } from './infrastructure/repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Repository],
})
export class AppModule {}
