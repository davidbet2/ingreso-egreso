import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  crearIngresoEgreso(ingresoEgreso:IngresoEgreso) {
    const uid = this.authService.user.uid;
   return this.firestore.doc(`${uid}/ingresos-egresos`)
    .collection('items')
    .add({ ...ingresoEgreso});
  }

  initiIngresosEgresosListener(uid:string) {
    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
    .snapshotChanges()
    .pipe(
      map( snapShot => {
        return snapShot.map( doc => {
          const data:any = doc.payload.doc.data();
          return {
            uid: doc.payload.doc.id,
            ...data
          }
        })
      })
    )
  }

  borrarIngresoEgreso(uidItem: string) {
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }

}


