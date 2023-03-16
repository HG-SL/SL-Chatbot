import {
  Component,
  OnInit
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;

  constructor(private fb: FormBuilder) {
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
    // let user = new User();
    // user.email = this.loginForm.value.email;
    // user.password = this.loginForm.value.password;
    //
    // this.login.login(user).subscribe({
    //   next: (res) => {
    //     this.sess.setSession(res);
    //     this.nextPage(res);
    //   },
    //   error: (err) => {
    //     this.snackbar.open('Email/Password invalid', 'Ok')
    //   }
    // })
  }

}
