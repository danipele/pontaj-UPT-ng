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

  update(project: IProject): Observable<any> {
    return this.http.put('http://localhost:8000/api/v1/projects', project);
  }
}
