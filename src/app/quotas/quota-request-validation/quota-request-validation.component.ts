import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InventSumService } from 'src/app/services/inventory.service';
import { QuotaService } from 'src/app/services/quota.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Quota } from '../Models/quota.model';
import { ReservedQuota } from '../Models/reserved.quota.model';

@Component({
  selector: 'app-quota-request-validation',
  templateUrl: './quota-request-validation.component.html',
  styleUrls: ['./quota-request-validation.component.sass']
})
export class QuotaRequestValidationComponent implements OnInit {
public productCode: string;
public qntQuota: number = 0;
public productName : string ;
public availableQnt : number = 0;
  productId: any;
  requestId: any;
  customerId: string;
  customerName: string;
  customerCode: string;
constructor(private dialogRef: MatDialogRef<QuotaRequestValidationComponent>,
  private quotaService: QuotaService, 
  private notif: NotificationHelper,
  private inventService : InventSumService,
  @Inject(MAT_DIALOG_DATA) data) {
    this.qntQuota = data.qnt;
    this.productId =data.productId;
    this.productCode =data.productCode;
    this.productName = data.productName;
    this.requestId = data.requestId;
    this.customerCode =data.customerCode;
    this.customerName = data.customerName;
   }

  async ngOnInit() {
    this.availableQnt =await this.inventService.getAvailableQnt(this.productId).toPromise();
  }

    async save() {
      if(this.qntQuota > this.availableQnt) {
        this.notif.showNotification('mat-warn',"Le quota est superieur à la quantité disponible.",'top','right');
        return;
      }
      let command = new ReservedQuota();
      command.quantityReserved = 0;
      command.productId = this.productId;
      command.requestId =  this.requestId;
        var quota = new Quota();
        quota.productId = this.productId;
        quota.productName =  this.productName;
        quota.productCode =  this.productCode;
        quota.quotaDate = new Date();
        quota.customerCode = this.customerCode;
        quota.customerName = this.customerName;
        quota.initialQuantity = this.qntQuota;
       
        command.quotas.push(quota);
        command.quantityReserved +=quota.initialQuantity;
     this.quotaService.post(command).subscribe(result => {
        //console.log(this.quotaId.availableQuantity);
        this.notif.showNotification('mat-success','Remise mise à jour avec succès','top','right');
       
      }, (error) => {
        this.notif.showNotification('mat-warn',error,'top','right');
       
      });  
      
      this.dialogRef.close();
  }

}
