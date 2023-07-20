import { throwError } from 'rxjs';

export abstract class BaseService {  
    
    constructor() { }

    protected handleError(errorRequest: any) {
   try {
    var applicationError = errorRequest.headers?.get('Application-Error');

    // either application-error in header or model error in body
    if (applicationError) {
      return throwError(applicationError);
    }
    
    var modelStateErrors: string = '';
    let errors = errorRequest?.error?.errors;

    try {
      var messages = errors.ErrorMessages
      messages.forEach((element: any) => {
        modelStateErrors = modelStateErrors + "-" + element + "\n"
      });
    } catch (err) {
      return throwError("Opps ... Something went wrong!")
    }
    //console.log(errorMessages);
  
    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return throwError(modelStateErrors || 'Server error');
   }
    catch (error) {
      console.log(error);
      return throwError("Opps ... Something went wrong!")
     
   }
   
  }
}