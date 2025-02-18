import { AppError } from "../utils/error"

export abstract class RestService {
  protected baseUrl: string = ""

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  protected async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw AppError.wrap(response);
    }
    return await response.json();
  }

  protected async post<T>(endpoint: string, body: any = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw AppError.wrap(response)
    }
    return await response.json()
  }
}