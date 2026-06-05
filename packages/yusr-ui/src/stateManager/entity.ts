import { Signal, signal } from "@preact/signals-react";
import type { Dto } from "./dto";

export abstract class Entity<TDto extends Dto>
{
  id: Signal<number>;

  constructor(dto: Partial<TDto>)
  {
    this.id = signal((dto as Dto).id ?? 0);

    (Object.keys(dto) as (keyof TDto)[]).forEach((key) =>
    {
      (this as any)[key] = signal(dto[key]);
    });
  }

  toJson(): TDto
  {
    return (Object.keys(this) as (keyof TDto)[]).reduce((acc, key) =>
    {
      const field = this[key as keyof this];
      acc[key] = (field instanceof Signal ? field.value : field) as TDto[keyof TDto];
      return acc;
    }, {} as TDto);
  }
}
