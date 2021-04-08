import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';
import { IProject } from '../models/project.model';
import { HttpWrapper } from '../helpers/http-wrapper';

@Injectable()
export class ProjectService {
  constructor(private httpWrapper: HttpWrapper) {}

  getAll(): Observable<any> {
    return this.httpWrapper.get(`http://localhost:8000/api/v1/projects`, this.httpWrapper.getAuthOptions());
  }

  add(project: ICourse): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/projects`, project, this.httpWrapper.getAuthOptions());
  }

  update(params: { project: IProject }): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/projects/${params.project.id}`, params, this.httpWrapper.getAuthOptions());
  }

  delete(projectId: number | undefined): Observable<any> {
    return this.httpWrapper.delete(`http://localhost:8000/api/v1/projects/${projectId}`, this.httpWrapper.getAuthOptions());
  }

  delete_selected(projects: IProject[]): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/projects/destroy_selected`, { projects }, this.httpWrapper.getAuthOptions());
  }

  download_template_api_url(): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/projects/download_template`, {}, this.httpWrapper.getDownloadOptions());
  }

  import_projects(formData: FormData): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/projects/import_projects`, formData, this.httpWrapper.getImportOptions());
  }

  export_projects(projects: IProject[]): Observable<any> {
    return this.httpWrapper.post(
      `http://localhost:8000/api/v1/projects/export_projects`,
      { projects },
      this.httpWrapper.getDownloadOptions()
    );
  }

  getProjectDetails(project: IProject): string {
    const hoursPerMonth = project.hours_per_month ? `${project.hours_per_month} ore pe luna ∙ ` : '';
    let restrictedHours = '';
    if (project.restricted_start_hour || project.restricted_end_hour) {
      restrictedHours = `Restrictie ore de lucru pe proiect: ${project.restricted_start_hour || '00'}:00 - ${
        project.restricted_end_hour || '24'
      }:00 ∙ `;
    }
    return `${hoursPerMonth}${restrictedHours}${project.description || ''}`;
  }
}
