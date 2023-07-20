import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from 'src/environments/environment';
import { ErrorParseHelper, Result } from 'src/app/shared/helpers/ErrorParseHelper';

@Component({
  selector: 'app-orders-for-agent',
  templateUrl: './orders-for-agent.component.html',
  styleUrls: ['./orders-for-agent.component.sass']
})
export class OrdersForAgentComponent implements OnInit {

  gridLines: string;
  data: DataManager;
  selectionOptions: SelectionSettingsModel;
  @ViewChild('grid') public grid: GridComponent;
  constructor(
    private authService: AuthService,
    private orderPreparationService: PreparationOrdersService,
    private notif: NotificationHelper,
    private permService: PermissionService,
    private parseErrorHelper: ErrorParseHelper,
  ) { }

  ngOnInit(): void {
    this.gridLines = "Both";
    this.loadData();
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick' };


  }

  loadData() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "orders" + "/printingAgent",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken }],
    });
  }
  async print(row) {
    let response =await this.orderPreparationService.printBl(row.id).toPromise();
    
   
   if(response == null) {
    this.notif.showNotification("mat-success"," Ordre de préparation " + row.orderNumber+ " est imprimé avec succès",'top','right');
   

  } else {
    let resultError = this.parseErrorHelper.parse(<Result>response);
    this.notif.showNotification('mat-warn','Echec d\'impression ' + resultError,'top','right');

  }
  }
}
