// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { User } from "../domain/users";

export default function UserField({ user, onUsernameChanged }: { user: User; onUsernameChanged: (username: string) => void }) {
  return (
    <div id="user-field" className="mb-4">
      <label htmlFor="username" className="form-label">
        Your name
      </label>
      <input type="text" id="username" name="username" autoComplete="username" className="form-control" value={user.username} onChange={(event) => onUsernameChanged(event.target.value)} />
    </div>
  );
}
