import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';
import { IProject } from '../models/project.model';

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/projects');
  }

  add(project: ICourse): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/projects', project);
  }

  update(params: { project: IProject }): Observable<any> {
    return this.http.put(`http://localhost:8000/api/v1/projects/${params.project.id}`, params);
  }

  delete(projectId: number | undefined): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/v1/projects/${projectId}`);
  }

  delete_selected(projects: IProject[]): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/projects/destroy_selected`, { projects });
  }

  download_template_api_url(): string {
    return 'http://localhost:8000/api/v1/projects/download_template';
  }
}
