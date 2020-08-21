import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from  '../ingreso-egreso/inngreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit() {
    this.userSubs = this.store.select('user').pipe(
      filter(auth => auth.user !== null)
    ).subscribe( ({user})  => {
      // console.log(user)
      this.ingresosSubs = this.ingresoEgresoService.initiIngresosEgresosListener(user.uid).subscribe(
        ingresosEgresos=> {
          // console.log(ingresosEgresos)
          this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresos}))
        }
      )
    })
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe() ;
    this.ingresosSubs.unsubscribe();
  }

}
