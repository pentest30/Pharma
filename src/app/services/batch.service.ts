import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class BatchService extends BaseService {
  baseURL: string;

  constructor(private httpCLient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "batches";
  }
  GetInternalBatch(supplierId,command):Observable<any> {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.post<any>(this.baseURL + '/' + supplierId + '/internal-batch', command);
  }
}
