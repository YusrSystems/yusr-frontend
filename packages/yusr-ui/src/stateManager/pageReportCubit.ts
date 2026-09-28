import { Cubit } from "./cubit.ts";
import { signal, type Signal } from "@preact/signals-react";
import { apiClient } from "#/api";
import { ReportError, ReportInitial, ReportLoaded, ReportLoading } from "./reportCubit.ts";


export class PageReportCubit<TRequest, TResult> extends Cubit<ReportInitial>
{
	public pageSize: Signal<number> = signal(1000);
	public currentPage: Signal<number> = signal(1);
	public result: Signal<TResult | undefined> = signal();

	constructor(private routeName: string)
	{
		super(new ReportInitial());
	}

	async getReportData(request: TRequest, pageNumber?: number, pageSize?: number)
	{
		this.emit(new ReportLoading());
		const resolvedPage = pageNumber ?? this.currentPage.value;
		const resolvedPageSize = pageSize ?? this.pageSize.value;

		const result = await apiClient.post<TResult>(`/api/Reports/${ this.routeName }`, {
			...request,
			pageNumber: resolvedPage,
			rowsPerPage: resolvedPageSize
		});

		if (result.ok && result.data)
		{
			this.currentPage.value = resolvedPage;
			this.pageSize.value = resolvedPageSize;
			this.result.value = result.data;
			this.emit(new ReportLoaded());
			return;
		}

		this.emit(new ReportError());
	}
}