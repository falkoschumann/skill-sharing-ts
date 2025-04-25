// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { TalksService } from "./application/talks_service";
import {
  repositoryConfigurationFactory,
  TalksRepository,
} from "./infrastructure/talks_repository";
import { TalksController } from "./ui/talks_controller";

@Module({
  imports: [ConfigModule.forRoot({ load: [repositoryConfigurationFactory] })],
  controllers: [TalksController],
  providers: [TalksService, TalksRepository, TalksService],
})
export class AppModule {}
