import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DciCode } from '../dci-code/dci-code-models/dci-code';
import * as uuid from 'uuid';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class DciCodeService extends BaseService{

  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  update(value: DciCode) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  add(value: DciCode) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "innCodes";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<DciCode[]> {
    return this.httpCLient.get<DciCode[]>(this.baseURL, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<DciCode[]> {
    return this.httpCLient.get<DciCode[]>(this.baseURL + "/getAll");
  }
  
}
