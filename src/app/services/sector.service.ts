import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as uuid from 'uuid';
import { BaseService } from '../shared/base.service';
import { Sector } from '../tiers/sector-client/models/sector';
@Injectable({
  providedIn: 'root'
})
export class SectorService  extends BaseService {

  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  activate(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.put(this.baseURL + "/" + id  +"/activate" , {}).pipe(catchError(this.handleError) )
  }
  update(value: Sector) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  add(value: Sector) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  getById(item : Sector) : Observable<any>{
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + "/" + item.id ).pipe(catchError(this.handleError) )
  }
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "sectors";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<Sector[]> {
    return this.httpCLient.get<Sector[]>(this.baseURL, {
      params: new HttpParams()
        .set('term', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<Sector[]> {
    return this.httpCLient.get<Sector[]>(this.baseURL + "/getAll");
  }
 
}
