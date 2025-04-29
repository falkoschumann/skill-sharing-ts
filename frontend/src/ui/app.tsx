// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/css/bootstrap.css";

import { AppDispatch } from "../application/store.ts";
import { queryTalks, selectTalks } from "../application/talks_slice.ts";
import Talks from "./talks";

export default function App() {
  const dispatch: AppDispatch = useDispatch();
  const talks = useSelector(selectTalks);

  useEffect(() => void dispatch(queryTalks({})), [dispatch]);

  return (
    <div className="container py-4 px-3 mx-auto">
      <h1>Skill Sharing</h1>
      <Talks talks={talks} />
    </div>
  );
}
