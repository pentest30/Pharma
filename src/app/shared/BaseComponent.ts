import { HostListener, Injectable, OnInit, ViewChild } from "@angular/core";
import { ColumnMenuItem, ContextMenuItem, EditSettingsModel, GridComponent, IFilter, SelectionSettingsModel } from "@syncfusion/ej2-angular-grids";
import { enableRipple, L10n, loadCldr, setCulture } from "@syncfusion/ej2-base";
import * as enumLookup from './EnumLookup.json';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/fr.json";
loadCldr(
  require('cldr-data/main/fr/numbers.json'),
  require('cldr-data/main/fr/ca-gregorian.json'),
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/fr/timeZoneNames.json'),
  require('cldr-data/supplemental/weekData.json'),
  require('cldr-data/main/fr/units.json'),
  require('cldr-data/main/fr/layout.json'),
  require('cldr-data/main/fr/measurementSystemNames.json'),
);
enableRipple(true);
setCulture("fr"); // Change the Grid culture 
L10n.load({fr: EJ2_LOCALE.fr});
@Injectable({
    providedIn: 'root'
  })
export class BaseComponent implements OnInit {
  enumLookupData: any = (enumLookup as any).default;
  public baseUrl = '';
  filters: any = {};
  public gridLines: any;
  public editSettings: EditSettingsModel;
  @ViewChild('grid') public grid: GridComponent;
  filterOptions: any;
  public filterBar: IFilter = {};
  public filterMenu: IFilter = {};
  public contextMenuItems: ColumnMenuItem[] = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending','Filter', 'Group', 'Ungroup'];  
  data: DataManager;
  token: string;
  selectionOptions: SelectionSettingsModel;
  filterSettings: { type: string; };
  constructor( _auth: AuthService, baseUrl: string){
    this.token = _auth? _auth.getToken : "";
    this.baseUrl = baseUrl;
    this.gridLines = "Both";
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    this.editSettings = { allowEditing: true, allowDeleting: true };
    this.filterBar.type = 'FilterBar';
    this.filterMenu.type = 'Menu';
    this.filterOptions = {
      type: 'FilterBar',
      operators: {
          stringOperator: [
              { value: 'startsWith', text: 'starts with' },
              { value: 'endsWith', text: 'ends with' },
              { value: 'contains', text: 'contains' }
          ],
      }
    };
   loadCldr(require('./trans.json'));
   loadCldr(require('./../sales/numbers.json'));
  }
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    console.log(event);
    localStorage.clear();

    alert("unload");
  }
  @HostListener("window:beforeunload", ["$event"]) beforeUnloadHandler(event: Event) {
    console.log(event);
    alert("unload");
    this.grid.clearFiltering();
    localStorage.clear();

  }
  
  ngOnInit(): void {
    console.log(this.baseUrl);
    if(this.baseUrl != null) this.loadData();
    setCulture("fr"); // Change the Grid culture 
  }
 
  loadData() {
    
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + this.baseUrl +"search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.token }],
      
    });
  }
  begin(args): any { 
    if(args.requestType === "filtering") { 
      console.log(args);
      if(!args ||!args.columns)
      return;
      if(args.columns && args.columns.length) {
        args.columns.forEach(element => {
          let value = element.properties.value;
          if(element.properties.field == "sequenceNumber") {
            let str = element.properties.value.split("/");
            value = str[1].replace(/^0+/, '');
            this.grid.filterByColumn('sequenceNumber', 'equal', value);
 
          }
          if(element.properties.field == "orderNumberSequence") {
             let str = element.properties.value.split("/");
             value = str[1].replace(/^0+/, '');
             this.grid.filterByColumn('orderNumberSequence', 'equal', value);
  
          }
          if(element.properties.field == "orderIdentifier") {
            let str = element.properties.value.split("/");
            value = str[1].replace(/^0+/, '');
            this.grid.filterByColumn('orderIdentifier', 'equal', value);
 
          }
          if(element.properties.field == "preparationOrderStatus") {
            console.log(element.properties.value);
            // let str = element.properties.value.split("/");
            // value = str[1].replace(/^0+/, '');
            // this.grid.filterByColumn('preparationOrderStatus', 'equal', value);
 
          }
          Object.assign(this.filters, { [element.properties.field ]: value});
          console.log(this.filters);
        });
      }
     
    } 
  } 
  public dataBound(e) {
    this.grid.selectRow(0);
    this.grid.height = window.innerHeight - 400;
  }
  toggleSearch($event) {
    console.log($event);
    if($event.checked) this.filterSettings = { type : 'Menu'};
    else  this.filterSettings = { type: 'FilterBar' };
  }
  expand(): void {
    this.grid.detailRowModule.expandAll();
  }
  collapse(): void {
      this.grid.detailRowModule.collapseAll();
  }
  complete(args): any { 
    if(args.requestType === "filtering") { 
    } 
  } 
  public onChange(args: any): void {
    let filter;
    filter = this.enumLookupData[args.element.id][args.value];
    if(filter != null)
    this.grid.filterByColumn(args.element.id, 'equal', filter);
    else this.grid.removeFilteredColsByField(args.element.id, true);
  }
  
 
}
