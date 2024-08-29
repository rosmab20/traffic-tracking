interface IBasicResponse {
  status: number;
  message?: string;
  data?: any;
  errorcode: number;
}

interface IResponseError {
  status: number;
  message: string;
  errorcode: number;
}
