import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandModel, EditSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from 'src/environments/environment';
import { BaseComponent } from 'src/app/shared/BaseComponent';

@Component({
  selector: 'app-invent-list',
  templateUrl: './invent-list.component.html',
  styleUrls: ['./invent-list.component.sass']
})
export class InventListComponent extends BaseComponent implements OnInit {

  @ViewChild('grid') public grid: GridComponent;
  public data: DataManager;
  gridLines: string;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];
  
  public dropZoneName: string[]  = Object.keys(this.enumLookupData["zoneId"]);
  public dropStockState: string[]  = Object.keys(this.enumLookupData["stockStateId"]);

  public fieldType: object = { text: 'zoneId', value: 'zoneId' };

  constructor( _auth: AuthService) {
    super(_auth, "invents/");
    this.commandListing = [
     { type: 'None',title:'Editer', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },
     { type: 'None',title:'Réapprovisioner', buttonOption: { iconCss: 'e-icons  e-upload', cssClass: 'e-flat'} },
     { type: 'None',title:'Supprimer', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'} },

   ];
  }
  ngOnInit(): void {
   this.loadData();
  }
  ListingCommandClick($event) {

  }
  public dataBound(e) {
    this.grid.height = window.innerHeight - 412;    
  }
}
