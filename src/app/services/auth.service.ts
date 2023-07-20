import { NgxRolesService } from 'ngx-permissions';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManager, UserManagerSettings, User, WebStorageStateStore } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../shared/base.service';
import { environment } from 'src/environments/environment';
import * as Oidc from 'oidc-client';
import { PickingZoneService } from './piking-zone.service';
import { Roles, rolesTable } from './permissions.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  private manager = new UserManager(getClientSettings());
  user: User | null;
  profile: any;

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private ngxRolesService: NgxRolesService, private http: HttpClient, private zoneService: PickingZoneService,
  ) {
    super();

    this.manager.getUser().then(user => {

      if (user != undefined)
        this.profile = user.profile

      this.setRoles();

      this.user = user;

    });
  }


  login() {
    return this.manager.signinRedirect();
  }

  getUser() {
    return this.manager.getUser().then(user => {
      if (user != undefined)
        this.profile = user.profile

      // set roles
      this.setRoles();

      return this.profile;
    });
  }

  async completeAuthentication() {
    try {
      this.user = await this.manager.signinRedirectCallback();
      this.profile = this.user.profile;

      // set roles
      this.setRoles()

      await this.zoneService.setZoneStore();

    }
    catch (error) {

    }
  }

  private setRoles() {
    const roles: Array<any> = Array.isArray(this.profile.role) ? this.profile.role : [this.profile.role];

    roles.forEach(role => {
      this.ngxRolesService.addRoleWithPermissions(role, rolesTable[role]);
    });
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  get authorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }
  get getToken(): string {
    console.log(this.user);
    return `${this.user.access_token}`;
  }

  get name(): string {
    return this.user != null ? this.user.profile.name : '';
  }

  async signout() {
    localStorage.clear();
    localStorage.removeItem('profile');
    localStorage.removeItem('ordersInEdition');
    await this.manager.signoutRedirect();
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.OpenIdConnect.Authority,
    client_id: environment.OpenIdConnect.ClientId,
    redirect_uri: `${environment.CurrentUrl}auth-callback`,
    post_logout_redirect_uri: `${environment.CurrentUrl}`,
    response_type: "id_token token",
    scope: "openid profile  GHPCommerce.WebApi",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: `${environment.CurrentUrl}silent-refresh.html`,
    userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })
  };
}
