import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService{
 
  baseURL: string;
 
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "employees";
  }
  add(value: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  getAll(functionCode): Observable<any[]> {
    return this.httpCLient.get<any[]>(this.baseURL +'/'+ functionCode +"/all");
  }
  update(value: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + '/' + value.id , value).pipe(catchError(this.handleError) );
  }
}
