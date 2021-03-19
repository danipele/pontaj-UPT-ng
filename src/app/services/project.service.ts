import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';

@Injectable()
export class ProjectService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/projects');
  }

  save(project: ICourse): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/projects', project);
  }
}
