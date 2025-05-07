// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Talk } from "../domain/talks";
import Comments from "./comments";

export default function Talks({ talks, onCommentAdded }: { talks: Talk[]; onCommentAdded: (comment: { title: string; message: string }) => void }) {
  return talks.map((talk) => <TalkItem key={talk.title} talk={talk} onCommentAdded={onCommentAdded} />);
}

function TalkItem({ talk, onCommentAdded }: { talk: Talk; onCommentAdded: (comment: { title: string; message: string }) => void }) {
  return (
    <section className="mb-4">
      <h2>{talk.title}</h2>
      <div>
        by <strong>{talk.presenter}</strong>
      </div>
      <p>{talk.summary}</p>
      <Comments talk={talk} onCommentAdded={onCommentAdded} />
    </section>
  );
}
