import { Manufacturer } from './../manufacturer/models/manufacturer-model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class ManufacturerService extends BaseService{
  deleteManufacturer(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpClient.delete(this.baseURL + "/" + id  ).pipe(
      catchError(this.handleError)
       )
  }

  getAll(): Observable<Manufacturer[]> {
    return this.httpClient.get<Manufacturer[]>(this.baseURL + "/getAll");
  }
  getManufacturers(filter: string, sortDirection: string, pageIndex: number, pageSize: number) : Observable<Manufacturer[]>{
    return this.httpClient.get<Manufacturer[]>(this.baseURL, {params : new  HttpParams() 
      .set('filter', filter)
      .set('sort', sortDirection)
     .set('page', pageIndex.toString())
     .set('pageSize', pageSize.toString()) });
  }
  baseURL : string;
  constructor(private httpClient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint +  "manufacturers";
  }
  
  addManufacturer(manufacturer: Manufacturer){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    // manufacturer.id = uuid.v4();
    console.log(manufacturer);
    return this.httpClient.post(this.baseURL , manufacturer).pipe(catchError(this.handleError) )
  }
  updateManufacturer(manufacturer: Manufacturer){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL + "/" +manufacturer.id  , manufacturer).pipe(catchError(this.handleError) )
  }
  
}
