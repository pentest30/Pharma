import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfimDialogComponent, ConfirmDialogModel } from "../confim-dialog/confim-dialog.component";

@Injectable()
export class DialogHelper {
  
   async confirmDialog(dialog,message,focusNo:boolean=true) {
    const dialogData = new ConfirmDialogModel("Avertissement", message,focusNo);
    const dialogRef = dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    let dialogResult = await dialogRef.afterClosed().toPromise();
    if(dialogResult)  return true;
    else return false;
  }
}