import { type TFunction } from "i18next";
import { toast } from "sonner";
import { AuthConstants } from "../auth";
import { type RequestResult, ResultStatus } from "../types/requestResult";


export class YusrApiHelper
{
	private static t: TFunction<"common"> | null = null;
	private static currentLanguage: string = "ar";

	public static init(t: TFunction, language: string)
	{
		this.t = t;
		this.currentLanguage = language;
	}

	static async Get<T>(url: string, options?: RequestInit): Promise<RequestResult<T>>
	{
		const response = await fetch(url, {
			method: "GET",
			credentials: "include",
			...options,
			headers: this.getHeaders(options?.headers)
		});
		return YusrApiHelper.handleResponse<T>(response);
	}

	static async Post<T>(
		url: string,
		body?: unknown,
		options?: RequestInit,
		successMessage?: string
	): Promise<RequestResult<T>>
	{
		const isFormData = body instanceof FormData;
		const response = await fetch(url, {
			method: "POST",
			credentials: "include",
			...options,
			headers: this.getHeaders({
				...(options?.headers || {}),
				...(!isFormData && body ? {"Content-Type": "application/json"} : {})
			}),
			body: isFormData ? body : JSON.stringify(body)
		});
		return YusrApiHelper.handleResponse<T>(response, successMessage);
	}

	static async Put<T>(
		url: string,
		body?: unknown,
		options?: RequestInit,
		successMessage?: string
	): Promise<RequestResult<T>>
	{
		const isFormData = body instanceof FormData;
		const response = await fetch(url, {
			method: "PUT",
			credentials: "include",
			...options,
			headers: this.getHeaders({
				...(options?.headers || {}),
				...(!isFormData && body ? {"Content-Type": "application/json"} : {})
			}),
			body: isFormData ? body : JSON.stringify(body)
		});
		return YusrApiHelper.handleResponse<T>(response, successMessage);
	}

	static async Delete<T>(url: string, options?: RequestInit, successMessage?: string): Promise<RequestResult<T>>
	{
		const response = await fetch(url, {
			method: "DELETE",
			credentials: "include",
			...options,
			headers: this.getHeaders(options?.headers)
		});
		return YusrApiHelper.handleResponse<T>(response, successMessage);
	}

	static async PostBlob(url: string, body?: unknown, options?: RequestInit): Promise<Blob | undefined>
	{
		const t = this.getT();
		const isFormData = body instanceof FormData;
		const response = await fetch(url, {
			method: "POST",
			credentials: "include",
			...options,
			headers: this.getHeaders({
				...(options?.headers || {}),
				...(!isFormData && body ? {"Content-Type": "application/json"} : {})
			}),
			body: isFormData ? body : JSON.stringify(body)
		});

		if (!response.ok)
		{
			const errorData = await response.json();
			toast.error(errorData.title || t("api.reportLoadError"), {
				description: errorData.detail || t("api.tryAgainLater")
			});
			return undefined;
		}

		return await response.blob();
	}

	private static getT(): TFunction<"common">
	{
		if (!this.t)
		{
			throw new Error("YusrApiHelper not initialized. Call YusrApiHelper.init(t) first.");
		}
		return this.t;
	}

	private static getLanguage(): string
	{
		if (!this.currentLanguage)
		{
			throw new Error("YusrApiHelper not initialized. Call YusrApiHelper.init(t, i18n.language) first.");
		}
		return this.currentLanguage;
	}

	private static getHeaders(extra?: HeadersInit): HeadersInit
	{
		return {
			"Accept-Language": this.getLanguage() || document.documentElement.lang || "ar",
			"X-TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
			...(extra || {})
		};
	}

	private static async handleResponse<T>(response: Response, successMessage?: string): Promise<RequestResult<T>>
	{
		const t = this.getT();
		if (response.status === ResultStatus.Unauthorized)
		{
			window.dispatchEvent(new Event(AuthConstants.UnauthorizedEventName));
			toast.error(t("api.sessionExpired"), {description: t("api.loginAgain")});
			return {
				data: undefined,
				status: ResultStatus.Unauthorized,
				title: "Unauthorized",
				errors: ["Session expired"],
				warnings: []
			};
		}

		if (response.status === ResultStatus.NotFound)
		{
			try
			{
				const errorData = await response.json() as RequestResult<any>;
				toast.error(errorData.title || t("api.notFound"), {
					description: errorData.errors?.join("\n") || errorData.warnings?.join("\n")
				});

				return {
					data: undefined,
					status: ResultStatus.NotFound,
					title: errorData.title,
					errors: errorData.errors,
					warnings: errorData.warnings
				};
			}
			catch
			{
				toast.error(t("api.notFound"));
				return {
					data: undefined,
					status: ResultStatus.NotFound,
					title: "",
					errors: [""],
					warnings: [""]
				};

			}

		}

		if (response.status === ResultStatus.TooManyRequests)
		{
			toast.error(t("api.tooManyRequests"));
			return {data: undefined, status: ResultStatus.TooManyRequests, title: "Rejected", errors: [], warnings: []};
		}

		if (!response.ok)
		{

			try
			{
				const errorData = await response.json() as RequestResult<any>;
				toast.error(errorData.title || t("api.anErrorOccurred"), {
					description: errorData.errors?.join("\n") || errorData.warnings?.join("\n")
				});

				return {
					data: undefined,
					status: ResultStatus.NotFound,
					title: errorData.title,
					errors: errorData.errors,
					warnings: errorData.warnings
				};
			}
			catch
			{
				toast.error(t("api.anErrorOccurred"));
				return {
					data: undefined,
					status: ResultStatus.NotFound,
					title: "",
					errors: [""],
					warnings: [""]
				};

			}
		}

		const data = await response.json() as T;

		if (successMessage)
		{
			toast.success(successMessage);
		}

		return {data, status: response.status as ResultStatus, title: "", errors: [], warnings: []};
	}
}
