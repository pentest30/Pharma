import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITherapeuticClass } from './interfaces/therapeutic-class';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

import * as uuid from 'uuid';
import { BaseService } from '../shared/base.service';
@Injectable({
    providedIn: 'root'
  })
  export class TherapeuticClassService extends BaseService {
    private dataUpdatedOnDB= new Subject<string>();
    dataUpdated$ = this.dataUpdatedOnDB.asObservable();
   deleteTherapeuticClass(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    this.dataUpdatedOnDB.next(id);
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
   }
  updateTherapeuticCLass(therapeuticClass: ITherapeuticClass) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    this.dataUpdatedOnDB.next(therapeuticClass.id);
    return this.httpCLient.put(this.baseURL + "/" + therapeuticClass.id , therapeuticClass).pipe(catchError(this.handleError) )
  }
    private readonly baseURL: string;
    constructor(private httpCLient: HttpClient) {
      super();
      this.baseURL = environment.ResourceServer.Endpoint +  "therapeuticClass";
    }
    addTherapeuticClass(therapeuticClass: ITherapeuticClass){
      let header = new HttpHeaders();
      header.append('Content-Type', 'applications/json');
      therapeuticClass.id = uuid.v4();
      this.dataUpdatedOnDB.next(therapeuticClass.id);
      return this.httpCLient.post(this.baseURL , therapeuticClass).pipe(catchError(this.handleError) )
    }
    getAll(): Observable<ITherapeuticClass[]> {
      return this.httpCLient.get<ITherapeuticClass[]>(this.baseURL + "/getAll");
    }
  
    getTherapeutictClasses(filter ='', sortDirection = '_asc', pageIndex: number, pageSize: number) : Observable<ITherapeuticClass []> {
      return this.httpCLient.get<ITherapeuticClass[]>(this.baseURL, {params : new  HttpParams() 
        .set('filter', filter)
        .set('sort', sortDirection)
       .set('page', pageIndex.toString())
       .set('pageSize', pageSize.toString()) });
  }
  
 
}