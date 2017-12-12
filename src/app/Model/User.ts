
export class User{
  userID:number;
  login:String;
  password:String;
  role:String;

  constructor(_userID?:number, _login?:string, _password?:string, _role?:string){
    if(_userID)
    {
      this.userID = _userID;
    }else
    {
      this.userID = 0;
    }

    this.login= _login;
    this.password = _password;
    this.role = _role;
  }
}
