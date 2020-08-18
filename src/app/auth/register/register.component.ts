import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  crearUsuario() {

    if (this.registroForm.invalid) { return;}

    const {nombre, correo, password} = this.registroForm.value;

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    });

    this.authService.crearUsuario(nombre, correo, password).then(
      credenciales => {
        Swal.close();
        console.log(credenciales)
        this.router.navigate(['/']);
      }
    ).catch((err: FirebaseError) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message
      });
    });
  }

}
