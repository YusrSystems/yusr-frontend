import { Signal, signal } from "@preact/signals-react";
import type { Dto } from "./dto";
import { EntitySignal } from "./entitySignal";


export abstract class Entity<TDto extends Dto>
{
	id: Signal<number>;
	private _dtoKeys: Set<keyof TDto> = new Set(["id"]);

	protected constructor(dto?: Partial<TDto>)
	{
		this.id = signal(dto?.id ?? 0);
	}

	assign(key: keyof TDto, value: any)
	{
		this._dtoKeys.add(key);
		return new EntitySignal(value, (value) =>
		{
			this.onFieldChange(key, value);
		});
	}

	toJson(): TDto
	{
		const dto = {} as TDto;

		this._dtoKeys.forEach((key) =>
		{
			const value = (this[key as unknown as keyof this] as Signal<any>).value;

			if (value instanceof Entity)
			{
				dto[key] = value.toJson();
			}
			else if (Array.isArray(value))
			{
				dto[key] = value.map((item) => item instanceof Entity ? item.toJson() : item) as TDto[keyof TDto];
			}
			else
			{
				dto[key] = value;
			}
		});

		return dto;
	}

	protected onFieldChange(_: keyof TDto, __: any): void
	{
	}
}
