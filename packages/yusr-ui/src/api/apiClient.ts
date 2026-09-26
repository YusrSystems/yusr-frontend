import { toast } from "sonner";
import { AuthConstants } from "yusr-ui";


export interface ApiResponse<T>
{
	data?: T;
	status: number;
	ok: boolean;
	title?: string;
	errors: string[];
	warnings: string[];
}

export interface RequestOptions extends Omit<RequestInit, "body">
{
	silent?: boolean;
	successMessage?: string;
}

export class ApiClient
{
	static async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>
	{
		const response = await fetch(url, {
			method: "GET",
			credentials: "include",
			...options,
			headers: this.defaultHeaders(options?.headers)
		});
		return this.handleResponse<T>(response, options);
	}

	static async post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>
	{
		const isFormData = body instanceof FormData;
		const response = await fetch(url, {
			method: "POST",
			credentials: "include",
			...options,
			headers: this.defaultHeaders({
				...(options?.headers || {}),
				...(!isFormData && body !== undefined ? {"Content-Type": "application/json"} : {})
			}),
			body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined
		});
		return this.handleResponse<T>(response, options);
	}

	static async put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>
	{
		const isFormData = body instanceof FormData;
		const response = await fetch(url, {
			method: "PUT",
			credentials: "include",
			...options,
			headers: this.defaultHeaders({
				...(options?.headers || {}),
				...(!isFormData && body !== undefined ? {"Content-Type": "application/json"} : {})
			}),
			body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined
		});
		return this.handleResponse<T>(response, options);
	}

	static async delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>
	{
		const response = await fetch(url, {
			method: "DELETE",
			credentials: "include",
			...options,
			headers: this.defaultHeaders(options?.headers)
		});
		return this.handleResponse<T>(response, options);
	}

	private static defaultHeaders(extra?: HeadersInit): HeadersInit
	{
		return {
			"Accept-Language": document.documentElement.lang || "ar",
			"X-TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
			...(extra || {})
		};
	}

	private static async handleResponse<T>(
		response: Response,
		options?: RequestOptions
	): Promise<ApiResponse<T>>
	{
		const status = response.status;

		if (status === 401)
		{
			window.dispatchEvent(new Event(AuthConstants.UnauthorizedEventName));
			if (!options?.silent)
			{
				toast.error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا");
			}
			return {
				data: undefined,
				status,
				ok: false,
				title: "Unauthorized",
				errors: ["Session expired"],
				warnings: []
			};
		}

		if (status === 429)
		{
			if (!options?.silent)
			{
				toast.error("لقد تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة لاحقًا.");
			}
			return {
				data: undefined,
				status,
				ok: false,
				title: "Too Many Requests",
				errors: ["Rate limit exceeded"],
				warnings: []
			};
		}

		let json: any = null;
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json"))
		{
			try
			{
				json = await response.json();
			}
			catch
			{
				json = null;
			}
		}

		if (status >= 400)
		{
			const errors: string[] = json?.errors || (json?.title ? [json.title] : ["حدث خطأ أثناء معالجة الطلب"]);
			const warnings: string[] = json?.warnings || [];

			if (!options?.silent && status >= 500)
			{
				toast.error("حدث خطأ غير متوقع في الخادم");
			}
			else if (!options?.silent && status === 400)
			{
				toast.error(json?.title || "طلب غير صالح", {
					description: errors.join("\n")
				});
			}

			return {
				data: undefined,
				status,
				ok: false,
				title: json?.title,
				errors,
				warnings
			};
		}

		if (options?.successMessage)
		{
			toast.success(options.successMessage);
		}

		return {
			data: json as T,
			status,
			ok: true,
			errors: [],
			warnings: []
		};
	}
}

export const apiClient = ApiClient;