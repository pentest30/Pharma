import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaxGroup } from '../tax-group/models/tax-group';
import * as uuid from 'uuid';
import { catchError } from 'rxjs/operators';
import { BaseService } from '../shared/base.service';
@Injectable({
  providedIn: 'root'
})
export class TaxGroupService extends BaseService{
  deleteTaxGroup(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.httpCLient.delete(this.baseURL + "/" + id  ).pipe(catchError(this.handleError) )
  }
  baseURL = "";
  constructor(private httpCLient: HttpClient) {
    super();
    this.baseURL = environment.ResourceServer.Endpoint + "taxGroups";
  }
  addTaxGroup(taxGroup: TaxGroup){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    taxGroup.id = uuid.v4();
    return this.httpCLient.post(this.baseURL , taxGroup).pipe(catchError(this.handleError) )
  }
  updateTaxGroup(taxGroup: TaxGroup){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpCLient.put(this.baseURL+"/" + taxGroup.id , taxGroup).pipe(catchError(this.handleError) )
  }
  getTaxGroups(filter: string, sort: string, page: number, pageSize: number): Observable<TaxGroup[]> {
    return this.httpCLient.get<TaxGroup[]>(this.baseURL, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
   
  }
  getAll(): Observable<TaxGroup[]> {
    return this.httpCLient.get<TaxGroup[]>(this.baseURL + "/getAll");
  }
 
}
