import {Component} from '@angular/core';
import {AuthServices} from '../Services/auth.services'
import {UserServices} from '../Services/user.services'
import {User} from '../Model/User';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import CustomValidators from '../forms/CustomValidators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'register',
  styleUrls: ['./register.component.css'],
  templateUrl: './register.component.html',
  providers:[
    AuthServices,
    UserServices
  ]
})
export class RegisterComponent {
  errorMessageLogin: string = "";

  constructor( private authServices:AuthServices, private userServices:UserServices, private route: ActivatedRoute, private router: Router){

  }

  ngOnInit(){
    if(this.authServices.isAuthenticated()){
      this.redirectHome();
    }
  }

  register(loginRegisterInput:String, passwdRegisterInput:String, passwd2RegisterInput:String){
    let newUser = new User();
    newUser.login = loginRegisterInput;
    newUser.password = passwdRegisterInput;
    newUser.role = "user";

    this.userServices
      .createUser(newUser)
      .subscribe(() => this.redirectHome());
  }

  redirectHome(){
    let link = ['/'];
    this.router.navigate(link);
  }
}
