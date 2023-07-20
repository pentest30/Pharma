export class UserApp {
    id: string;
    userName?: any;
    organizationId?:string;
    organization?:string;
    normalizedUserName?: any;
    email?: any;
    normalizedEmail?: any;
    emailConfirmed: boolean;
    phoneNumber?: any;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    concurrencyStamp?: any;
    securityStamp?: any;
    lockoutEnabled: boolean;
    lockoutEnd?: any;
    accessFailedCount: number;
    password?: any;
    emailConfirmedState : string;
    roles : string;
    userRoles : string [] ;
    claims  : ClaimModel[] = [];
    firstName: string;
    lastName: string;
    managerId: string
    
}
export class ClaimModel {
type : string;
value : string
}