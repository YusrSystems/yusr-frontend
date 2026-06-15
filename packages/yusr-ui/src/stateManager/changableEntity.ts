import {Signal, signal} from "@preact/signals-react";
import type {ValidationRule} from "../validation";
import type {Dto} from "./dto";
import {ValidatableEntity} from "./validatableEntity";

export const ChangeableEntityMode = {
    Create: "create",
    Update: "update"
} as const;
export type ChangeableEntityMode = typeof ChangeableEntityMode[keyof typeof ChangeableEntityMode];

export abstract class ChangeableEntity<TDto extends Dto, TMode extends string = ChangeableEntityMode> extends ValidatableEntity<TDto> {
    public readonly mode: Signal<TMode>;
    public readonly isDirty: Signal<boolean> = signal(false);
    readonly hasChanges: Signal<boolean> = signal(false);
    private originalDto: Partial<TDto>;
    private modifiedFields: Set<string> = new Set();

    protected constructor(
        dto: Partial<TDto> | undefined,
        validationRules: ValidationRule<Partial<TDto>>[],
        mode: TMode
    ) {
        super(dto, validationRules);
        this.mode = signal(mode);
        this.originalDto = dto ?? {} as TDto;
    }

    static create<TEntity extends ChangeableEntity<TDto, TMode>, TDto extends Dto, TMode extends string = ChangeableEntityMode>(
        this: new(dto: Partial<TDto> | undefined, mode: TMode) => TEntity,
        dto: Partial<TDto> | undefined = undefined
    ): TEntity {
        const value = new this(dto, ChangeableEntityMode.Create as TMode);
        value.initChanged();
        value.resetDirty();
        return value;
    }

    static load<TEntity extends ChangeableEntity<TDto, TMode>, TDto extends Dto, TMode extends string = ChangeableEntityMode>(
        this: new(dto: Partial<TDto> | undefined, mode: TMode) => TEntity,
        dto: Partial<TDto> | undefined
    ): TEntity {
        return new this(dto, ChangeableEntityMode.Update as TMode);
    }

    resetDirty() {
        this.isDirty.value = false;
    }

    resetChanged() {
        this.hasChanges.value = false;
        this.modifiedFields.clear();
        this.originalDto = JSON.parse(JSON.stringify(this.toJson()));
    }

    protected normalizeForComparison(value: any): any {
        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === "string") {
            return value.trim();
        }

        return value;
    }

    protected onFieldChange(field: keyof TDto, newValue: any): void {
        super.onFieldChange(field, newValue);
        this.isDirty.value = true;

        const originalValue = this.originalDto[field];
        const normOriginal = this.normalizeForComparison(originalValue);
        const normNew = this.normalizeForComparison(newValue);
        const isDifferent = JSON.stringify(normOriginal) !== JSON.stringify(normNew);

        if (isDifferent) {
            this.modifiedFields.add(field as string);
        } else {
            this.modifiedFields.delete(field as string);
        }

        this.hasChanges.value = this.modifiedFields.size > 0;
    }

    private initChanged() {
        this.hasChanges.value = true;
        this.modifiedFields.clear();
        this.originalDto = {} as TDto;
    }
}
