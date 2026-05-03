import { toast } from "sonner";
import { AuthConstants } from "../auth";
import { type RequestResult, ResultStatus } from "../types/requestResult";

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
    if (response.status === ResultStatus.Unauthorized)
    {
      window.dispatchEvent(new Event(AuthConstants.UnauthorizedEventName));
      toast.error("انتهت صلاحية الدخول", { description: "سجل الدخول  مجددًا." });
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
      toast.error("لم يتم العثور على طلبك");
      return { data: undefined, status: 404, title: "Not Found", errors: [], warnings: [] };
    }

    if (response.status === ResultStatus.TooManyRequests)
    {
      toast.error("لقد تجاوزت الحد المسموح به. يرجى المحاولة لاحقا.");
      return { data: undefined, status: ResultStatus.TooManyRequests, title: "Rejected", errors: [], warnings: [] };
    }

    if (!response.ok)
    {
      const errorData = await response.json() as RequestResult<any>;

      if (response.status !== ResultStatus.UnprocessableEntity && response.status !== ResultStatus.PreconditionFailed)
      {
        toast.error(errorData.title || "An error occurred", {
          description: errorData.errors.join("\n") || errorData.warnings.join("\n")
        });
      }

      return {
        data: undefined,
        status: response.status as ResultStatus,
        title: errorData.title,
        errors: errorData.errors,
        warnings: errorData.warnings
      };
    }

    const data = await response.json() as T;

    if (successMessage)
    {
      toast.success(successMessage);
    }

    return { data, status: response.status as ResultStatus, title: "", errors: [], warnings: [] };
  }
}
