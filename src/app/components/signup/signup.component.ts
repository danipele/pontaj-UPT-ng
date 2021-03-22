import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {
  TYPES: string[] = ['Angajat cu norma de baza', 'Angajat in regim de plata cu ora', 'Colaborator'];
  formGroup: FormGroup;

  constructor(private loginService: LoginService, private router: Router, private userService: UserService) {
    this.formGroup = new FormGroup({
      userEmail: new FormControl(),
      userPassword: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      type: new FormControl()
    });
  }

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe((user) => {
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  createAccount(): void {
    const params = {
      email: this.formGroup.controls.userEmail.value,
      password: this.formGroup.controls.userPassword.value,
      first_name: this.formGroup.controls.firstName.value,
      last_name: this.formGroup.controls.lastName.value,
      type: this.formGroup.controls.type.value
    };

    this.loginService.signup(params).subscribe((result) => {
      if (result.success === true) {
        this.router.navigate(['/login']);
      }
    });
  }
}
