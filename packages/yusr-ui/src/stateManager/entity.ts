import { Signal, signal } from "@preact/signals-react";
import type { Dto } from "./dto";

export type EntityMode = "create" | "update";

export abstract class Entity<TDto extends Dto>
{
  id: Signal<number>;
  mode: Signal<EntityMode>;

  protected constructor(dto: Partial<TDto>, mode: EntityMode = "create")
  {
    this.id = signal((dto as Dto).id ?? 0);
    this.mode = signal(mode);

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

  patch(data: Partial<TDto>)
  {
    (Object.keys(data) as (keyof TDto)[]).forEach((key) =>
    {
      const field = this[key as keyof this];
      if (field instanceof Signal && data[key] !== undefined)
      {
        field.value = data[key]!;
      }
    });
  }
}
