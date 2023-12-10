import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;
  public auth2: any;

  loginForm: FormGroup;
  //Agregar el loginForm en un FormGroup, e importar desde: import { FormGroup } from '@angular/forms';


  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private ngZone: NgZone) {

    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });

  }
  ngOnInit(): void {
    // console.log({esto:this})

  }


  ngAfterViewInit(): void {
    // console.log({esto1:this})

    this.googleInit();
  }
  googleInit() {
    // console.log({esto1:this})

    google.accounts.id.initialize({
      client_id: '252372804784-l0vvkg96cl3i1n4vbdf8k0tjblajkpb5.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );

  }
  handleCredentialResponse(response: any) {
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        // console.log({login:resp})
        // Navegar al Dashboard
        this.router.navigateByUrl('/');
      })

  }


  login() {
    const emailControl = this.loginForm.get('email');
    const rememberControl = this.loginForm.get('remember');

    if (emailControl?.value) {
      // Guardar el email en localStorage si el campo de email tiene un valor
      localStorage.setItem('email', emailControl.value);
    }

    // Guardar en localStorage si la opción "remember" está seleccionada
    if (rememberControl?.value) {
      localStorage.setItem('remember', 'true');
    } else {
      localStorage.removeItem('remember');
      // También elimina el correo electrónico si la opción "remember" no está seleccionada
      localStorage.removeItem('email');
    }

    this.usuarioService.login(this.loginForm.value).subscribe(
      (resp) => {

        // Navegar al Dashboard
        this.router.navigateByUrl('/');
      },
      (err) => {
        // Manejar errores
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  //agrego este metodo startApp(): no explicado por fernando
  // async startApp() {
  //   await this.usuarioService.googleInit();
  //   this.auth2 = this.usuarioService.auth2;
  //   this.attachSignin(document.getElementById('my-signin2'));
  // }


  //agrego este metodo attachSignin(element: any): no explicado por fernando
  // attachSignin(element: any) {

  //   this.auth2.attachClickHandler(element, {},
  //     (googleUser: any) => {
  //       const id_token = googleUser.getAuthResponse().id_token;
  //       // console.log(id_token);
  //       this.usuarioService.loginGoogle(id_token)
  //         .subscribe(resp => {
  //           // Navegar al Dashboard
  //           this.ngZone.run(() => {
  //             this.router.navigateByUrl('/');
  //           })
  //         });

  //     }, (error: any) => {
  //       alert(JSON.stringify(error, undefined, 2));
  //     });
  // }

  //añado any 3 veces al metodo attachSignin para quitarme el error y inicio el el public auth2 arriba



}

