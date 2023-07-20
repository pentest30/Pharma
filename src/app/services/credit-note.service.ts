import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class CreditNoteService extends BaseService {
 
  
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "credit-notes";
  }
  updateCreditNote(id: any,command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + id , command).pipe(catchError(this.handleError) );
  }
  validateCreditNote(id: any,command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL + "/" + id +"/validate/", command).pipe(catchError(this.handleError) );
  }
  getById(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.get<any>(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )  
  }
  delete(command: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.delete(this.baseURL + "/" + command.id).pipe(catchError(this.handleError) )
  }
  
}
