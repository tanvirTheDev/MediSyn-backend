export interface ISchedulePayload {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface IScheduleFilterRequest {
  startTime: string;
  endTime: string;
}
