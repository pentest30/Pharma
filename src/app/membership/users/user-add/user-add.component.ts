import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from 'src/app/services/customer.service';
import { PermissionService } from 'src/app/services/permission.service';
import { RoleService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Customer } from 'src/app/tiers/customer/models/customer-model';
import { ClaimModel, UserApp } from '../../models/user-app';
import { UserPermission } from '../../models/user-claim';
import { Role } from '../../models/user-role';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.sass']
})
export class UserAddComponent implements OnInit {

  public userName: string;
  public email: string;
  public id: string;
  public emailConfirmed: boolean = true;
  public phoneNumber: string;
  public lastName: string;
  public firstName: string;
  public password: string;
  public modalTitle: string;
  public modules: any[] = [];
  public supervisors: any[] = [];
  public userPermissions: UserPermission[] = [];
  public roles: Role[] = [];
  public organizations: Customer[] = [];
  userRoles: string[] = [];
  submitted = false;
  public organizationId:string;
  public managerId:string;
  public form: FormGroup;
  public isSuperAdmin:boolean;
  constructor(public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private service: UserService,
    private roleService: RoleService,
    private notifHelper: NotificationHelper,
    private permService: PermissionService,
    private customerService:CustomerService) {
    this.modules = this.permService.getModules();
    this.isSuperAdmin=this.permService.isSuperAdmin();
    this.managerId = data.managerId;
    if(data.organizationId != null )
    {
      this.organizationId=data.organizationId;    
    }
    else
    {
      if(!this.isSuperAdmin)
      this.organizationId=permService.getOrganizationId();
    }
    if(data.id!=null &&data.claims!=undefined) {
      for (let index = 0; index < this.modules.length; index++) {
        const module = this.modules[index];
        var perms = data.claims.filter(c => c.type == module);        
        if (perms != undefined && perms.length > 0) {
          var item = new UserPermission();
          item.module = module;
          for (let index = 0; index < perms.length; index++) {
            const permission = perms[index];
            if (permission.value == "create") item.create = true;
            if (permission.value == "update") item.update = true;
            if (permission.value == "delete") item.delete = true;
            if (permission.value == "read") item.read = true;
          }
          this.userPermissions.push(item);
        }
  
      }
    }
    this.id = data.id;
    this.userName = data.userName;
    this.email = data.email;
    this.userRoles = data.userRoles != undefined ? data.userRoles : [];
    this.emailConfirmed = data.emailConfirmed;
    this.phoneNumber = data.phoneNumber;
    if (data.id == null)
      this.modalTitle = "Créer";
    else this.modalTitle = "Modifier";
  }

  ngOnInit(): void {
    //this.userRoles = [];
    this.roleService.getAll().subscribe(resp => {
      this.roles = resp;

    });
    this.customerService.getAll().subscribe(resp=>this.organizations=resp);
    this.service.getSupervisors().subscribe(resp => this.supervisors = resp);
    if(!this.id)this.createFrom();
    else this.createFromForUpdate();
  }
  
  onSelectRole($evt) {
    this.userRoles = $evt;
   


  }
  openDialog() {
    this.userPermissions.push(new UserPermission());


  }
  delete(row) {
    this.userPermissions.forEach((item, index) => {
      if (item === row) {
        this.userPermissions.splice(index, 1);
        return;
      }
    });
  }
  save() {

    if (this.form.invalid) return;
    if (this.form.value.id == null) {
      var user = new UserApp();
      user.userName = this.form.value.userName;
      user.emailConfirmed = this.form.value.emailConfirmed;
      user.phoneNumber = this.form.value.phoneNumber;
      user.firstName = this.form.value.firstName;
      user.lastName = this.form.value.lastName;
      user.phoneNumber = this.form.value.phoneNumber;
      user.email = this.form.value.email;
      user.userRoles = this.userRoles;
      user.organizationId=this.form.value.organizationId;
      user.managerId=this.form.value.managerId;
      user.password = this.form.value.password;
      this.setPermissions(user);

      this.add(user);

    }
    else {
      var user = this.form.value as UserApp;
      user.userRoles = this.userRoles;
      user.claims = [];
      this.setPermissions(user);
      this.update(this.form.value);
    }
  }
  private setPermissions(user: UserApp) {
    for (let index = 0; index < this.userPermissions.length; index++) {
      const element = this.userPermissions[index] as UserPermission;
      if(element == undefined) break;
      if (element.create)
        this.addtClaim(element, user, "create");
      if (element.read)
        this.addtClaim(element, user, "read");
      if (element.update)
        this.addtClaim(element, user, "update");
      if (element.delete)
        this.addtClaim(element, user, "delete");

    }
  }

  private addtClaim(element: UserPermission, user: UserApp, name: string) {
    var claim = new ClaimModel();
    claim.type = element.module;
    claim.value = name;
    user.claims.push(claim);

  }

  update(value: UserApp) {
    this.service.update(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  add(value: UserApp) {
    this.service.add(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  close() {
    this.dialogRef.close();
  }
  private createFrom() {
    this.form = this.fb.group({
      userName: [this.userName, [Validators.required]],
      id: [this.id, []],
      email: [this.email, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$")]],
      emailConfirmed: [this.emailConfirmed, []],
      phoneNumber: [this.phoneNumber, []],
      firstName: [this.firstName, []],
      lastName: [this.lastName, []],
      managerId:[this.managerId,[]],
      userRoles : [this.userRoles],
      password : [this.password,[Validators.required]],
      organizationId:[this.organizationId,[]]
    });
  }
  private createFromForUpdate() {
    this.form = this.fb.group({
      userName: [this.userName, [Validators.required]],
      id: [this.id, []],
      email: [this.email, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      emailConfirmed: [this.emailConfirmed, []],
      phoneNumber: [this.phoneNumber, []],
      firstName: [this.firstName, []],
      lastName: [this.lastName, []],
      managerId:[this.managerId,[]],
      userRoles : [this.userRoles],
      organizationId:[this.organizationId,[]]
    });
  }

}
