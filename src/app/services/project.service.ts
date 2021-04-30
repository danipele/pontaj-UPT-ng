import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';
import { IProject } from '../models/project.model';
import { HttpWrapper } from '../helpers/http-wrapper';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ProjectService {
  constructor(private httpWrapper: HttpWrapper, private translateService: TranslateService) {}

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

  deleteSelected(projects: IProject[]): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/projects/destroy_selected`, { projects }, this.httpWrapper.getAuthOptions());
  }

  downloadTemplateApiUrl(): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/projects/download_template`, {}, this.httpWrapper.getDownloadOptions());
  }

  importProjects(formData: FormData): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/projects/import_projects`, formData, this.httpWrapper.getImportOptions());
  }

  exportProjects(projects: IProject[]): Observable<any> {
    return this.httpWrapper.post(
      `http://localhost:8000/api/v1/projects/export_projects`,
      { projects },
      this.httpWrapper.getDownloadOptions()
    );
  }

  getProjectDetails(project: IProject): string {
    const hoursPerMonth = project.hours_per_month
      ? this.translateService.instant('project.details.hoursPerMonth', { hoursPerMonth: project.hours_per_month })
      : '';
    let restrictedHours = '';
    if (project.restricted_start_hour || project.restricted_end_hour) {
      restrictedHours = this.translateService.instant('project.details.hourRestrictions', {
        startHour: project.restricted_start_hour || '00',
        endHour: project.restricted_end_hour || '24'
      });
    }
    return `${hoursPerMonth}${restrictedHours}${project.description || ''}`;
  }
}
