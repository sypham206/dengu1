import { Component, OnInit } from '@angular/core';
import { AppService, AuthService } from '../shared/shared.module';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    public constructor(public  appService: AppService, public  authService: AuthService, public  router: Router,public  localStorage : LocalStorageService) {}

    public ngOnInit() {
        if (this.localStorage.get('isLoggedIn')) {
            this.authService.current_user = this.localStorage.get('current_user');
            this.authService.token = this.localStorage.get('token').toString();
            this.router.navigate(['/dashboard']);
        }
    }
    public username :string = '';
    public password :string = '';

    public error_message: any;
    public keyDownFunction(event) {
      if(event.keyCode == 13) {
        this.login();
      }
    }
    public login() {
        this.appService.showPNotify('1');
        this.authService.redirectMessage = '';
        this.appService.showPNotify('2');
        this.authService.login(this.username,this.password).subscribe(results => {
            if(results.result == 'success'){
                this.appService.showPNotify('3');

                this.authService.token = results.token;
                this.authService.current_user = results.user;

                //save to localStorage
                this.localStorage.set('isLoggedIn',true);
                this.localStorage.set('token',results.token);
                this.localStorage.set('current_user',results.user);

                //let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/dashboard';
                this.appService.showPNotify('4');
                this.router.navigate(['/dashboard']);
            }else{
                this.appService.showPNotify('5');

                this.error_message = results.message;
            }
        },error=>{this.appService.showPNotify('failure', "Server Error! Can't login", 'error');});
    }
    public forgotPassword(){
        this.router.navigate(['/forgot-password']);
    }
}
