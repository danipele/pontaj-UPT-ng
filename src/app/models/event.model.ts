import { EventColor } from 'calendar-utils';
import { ICourse } from './course.model';
import { IProject } from './project.model';

export interface IEvent {
  id?: string | number;
  start: Date;
  end: Date;
  title: string;
  color?: EventColor;
  activity: string;
  subactivity: string;
  entity?: ICourse | IProject;
  description?: string;
}
