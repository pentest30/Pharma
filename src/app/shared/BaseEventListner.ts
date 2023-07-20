import { Injectable, OnInit, ViewChild } from "@angular/core";
import { ColumnMenuItem, ContextMenuItem, ContextMenuItemModel, EditSettingsModel, GridComponent, IFilter, SelectionSettingsModel } from "@syncfusion/ej2-angular-grids";
import { loadCldr, setCulture } from "@syncfusion/ej2-base";
import * as enumLookup from './EnumLookup.json';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
  })
export class BaseEventListner implements OnInit {
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

}
