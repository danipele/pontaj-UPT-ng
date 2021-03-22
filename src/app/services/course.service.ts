import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';
import { HttpOptions } from '../helpers/http-options';

@Injectable()
export class CourseService {
  constructor(private http: HttpClient, private httpOptions: HttpOptions) {}

  getAll(): Observable<any> {
    return this.http.get('http://localhost:8000/api/v1/courses', this.httpOptions.getAuthOptions());
  }

  add(course: ICourse): Observable<any> {
    return this.http.post('http://localhost:8000/api/v1/courses', course, this.httpOptions.getAuthOptions());
  }

  update(params: { course: ICourse }): Observable<any> {
    return this.http.put(`http://localhost:8000/api/v1/courses/${params.course.id}`, params, this.httpOptions.getAuthOptions());
  }

  delete(courseId: number | undefined): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/v1/courses/${courseId}`, this.httpOptions.getAuthOptions());
  }

  delete_selected(courses: ICourse[]): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/courses/destroy_selected`, { courses }, this.httpOptions.getAuthOptions());
  }

  download_template_api_url(): string {
    return 'http://localhost:8000/api/v1/courses/download_template';
  }

  import_courses(formData: FormData): Observable<any> {
    return this.http.post(`http://localhost:8000/api/v1/courses/import_courses`, formData, this.httpOptions.getAuthOptions());
  }
}
