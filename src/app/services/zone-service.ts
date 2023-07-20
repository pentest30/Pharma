import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService  extends BaseService {

  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "inventory/zones";
  }
getAll(): Observable<any[]> {
    return this.httpCLient.get<any[]>(this.baseURL + "/getAll");
  }
}
