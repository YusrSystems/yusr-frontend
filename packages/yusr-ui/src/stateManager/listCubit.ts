import { signal, type Signal } from "@preact/signals-react";
import { Cubit } from "./cubit";
import type { Dto } from "./dto";
import { PageEmpty, PageInitial, PageLoaded, PageLoading, type PageState } from "./pageStates";
import type { IReadOnlyListResource } from "../api/createReadOnlyListResource";


export class ListCubit<TDto extends Dto> extends Cubit<PageState>
{
	public allEntities: Signal<TDto[]>;
	public entities: Signal<TDto[]>;
	public count: Signal<number>;
	public searchText: Signal<string | undefined>;
	protected resource: IReadOnlyListResource<TDto>;
	protected queryParams: Signal<Record<string, string | number | boolean> | undefined>;

	constructor(resource: IReadOnlyListResource<TDto>)
	{
		super(new PageInitial());
		this.resource = resource;
		this.allEntities = signal<TDto[]>([]);
		this.entities = signal<TDto[]>([]);
		this.count = signal<number>(0);
		this.searchText = signal<string | undefined>(undefined);
		this.queryParams = signal<Record<string, string | number | boolean> | undefined>(undefined);
	}

	async init(queryParams?: Record<string, string | number | boolean>): Promise<void>
	{
		this.queryParams.value = queryParams;
		this.emit(new PageLoading());

		const response = await this.resource.list(queryParams);

		if (!response.ok || !response.data || response.data.length === 0)
		{
			this.allEntities.value = [];
			this.entities.value = [];
			this.count.value = 0;
			this.emit(new PageEmpty());
			return;
		}

		this.allEntities.value = response.data;
		this.entities.value = response.data;
		this.count.value = response.data.length;
		this.emit(new PageLoaded());
	}

	search(text?: string, searchSelector?: (item: TDto) => string): void
	{
		const query = text?.trim().toLowerCase();
		this.searchText.value = text;

		if (!query)
		{
			this.entities.value = [...this.allEntities.value];
			this.count.value = this.allEntities.value.length;
			if (this.entities.value.length > 0)
			{
				this.emit(new PageLoaded());
			}
			return;
		}

		const filtered = this.allEntities.value.filter((item: any) =>
		{
			if (searchSelector)
			{
				return searchSelector(item).toLowerCase().includes(query);
			}

			const name = item.name ?? item.title ?? item.username ?? item.code ?? "";
			const id = item.id ? String(item.id) : "";
			return name.toLowerCase().includes(query) || id.includes(query);
		});

		this.entities.value = filtered;
		this.count.value = filtered.length;
		this.emit(filtered.length > 0 ? new PageLoaded() : new PageEmpty());
	}

	add(dto: TDto): void
	{
		this.allEntities.value = [dto, ...this.allEntities.value];
		this.search(this.searchText.value);
		this.emit(new PageLoaded());
	}

	update(dto: TDto): void
	{
		this.allEntities.value = this.allEntities.value.map((e) => (e.id === dto.id ? dto : e));
		this.search(this.searchText.value);
	}

	delete(target: TDto | number): void
	{
		const id = typeof target === "number" ? target : target.id;
		this.allEntities.value = this.allEntities.value.filter((e) => e.id !== id);
		this.search(this.searchText.value);

		if (this.allEntities.value.length === 0)
		{
			this.emit(new PageEmpty());
		}
	}
}