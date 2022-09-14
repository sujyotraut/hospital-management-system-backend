interface SuccessResponse {
  status: 'success';
  data: any;
}

interface FailResponse {
  status: 'fail' | 'error';
  message: string;
}

type APIResponse = SuccessResponse | FailResponse;
export default APIResponse;
