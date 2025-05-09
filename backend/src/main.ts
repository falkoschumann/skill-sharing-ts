// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app_module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.SERVER_PORT ?? 8080);
}

void bootstrap();
