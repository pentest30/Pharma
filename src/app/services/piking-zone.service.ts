import { PickingZone } from './../picking-zone/models/picking-zeone';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class PickingZoneService extends BaseService{
 
  delete(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  update(value: PickingZone) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + value.id , value).pipe(catchError(this.handleError) );
  }
  add(value: PickingZone) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    value.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , value).pipe(catchError(this.handleError) );
  }

  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "pickingZones";
  }
  get(filter: string, sort: string, page: number, pageSize: number): Observable<PickingZone[]> {
    return this.httpCLient.get<PickingZone[]>(this.baseURL, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAll(): Observable<PickingZone[]> {
    return this.httpCLient.get<PickingZone[]>(this.baseURL + "/getAll");
  }
  async setZoneStore() {
    let response = await this.httpCLient.get<PickingZone[]>(this.baseURL + "/getAll").toPromise();
  } 
}
