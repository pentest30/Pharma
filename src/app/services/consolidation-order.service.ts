import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class ConsolidationOrderService extends BaseService {

  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "consolidationOrders";
  }

  add(command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + '/', command).pipe(catchError(this.handleError));
  }
  update(command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL, command).pipe(catchError(this.handleError));
  }
  getById(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + '/' + id).pipe(catchError(this.handleError));
  }
  getByBarcode(barcode) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + '/' + barcode + '/barcode').pipe(catchError(this.handleError));
  }
  print(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/print/' + id, null).pipe(catchError(this.handleError));
  }
  getByOrderId(orderId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + '/byOrder/' + orderId).pipe(catchError(this.handleError));
  }
}
