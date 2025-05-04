// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Talk } from "../domain/talks";

export default function Talks({ talks }: { talks: Talk[] }) {
  return talks.map((talk) => <TalkItem key={talk.title} talk={talk} />);
}

function TalkItem({ talk }: { talk: Talk }) {
  return (
    <section className="mb-4">
      <h2>{talk.title}</h2>
      <div>
        by <strong>{talk.presenter}</strong>
      </div>
      <p>{talk.summary}</p>
      <Comments talk={talk} />
    </section>
  );
}

function Comments({ talk }: { talk: Talk }) {
  return (
    <ul className="list-group mb-3">
      {talk.comments.map((comment, index) => (
        <li key={index} className="list-group-item">
          <strong>{comment.author}</strong>: {comment.message}
        </li>
      ))}
    </ul>
  );
}
