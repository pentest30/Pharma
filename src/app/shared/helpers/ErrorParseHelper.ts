import { Injectable } from "@angular/core";
import { isString } from "@ng-bootstrap/ng-bootstrap/util/util";

@Injectable()
export class ErrorParseHelper {
    parse( error: Result) {
        console.log(error);
        let messageErrors = [];
        if(typeof (error) == 'object' && error.errors.length > 0) {
            error.errors.forEach(err => {
                messageErrors.push(err.errorMessage);
            });
            return messageErrors.join(',');
        } else return error;
       
    }
}
export class Result {
    isValid: boolean;
    errors: any[];
}