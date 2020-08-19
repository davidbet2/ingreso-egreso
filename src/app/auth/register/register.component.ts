import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ui  from 'src/app/shared/us.actions';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  uiSubscription: Subscription;
  cargando:Boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required],
    })

    this.uiSubscription = this.store.select('ui').subscribe(ui=> {
      this.cargando = ui.isLoading;
    })

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {

    if (this.registroForm.invalid) { return;}

    const {nombre, correo, password} = this.registroForm.value;

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    this.authService.crearUsuario(nombre, correo, password).then(
      credenciales => {
        this.store.dispatch(ui.stopLoading());
        // Swal.close();
        console.log(credenciales)
        this.router.navigate(['/']);
      }
    ).catch((err: FirebaseError) => {
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message
      });
    });
  }

}
