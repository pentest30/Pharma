import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class TransferLogService  extends BaseService {
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "transfer-logs";
  }
  add(command){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post(this.baseURL , command).pipe(catchError(this.handleError) )
  }
  update(command){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL+"/" + command.id , command).pipe(catchError(this.handleError) )
  }
  delete(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  getAll(): Observable<any[]> {
    return this.httpCLient.get<any[]>(this.baseURL + "/getAll");
  }
  getById(id): Observable<any> {
    return this.httpCLient.get<any>(this.baseURL + "/" + id);
  }
  validate(id){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL+"/" +id + "/validate" , null).pipe(catchError(this.handleError) )
  }
  save(id){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL+"/" +id + "/save" , null).pipe(catchError(this.handleError) )
  }
  deleteItem(id: any, productId: any, internalBatchNumber) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.delete(this.baseURL+'/'+ id +'/items/'+ productId + '/' + internalBatchNumber).pipe(catchError(this.handleError) );
  }
 
}
