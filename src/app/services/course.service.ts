import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICourse } from '../models/course.model';
import { HttpWrapper } from '../helpers/http-wrapper';

@Injectable()
export class CourseService {
  constructor(private httpWrapper: HttpWrapper) {}

  getAll(): Observable<any> {
    return this.httpWrapper.get(`http://localhost:8000/api/v1/courses`, this.httpWrapper.getAuthOptions());
  }

  add(course: ICourse): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/courses`, course, this.httpWrapper.getAuthOptions());
  }

  update(params: { course: ICourse }): Observable<any> {
    return this.httpWrapper.put(`http://localhost:8000/api/v1/courses/${params.course.id}`, params, this.httpWrapper.getAuthOptions());
  }

  delete(courseId: number | undefined): Observable<any> {
    return this.httpWrapper.delete(`http://localhost:8000/api/v1/courses/${courseId}`, this.httpWrapper.getAuthOptions());
  }

  delete_selected(courses: ICourse[]): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/courses/destroy_selected`, { courses }, this.httpWrapper.getAuthOptions());
  }

  download_template_api_url(): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/courses/download_template`, {}, this.httpWrapper.getDownloadOptions());
  }

  import_courses(formData: FormData): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/courses/import_courses`, formData, this.httpWrapper.getImportOptions());
  }

  export_courses(courses: ICourse[]): Observable<any> {
    return this.httpWrapper.post(`http://localhost:8000/api/v1/courses/export_courses`, { courses }, this.httpWrapper.getDownloadOptions());
  }
}
