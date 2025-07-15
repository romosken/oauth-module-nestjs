export default class HttpExceptionDto {
  constructor(obj: object) {
    Object.assign(this, obj);
  }
  statusCode: number;
  message: string[];
  error: string;
}
