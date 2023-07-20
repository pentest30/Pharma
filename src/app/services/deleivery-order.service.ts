import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreateDeleiveryOrderCommand } from '../preparation-orders/models/DeleiveryOrder';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class DeleiveryOrderService extends BaseService{
  baseURL : string;
  customerUrl : string;

  constructor(private httpClient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint +  "deleivery-orders";
  }
  add(command: CreateDeleiveryOrderCommand) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL, command).pipe(catchError(this.handleError) );
  }
  getById(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.get(this.baseURL+'/'+id ).pipe(catchError(this.handleError) );
  }
}
