import { type Signal, signal } from "@preact/signals-react";
import type { BaseFilterableApiService } from "../networking";
import { Cubit } from "./cubit";
import type { Dto } from "./dto";
import type { Entity } from "./entity";
import { PageEmpty, PageInitial, PageLoaded, PageLoading, type PageState } from "./pageStates";

export class PageCubit<TEntity extends Entity<TDto>, TDto extends Dto> extends Cubit<PageState>
{
  protected _service: BaseFilterableApiService<TEntity, TDto>;
  public pageSize: Signal<number>;
  public currentPage: Signal<number>;
  public searchText: Signal<string | undefined>;
  protected types: Signal<number[] | undefined>;
  protected queryParams: Signal<Record<string, string | number> | undefined>;
  entities: Signal<TEntity[]>;
  count: Signal<number>;

  constructor(service: BaseFilterableApiService<TEntity, TDto>, pageSize: number = 100)
  {
    super(new PageInitial());
    this._service = service;
    this.pageSize = signal(pageSize);
    this.currentPage = signal(1);
    this.searchText = signal(undefined);
    this.types = signal([]);
    this.queryParams = signal({});
    this.entities = signal<TEntity[]>([]);
    this.count = signal(0);
  }

  async filter(
    pageNumber?: number,
    rowsPerPage?: number,
    searchText?: string,
    types?: number[],
    queryParams?: Record<string, string | number>
  ): Promise<void>
  {
    this.currentPage.value = pageNumber ?? this.currentPage.value;
    this.pageSize.value = rowsPerPage ?? this.pageSize.value;
    this.searchText.value = searchText;
    this.types.value = types;
    this.queryParams.value = queryParams;

    this.emit(new PageLoading());

    const result = await this._service.Filter(
      this.currentPage.value,
      this.pageSize.value,
      this.searchText.value,
      this.types.value,
      this.queryParams.value
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

  init(types?: number[], queryParams?: Record<string, string | number>): void
  {
    this.filter(1, undefined, undefined, types, queryParams);
  }

  changePage(pageNumber: number)
  {
    this.filter(pageNumber);
  }

  search(searchText: string | undefined)
  {
    this.filter(1, undefined, searchText);
  }

  add(entity: TEntity)
  {
    this.entities.value = [entity, ...this.entities.value];
  }

  update(entity: TEntity)
  {
    this.entities.value = this.entities.value.map((e) => e.id.value === entity.id.value ? entity : e);
  }

  delete(entity: TEntity)
  {
    this.entities.value = this.entities.value.filter((e) => e.id.value !== entity.id.value);
    if (this.entities.value.length === 0)
    {
      this.filter(1);
    }
  }
}
