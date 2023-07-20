import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import { UserApp } from '../membership/models/user-app';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService{
  

  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  update(value: UserApp) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  
  add(value: UserApp) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "users";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<UserApp[]> {
    return this.httpCLient.get<UserApp[]>(this.baseURL, {
      params: new HttpParams()
        .set('term', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<UserApp[]> {
    return this.httpCLient.get<UserApp[]>(this.baseURL + "/getAll");
  }
  getSalesPersons(): Observable<UserApp[]> {
    return this.httpCLient.get<UserApp[]>(this.baseURL + "/sales-persons");
  }
  getSupervisors(): Observable<UserApp[]> {
    return this.httpCLient.get<UserApp[]>(this.baseURL + "/supervisors");
  }
  GetVerifiers(): Observable<UserApp[]> {
    return this.httpCLient.get<UserApp[]>(this.baseURL + "/controllers");
  }
  GetExecuters(): Observable<UserApp[]> {
    return this.httpCLient.get<UserApp[]>(this.baseURL + "/executers");
  }
  GetConsolidators() {
    return this.httpCLient.get<UserApp[]>(this.baseURL + "/consolidators");
  }
  getById(id): Observable<UserApp> {
    return this.httpCLient.get<UserApp>(this.baseURL + "/"+id);
  }
  getSalesPersonsBySupervisor(id :string): Observable<UserApp[]> {
    return this.httpCLient.get<UserApp[]>(this.baseURL + "/sales-persons/"+id);
  }
}
