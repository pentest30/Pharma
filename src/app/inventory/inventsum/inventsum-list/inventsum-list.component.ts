import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ConfimDialogComponent, ConfirmDialogModel } from 'src/app/confim-dialog/confim-dialog.component';
import { InventSumService } from 'src/app/services/inventory.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { InventSum } from '../models/inventsum-model';
import { InventSumAddComponent } from '../inventsum-add/inventsum-add.component'; 
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';

@Component({
  selector: 'app-inventsum-list',
  templateUrl: './inventsum-list.component.html',
  styleUrls: ['./inventsum-list.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class InventSumListComponent extends BaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('grid') public grid: GridComponent;
  public data: DataManager;
  gridLines: string;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];
  searchTerms: InventSum;
  advanceSearch : boolean = false;
  public Quotas : string[] = ["Quota" , "Non Quota"];
  public filteringType: Object[] = [
    { Id: 'Menu', type: 'Menu' },
    { Id: 'FilterBar', type: 'FilterBar' }
  ];

// public filterSettings: Object;
  constructor( 
    private service: InventSumService,  
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private _auth: AuthService,
    ) { 
      super(_auth,'inventory/inventsum/');
      this.commandListing = [
       { type: 'None',title:'Editer', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },
       { type: 'None',title:'Réapprovisioner', buttonOption: { iconCss: 'e-icons  e-upload', cssClass: 'e-flat'} },
       { type: 'None',title:'Supprimer', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} },

     ];
    
  }

  ngOnInit(): void {
  
    this.searchTerms=new InventSum();
    this.searchTerms.isPublic=true;
    this.loadData();
    this.filterSettings = { type: 'FilterBar' };
  }
  doFilter(val : any,index:number) {
    switch(index)
    {
      
      case 0:this.searchTerms.productFullName = val;break;
      case 1:this.searchTerms.productCode = val;break;
      case 2:this.searchTerms.internalBatchNumber = val;break;
      case 3:this.searchTerms.vendorBatchNumber = val;break;
      case 4:this.searchTerms.isPublic = val==2?null:val;break;
    }
    
  }

  openDialog(row:InventSum): void {

    const message = "<pre><h5><b>Lot : </b>     " + row.internalBatchNumber + "<br/>"+
    "<b>Lot fournisseur : </b>" + row.vendorBatchNumber + "<br/>"+
    "<b>SHP : " + row.pfs + "<br/>"+
    "<b>PPA(Tout inclus) : </b>" + row.ppaPFS + "<br/>"+
    "<b>PPA(HT) : </b>" + row.ppaHT + "<br/>"+
    "<b>PPA(TTC) : </b>" + row.ppaTTC + "<br/></h5></pre>";
    const dialogData = new ConfirmDialogModel("Informations LOT", message,false,true);
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
  }

  private createModalDialog( item,feed:boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = item;
    dialogConfig.data.feed=feed;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(InventSumAddComponent, dialogConfig);
    modalRef.afterClosed().subscribe(data => {
    });
 }
 getMoreInformation(element:InventSum){
return  "PPA = "+element.ppaPFS+" \n \r SHP = "+element.pfs;
 }
 getBatchDetails(value: InventSum): string {
  return `N° Lot : ${value.internalBatchNumber} ||
      Date de péremption: ${value.expiryDate}  `;
}
   edit (row) { 
     console.log(row);
     this.service.getById(row.id).subscribe(resp=>this.createModalDialog(resp,false)); 
   }
   replinish_consume(row)
   {
    this.service.getById(row.id).subscribe(resp=>this.createModalDialog(resp,true)); 
   }
   async switchState (row ) {
    // await this.service.switchState(row).subscribe(resp=>this.loadDataTable(null))
   }
   delete (row) {
      this.confirmDialog(row);
   }
   confirmDialog(row): void {
      const message = 'Est-vous sûr de bien vouloir épuiser cette dimension' ;
      const dialogData = new ConfirmDialogModel("Confirmation", message);
      const dialogRef = this.dialog.open(ConfimDialogComponent, {
        maxWidth: "400px",
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
       if(dialogResult) {
        this.service.delete(row.id).subscribe(msg => {
          this.notif.showNotification('mat-primary', "La suppression a été terminée avec succès", 'top', 'right');
          
        }, (error) => {
          this.notif.showNotification('mat-warn', error, 'top', 'right');
          return;
        });
       }
      });
     
    }
    add() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {};

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      const modalRef = this.dialog.open(InventSumAddComponent, dialogConfig);
      modalRef.afterClosed().subscribe(data => {
        // if(data!=null) this.loadDataTable(this.searchTerms);;
      });
    }

    ListingCommandClick(args: CommandClickEventArgs): void {
      if(args.commandColumn.title == 'Editer') this.edit(args.rowData);
      if(args.commandColumn.title == 'Supprimer') this.delete(args.rowData);
      if(args.commandColumn.title == 'Réapprovisioner') this.replinish_consume(args.rowData);
    }
}