import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';


import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CargarUsuario } from 'src/app/interfaces/cargar-usuarios.interfaces';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Subscription, delay } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})


export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription;

  public desde: number = 0;
  public cargando: boolean = true;



  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService
              ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      })
  }




  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios', termino)

      .subscribe((resp:Usuario[]) => {
        this.usuarios = resp;
      });
    return []

  }

  eliminarUsuario(usuario: Usuario) {
    console.log(usuario);

    if (usuario.uid === this.usuarioService.uid) {
      // Mostrar un mensaje de error si el usuario intenta eliminarse a sí mismo
      Swal.fire('Error', 'No puede borrarse a sí mismo', 'error');
      return;
    }
    // Mostrar un cuadro de diálogo de confirmación para borrar el usuario
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      // Si el usuario confirma la eliminación, realizar la operación
      if (result.value) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {

            // Recargar la lista de usuarios después de la eliminación
            this.cargarUsuarios();

            // Mostrar un mensaje de éxito
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );
          });

      }
    });
  }

  cambiarRole(usuario: Usuario) {

    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {
        console.log(resp);
      })
  }

  abrirModal( usuario: Usuario ) {

    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img );
  }


}
