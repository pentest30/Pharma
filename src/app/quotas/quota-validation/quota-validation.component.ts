import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditSettingsModel, GridComponent, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';
import { QuotaService } from 'src/app/services/quota.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { Quota } from '../Models/quota.model';

@Component({
  selector: 'app-quota-validation',
  templateUrl: './quota-validation.component.html',
  styleUrls: ['./quota-validation.component.sass']
})
export class QuotaValidationComponent implements OnInit {
  qntQuota : number;
  productId: string;
  productCode : string;
  productName : string;
  requestId:string;
  customerName : string;
  customerCode : string;
  public editOptions: EditSettingsModel;
  items : any[];
  changedItems : any[];
  selectedrowindex: Quota;
  @ViewChild("grid2")
  public grid: GridComponent;
  quantityRules: any;

  constructor(private dialogRef: MatDialogRef<QuotaValidationComponent>,
    private quotaService: QuotaService, private notif: NotificationHelper,
    @Inject(MAT_DIALOG_DATA) data) {
      console.log(data);
      this.qntQuota = data.qnt;
      this.productId =data.productId;
      this.productCode =data.productCode;
      this.productName = data.productName;
      this.requestId = data.requestId;
      this.customerCode = data.customerCode;
      this.customerName = data.customerName;
     }
     customValidationFn (args) {
       console.log(this.selectedrowindex);
       this.selectedrowindex = JSON.parse(localStorage.getItem('selectedrowindex')) as Quota;
       var oldValue =this.selectedrowindex.oldAvailableQuantity;
       console.log(oldValue);

      if(args.value >oldValue){
        return false;
      } else
      return true;
    }
  async  ngOnInit() {
    this.quantityRules = {required:[this.customValidationFn,"Valeur non autorisée"]};
    this.items = await this.quotaService.getQuotabyProductId(this.productId).toPromise();
    if(this.requestId != null){
      this.items.forEach(element =>{
        element.customerName = this.customerName; 
        element.customerCode = this.customerCode;
        element.qntQuota = this.qntQuota;
      })
    }
    this.editOptions = { allowEditing: true, allowAdding: false, allowDeleting: false, mode: 'Normal' };
  }
  rowSelected(args: RowSelectEventArgs) {
    console.log(args);
    setTimeout(() => {
      localStorage.setItem('selectedrowindex', JSON.stringify(args.data));
  }, 10);



  }
  async onQuantityChange(args) {
    let oldQnt = args.rowData.qntQuota;
    if (this.items !=null && args.rowData.oldAvailableQuantity < args.data.qntQuota) {
      this.notif.showNotification('mat-warn',"La quantité doit pas être superieure au quota, Quantité quota restante égale = " +  args.rowData.oldAvailableQuantity ,'top','right');
     var item = this.items.find(x => x.id == args.rowData.id);
     item.qntQuota = oldQnt
     var index = this.items.findIndex(x => x.id == args.rowData.id);
     if(index> -1) {
       (this.grid.dataSource as object[]).splice(index, 1);
       (this.grid.dataSource as object[]).splice(index, 0, item);
       this.grid.refresh();
     }
     return;

    } else {
      if(args.data.qntQuota > 0 && args.data.qntQuota != oldQnt) {
        this.qntQuota= parseInt(args.data.qntQuota) ;
      }
    }
  }
  save(){
    var quotaDetails = [];
    this.items.forEach(element => {
      quotaDetails.push({customerId: element.customerId, quantity : element.qntQuota})
    });
    var command = {requestId:  this.requestId, quotaDetails : quotaDetails}
    console.log(command);
    this.quotaService.validateByCustomer(command).subscribe(result => {
      //console.log(this.quotaId.availableQuantity);
      this.notif.showNotification('mat-success','Validation terminée avec succès','top','right');

      this.dialogRef.close();
    }, (error) => {
      this.notif.showNotification('mat-warn',error,'top','right');


    });
  }
  delete(row) {
    var i = this.items.findIndex(x=>x.id == row.id);
    console.log(i);
    this.items.splice(i,1);
    console.log(this.items);
    this.grid.refresh();
  }

}
