import { type Signal, signal } from "@preact/signals-react";
import { Cubit } from "./cubit";
import type { Dto } from "./dto";
import { PageEmpty, PageError, PageInitial, PageLoaded, PageLoading, type PageState } from "./pageStates";
import type { ApiResponse } from "#/api/apiClient";


export type SimpleListFn<TDto> = (
	queryParams?: Record<string, string | number | boolean>
) => Promise<ApiResponse<TDto[]>>;

export interface ISimpleListProvider<TDto>
{
	list: SimpleListFn<TDto>;
}

export class ListCubit<TDto extends Dto & { name?: string }> extends Cubit<PageState>
{
	public allEntities: Signal<TDto[]>;
	public entities: Signal<TDto[]>;
	public count: Signal<number>;
	public searchText: Signal<string | undefined>;
	protected listProvider: ISimpleListProvider<TDto>;
	protected currentQueryParams: Signal<Record<string, string | number | boolean> | undefined>;

	constructor(resourceOrListFn: ISimpleListProvider<TDto> | SimpleListFn<TDto>)
	{
		super(new PageInitial());
		this.listProvider = typeof resourceOrListFn === "function"
			? {list: resourceOrListFn}
			: resourceOrListFn;
		this.allEntities = signal<TDto[]>([]);
		this.entities = signal<TDto[]>([]);
		this.count = signal<number>(0);
		this.searchText = signal<string | undefined>(undefined);
		this.currentQueryParams = signal<Record<string, string | number | boolean> | undefined>(undefined);
	}

	async init(
		_types?: number[],
		queryParams?: Record<string, string | number | boolean>
	): Promise<void>
	{
		this.currentQueryParams.value = queryParams;
		this.emit(new PageLoading());

		try
		{
			const res = await this.listProvider.list(queryParams);

			if (!res.ok)
			{
				this.emit(new PageError());
				return;
			}

			const items = res.data ?? [];
			this.allEntities.value = items;
			this.applyLocalSearch(this.searchText.value);

			if (this.entities.value.length === 0)
			{
				this.emit(new PageEmpty());
			}
			else
			{
				this.emit(new PageLoaded());
			}
		}
		catch
		{
			this.emit(new PageError());
		}
	}

	search(searchText: string | undefined): void
	{
		this.searchText.value = searchText;
		this.applyLocalSearch(searchText);

		if (this.entities.value.length === 0)
		{
			this.emit(new PageEmpty());
		}
		else
		{
			this.emit(new PageLoaded());
		}
	}

	add(dto: TDto): void
	{
		this.allEntities.value = [dto, ...this.allEntities.value];
		this.applyLocalSearch(this.searchText.value);
		this.emit(new PageLoaded());
	}

	update(dto: TDto): void
	{
		this.allEntities.value = this.allEntities.value.map((e) => (e.id === dto.id ? dto : e));
		this.applyLocalSearch(this.searchText.value);
		this.emit(new PageLoaded());
	}

	delete(dto: TDto): void
	{
		this.allEntities.value = this.allEntities.value.filter((e) => e.id !== dto.id);
		this.applyLocalSearch(this.searchText.value);

		if (this.entities.value.length === 0)
		{
			this.emit(new PageEmpty());
		}
		else
		{
			this.emit(new PageLoaded());
		}
	}

	private applyLocalSearch(text?: string): void
	{
		if (!text || !text.trim())
		{
			this.entities.value = this.allEntities.value;
			this.count.value = this.allEntities.value.length;
			return;
		}

		const query = text.trim().toLowerCase();
		const filtered = this.allEntities.value.filter((item) =>
		{
			if (typeof item.name === "string")
			{
				return item.name.toLowerCase().includes(query);
			}
			return JSON.stringify(item).toLowerCase().includes(query);
		});

		this.entities.value = filtered;
		this.count.value = filtered.length;
	}
}