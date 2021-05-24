
export class UserModel {
    public fName: string = "";
    public lName: string = "";
    public emailID: string = "";
    public color: string = "";
    public entityID: string = "";
    public EmailConfirmed:string="";
  
    UserModel(fName: string, lName: string, emailID: string, color: string, entityID: string, EmailConfirmed:string) {
      this.fName = fName;
      this.lName = lName;
      this.emailID = emailID;
      this.color = color;
      this.entityID = entityID;
      this.EmailConfirmed=EmailConfirmed;
    }
  }

  export class InviteUser{
      public userName:string = "";
      public fName: string = "";
      public lName: string = "";
      public email: string = "";
      public companyID: string = "";
      public CompanyRole: string = "";
      public CampaignID: string = "";
  }