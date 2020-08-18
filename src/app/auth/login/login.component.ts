import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { FirebaseError } from 'firebase';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  loginUsuario() {
    if (this.loginForm.invalid) {
      return;
    }

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    });

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .then((usuario) => {
        console.log(usuario);
        Swal.close();
        this.router.navigate(["/"]);
      })
      .catch((err: FirebaseError) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message
        });
      });
  }
}
