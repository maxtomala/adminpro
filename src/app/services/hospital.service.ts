import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): any {
    return {
        'x-token': this.token

     }
  }

  cargarHospitales(){
    const url = `${base_url}/hospitales`;
    return this.http.get(url, { headers: this.headers })
    .pipe(
      map( (resp: {ok: boolean, hospitales: Hospital[] }) => resp.hospitales )
    );
  }
  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token,
      }),
    };

    return this.http.post(url, { nombre }, options);
  }

  actualizarHospital( _id: string, nombre: string  ) {

    const url = `${ base_url }/hospitales/${ _id }`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token,
      }),
    };

    return this.http.put(url, { nombre }, options);
  }

  borrarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token,
      }),
    };

    return this.http.delete(url, options);
  }

}
