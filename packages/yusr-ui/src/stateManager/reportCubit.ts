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
	public result: Signal<TResult | undefined> = signal();

	constructor(private routeName: string)
	{
		super(new ReportInitial());
	}

	async getReportData(request: TRequest)
	{
		try
		{
			this.emit(new ReportLoading());
			const result = await YusrApiHelper.Post<TResult>(`/api/Reports/${ this.routeName }`, request);
			this.emit(new ReportLoaded());
			this.result.value = result.data;
		}
		catch (e)
		{
			this.emit(new ReportError());
		}
	}
}