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

  it("Submit and comment a talk", async () => {
    await sut.goToSubmission();
    await sut.setViewport({ width: 768, height: 1024 });
    await sut.saveScreenshot("01-app-started");

    await sut.submitTalk({ title: "Foobar", summary: "Lorem ipsum" });
    await sut.saveScreenshot("02-talk-submitted");
    await sut.verifyTalkAdded({
      title: "Foobar",
      presenter: "Anon",
      summary: "Lorem ipsum",
    });

    await sut.changeUser({ name: "Bob" });
    await sut.commentOnTalk({ comment: "Amazing!" });
    await sut.saveScreenshot("03-talk-commented");
    await sut.verifyCommentAdded({ author: "Bob", comment: "Amazing!" });

    await sut.changeUser({ name: "Anon" });
    await sut.commentOnTalk({ comment: "Thanks." });
    await sut.saveScreenshot("04-comment-answered");
    await sut.verifyCommentAdded({ author: "Anon", comment: "Thanks." });
  }, 60_000);

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
    console.log("Start");

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

  async stop() {
    console.info("SUT - Stop");

    await this.#browser.close();
    this.#app.kill();
  }

  async goToSubmission() {
    console.info("SUT - Go to submission");

    this.#page = await this.#browser.newPage();
    await this.#page.goto(`http://localhost:8888`);
  }

  async setViewport(viewport: { width: number; height: number }) {
    console.info("SUT - Set viewport", viewport);

    await this.#page.setViewport(viewport);
  }

  async saveScreenshot(name: string) {
    console.info("SUT - Save screenshot", { name });

    await this.#page.screenshot({
      path: `${this.#screenshotsDir}/${name}.png`,
    });
  }

  async changeUser(user: { name: string }) {
    console.info("SUT - Change user", user);

    const usernameInput = await this.#page.waitForSelector(
      '#user-field input[name="username"]',
    );
    await usernameInput!.evaluate((node) => (node.value = ""));
    await usernameInput!.type(user.name);
  }

  async submitTalk(talk: { title: string; summary: string }) {
    console.info("SUT - Submit talk", talk);

    const titleInput = await this.#page.waitForSelector(
      '#talk-form input[name="title"]',
    );
    await titleInput!.type(talk.title);

    const summaryInput = await this.#page.waitForSelector(
      '#talk-form textarea[name="summary"]',
    );
    await summaryInput!.type(talk.summary);

    const submitButton = await this.#page.waitForSelector(
      '#talk-form button[type="submit"]',
    );
    await submitButton!.click();
  }

  async commentOnTalk(talk: { comment: string }) {
    console.info("SUT - Comment on talk", talk);

    const commentInput = await this.#page.waitForSelector(
      '#comments input[name="comment"]',
    );
    await commentInput!.type(talk.comment);

    const submitButton = await this.#page.waitForSelector(
      '#comments button[type="submit"]',
    );
    await submitButton!.click();
  }

  async verifyTalkAdded(talk: {
    title: string;
    presenter: string;
    summary: string;
  }) {
    console.info("SUT - Verify talk added", talk);

    const lastTalkTitle = await this.#page.waitForSelector(
      "#talks > section:last-child h2",
    );
    const actualTitle = await lastTalkTitle!.evaluate(
      (node) => node.textContent,
    );
    expect(actualTitle).toContain(talk.title);

    const lastTalkPresenter = await this.#page.waitForSelector(
      "#talks > section:last-child strong",
    );
    const actualPresenter = await lastTalkPresenter!.evaluate(
      (node) => node.textContent,
    );
    expect(actualPresenter).toContain(talk.presenter);

    const lastTalkSummary = await this.#page.waitForSelector(
      "#talks > section:last-child p",
    );
    const actualSummary = await lastTalkSummary!.evaluate(
      (node) => node.textContent,
    );
    expect(actualSummary).toContain(talk.summary);
  }

  async verifyCommentAdded(comment: { author: string; comment: string }) {
    console.info("SUT - Verify comment added", comment);

    const lastTalksCommentElement = await this.#page.waitForSelector(
      "#talks > section:last-child #comments li:last-child",
    );
    const lastTalksComment = await lastTalksCommentElement!.evaluate(
      (node) => node.textContent,
    );
    expect(lastTalksComment).toContain(comment.author);
    expect(lastTalksComment).toContain(comment.comment);
  }
}
