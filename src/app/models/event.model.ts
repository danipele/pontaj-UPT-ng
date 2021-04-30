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
  type?: string;
  allDay: boolean;
}

export const ACTIVITIES: string[] = ['courseHour', 'otherActivity', 'holidays', 'project'];
export const NO_HOLIDAY_ACTIVITIES: string[] = ['courseHour', 'otherActivity', 'project'];
export const WEEKEND_ACTIVITIES: string[] = ['courseHour', 'project'];

export const COURSE_SUBACTIVITIES: string[] = [
  'course',
  'seminar',
  'laboratory',
  'projectHour',
  'evaluation',
  'consultations',
  'teachingActivityPreparation'
];
export const OTHER_SUBACTIVITIES: string[] = [
  'doctoralStudentsGuidance',
  'cooperationManagement',
  'internalDelegationDays',
  'externalDelegationDays',
  'departureWithScholarship',
  'researchDocumentation',
  'projectFinancingOpportunitiesDocumentation',
  'researchProjectsElaboration',
  'otherActivities'
];
export const HOLIDAYS: string[] = ['vacation', 'sickLeave', 'childGrowthLeave', 'maternityLeave', 'unpaidLeave', 'unmotivatedAbsences'];
export const COLLABORATOR_SUBACTIVITIES: string[] = ['course', 'seminar', 'laboratory', 'projectHour'];
