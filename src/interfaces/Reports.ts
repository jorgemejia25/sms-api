export interface Reports {
  port: string;
  phonenumber: string;
  time: string;
  id: string;
  result: string;
}

export interface ReportsResponse {
  reports: Reports[];
}
