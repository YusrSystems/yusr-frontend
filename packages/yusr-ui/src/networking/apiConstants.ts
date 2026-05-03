export class ApiConstants {
  private static _baseUrl: string = "";

  static get baseUrl(): string {
    if (!this._baseUrl) {
      console.warn("YusrCore: baseUrl has not been initialized. Defaults to empty string.");
    }
    return this._baseUrl;
  }

  static initialize(url: string) {
    this._baseUrl = url;
  }
}