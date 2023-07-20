import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../product/prodcut-models/product';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  SERVER_URL: string = environment.ResourceServer.Endpoint + "catalog";;  
  constructor(private httpClient: HttpClient) { }
  public upload(prodcut : Product,  formData) {

    return this.httpClient.post<any>(this.SERVER_URL + "/"+ prodcut.productClassId  + "/products/" + prodcut.id + "/upload", formData, {  
        reportProgress: true,  
        observe: 'events'  
      });  
  }
}
