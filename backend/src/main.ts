// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app_module";
import type { ServerConfiguration } from "./ui/server_configuration";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const serverConfiguration = configService.get(
    "server",
  ) as ServerConfiguration;
  await app.listen(serverConfiguration.port, serverConfiguration.address);
}

void bootstrap();
