import {
  Component,
  OnInit
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../core/services/auth/login.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {LocalstorageService} from "../../core/services/localstorage.service";


interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  hidePassword = true;

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private localStorageService: LocalstorageService,
              public snackbar: MatSnackBar,
              public dialog: MatDialog,) {
    this.createForm()
  }

  ngOnInit() {

  }

  openSnackBar(message: string, btnMssg:string, time: number = 3000){
    this.snackbar.open(message, btnMssg, {
      duration: time,
    });
  }


  createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * [We need to ask for the user id as the email is not unique in the DB
   * For using this endpoint with the email you need to ask also the client id
   * Please check the behaviour of the system login with user id/email: https://dev.shocklogic.com/v2/unifiedlogin]
   * */
  onSubmit(){
    //
    let formData = new FormData();
    formData.append('email', this.loginForm.value.email);
    formData.append('password', this.loginForm.value.password);
    this.loginService.login(formData).subscribe({
      next: (res) => {
        let auxRes:any = res
        if(auxRes.type == 'error'){
          this.openSnackBar(auxRes.message, 'Ok');
          return;
        }
        else {
          this.dialog.closeAll()
          this.localStorageService.setCurrentItem('userId', auxRes.id)
          this.localStorageService.setCurrentItem('token', auxRes.token)
        }
      },
      error: (err) => {
        this.openSnackBar('Invalid credentials', 'Ok')
      }
    })
  }

  // TODO: for some reason the first time you authenticate it's not doing anything

}
