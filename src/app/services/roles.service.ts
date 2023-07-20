import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import { Role } from '../membership/models/user-role';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService{

  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  update(value: Role) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  add(value: Role) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "roles";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<Role[]> {
    return this.httpCLient.get<Role[]>(this.baseURL, {
      params: new HttpParams()
        .set('term', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<Role[]> {
    return this.httpCLient.get<Role[]>(this.baseURL + "/getAll");
  }
  
}
