// usuario-peso.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioPesoService {

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }


  obtenerPesosUsuario(id: string): Observable<any> {
    const url = `${base_url}/peso/${id}/pesos`;

    return this.http.get(url, {
      headers: {
        'x-token': this.token
      }
    });


    //   );
      // map((data) => {
      //   console.log('Datos crudos del servicio:', data);

      //   // Realizar conversiones si es necesario
      //   const result = data.map((item) => ({
      //     peso: item.peso,
      //     fecha: new Date(item.fecha),
      //     hora: item.hora,
      //   }));

      //   console.log('Datos procesados:', result);
      //   return result;
      // }),


  }



  // obtenerPesosUsuario(id: string): Observable<{ peso: number; fecha: Date; }[]> {
  //   const url = `${base_url}/peso/${id}/pesos`;

  //   return this.http.get<any[]>(url, this.headers).pipe(
  //     tap(data => console.log('Datos recibidos del backend:', data)),
  //     map(data => {
  //       if (Array.isArray(data)) {
  //         // La transformación se realiza solo si los datos son un array
  //         return data.map(weightData => ({
  //           peso: weightData.valor,  // Ajusta la propiedad según la respuesta real del servidor
  //           fecha: new Date(weightData.fecha),
  //         }));
  //       } else {
  //         console.error('Error al transformar datos: La respuesta del servidor no es un array');
  //         return [];
  //       }
  //     })
  //   );
  // }


  agregarDatoDePeso(id: string, datoDePeso: any): Observable<any> {
    const url = `${base_url}/peso/${id}/pesos`;
    return this.http.post<any>(url, datoDePeso, this.headers);
  }

  actualizarDatoDePeso(id: string, datoDePesoId: string, nuevoValor: any): Observable<any> {
    const url = `${base_url}/peso/${id}/pesos/${datoDePesoId}`;
    return this.http.put<any>(url, { valor: nuevoValor }, this.headers);
  }

  eliminarDatoDePeso(usuarioId: string, datoDePesoId: string): Observable<any> {
    const url = `${base_url}/peso/${usuarioId}/pesos/${datoDePesoId}`;
    return this.http.delete<any>(url, this.headers);
  }
}


