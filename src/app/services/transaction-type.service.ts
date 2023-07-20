import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';
import * as uuid from 'uuid';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TransactionType } from '../transaction-type/models/transactionType';
@Injectable({
  providedIn: 'root'
})
export class TransactionTypeService extends BaseService {

  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "transactionType";
  }
  addTransactionType(command){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    command.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , command).pipe(catchError(this.handleError) )
  }
  updateTransactionType(command){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL+"/" + command.id , command).pipe(catchError(this.handleError) )
  }
  deleteTransactionType(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  getAll(): Observable<TransactionType[]> {
    return this.httpCLient.get<TransactionType[]>(this.baseURL + "/getAll");
  }
}
