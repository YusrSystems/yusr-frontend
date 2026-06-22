import { signal, type Signal } from "@preact/signals-react";
import { Cubit } from "../stateManager/cubit.ts";
import type { FilterFieldMetadataDto } from "../filter/filterFieldMetadataDto.ts";
import { YusrApiHelper } from "../networking";


export class FilterFieldsInitial
{
}

export class FilterFieldsLoading extends FilterFieldsInitial
{
}

export class FilterFieldsLoaded extends FilterFieldsInitial
{
}

export class FilterFieldsError extends FilterFieldsInitial
{
}

export type FilterFieldsState = FilterFieldsInitial | FilterFieldsLoading | FilterFieldsLoaded | FilterFieldsError;

export class FilterFieldsCubit extends Cubit<FilterFieldsState>
{
	public fields: Signal<FilterFieldMetadataDto[]> = signal([]);
	private _routeName: string;
	private _loadedRouteName?: string;

	constructor(routeName: string)
	{
		super(new FilterFieldsInitial());
		this._routeName = routeName;
	}

	async load(): Promise<void>
	{
		if (this._loadedRouteName === this._routeName)
		{
			return;
		}

		this.emit(new FilterFieldsLoading());
		try
		{
			const result = await YusrApiHelper.Get<FilterFieldMetadataDto[]>(`/api/${ this._routeName }/FilterFields`);
			this.fields.value = result.data ?? [];
			this._loadedRouteName = this._routeName;
			this.emit(new FilterFieldsLoaded());
		}
		catch
		{
			this.emit(new FilterFieldsError());
		}
	}
}