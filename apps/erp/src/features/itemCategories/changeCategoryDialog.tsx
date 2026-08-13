import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import {
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	SelectField,
	TextField
} from "yusr-ui";
import { Category, CategoryDto } from "@/core/data/category.ts";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";


export default function ChangeCategoryDialog({
	dto,
	service = Services.categoriesApi,
	onSuccess,
	initDto
}: CommonChangeDialogProps<CategoryDto> & {
	initDto?: Partial<CategoryDto>;
})
{
	useSignals();

	const entity = useMemo(
		() => signal<Category>(dto ? Category.load(dto) : Category.create(initDto)),
		[dto, initDto]
	);

	useEffect(() =>
	{
		Cubits.categories.init();
	}, []);

	const parentOptions = useMemo(() =>
	{
		return [
			{label: "بدون تصنيف أب", value: 0},
			...Cubits.categories.entities.value
				.filter(c => !c.parentCategoryId && c.id !== entity.value.id.peek())
				.map(c => ({
					label: c.name,
					value: c.id
				}))
		];
	}, [entity.value.id]);

	const isUpdateMode = entity.value.mode.value === ChangeableEntityMode.Update;
	const title = isUpdateMode ? "تعديل التصنيف" : "إضافة تصنيف جديد";

	return (
		<ChangeDialog className="sm:max-w-md">
			<ChangeDialog.Header title={ title }/>
			<FieldGroup>
				<FieldsSection columns={ 1 }>
					<TextField
						label="اسم التصنيف"
						required
						value={ entity.value.name }
						error={ entity.value.getError("name") }
					/>
					<SelectField<number>
						label="التصنيف الأب (اختياري)"
						value={ entity.value.parentCategoryId }
						options={ parentOptions }
					/>
				</FieldsSection>
			</FieldGroup>
			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton<Category, CategoryDto>
					entity={ entity }
					service={ service }
					transformData={ (data) =>
					{
						if (data.parentCategoryId === 0)
						{
							data.parentCategoryId = undefined;
						}
						return data;
					} }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}