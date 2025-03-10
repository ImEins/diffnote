import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = axios.create({
  baseURL: "http://localhost:8000",
});

// Add the customInstance function required by the generator
export const api = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: { data: T }) => data);

  // @ts-expect-error - This is a custom function
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// Add these type exports
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
