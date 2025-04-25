// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { Controller, Get, Query } from '@nestjs/common';

import { TalksService } from '../application/talks_service';
import { TalksQueryResult } from '../domain/messages';

@Controller('api/talks')
export class TalksController {
  constructor(private readonly service: TalksService) {}

  @Get('query-talks')
  async queryTalks(@Query('title') title: string): Promise<TalksQueryResult> {
    return this.service.queryTalks({ title });
  }
}
