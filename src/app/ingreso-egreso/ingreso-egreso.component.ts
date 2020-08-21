import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IngresoEgresoService } from "../services/ingreso-egreso.service";
import { IngresoEgreso } from "../models/ingreso-egreso.model";
import Swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "../app.reducer";
import { Subscription } from "rxjs";
import { isLoading, stopLoading } from "../shared/us.actions";
import * as ui  from 'src/app/shared/us.actions';

@Component({
  selector: "app-ingreso-egreso",
  templateUrl: "./ingreso-egreso.component.html",
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm: FormGroup;
  tipo: string = "ingreso";
  uiSubscription: Subscription;
  cargando: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.ingresoForm = this.fb.group({
      descripcion: ["", Validators.required],
      monto: ["", Validators.required],
    });

    this.uiSubscription = this.store
      .select("ui")
      .subscribe(({ isLoading }) => (this.cargando = isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  public guardar() {
    
    if (this.ingresoForm.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    const { descripcion, monto } = this.ingresoForm.value;

    // console.log(this.ingresoForm.value);
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire("Registro creado", descripcion, "success");
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire("Registro creado", err.message, "error");
      });
  }
}
