import queryString from "query-string";

export interface IRequest {
  url: string;
  method: string;
  body?: any;
  queryParams?: any;
  useCredentials?: boolean;
  headers?: any;
  nextOption?: any;
}

export const sendRequest = async <T>(props: IRequest) => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method: method,
    headers: new Headers({
      "content-type": "application/json",
      platform: "client-desktop",
      ...headers,
    }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  if (queryParams && Object.keys(queryParams).length > 0) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }
  // console.log("uraal", url, options);

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T;
    } else {
      return res.json().then(function (json) {
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
          code: json?.code ?? "",
        } as T;
      });
    }
  });
};

// export const sendRequestFile = async <T>(props: IRequest) => {
//   let {
//     url,
//     method,
//     body,
//     queryParams = {},
//     useCredentials = false,
//     headers = {},
//     nextOption = {},
//   } = props;

//   const options: any = {
//     method: method,
//     headers: new Headers({ ...headers }),
//     body: body ? body : null,
//     ...nextOption,
//   };
//   if (useCredentials) options.credentials = "include";

//   if (queryParams && Object.keys(queryParams).length > 0) {
//     url = `${url}?${queryString.stringify(queryParams)}`;
//   }

//   return fetch(url, options).then((res) => {
//     if (res.ok) {
//       return res.json() as T;
//     } else {
//       return res.json().then(function (json) {
//         return {
//           statusCode: res.status,
//           message: json?.message ?? "",
//           error: json?.error ?? "",
//         } as T;
//       });
//     }
//   });
// };
const httpClient = {
  get: <T = any>(url: string, queryParams?: any) =>
    sendRequest<T>({
      url,
      method: "GET",
      queryParams,
    }),

  post: <T = any>(url: string, body?: any, queryParams?: any) =>
    sendRequest<T>({
      url,
      method: "POST",
      body,
      queryParams,
    }),

  put: <T = any>(url: string, body?: any, queryParams?: any) =>
    sendRequest<T>({
      url,
      method: "PUT",
      body,
      queryParams,
    }),

  patch: <T = any>(url: string, body?: any, queryParams?: any) =>
    sendRequest<T>({
      url,
      method: "PATCH",
      body,
      queryParams,
    }),

  delete: <T = any>(url: string, queryParams?: any) =>
    sendRequest<T>({
      url,
      method: "DELETE",
      queryParams,
    }),
};

export default httpClient;
