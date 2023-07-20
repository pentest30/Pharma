import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Pharmacological } from '../pharmacological-class/models/pharmacological-model';
import { environment } from 'src/environments/environment';


import * as uuid from 'uuid';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PharmacologicalService {
    delete(id: any) {
      let header = new HttpHeaders();
      header.append('Content-Type', 'applications/json');
    
      //this.dataUpdatedOnDB.next(therapeuticClass.id);
      return this.httpCLient.delete(this.baseURL + "/" +id).pipe(catchError(this.handleError) )
    }
    updatePharmacologicalClass(value: Pharmacological) {
        let header = new HttpHeaders();
        header.append('Content-Type', 'applications/json');
      
        //this.dataUpdatedOnDB.next(therapeuticClass.id);
        return this.httpCLient.put(this.baseURL + "/" +value.id , value).pipe(catchError(this.handleError) )
    }
    addPharmacologicalClass(pharmaClass: any) {
        let header = new HttpHeaders();
        header.append('Content-Type', 'applications/json');
        pharmaClass.id = uuid.v4();
        //this.dataUpdatedOnDB.next(therapeuticClass.id);
        return this.httpCLient.post(this.baseURL , pharmaClass).pipe(catchError(this.handleError) )
    }
    baseURL = "";
    constructor(private httpCLient : HttpClient){
        this.baseURL = environment.ResourceServer.Endpoint +  "pharmacologicalClass";
    }
    getPharmacologicalsses(filter : string, sort : string , page: number, pageSize: number) : Observable<Pharmacological[]> {
        return this.httpCLient.get<Pharmacological[]>(this.baseURL,{params : new  HttpParams() 
            .set('filter', filter)
            .set('sort', sort)
           .set('page', page.toString())
           .set('pageSize', pageSize.toString()) })
    }
    getAll(): Observable<Pharmacological[]> {
      return this.httpCLient.get<Pharmacological[]>(this.baseURL + "/getAll");
    }
    handleError(handleError) {
        let errorMessages  = ""
        if (handleError.error instanceof ErrorEvent) {
          // client-side error
          errorMessages = `Error: ${handleError.error.message}`;
        } else {
          // server-side error
         
          let errors = handleError.error.errors.ErrorMessages;
         
          errors.forEach( (element : any)=> {
            errorMessages = errorMessages + "-" + element + "\n"
          });
          //console.log(errorMessages);
          
          
        }
        //window.alert(errorMessages);
        return throwError(errorMessages);
      }

}