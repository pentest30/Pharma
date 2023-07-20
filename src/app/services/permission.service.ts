import { Injectable } from '@angular/core';
import { ActionsPermissions } from '../product/prodcut-models/product.permission';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private CATALOG_MODULE: string = "catalog";
  private INVENTORY_MODULE: string = "inventory";
  private MEMBERSHIP_MODULE: string = "membership";
  private SALES_MODULE: string = "sales";
  private CUSTOMERS_MODULE: string = "customers";
  private ONLINESTORE_MODULE: string = "onlinestore";
  constructor(private _auth: AuthService) {

  }
  // une fonction qui sert a gérer les permissions du module catalog
  public getCatalogModulePermissions(): ActionsPermissions {
    var perm = new ActionsPermissions();
    // si l'utilisateur n'est pas authentifier on retourne new ProductPermissions()
    if (!this._auth.isAuthenticated())
      return perm;

    this.getActionsPermissions(perm, this.CATALOG_MODULE);

    var roles = this._auth.profile["role"];
    var buyerGroupRole = this.isArray(roles) ? roles.filter(f => f == "BuyerGroup")[0] : roles;
    var buyerRole = this.isArray(roles) ? roles.filter(f => f == "Buyer")[0] : roles;
    var technicalDirectorGroupRole = this.isArray(roles) ? roles.filter(f => f == "TechnicalDirectorGroup")[0] : roles
    var technicalDirectorRole = this.isArray(roles) ? roles.filter(f => f == "TechnicalDirector")[0] : roles

    // si le role == TechnicalDirectorGroup l'utilisateur peut créer, modifier , supprimer et valider un produit .
    if (technicalDirectorGroupRole != undefined && technicalDirectorGroupRole == "TechnicalDirectorGroup") {

      perm.canCreate = true;
      perm.canUpdate = true;
      perm.canDelete = true;
      perm.canRead = true;
      perm.canActivate = true;
    }
    // si le role == buyerGroup l'utilisateur peut créer un produit en mode brouillon.
    if (buyerGroupRole != undefined && buyerGroupRole == "BuyerGroup") {

      perm.canCreateDraft = true;
      perm.canUpdateDraft = true;
      perm.canDeleteDraft = true;
      perm.canRead = true;
    }
    if ((buyerRole != undefined && buyerGroupRole == "Buyer") || (technicalDirectorRole != undefined && technicalDirectorRole == "TechnicalDirector")) {

      perm.canRead = true;
    }
    console.log(perm);

    //sinon il peut rien faire.
    return perm;

  }
  private getActionsPermissions(perm: ActionsPermissions, module: string) {
    var permissions = this._auth.profile[module];
    // on doit parcourir les permissions d'utilisateur en premier lieu
    if (permissions != undefined) {

      var create = this.isArray(permissions) ? permissions.filter(f => f == "create")[0] : permissions;
      var update = this.isArray(permissions) ? permissions.filter(f => f == "update")[0] : permissions;
      var remove = this.isArray(permissions) ? permissions.filter(f => f == "delete")[0] : permissions;
      var read = this.isArray(permissions) ? permissions.filter(f => f == "read")[0] : permissions;

      perm.canCreate = create != undefined && create == "create";
      perm.canUpdate = update != undefined && update == "update";
      perm.canDelete = remove != undefined && remove == "delete";
      perm.canRead = read != undefined && read == "read";
      //return perm;
    }

  }

  public getMembershipModulePermissions(): ActionsPermissions {
    
    var perm = new ActionsPermissions();

    // si l'utilisateur n'est pas authentifier on retourne new ActionsPermissions()
    if (!this._auth.isAuthenticated())
      return perm;

    this.getActionsPermissions(perm, this.MEMBERSHIP_MODULE);
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "SuperAdmin")[0] : roles;
    var adminRole = this.isArray(roles) ? roles.filter(f => f == "Admin")[0] : roles;
    
    // convertir le role en permissions
    // si le role == superAdminRole / adminRole l'utilisateur peut créer, modifier , supprimer et valider un utilisateur / role .
    if ((superAdminRole != undefined && superAdminRole == "SuperAdmin") || (adminRole != undefined && adminRole == "Admin")) {
      perm.canCreate = true;
      perm.canUpdate = true;
      perm.canDelete = true;
      perm.canRead = true;
      perm.canActivate = true;
    }
    return perm;
  }
  public isSuperAdmin(): boolean {
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "SuperAdmin")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "SuperAdmin");
  }
  public isSalesManager(): boolean {
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "SalesManager")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "SalesManager");
  }
  public isSalesPerson(): boolean {
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "SalesPerson")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "SalesPerson");
  }
  public isBuyer(): boolean {
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "Buyer")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "Buyer");
  }
  public isDt(): boolean {
    console.log(this._auth.profile);
    
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "TechnicalDirector")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "TechnicalDirector");
  }
  public isDtGroup(): boolean {
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "TechnicalDirectorGroup")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "TechnicalDirectorGroup");
  }
  public isSupervisor(): boolean {
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "Supervisor")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "Supervisor");
  }
  public isBuyerGroup(): boolean {
    var roles = this._auth.profile["role"];
    var superAdminRole = this.isArray(roles) ? roles.filter(f => f == "BuyerGroup")[0] : roles;
    return (superAdminRole != undefined && superAdminRole == "BuyerGroup");
  }
  public getOrganizationId(): string {
    if (this._auth) {
      console.log("organizationId = " + this._auth.profile["organizationId"]);
      return this._auth.profile["organizationId"];
    }
  }
  public getUserId(): string {
    return this._auth.profile["sub"];

  }
  public getModules(): any[] {
    let modules: string[] = [this.CATALOG_MODULE, this.MEMBERSHIP_MODULE, this.SALES_MODULE, this.CUSTOMERS_MODULE, this.INVENTORY_MODULE];
    return modules;
  }
  isArray(value) {
    if (value) {
      if (typeof value === 'object') {
        return (Object.prototype.toString.call(value) == '[object Array]')
      }
    }
    return false;
  }
}
