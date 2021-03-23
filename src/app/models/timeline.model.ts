export interface ITimeline {
  id?: number;
  startDate?: Date;
  endDate?: Date;
  activityId?: number;
  activityType?: string;
  userId?: number;
  allDay?: boolean;
}
