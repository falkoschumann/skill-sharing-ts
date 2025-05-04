// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../application/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
