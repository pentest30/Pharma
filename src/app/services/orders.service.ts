import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Order } from '../sales/sales-models/Order';
import { BaseService } from '../shared/base.service';
import * as uuid from 'uuid';
import { ChangeExtraDiscountCommand, ChangePaymentStateCommand, OrderItem, OrderItemCreateCommand, OrderItemDeleteCommand, UpdateOrderDiscountCommandV2 } from '../sales/sales-models/orderItem';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends BaseService{
 
  baseURL : string;
  customerUrl : string;

  constructor(private httpClient: HttpClient) { 
    super();
    this.baseURL = environment.ResourceServer.Endpoint +  "orders";
    this.customerUrl = environment.ResourceServer.Endpoint +  "customer";
  }

  get(filter: string, sort: string, page: number, pageSize: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseURL, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }
  getAllPendingOrdersForSupervisor(): Observable<Order[]> {
    let url =  environment.ResourceServer.Endpoint +  "supervisor";
    return this.httpClient.get<Order[]>(url+'/orders/all-pending-orders').pipe(catchError(this.handleError) );
  }
  getAllPendingOrdersDetails(): Observable<Order[]> {
    let url =  environment.ResourceServer.Endpoint +  "cached-orders";

    return this.httpClient.get<Order[]>(url+'/pending-detail').pipe(catchError(this.handleError) );
  }
  add(orderId, orderItem: OrderItemCreateCommand) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL+'/'+orderId+'/items/' , orderItem).pipe(catchError(this.handleError) );
  }

  updateItem(orderId, orderItem: OrderItemCreateCommand) {
    return this.httpClient.put(this.baseURL+'/'+orderId+'/items/' , orderItem).pipe(catchError(this.handleError) );
  }
  updateItemV2(orderId, orderItem: OrderItemCreateCommand) {
    return this.httpClient.put(this.baseURL+'/'+orderId+'/items/sales-person' , orderItem).pipe(catchError(this.handleError) );
  }
  updateSpecialOrder(orderId,customerid) {
    return this.httpClient.put(this.baseURL+'/'+orderId+'/special-order/'+customerid, null ).pipe(catchError(this.handleError) );
  }

  getPendingOrderSupplier(supplierId) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'customer';
    return this.httpClient.get(this.customerUrl+'/'+supplierId+'/orders/pending').pipe(catchError(this.handleError) );
  }

  getAllPendingOrderSupplier(supplierId) : Observable<Order[]>{
    this.customerUrl = environment.ResourceServer.Endpoint + 'customer';
    return this.httpClient.get<Order[]>(this.customerUrl+'/'+supplierId+'/pending-orders/all').pipe(catchError(this.handleError) );
  }
  GetSalesPersonPendingOrder(orderId, customerId, salesPersonId) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'salesperson';
    return this.httpClient.get(this.customerUrl+'/'+orderId+'/'+customerId+'/'+salesPersonId+'/orders/pending').pipe(catchError(this.handleError) );
  }
  GetSalesPersonPendingOrderV2(customerId) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'salesperson';
    return this.httpClient.get(this.customerUrl+'/'+customerId+'/orders/pending/v2').pipe(catchError(this.handleError) );
  }
  GetSalesPersonPendingOrders(customerId) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'salesperson';
    return this.httpClient.get(this.customerUrl+'/'+customerId+'/orders/pending-orders').pipe(catchError(this.handleError) );
  }
  cancelOrder(orderId,supplierId) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'suppliers';
    return this.httpClient.delete(this.customerUrl+'/'+supplierId+'/orders/'+orderId).pipe(catchError(this.handleError) );
  }
  cancelPendingOrder(order) {
    return this.httpClient.put(this.baseURL+'/'+order.id+'/remove-pending',order).pipe(catchError(this.handleError) );
  }
  update(orderId, order:Order) {
    return this.httpClient.put(this.baseURL+'/'+orderId,order ).pipe(catchError(this.handleError) );
  }
  send(order) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'suppliers';
    return this.httpClient.put(this.customerUrl+'/'+order.supplierId+'/orders/'+ order.id+'/send',order ).pipe(catchError(this.handleError) );
  }
 empytOrder(order) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'suppliers';
    return this.httpClient.put(this.customerUrl+'/'+order.supplierId+'/orders/'+ order.id+'/cancel', null ).pipe(catchError(this.handleError) );
  } 

  deleteOrderItem(orderId, orderItem: OrderItemDeleteCommand) {
    return this.httpClient.post(this.baseURL+'/'+orderId + '/deleteItem',orderItem).pipe(catchError(this.handleError) );
  }

  GetOrderById(orderId) {
    return this.httpClient.get(this.baseURL+'/'+orderId).pipe(catchError(this.handleError) );
  }
  GetOrderByIdV1(orderId) {
    return this.httpClient.get(this.baseURL+'/'+orderId+'/v1').pipe(catchError(this.handleError) );
  }
  GetOrdersForSalesCustomer(supplierId:string,filter: string, sort: string, page: number, pageSize: number) {
    this.customerUrl = environment.ResourceServer.Endpoint + 'suppliers/'+supplierId+'/orders';
    return this.httpClient.get<Order[]>(this.customerUrl, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sort', sort)
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
    })
  }

  ChangeState(model) {
    return this.httpClient.put(this.baseURL+'/'+model.id + '/changeState', model).pipe(catchError(this.handleError) );

  }
  ChangePaymentState(model : ChangePaymentStateCommand) {
    return this.httpClient.put(this.baseURL+'/'+model.id + '/paid', model).pipe(catchError(this.handleError) );
  }
  updateExtraDiscount(model : ChangeExtraDiscountCommand) {

    return this.httpClient.put(this.baseURL+'/'+model.id + '/extra-discount', model).pipe(catchError(this.handleError) );
  }
  applyMultiDiscount(model : UpdateOrderDiscountCommandV2) {

    return this.httpClient.put(this.baseURL+'/'+model.id + '/discounts/multi', model).pipe(catchError(this.handleError) );
  }
  getProductHistoryOrders(customerId, productCode) {
    return this.httpClient.get(this.baseURL+'/'+customerId + '/order-items/'+productCode).pipe(catchError(this.handleError) );
  }
  getAllOrdersFrocustomer(customerId) : Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseURL+'/'+customerId + '/all/').pipe(catchError(this.handleError) );
  }
  printOrder(id) : Observable<any> {
    return this.httpClient.post(this.baseURL+'/'+id + '/print/',null, { responseType: 'blob'});
  }
  generateOps(command:any): Observable<any>
  {
    let header = new HttpHeaders();
    header.append('Content-Type', 'applications/json');
    return this.httpClient.post(this.baseURL + '/generate-op', command).pipe(catchError(this.handleError));

  }
  getAllReservedQuantities() : Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseURL+ '/all-reserved-qnt/').pipe(catchError(this.handleError) );
  }
}
