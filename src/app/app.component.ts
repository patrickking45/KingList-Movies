import {Component} from '@angular/core';
import {AuthServices} from './Services/auth.services';
import {UserServices} from './Services/user.services';
import {User} from './Model/User';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  providers:[
      AuthServices,
      UserServices
  ]
})
export class AppComponent {
  errorMessageLogin: string = "";

  constructor(private auth:AuthServices, private userServices:UserServices, private route: ActivatedRoute, private router: Router){

  }

  isRegistering(){
    if(this.router.url.endsWith('register')){
      return true;
    }
    return false;
  }

  startRegistration(){
    this.router.navigate(['/register']);;
  }

  login(loginInput:String, passwdInput:String){
    this.auth.login(loginInput,passwdInput);

    if(!this.auth.isAuthenticated()){
      this.errorMessageLogin = "Wrong Login Or Password!";
    }
  }

  logout(){
    this.auth.logout();
  }

  redirectHome(){
    let link = ['/'];
    this.router.navigate(link);
  }
}
