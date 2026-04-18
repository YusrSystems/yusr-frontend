import { toast } from "sonner";
import { AuthConstants } from "../../auth";
import type { RequestResult } from "../../types/requestResult";

export class YusrApiHelper
{
  static async Get<T>(url: string, options?: RequestInit): Promise<RequestResult<T>>
  {
    const response = await fetch(url, { method: "GET", credentials: "include", ...options });
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
    const headers = {
      ...(options?.headers || {}),
      ...(!isFormData && body ? { "Content-Type": "application/json" } : {})
    };

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options
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
    const headers = {
      ...(options?.headers || {}),
      ...(!isFormData && body ? { "Content-Type": "application/json" } : {})
    };

    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options
    });
    return YusrApiHelper.handleResponse<T>(response, successMessage);
  }

  static async Delete<T>(url: string, options?: RequestInit, successMessage?: string): Promise<RequestResult<T>>
  {
    const response = await fetch(url, { method: "DELETE", credentials: "include", ...options });
    return YusrApiHelper.handleResponse<T>(response, successMessage);
  }

  static async PostBlob(url: string, body?: unknown, options?: RequestInit): Promise<Blob | undefined>
  {
    const isFormData = body instanceof FormData;
    const headers = {
      ...(options?.headers || {}),
      ...(!isFormData && body ? { "Content-Type": "application/json" } : {})
    };

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options
    });

    if (!response.ok)
    {
      const errorData = await response.json();
      toast.error(errorData.title || "حدث خطأ أثناء تحميل التقرير", {
        description: errorData.detail || "يرجى المحاولة مرة أخرى لاحقاً"
      });
      return undefined;
    }

    return await response.blob();
  }

  private static async handleResponse<T>(response: Response, successMessage?: string): Promise<RequestResult<T>>
  {
    if (response.status === 401)
    {
      window.dispatchEvent(new Event(AuthConstants.UnauthorizedEventName));
      toast.error("انتهت صلاحية الدخول", { description: "سجل الدخول  مجددًا." });
      return { data: undefined, status: 401, errorTitle: "Unauthorized", errorDetails: "Session expired" };
    }

    if (response.status === 404)
    {
      toast.error("لم يتم العثور على طلبك");
      return { data: undefined, status: 404, errorTitle: "Not Found", errorDetails: "" };
    }

    if (response.status === 429)
    {
      toast.error("لقد تجاوزت الحد المسموح به. يرجى المحاولة لاحقا.");
      return { data: undefined, status: 429, errorTitle: "Rejected", errorDetails: "" };
    }

    if (!response.ok)
    {
      const errorData = await response.json();
      toast.error(errorData.title || "An error occurred", { description: errorData.detail });
      return { data: undefined, status: response.status, errorTitle: errorData.title, errorDetails: errorData.detail };
    }

    const data = await response.json() as T;

    if (successMessage)
    {
      toast.success(successMessage);
    }

    return { data, status: response.status, errorTitle: "", errorDetails: "" };
  }
}
