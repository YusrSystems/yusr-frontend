import { Signal, signal } from "@preact/signals-react";
import type { ValidationRule } from "../validation";
import type { Dto } from "./dto";
import { ValidatableEntity } from "./validatableEntity";
import { Entity } from "./entity.ts";


export class ChangeableEntityMode
{
	static readonly Create = new ChangeableEntityMode("create");
	static readonly Update = new ChangeableEntityMode("update");
	protected dummyText?: string = "this dummy text prevents you from comparing mode with strings.";

	constructor(modeName: string)
	{
		this.dummyText = modeName;
	}
}

export abstract class ChangeableEntity<TDto extends Dto> extends ValidatableEntity<TDto>
{
	public readonly mode: Signal<ChangeableEntityMode>;
	public readonly isDirty: Signal<boolean> = signal(false);
	readonly hasChanges: Signal<boolean> = signal(false);
	private originalDto: Partial<TDto>;
	private modifiedFields: Set<string> = new Set();

	protected constructor(
		dto: Partial<TDto> | undefined,
		validationRules: ValidationRule<Partial<TDto>>[],
		mode: ChangeableEntityMode
	)
	{
		super(dto, validationRules);
		this.mode = signal(mode);
		this.originalDto = dto ?? {} as TDto;
	}

	static create<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
		this: new(dto: Partial<TDto> | undefined, mode: ChangeableEntityMode) => TEntity,
		dto: Partial<TDto> | undefined = undefined
	): TEntity
	{
		let res = new this(dto, ChangeableEntityMode.Create);
		res.initChanged();
		res.resetDirty();
		return res;
	}

	static load<
		TEntity extends ChangeableEntity<TDto>,
		TDto extends Dto
	>(
		this: new(dto: Partial<TDto> | undefined, mode: ChangeableEntityMode) => TEntity,
		dto: Partial<TDto> | undefined = undefined
	): TEntity
	{
		return new this(dto, ChangeableEntityMode.Update);
	}

	resetDirty()
	{
		this.isDirty.value = false;
	}

	resetChanged()
	{
		this.hasChanges.value = false;
		this.modifiedFields.clear();
		this.originalDto = JSON.parse(JSON.stringify(this.toJson()));
	}

	protected normalizeForComparison(value: any): any
	{
		if (value === null || value === undefined)
		{
			return "";
		}

		if (typeof value === "string")
		{
			return value.trim();
		}
		if (value instanceof Entity)
		{
			return value.toJson();
		}
		if (Array.isArray(value))
		{
			return value.map((item) => this.normalizeForComparison(item));
		}
		if (value instanceof Signal)
		{
			// defensive: shouldn't normally happen, but unwrap if it does
			return this.normalizeForComparison(value.value);
		}

		return value;
	}

	protected onFieldChange(field: keyof TDto, newValue: any): void
	{
		super.onFieldChange(field, newValue);
		this.isDirty.value = true;

		const originalValue = this.originalDto[field];
		const normOriginal = this.normalizeForComparison(originalValue);
		const normNew = this.normalizeForComparison(newValue);
		const isDifferent = JSON.stringify(normOriginal) !== JSON.stringify(normNew);

		if (isDifferent)
		{
			this.modifiedFields.add(field as string);
		}
		else
		{
			this.modifiedFields.delete(field as string);
		}

		this.hasChanges.value = this.modifiedFields.size > 0;
	}

	private initChanged()
	{
		this.hasChanges.value = true;
		this.modifiedFields.clear();
		this.originalDto = {} as TDto;
	}
}
