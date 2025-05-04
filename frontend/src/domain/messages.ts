// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import type { Talk } from "./talks";

export interface TalksQuery {
  title?: string;
}

export interface TalksQueryResult {
  talks: Talk[];
}
