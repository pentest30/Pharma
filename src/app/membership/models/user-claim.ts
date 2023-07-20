export class UserPermission {
    public module: string;
    public read : boolean = false;
    public create : boolean = false;
    public update : boolean = false;
    public delete : boolean = false;
    detail : boolean = false;
}