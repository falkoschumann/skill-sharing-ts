// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
