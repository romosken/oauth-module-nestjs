export default class ErrorDto {
  constructor(status: number, path: string, message: string[]) {
    this.status = status;
    this.path = path;
    this.timestamp = new Date().toISOString();
    this.message = message;
  }
  status: number;
  error: string;
  path: string;
  timestamp: string;
  message: string[];
}
