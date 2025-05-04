// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

// TODO use User instead of username
export default function UserField({ username, onUsernameChanged }: { username: string; onUsernameChanged: (username: string) => void }) {
  return (
    <div className="mb-4">
      <label htmlFor="username" className="form-label">
        Your name
      </label>
      <input type="text" id="username" name="username" autoComplete="username" className="form-control" value={username} onChange={(event) => onUsernameChanged(event.target.value)} />
    </div>
  );
}
