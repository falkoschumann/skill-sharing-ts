// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import path from "node:path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ServeStaticModule } from "@nestjs/serve-static";

import { TalksService } from "./application/talks_service";
import {
  repositoryConfigurationFactory,
  TalksRepository,
} from "./infrastructure/talks_repository";
import { serverConfigurationFactory } from "./ui/server_configuration";
import { TalksController } from "./ui/talks_controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [repositoryConfigurationFactory, serverConfigurationFactory],
    }),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.env.STATIC_DIR || "static"),
    }),
  ],
  controllers: [TalksController],
  providers: [TalksService, TalksRepository, TalksService],
})
export class AppModule {}
