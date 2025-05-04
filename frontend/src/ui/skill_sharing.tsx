// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/css/bootstrap.css";

import { changeUser, selectTalks, selectUser, start, submitTalk } from "../application/talks_slice";
import { useAppDispatch, useAppSelector } from "./hooks";
import Talks from "./talks";
import UserField from "./user_field";
import TalkForm from "./talk_form";

export default function SkillSharing() {
  const dispatch = useAppDispatch();
  const talks = useAppSelector(selectTalks);
  const user = useAppSelector(selectUser);

  useEffect(() => void dispatch(start()), [dispatch]);

  return (
    <div className="container py-4 px-3 mx-auto">
      <h1>Skill Sharing</h1>
      <UserField user={user} onUsernameChanged={(username) => void dispatch(changeUser({ username }))} />
      <Talks talks={talks} />
      <TalkForm onTalkSubmitted={(talk) => void dispatch(submitTalk(talk))} />
    </div>
  );
}
