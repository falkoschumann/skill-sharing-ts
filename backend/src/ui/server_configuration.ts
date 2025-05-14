// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { registerAs } from "@nestjs/config";

export interface ServerConfiguration {
  address: string;
  port: number;
}

export const serverConfigurationFactory = registerAs("server", () => ({
  address: process.env.SERVER_ADDRESS || "127.0.0.1",
  port: process.env.SERVER_PORT || 8080,
}));
