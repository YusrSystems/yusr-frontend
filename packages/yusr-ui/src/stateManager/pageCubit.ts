import { type Signal, signal } from "@preact/signals-react";
import type { BaseFilterableApiService } from "../networking";
import { Cubit } from "./cubit";
import type { Dto } from "./dto";
import { PageEmpty, PageInitial, PageLoaded, PageLoading, type PageState } from "./pageStates";
import type { FilterGroupDto } from "../filter/filterGroup.ts";


export class PageCubit<TDto extends Dto> extends Cubit<PageState>
{
	public pageSize: Signal<number>;
	public currentPage: Signal<number>;
	public searchText: Signal<string | undefined>;
	entities: Signal<TDto[]>;
	count: Signal<number>;
	protected _service: BaseFilterableApiService<TDto>;
	protected types: Signal<number[] | undefined>;
	protected queryParams: Signal<Record<string, string | number | boolean> | undefined>;
	protected groups: Signal<FilterGroupDto[] | undefined>;

	constructor(service: BaseFilterableApiService<TDto>, pageSize: number = 100)
	{
		super(new PageInitial());
		this._service = service;
		this.pageSize = signal(pageSize);
		this.currentPage = signal(1);
		this.searchText = signal(undefined);
		this.types = signal([]);
		this.queryParams = signal({});
		this.groups = signal(undefined);
		this.entities = signal<TDto[]>([]);
		this.count = signal(0);
	}

	async filter(
		pageNumber?: number,
		rowsPerPage?: number,
		searchText?: string,
		types?: number[],
		queryParams?: Record<string, string | number | boolean>,
		groups?: FilterGroupDto[]
	): Promise<void>
	{
		this.currentPage.value = pageNumber ?? this.currentPage.value;
		this.pageSize.value = rowsPerPage ?? this.pageSize.value;
		this.searchText.value = searchText;
		this.types.value = types;
		this.queryParams.value = queryParams ?? this.queryParams.value;
		this.groups.value = groups ?? this.groups.value;

		this.emit(new PageLoading());

		const result = await this._service.Filter(
			this.currentPage.value,
			this.pageSize.value,
			this.searchText.value,
			this.types.value,
			this.queryParams.value,
			this.groups.value
		);

		if (!result.data?.length)
		{
			this.entities.value = [];
			this.count.value = 0;
			this.emit(new PageEmpty());
			return;
		}

		this.entities.value = result.data;
		this.count.value = result.count ?? 0;
		this.emit(new PageLoaded());
	}

	init(types?: number[], queryParams?: Record<string, string | number | boolean>, rowsPerPage: number = 100): void
	{
		this.filter(1, rowsPerPage, undefined, types, queryParams);
	}

	applyFilterGroups(groups: FilterGroupDto[]): void
	{
		this.filter(1, undefined, this.searchText.value, this.types.value, this.queryParams.value, groups);
	}

	clearFilterGroups(): void
	{
		this.filter(1, undefined, this.searchText.value, this.types.value, this.queryParams.value, []);
	}

	changePage(pageNumber: number)
	{
		this.filter(pageNumber, undefined, undefined, this.types.value, undefined, this.groups.value);
	}

	search(searchText: string | undefined)
	{
		this.filter(1, undefined, searchText, this.types.value, undefined, this.groups.value);
	}

	add(dto: TDto)
	{
		this.entities.value = [dto, ...this.entities.value];
	}

	update(dto: TDto)
	{
		this.entities.value = this.entities.value.map((e) => e.id === dto.id ? dto : e);
	}

	delete(dto: TDto)
	{
		this.entities.value = this.entities.value.filter((e) => e.id !== dto.id);
		if (this.entities.value.length === 0)
		{
			this.filter(1);
		}
	}
}