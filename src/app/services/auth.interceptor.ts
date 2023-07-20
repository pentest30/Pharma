import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { ActivationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { NotificationHelper } from '../shared/notif-helper';
import { HttpCancelService } from "./httpCancelService";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService, private _router: Router, private notifHelper: NotificationHelper, private httpCancelService: HttpCancelService) {
    this._router.events.subscribe(event => {
      // An event triggered at the end of the activation part of the Resolve phase of routing.
      if (event instanceof ActivationEnd) {
        // Cancel pending calls
        this.httpCancelService.cancelPendingRequests();
      }
    });

  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith(environment.ResourceServer.Endpoint)) {
      var accessToken = this._authService.authorizationHeaderValue;
      // console.log("token"+accessToken);
      const headers = req.headers.set("Authorization", `${accessToken}`);
      const authReq = req.clone({ headers });
      return next.handle(authReq).pipe(
        tap(
          () => { },
          (error: any) => {
            var respError = error as HttpErrorResponse;
            if (respError && (respError.status === 401 || respError.status === 403)) {
              if (this._authService.isAuthenticated()) {
                try {
                  this.notifHelper.showNotification('mat-warn', "vous n'avez pas l'autorisation d'accéder a cette ressource. contactez votre administrateur", 'top', 'right');

                } catch (error) {

                }
                //return
              }

              this._authService.login();
            }
          }
        )
      );
    } else {
      return next.handle(req);
    }
  }
}
