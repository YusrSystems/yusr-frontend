import { Signal, signal } from "@preact/signals-react";
import type { Dto } from "./dto";
import { EntitySignal } from "./entitySignal";


export abstract class Entity<TDto extends Dto>
{
	id: Signal<number>;
	private readonly _dto;

	protected constructor(dto?: Partial<TDto>)
	{
		this.id = signal(dto?.id ?? 0);
		this._dto = dto;
	}

	assign(key: keyof TDto, value: any)
	{
		return new EntitySignal(value, (value) =>
		{
			this.onFieldChange(key, value);
		});
	}

	toJson(): TDto
	{
		return (Object.keys(this) as (keyof TDto)[]).reduce((acc, key) =>
		{
			const field = this[key as keyof this];
			const isKeyofDto = this._dto ? key in this._dto : false;
			if (typeof field === "function" || !isKeyofDto)
			{
				return acc;
			}
			const value = field instanceof Signal ? field.value : field;

			if (value instanceof Entity)
			{
				acc[key] = value.toJson() as TDto[keyof TDto];
			}
			else if (Array.isArray(value))
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

	protected onFieldChange(_: keyof TDto, __: any): void
	{
	}
}
