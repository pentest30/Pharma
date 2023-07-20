import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class PreparationOrdersService extends BaseService {



  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "preparationOrders";
  }

  print(orderIds: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/print', orderIds).pipe(catchError(this.handleError));
  }
  printBl(id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/printBl/' + id, {}).pipe(catchError(this.handleError));
  }
  PrintBulkBl(Ids: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/printBulkBl', Ids).pipe(catchError(this.handleError));
  }
  printPendingBl(filters) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/printBulkPendingBl', filters).pipe(catchError(this.handleError));
  }
  update(command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + '/' + command.id, command).pipe(catchError(this.handleError));
  }
  getById(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + '/' + id).pipe(catchError(this.handleError));
  }
  getBlByOrder(orderId: any, pickingZoneId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + '/order/' + orderId + '/pickingZone/' + pickingZoneId).pipe(catchError(this.handleError));
  }
  consolidate(command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/consolidate', command).pipe(catchError(this.handleError));
  }
  addAgents(command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/addOpAgents', command).pipe(catchError(this.handleError));
  }
  getControlledByBarcode(barcode: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL + '/controlled/' + barcode + '/barcode').pipe(catchError(this.handleError));
  }
  GetAllOpByOrder(orderId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<any>(this.baseURL + '/AllOpByOrder/' + orderId).pipe(catchError(this.handleError));
  }

  /* getAll by barcode */
  getAll(barcode, body) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL + '/consolidation/search', body, {
      headers: { 'barcode': barcode }
    }).pipe(catchError(this.handleError));
  }
  getByBarCode(barcode: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get(this.baseURL+'/'+barcode+'/barcode' ).pipe(catchError(this.handleError) );
  }
  controlOp(id) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL+'/'+id+'/control-op', {} ).pipe(catchError(this.handleError) );
  } 
}
