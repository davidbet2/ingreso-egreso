import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
import { FirebaseError } from 'firebase';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui  from 'src/app/shared/us.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  loginForm: FormGroup;
  cargando: Boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui=> {
      this.cargando = ui.isLoading;
    })

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .then((usuario) => {
        console.log(usuario);
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(["/"]);
      })
      .catch((err: FirebaseError) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message
        });
      });
  }
}
