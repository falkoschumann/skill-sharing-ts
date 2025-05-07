// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Comment, Talk } from "../domain/talks";
import type { FormEvent } from "react";

export default function Comments({ talk, onCommentAdded }: { talk: Talk; onCommentAdded: (comment: { title: string; message: string }) => void }) {
  function formSubmitted(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validateForm(event.currentTarget)) {
      addComment(event.currentTarget);
    }
  }

  function validateForm(form: HTMLFormElement) {
    form.reportValidity();
    return form.checkValidity();
  }

  function addComment(form: HTMLFormElement) {
    const formData = new FormData(form);
    onCommentAdded({
      title: formData.get("talkTitle") as string,
      message: formData.get("comment") as string,
    });
    form.reset();
  }

  return (
    <>
      <ul className="list-group mb-3">
        {talk.comments.map((comment, index) => (
          <Comment comment={comment} key={index} />
        ))}
      </ul>
      <form onSubmit={(e) => formSubmitted(e)} className="form">
        <div className="mb-3">
          <input type="text" hidden name="talkTitle" defaultValue={talk.title} />
          <input type="text" required name="comment" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">
          Add comment
        </button>
      </form>
    </>
  );
}

function Comment({ comment }: { comment: Comment }) {
  return (
    <li className="list-group-item">
      <strong>{comment.author}</strong>: {comment.message}
    </li>
  );
}
