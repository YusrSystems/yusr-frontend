import { signal, type Signal } from "@preact/signals-react";
import { Cubit } from "./cubit.ts";
import { apiClient } from "#/api";


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
	public result: Signal<TResult | undefined> = signal();

	constructor(private routeName: string)
	{
		super(new ReportInitial());
	}

	async getReportData(request: TRequest)
	{
		this.emit(new ReportLoading());
		const result = await apiClient.post<TResult>(`/api/Reports/${ this.routeName }`, request);

		if (result.ok && result.data)
		{
			this.result.value = result.data;
			this.emit(new ReportLoaded());
			return;
		}

		this.emit(new ReportError());
	}
}