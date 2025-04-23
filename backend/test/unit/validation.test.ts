// Copyright (c) 2025 Falko Schumann. All rights reserved. MIT license.

import { IsInt, IsString } from 'class-validator';

import { ConstraintViolationError, validate } from '../../src/util/validation';

describe('Validation', () => {
  describe('Validate', () => {
    it('Returns instance of class when value is valid', () => {
      const person = { name: 'Alice', age: 30 };

      const result = validate(Person, person);

      expect(result).toEqual(person);
    });

    it('Throws error when instance is not valid', () => {
      const person = { name: 5, age: '30' };

      expect(() => validate(Person, person)).toThrow(ConstraintViolationError);
    });

    it('Throws error when an array of instance is not valid', () => {
      const persons = [
        { name: 'Alice', age: 30 },
        { name: 5, age: 30 },
      ];

      expect(() => validate(Person, persons)).toThrow(ConstraintViolationError);
    });
  });
});

class Person {
  @IsString() name: string;
  @IsInt() age: number;
}
