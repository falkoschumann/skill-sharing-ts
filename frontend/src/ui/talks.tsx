// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Talk } from "../domain/talks";
import Comments from "./comments";

export default function Talks({
  talks,
  onCommentAdded,
  onTalkDeleted,
}: {
  talks: Talk[];
  onCommentAdded: (comment: { title: string; message: string }) => void;
  onTalkDeleted: (talk: { title: string }) => void;
}) {
  return talks.map((talk) => <TalkItem key={talk.title} talk={talk} onCommentAdded={onCommentAdded} onTalkDeleted={onTalkDeleted} />);
}

function TalkItem({ talk, onCommentAdded, onTalkDeleted }: { talk: Talk; onCommentAdded: (comment: { title: string; message: string }) => void; onTalkDeleted: (talk: { title: string }) => void }) {
  return (
    <section className="mb-4">
      <h2>
        {talk.title}{" "}
        <button className="btn btn-secondary btn-sm" onClick={() => onTalkDeleted({ title: talk.title })}>
          Delete
        </button>
      </h2>
      <div>
        by <strong>{talk.presenter}</strong>
      </div>
      <p>{talk.summary}</p>
      <Comments talk={talk} onCommentAdded={onCommentAdded} />
    </section>
  );
}
