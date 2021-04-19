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

export const ACTIVITIES: string[] = ['Activitate didactica', 'Alta activitate', 'Concediu', 'Proiect'];

export const COURSE_SUBACTIVITIES: string[] = [
  'Curs',
  'Seminar',
  'Laborator',
  'Ora de proiect',
  'Evaluare',
  'Consultatii',
  'Pregatire pentru activitatea didactica'
];
export const OTHER_SUBACTIVITIES: string[] = [
  'Indrumare doctoranzi',
  'Implicare neremunerată în problematica societății',
  'Gestiune cooperari',
  'Zile delegatie (Deplasare interna)',
  'Zile delegatie (Deplasare externa)',
  'Plecati cu bursa',
  'Documentare pentru cercetare',
  'Documentare oportunitati de finantare proiecte',
  'Elaborare proiecte de cercetare',
  'Executie proiecte de cercetare',
  'Alte activitati'
];
export const HOLIDAYS: string[] = [
  'Concediu de odihna',
  'Concediu medical',
  'Concediu crestere copil',
  'Concediu de maternitate',
  'Concediu fara salariu',
  'Absente nemotivate'
];
