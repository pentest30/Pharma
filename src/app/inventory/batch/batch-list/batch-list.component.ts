import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandModel, EditSettingsModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.sass']
})
export class BatchListComponent extends BaseComponent implements OnInit {

  @ViewChild('grid') public grid: GridComponent;
  public data: DataManager;
  gridLines: string;
  public editSettings: EditSettingsModel;
  public commandListing: CommandModel[];
  constructor(private _auth: AuthService) {
    super(_auth,"batches/");
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


}
