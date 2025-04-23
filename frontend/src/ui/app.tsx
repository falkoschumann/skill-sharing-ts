// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/css/bootstrap.css";

import { Talk } from "../domain/talks.ts";
import Talks from "./talks.tsx";

export default function App() {
  const talks: Talk[] = [
    {
      title: "Foobar",
      presenter: "Alice",
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      comments: [
        { author: "Bob", message: "Great talk." },
        { author: "Alice", message: "Thanks!" },
      ],
    },
  ];

  return (
    <div className="container py-4 px-3 mx-auto">
      <h1>Skill Sharing</h1>
      <Talks talks={talks} />
    </div>
  );
}
