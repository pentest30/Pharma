
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";

import { environment } from "src/environments/environment";
import { BaseService } from "../shared/base.service";
@Injectable({
    providedIn: 'root'
  })
export class InventService extends BaseService{
 baseURL: string;
 constructor(private httpCLient : HttpClient) {
  super();
  this.baseURL = environment.ResourceServer.Endpoint + "invents/";
 }   
 getInventsByZone(zoneId, stcokStateId): Observable<any[]> {
    let url = this.baseURL +  zoneId+"/" +stcokStateId;
    return this.httpCLient.get<any[]>(url);

  }
}