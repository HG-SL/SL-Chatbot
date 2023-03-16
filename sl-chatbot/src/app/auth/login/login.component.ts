import {
  Component,
  OnInit
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoginService} from "../../core/services/auth/login.service";
import {MatSnackBar} from "@angular/material/snack-bar";


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

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private snackbar: MatSnackBar) {
    this.createForm()
  }

  ngOnInit() {

  }


  createForm(): void {
    this.loginForm = this.fb.group({
      email: [
        ''
      ],
      password: [
        ''
      ]
    });
  }

  onSubmit(){
    let user: User = {email: this.loginForm.value.email, password: this.loginForm.value.password}

    this.loginService.login(user).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        this.snackbar.open('Invalid credentials', 'Ok')
      }
    })
  }

}
