import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

declare const google: any;
declare const gapi: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {

    // this.initGoogle();
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

  validarToken(): Observable < boolean > {
      const token = localStorage.getItem('token') || '';

      return this.http.get(`${base_url}/login/renew`, {
        headers: {
          'x-token': token
        }
      }).pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        }),
        map(resp => true),
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

}
