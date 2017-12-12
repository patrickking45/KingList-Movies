import { Injectable } from '@angular/core';
import {User} from "../Model/user";
import {UserServices} from '../Services/user.services';

@Injectable()
export class AuthServices{

  errorMessage:String = "";

  constructor(private userService:UserServices){
  }

  public login(loginInput:String, passwdInput:String){
    let users: User[];

    this.userService
      .getAllUsers()
      .subscribe(
         /* happy path */  p=> users = p,
         /* error path */ e => this.errorMessage = e,
         /* onComplete */ function(){
                            for(let user of users){
                              if(user.login === loginInput && user.password === passwdInput){
                                localStorage.setItem('connectedUser', JSON.stringify({  userID: user.userID, login: user.login, password: user.password }));
                                window.location.reload();
                              }
                            }
                          }
     );
    return true;
  }

  public logout(){
    localStorage.removeItem('connectedUser');
    console.warn("removed");
    window.location.reload();
  }

  public isAuthenticated(){
    var connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    return(connectedUser != null);
  }

  public getUser(){
      return (JSON.parse(localStorage.getItem('connectedUser')));
  }
}
