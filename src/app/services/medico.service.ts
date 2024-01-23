import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): any {
    return {
      'x-token': this.token,
    };
  }

  cargarMedicos() {
    const url = `${base_url}/medicos`;
    return this.http
      .get(url, { headers: this.headers })
      .pipe(map((resp: { ok: boolean; medicos: Medico[] }) => resp.medicos));
  }
  crearMedico(medico: { nombre: string; hospital: string }) {
    const url = `${base_url}/medicos`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token,
      }),
    };
    return this.http.post(url, medico, options);
  }

  actualizarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token,
      }),
    };

    return this.http.put(url, medico , options);
  }

  borrarMedico(_id: string) {
    const url = `${base_url}/medicos/${_id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-token': this.token,
      }),
    };

    return this.http.delete(url, options);
  }

  obtenerMedicoPorId(id: string): Observable<Medico> {
    const url = `${base_url}/medicos/${id}`;
    return this.http
      .get<{ ok: boolean; medico: Medico }>(url, { headers: this.headers }) // Ajusta la tipificación aquí
      .pipe(
        map(resp => resp.medico)
      );
  }

}
