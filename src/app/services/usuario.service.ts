import { HttpClient, HttpEvent } from '@angular/common/http';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { tap, map, catchError, } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
//interfaces
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interfaces';

import { Usuario } from '../models/usuario.model';

declare const google: any;
declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {

    // this.initGoogle();
  }
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return this.usuario.uid || '';
  }
  get headers(): any {
    return {
      'x-token': this.token
    }
  }


  //agrego este metodogoogleInit(): no explicado por fernando

  // googleInit() {
  //   return new Promise<void>(resolve => {
  //     console.log('google init');

  //     gapi.load('auth', () => {
  //       this.auth2 = gapi.auth2.init({
  //         client_id: '252372804784-l0vvkg96cl3i1n4vbdf8k0tjblajkpb5.apps.googleusercontent.com',
  //         cookiepolicy: 'single_host_origin',
  //       });
  //       resolve();
  //     });
  //   })
  // }
  //agrego este initGoogle(_callback: any): no explicado por fernando, hecho por un compi
  initGoogle(_callback: any) {
    google.accounts.id.initialize({
      client_id: '252372804784-l0vvkg96cl3i1n4vbdf8k0tjblajkpb5.apps.googleusercontent.com',
      callback: _callback
    });
  }
  buttonGoogle(button: ElementRef) {
    google.accounts.id.renderButton(
      // document.getElementById("googleBtn"), no usar esto sino el ElementRef
      button.nativeElement,
      { theme: 'outline', size: 'large' }
    );
  }
  // maximporta2@gmail.com

  logout() {
    localStorage.removeItem('token');
    google.accounts.id.revoke('', () => {
      // this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })

    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token);
        return true;

      }),
      catchError(error => of(false))
    );

  }



  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )

  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }



  login(formData: LoginForm) {

    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );
  }

  loginGoogle(token: string) {

    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );
  }
  cargarUsuarios(desde: number = 0): Observable<CargarUsuario> {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, { headers: this.headers })
      .pipe(

        map((resp: any) => {
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
          );

          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {
    console.log('eliminado');
    // /usuarios/5eff3c5054f5efec174e9c84
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    console.log(url);
    // return this.http.delete( url,  this.headers );
    return this.http.delete( url, { headers: this.headers} );
  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, { headers: this.headers });

  }

}
