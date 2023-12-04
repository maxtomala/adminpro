import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'
  ]
})
// name: ['', [Validators.required, Validators.minLength(3)]],
// email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
// password1: ['', [Validators.required, Validators.minLength(6)]],
// password2: ['', [Validators.required, Validators.minLength(6)]],
// term: [false, [ Validators.requiredTrue]],

export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Fernando', Validators.required],
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos: [true, Validators.required],
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router:Router) { }

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {

              // Navegar al Dashboard
              this.router.navigateByUrl('/');

      }, (err) => {
          // Si sucede un error
          Swal.fire('Error', err.error.msg, 'error' );
    });
  }






  campoNoValido(campo: string): boolean {
    const campoControl = this.registerForm.get(campo);

    // Verifica si campoControl es null o undefined antes de acceder a las propiedades
    if (this.formSubmitted && campoControl && campoControl.invalid) {
      return true;
    } else {
      return false;
    }


  }
  contrasenasNoValidas(): boolean {
    const pass1Control = this.registerForm.get('password');
    const pass2Control = this.registerForm.get('password2');

    // Verifica si los controles no son null o undefined antes de acceder a sus valores
    const pass1 = pass1Control ? pass1Control.value : null;
    const pass2 = pass2Control ? pass2Control.value : null;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos(): boolean {
    const terminosControl = this.registerForm.get('terminos');

    // Verifica si terminosControl es null o undefined antes de acceder a las propiedades
    return terminosControl ? !terminosControl.value && this.formSubmitted : false;
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      // Verifica si los controles no son null o undefined antes de acceder a sus valores
      const pass1 = pass1Control ? pass1Control.value : null;
      const pass2 = pass2Control ? pass2Control.value : null;

      if (pass1 === pass2) {
        pass2Control?.setErrors(null);  // Usa el operador de navegación segura para evitar errores si pass2Control es null
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    };
  }



}
