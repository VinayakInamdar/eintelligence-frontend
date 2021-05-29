export class CampaignUserModel {
    public fName: string = "";
    public lName: string = "";
    public emailID: string = "";
    public id:string="";
    public CompanyRole: string = "";

    CampaignUserModel(fName: string, lName: string, emailID: string, id: string,  CompanyRole: string) {
        this.fName = fName;
        this.lName = lName;
        this.emailID = emailID;
        this.id = id;
        this.CompanyRole = CompanyRole;

    }
}