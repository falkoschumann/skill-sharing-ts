// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

export function validate<T extends object, V extends object>(
  cls: ClassConstructor<T>,
  value: V[],
): T[];
export function validate<T extends object, V extends object>(
  cls: ClassConstructor<T>,
  value: V,
): T;
export function validate<T extends object, V extends object>(
  cls: ClassConstructor<T>,
  value: V | V[],
): T | T[] {
  const instance = plainToInstance(cls, value);
  const errors = Array.isArray(instance)
    ? instance.map(validateArrayElement).filter(notUndefined)
    : validateSync(instance);
  if (errors.length > 0) {
    throw new ConstraintViolationError(instance, value, errors);
  }
  return instance;
}

function validateArrayElement<T extends object>(
  value: T,
  index: number,
  array: T[],
) {
  const result = validateSync(value);
  if (result.length == 0) {
    return undefined;
  }

  const error = new ValidationError();
  error.target = array;
  error.value = value;
  error.property = String(index);
  error.children = result;
  return error;
}

function notUndefined<T>(value?: T): value is T {
  return value != null;
}

export class ConstraintViolationError extends Error {
  constructor(
    target: object,
    value: unknown,
    public errors: ValidationError[],
  ) {
    super(createErrorMessage(target, value, errors));
    this.name = 'ConstraintViolationError';
  }
}

function createErrorMessage<T>(
  target: object,
  value: T,
  children: ValidationError[],
) {
  const error = new ValidationError();
  error.target = target;
  error.value = value;
  error.property = '';
  error.children = children;
  return error.toString(false, false, '', true);
}
