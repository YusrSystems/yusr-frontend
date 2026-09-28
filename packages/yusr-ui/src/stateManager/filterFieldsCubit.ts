import { signal, type Signal } from "@preact/signals-react";
import { Cubit } from "./cubit.ts";
import type { FilterFieldMetadataDto } from "#/filter";
import { apiClient } from "#/api";


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
	private readonly _routeName: string;
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
		const result = await apiClient.get<FilterFieldMetadataDto[]>(`/api/${ this._routeName }/FilterFields`);

		if (result.ok && result.data)
		{
			this.fields.value = result.data;
			this._loadedRouteName = this._routeName;
			this.emit(new FilterFieldsLoaded());
			return;
		}

		this.emit(new FilterFieldsError());
	}
}