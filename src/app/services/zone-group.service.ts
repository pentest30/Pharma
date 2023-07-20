import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import { ZoneGroup } from '../zone-group/models/ZoneGroup';
import * as uuid from 'uuid';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneGroupService  extends BaseService {

  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "zoneGroups";
  }
  addZoneGroup(zoneGroup: ZoneGroup){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    zoneGroup.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , zoneGroup).pipe(catchError(this.handleError) )
  }
  updateZoneGroup(zoneGroup: ZoneGroup){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL+"/" + zoneGroup.id , zoneGroup).pipe(catchError(this.handleError) )
  }
  deleteZoneGroup(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  getAll(): Observable<ZoneGroup[]> {
    return this.httpCLient.get<ZoneGroup[]>(this.baseURL + "/getAll");
  }
}


