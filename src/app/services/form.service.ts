import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

import * as uuid from 'uuid';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Form } from '../form/models/form-model';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class FormService extends BaseService{
  delete(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  updateForm(value: Form) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  addForm(value: Form) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "forms";
  }
  getForms(filter: string, sort: string, page: number, pageSize: number): Observable<Form[]> {
    return this.httpCLient.get<Form[]>(this.baseURL, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<Form[]> {
    return this.httpCLient.get<Form[]>(this.baseURL + "/getAll");
  }
  
}
