import { Signal, signal } from "@preact/signals-react";
import type { Dto } from "./dto";
import { EntitySignal } from "./entitySignal";

export abstract class Entity<TDto extends Dto>
{
  id: Signal<number>;

  constructor(dto: Partial<TDto>)
  {
    this.id = signal((dto as Dto).id ?? 0);

    (Object.keys(dto) as (keyof TDto)[]).forEach((key) =>
    {
      (this as any)[key] = new EntitySignal(dto[key], (value) =>
      {
        this.onFieldChange(key, value);
      });
    });
  }

  protected onFieldChange(_: keyof TDto, __: any): void
  {}

  toJson(): TDto
  {
    return (Object.keys(this) as (keyof TDto)[]).reduce((acc, key) =>
    {
      const field = this[key as keyof this];
      const value = field instanceof Signal ? field.value : field;

      if (Array.isArray(value))
      {
        acc[key] = value.map((item) => item instanceof Entity ? item.toJson() : item) as TDto[keyof TDto];
      }
      else
      {
        acc[key] = value as TDto[keyof TDto];
      }

      return acc;
    }, {} as TDto);
  }
}
