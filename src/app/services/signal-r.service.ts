import { Injectable, EventEmitter } from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { HubConnectionState } from "@aspnet/signalr";
import { Observable, Subject } from "rxjs";
//import { SignalViewModel } from "../models/signal-view-model";
import { environment } from 'src/environments/environment';
import { AuthService } from "./auth.service";
@Injectable({
  providedIn: 'root'
 })
 export class SignalRService {
  private message$: Subject<any>;
  private messagePendingOrderNumber$ : Subject<any>;
  private messageQuota$: Subject<any>;
  private messageProcurement$: Subject<any>;
  private connection: signalR.HubConnection;
  private connection2: signalR.HubConnection;
  private quotaConnection: signalR.HubConnection;
  private procurementConnection : signalR.HubConnection;
  
  constructor(private authService : AuthService) {
    this.message$ = new Subject<any>();
    this.messagePendingOrderNumber$ = new Subject<any>();
    this. messageQuota$ = new Subject<any>();
    this.messageProcurement$ = new Subject<any>();
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(environment.OpenIdConnect.Authority + "hub", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .build();
    this.connect();
    var user = localStorage.getItem('oidc.user');
    this.connection2 = new signalR.HubConnectionBuilder()
    .withUrl(environment.ResourceServer.HubEndPont + "invent-hub", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();
   
    this.quotaConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.ResourceServer.HubEndPont + "quota-hub",  {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory : ()=> {
      
        return this.authService.getToken;
      }

    })
    .build();
    this.procurementConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.ResourceServer.HubEndPont + "procurement-hub",  {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory : ()=> {
       
        return this.authService.getToken;
     
      }

    })
    .build();
    
    this.connect2();
  
    setTimeout(() => {
      this.quotaConnected();
      this.procurementConnected();
    }, 1000);
  
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.connection2.state !== HubConnectionState.Connected) {
        this.connection2.start();
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.procurementConnection.state !== HubConnectionState.Connected) {
        this.procurementConnection.start();
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.quotaConnection.state !== HubConnectionState.Connected) {
        this.quotaConnection.start();
      }
    });
    
  }
  private joinGroup() {
    
    //this.connection.invoke('JoinGroup', this.authService.getUserId());
  }
  private joinQuotaGroup() {
    //this.quotaConnection.invoke('getConnectionId');
  }
  private connect() {
    this.connection.start().finally(this.joinGroup).catch(err => console.log(err)); 
    this.connection.on('receiveOrderCreated', (message) => {
      console.log(message);
     
      this.message$.next(message);
    });
  }
  private connect2() {
    this.connection2.start().finally(this.joinGroup).catch(err => console.log(err)); 
    this.connection2.on('productQuantityChanged', (message) => {
      console.log(message);
      this.message$.next(message);
    })
    this.connection2.on('lineQuantityChanged', (message) => {
      this.messagePendingOrderNumber$.next(message);
    })
  }
  getConnectionId () {
    this.quotaConnection.invoke('getConnectionId').then(
      (data) => {
        console.log('idConection', data);
      
      }
    );
  }
  getProcurementConnectionId () {
    this.procurementConnection.invoke('getConnectionId').then(
      (data) => {
        
      }
    );
  }
  public quotaConnected() {
    this.quotaConnection.start()
    .then(() => console.log('Connection started!'))
    .then(() => this.getConnectionId())
    .catch(err => console.log(err)); 
    this.quotaConnection.on('pushQuotaRequestNotification', (message) => {
      this.messageQuota$.next(message);
    });
  }
  public procurementConnected() {
    this.procurementConnection.start()
    .then(() => console.log('Connection started!'))
   // .then(() => this.getProcurementConnectionId())
    .catch(err => console.log(err)); 
    this.procurementConnection.on('getValidationReceiptNotification', (message) => {
      this.messageProcurement$.next(message);
    });
  }
  public getMessage(): Observable<any> {
    return this.message$.asObservable();
  }
  public getPendingOrderMessage(): Observable<any> {
    return this.messagePendingOrderNumber$.asObservable();
  }
  public getQuotaMessage(): Observable<any> {
    return this.messageQuota$.asObservable();
  }
  public getProcurementMessage(): Observable<any> {
    return this.messageProcurement$.asObservable();
  }
  public disconnect() {
    this.connection.stop();
    this.connection2.stop();
    this.procurementConnection.stop();
    this.quotaConnection.stop();
  }
 }