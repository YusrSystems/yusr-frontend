import { signal, type Signal } from "@preact/signals-react";
import { YusrApiHelper } from "../networking";
import { Cubit } from "./cubit.ts";


export class ReportInitial
{
}

export class ReportLoading extends ReportInitial
{
}

export class ReportLoaded extends ReportInitial
{
}

export class ReportError extends ReportInitial
{
}

export type ReportState = ReportLoading | ReportLoaded | ReportError;

export class ReportCubit<TRequest, TResult> extends Cubit<ReportInitial>
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
		try
		{
			this.emit(new ReportLoading());
			const resolvedPage = pageNumber ?? this.currentPage.value;
			const resolvedPageSize = pageSize ?? this.pageSize.value;

			const result = await YusrApiHelper.Post<TResult>(`/api/Reports/${ this.routeName }`, {
				...request,
				pageNumber: resolvedPage,
				rowsPerPage: resolvedPageSize
			});

			this.currentPage.value = resolvedPage;
			this.pageSize.value = resolvedPageSize;
			this.emit(new ReportLoaded());
			this.result.value = result.data;
		}
		catch (e)
		{
			this.emit(new ReportError());
		}
	}
}