import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';

@Injectable()
export class CourseService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/courses');
  }

  add(course: ICourse): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/courses', course);
  }

  update(params: { course: ICourse }): Observable<any> {
    return this.http.put(`http://localhost:8000/api/v1/courses/${params.course.id}`, params);
  }

  delete(courseId: number | undefined): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/v1/courses/${courseId}`);
  }

  delete_selected(courses: ICourse[]): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/courses/destroy_selected`, { courses });
  }
}
