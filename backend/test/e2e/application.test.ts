// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app_module';
import { createTestTalk, createTestTalkWithComment } from '../data/testdata';

describe('Application', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Talks', () => {
    it('Returns all talks', () => {
      return request(app.getHttpServer())
        .get('/api/talks/query-talks')
        .expect(200)
        .expect(
          JSON.stringify({
            talks: [
              createTestTalk({ title: 'Foo' }),
              createTestTalkWithComment({ title: 'Bar' }),
            ],
          }),
        );
    });

    it('Returns a single talk when client asks for a specific talk', () => {
      return request(app.getHttpServer())
        .get('/api/talks/query-talks?title=Foo')
        .expect(200)
        .expect(
          JSON.stringify({
            talks: [createTestTalk({ title: 'Foo' })],
          }),
        );
    });

    it('Returns no talk when client asks for a specific talk that does not exist', () => {
      return request(app.getHttpServer())
        .get(
          '/api/talks/query-talks?title=' +
            encodeURIComponent('Non existing talk'),
        )
        .expect(200)
        .expect(JSON.stringify({ talks: [] }));
    });
  });
});
