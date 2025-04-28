// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { TalksQuery, TalksQueryResult } from "@skill-sharing/shared/domain";
import { createTestTalk } from "../../test/data/testdata";

type FetchType = typeof globalThis.fetch;

export class TalksApi {
  static create() {
    return new TalksApi(globalThis.fetch.bind(globalThis));
  }

  static createNull() {
    return new TalksApi(fetchStub as unknown as FetchType);
  }

  #fetch;

  constructor(fetch: FetchType) {
    this.#fetch = fetch;
  }

  async queryTalks(_query: TalksQuery): Promise<TalksQueryResult> {
    const response = await this.#fetch("/api/talks/query-talks");
    // TODO Validate query result
    return (await response.json()) as TalksQueryResult;
  }
}

async function fetchStub() {
  return Promise.resolve({
    json: () => ({ talks: [createTestTalk()] }),
  });
}
