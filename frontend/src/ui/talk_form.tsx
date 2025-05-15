// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { FormEvent } from "react";

export default function TalkForm({ onTalkSubmitted }: { onTalkSubmitted: (talk: { title: string; summary: string }) => void }) {
  function formSubmitted(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validateForm(event.currentTarget)) {
      submitTalk(event.currentTarget);
    }
  }

  function validateForm(form: HTMLFormElement) {
    form.reportValidity();
    return form.checkValidity();
  }

  function submitTalk(form: HTMLFormElement) {
    const formData = new FormData(form);
    onTalkSubmitted({
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
    });
    form.reset();
  }

  return (
    <form id="talk-form" onSubmit={(e) => formSubmitted(e)}>
      <h3>Submit a Talk</h3>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title:
        </label>
        <input type="text" required id="title" name="title" className="form-control" />
      </div>
      <div className="mb-3">
        <label htmlFor="summary" className="form-label">
          Summary:
        </label>
        <textarea rows={6} cols={30} required id="summary" name="summary" className="form-control"></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
