import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreateSupplierOrderItem } from '../procurment/models/SupplierOrderItem';
import { BaseService } from '../shared/base.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService extends BaseService{
 
  
  baseURL : string;
  customerUrl : string;

  constructor(private httpClient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint +  "supplier-orders";
  }

 

  createSupplierOrderItem(orderId, supplierOrderItem: CreateSupplierOrderItem) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL+'/'+orderId+'/items/' , supplierOrderItem).pipe(catchError(this.handleError) );
  }
  getAllValidOrders(supplierId: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.get(this.baseURL+'/'+supplierId+'/all/' ).pipe(catchError(this.handleError) );  
  }
  getAllCompletedOrders(supplierId: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.get(this.baseURL+'/'+supplierId+'/complete/' ).pipe(catchError(this.handleError) );  
  }
  getPendingSuppliersOrders(supplierOrganizationId: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.get(this.baseURL+'/'+supplierOrganizationId+'/pending-orders/' ).pipe(catchError(this.handleError) );  
  }
  deletePendingOrder(orderId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.delete(this.baseURL+'/'+ orderId ).pipe(catchError(this.handleError) );
  }
  getById(id: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.get(this.baseURL+'/'+id).pipe(catchError(this.handleError) );    
  }
  SaveOrder(orderId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ orderId +'/save',null).pipe(catchError(this.handleError) );   
  }
  updateOrder(orderId, model) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ orderId ,model).pipe(catchError(this.handleError) );
  }
  deleteOrderItem(orderId,  productId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.delete(this.baseURL+'/'+ orderId + '/items/' + productId).pipe(catchError(this.handleError) );
  }
  deleteOrder(orderId) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.delete(this.baseURL+'/'+ orderId + '/remove-saved').pipe(catchError(this.handleError) );
  }
  validateOrder(orderId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ orderId + '/validate', null).pipe(catchError(this.handleError) );
  }
  rejectOrder(orderId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ orderId + '/reject', null).pipe(catchError(this.handleError) );
  }
  backToSavedStatus(orderId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ orderId + '/back-to-saved', null).pipe(catchError(this.handleError) );
  }
  finishOrder(orderId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ orderId + '/complete-status', null).pipe(catchError(this.handleError) );
  }
  cancelOrder(orderId: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.put(this.baseURL+'/'+ orderId + '/cancel', null).pipe(catchError(this.handleError) );
  }
  printOrder(orderIds: any) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL+'/print', orderIds ).pipe(catchError(this.handleError) );
  }
}
