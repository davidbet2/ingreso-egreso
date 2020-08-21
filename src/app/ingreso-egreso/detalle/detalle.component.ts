import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos:IngresoEgreso [] = [];
  ingresosEgresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresosEgresosService: IngresoEgresoService
  ) { }

  ngOnInit() {
   this.ingresosEgresosSubs = this.store.select('ingresosEgresos').subscribe(
      ({items}) => {
        this.ingresosEgresos = items;
      }
    )
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  borrar(uid:string) {
    console.log(uid);
    this.ingresosEgresosService.borrarIngresoEgreso(uid).then( (resp => {
      Swal.fire('Borrado', 'Item borrado', 'success')
    })).catch( err => {
      Swal.fire('Error', err.message, 'error')
    })
  }

}
