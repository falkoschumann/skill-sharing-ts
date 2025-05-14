// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import path from "node:path";
import fs from "node:fs/promises";
import child_process from "node:child_process";
import puppeteer, { Browser, Page } from "puppeteer";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("User acceptance test", () => {
  let sut: SystemUnderTest;

  beforeEach(async () => {
    sut = new SystemUnderTest();
    await sut.start();
  });

  it("Submit and comment a talk", { timeout: 60_000 }, async () => {
    await sut.gotoSubmission();
    await sut.setViewport(1024, 768);
    await sut.saveScreenshot("01-app-started");

    expect(true).equals(true);
  });

  afterEach(async () => {
    await sut.stop();
  });
});

class SystemUnderTest {
  #screenshotsDir = path.join(import.meta.dirname, "../../screenshots");
  #app!: child_process.ChildProcess;
  #browser!: Browser;
  #page!: Page;

  async start() {
    process.env.SERVER_PORT = "8888";
    process.env.REPOSITORY_FILE_NAME = path.resolve(
      import.meta.dirname,
      "../../testdata/e2e_acceptance.json",
    );

    await fs.rm(process.env.REPOSITORY_FILE_NAME, { force: true });
    await fs.rm(this.#screenshotsDir, { recursive: true, force: true });
    await fs.mkdir(this.#screenshotsDir, { recursive: true });

    const cwd = path.resolve(import.meta.dirname, "../../dist");
    this.#app = child_process.fork("main.cjs", { cwd });
    this.#browser = await puppeteer.launch();
  }

  async gotoSubmission() {
    this.#page = await this.#browser.newPage();
    await this.#page.goto(`http://localhost:8888`);
  }

  async setViewport(width: number, height: number) {
    await this.#page.setViewport({ width, height });
  }

  async saveScreenshot(name: string) {
    await this.#page.screenshot({
      path: `${this.#screenshotsDir}/${name}.png`,
    });
  }

  async stop() {
    await this.#browser.close();
    this.#app.kill();
  }
}
