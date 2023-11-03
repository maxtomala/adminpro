import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
  ],
  exports:[
    AuthComponent,
    LoginComponent,
    RegisterComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
})
export class AuthModule { }
