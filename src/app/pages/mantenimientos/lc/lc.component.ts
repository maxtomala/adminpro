import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types/swiper-options';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-lc',
  templateUrl: './lc.component.html',
  styles: []
})
export class LcComponent implements OnInit {
  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  images: string[] = [
    'IMAGEN NO DISPONIBLE (1).jpg',
    'IMAGEN NO DISPONIBLE (2).jpg',
    'IMAGEN NO DISPONIBLE (3).jpg'
  ];
  carousel: any;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,) {
    this.usuario = usuarioService.usuario;

  }

  ngOnInit() {
    // Declarar la variable slides
    const slides = [];

    // Inicializar el carrusel con las imágenes por defecto
    this.carousel(slides);

    // Agregar la imagen no-img-carrusel.jpg al inicio del carrusel
    slides.unshift(`<div class="carousel-item active">
      <img src="C:/dev/Angular-adv/backend-server/uploads/carrusel-no-img/no-img-carrusel.jpg" alt="Imagen por defecto">
    </div>`);

    document.querySelector('.carousel-inner').innerHTML = slides.join('');
  }

  // Escucha el evento slid.bs.carousel que se produce cuando se cambia la imagen principal
  // Luego, actualiza los círculos para que coincidan con la imagen principal actual
  onSlid() {
    const activeIndex = this.carousel.activeIndex;

    const circles = this.carousel.querySelectorAll('.position-circle');

    for (let i = 0; i < circles.length; i++) {
      circles[i].classList.remove('active-position-circle');
    }

    circles[activeIndex].classList.add('active-position-circle');
  }

}
