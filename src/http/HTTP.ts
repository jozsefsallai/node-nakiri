import axios, { AxiosRequestConfig } from 'axios';
import { NakiriHTTPPaginatedResponse } from '../typings/http';

export class HTTPClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private buildConfig(config?: AxiosRequestConfig) {
    const finalConfig = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.apiKey,
      },
    };

    if (!config) {
      return finalConfig;
    }

    return {
      ...finalConfig,
      ...config,
    };
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axios.get(url, this.buildConfig(config));
    return response.data;
  }

  public async *getAll<T extends NakiriHTTPPaginatedResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): AsyncIterableIterator<T> {
    let response: T;

    do {
      response = await this.get<T>(url, config);
      yield response;

      config = {
        ...config,
        params: {
          ...config?.params,
          cursor: response.pagination.nextCursor,
        },
      };
    } while (response.pagination.nextCursor);
  }

  public async post<T = any, U = any>(
    url: string,
    data?: U,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await axios.post(url, data, this.buildConfig(config));
    return response.data;
  }
}
