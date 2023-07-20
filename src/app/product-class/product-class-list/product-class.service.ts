
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ProductClass } from '../models/product-class-model';
import { environment } from "src/environments/environment";
import * as uuid from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class ProductClassService {
  private readonly baseURL: string;
  constructor(private http: HttpClient) {
    this.baseURL = environment.ResourceServer.Endpoint +  "catalog";
  }
   getProductClasses( filter = '', sortOrder = 'asc', page : number , pageSize : number ) : Observable<ProductClass []> {
     return this.http.get<ProductClass[]>(this.baseURL, {params : new  HttpParams() 
      .set('filter', filter)
      .set('sort', sortOrder)
     .set('page', page.toString())
     .set('pageSize', pageSize.toString()) });
  }
   getAllProductClasses() : Observable<ProductClass []> {
    return this.http.get<ProductClass[]>(this.baseURL+"/getall");
  }
   addProductClass(productClass: ProductClass){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    productClass.id = uuid.v4();
    return this.http.post(this.baseURL , productClass).pipe(catchError(this.handleError) )
   }
   updateProductClass(productClass: ProductClass){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.http.put(this.baseURL + "/" + productClass.id  , productClass).pipe(catchError(this.handleError) )
   }
   deleteProductClass(productClassId :  string){
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    
    return this.http.delete(this.baseURL + "/" + productClassId  ).pipe(catchError(this.handleError) )
   }
   handleError(error) {
    
    let errorMessages  = ""
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessages = `Error: ${error.error.message}`;
    } else {
      // server-side error
     
      let errors = error.error.errors.ErrorMessages;
     
      errors.forEach( (element : any)=> {
        errorMessages = errorMessages + "-" + element + "\n"
      });
      //console.log(errorMessages);
      
      
    }
    //window.alert(errorMessages);
    return throwError(errorMessages);
  }
}
