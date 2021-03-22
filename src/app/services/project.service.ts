import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';
import { IProject } from '../models/project.model';
import { HttpOptions } from '../helpers/http-options';

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient, private httpOptions: HttpOptions) {}

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/projects', this.httpOptions.getAuthOptions());
  }

  add(project: ICourse): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/projects', project, this.httpOptions.getAuthOptions());
  }

  update(params: { project: IProject }): Observable<any> {
    return this.http.put(`http://localhost:8000/api/v1/projects/${params.project.id}`, params, this.httpOptions.getAuthOptions());
  }

  delete(projectId: number | undefined): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/v1/projects/${projectId}`, this.httpOptions.getAuthOptions());
  }

  delete_selected(projects: IProject[]): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/projects/destroy_selected`, { projects }, this.httpOptions.getAuthOptions());
  }

  download_template_api_url(): string {
    return 'http://localhost:8000/api/v1/projects/download_template';
  }

  import_projects(formData: FormData): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/projects/import_projects`, formData, this.httpOptions.getAuthOptions());
  }
}
