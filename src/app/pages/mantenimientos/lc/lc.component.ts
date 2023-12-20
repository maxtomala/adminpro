import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swiper from 'swiper';
import {  registerables } from 'chart.js/auto';
import { UsuarioPesoService } from 'src/app/services/usuario-peso.service';  // Ajusta la ruta a tu servicio
import { PesoData } from 'src/app/interfaces/peso-data.interfaces';
//grafica lineal
import 'morris.js/morris.js';
// import * as $ from 'jquery';
//grafica circular
import Chart from 'chart.js/auto';




declare var Morris: any;

// Registra los módulos necesarios de Chart.js
Chart.register(...registerables);


@Component({
  selector: 'app-lc',
  templateUrl: './lc.component.html',
  styleUrls: ['./lc.component.css']
})
export class LcComponent implements OnInit, AfterViewInit {
  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  @ViewChild('myPieChart') pieChartCanvas!: ElementRef;



  images: string[] = [
    "assets/image_no_disponible.jpg",
    "assets/image_no_disponible.jpg",
    "assets/image_no_disponible.jpg"
  ];
  carousel: Swiper;

  // ViewChild para acceder al elemento contenedor del carrusel
  @ViewChild('swiperContainer') swiperContainer: ElementRef;

  // Declaración de la variable para el gráfico
  myChart: Chart;
  // Datos de peso obtenidos del servicio
  weightData: PesoData[] = [];
  nombre: any;
  // Variables para los pesos: grafica 2
  pesoIdeal: number = 70;
  ultimoPeso: number = 65;
  peso: number = 65;
  value: any;
  pesoActual: number;
  private pieChart: Chart;
porcentajeProgreso: any;


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
    private renderer: Renderer2,
    private usuarioPesoService: UsuarioPesoService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.usuario.uid = this.usuario.uid;
    this.perfilForm = this.fb.group({
    });
    this.mostrarGrafico();
    this.cargarDatosDePeso();
    // this.mostrarGrafico2()
    // this.mostrarGrafico3()

  }


  ngAfterViewInit(): void {
    if (this.pieChartCanvas) {
      console.log("dentro ")
      // this.inicializarGraficoCircular();
      this.mostrarGrafico2()

    }

    if (this.swiperContainer) {
      // this.initializeSwiper();
      this.cargarDatosDePeso();
      this.mostrarGrafico();

    } else {
      console.error('La referencia swiperContainer no está definida.');
    }
  }


  // private inicializarGraficoCircular(): void {
  //   const ctx: CanvasRenderingContext2D = this.pieChartCanvas.nativeElement.getContext('2d');

  //   this.pieChart = new Chart(ctx, {
  //     type: 'pie',
  //     data: {},
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       textDuration: '.1s',
  //       chartDuration: '2s',
  //       delay: '2s',
  //       easing: 'ease-in',
  //       enableHover: true,
  //     },
  //   });
  // }

  // mostrarGrafico2(): void {
  //   // Establecer valores fijos
  //   const pesoActual: number = this.perfilForm.get('pesoActual').value;
  //   const pesoIdeal: number = this.perfilForm.get('pesoIdeal').value;

  //   // Calcular el porcentaje del progreso hacia el objetivo
  //   const porcentajeProgreso: number = (pesoActual / pesoIdeal) * 100;

  //   // Actualizar datos del gráfico
  //   this.pieChart.data = {
  //     labels: ['Progreso', 'Restante'],
  //     datasets: [{
  //       data: [porcentajeProgreso, 100 - porcentajeProgreso],
  //       backgroundColor: ['#36A2EB', '#FFCE56'],
  //     }],
  //   };

  //   // Actualizar opciones del gráfico
  //   this.pieChart.options = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     textDuration: '.1s',
  //     chartDuration: '2s',
  //     delay: '2s',
  //     easing: 'ease-in',
  //     enableHover: true,
  //   };

  //   // Actualizar el gráfico
  //   this.pieChart.update();
  // }






  mostrarGrafico2(): void {
    // Establecer valores fijos
    console.log("entro a grafica mostrar grafica 2");
    const pesoActual: number = 70;
    const pesoIdeal: number = 100;

    // Calcular el porcentaje del progreso hacia el objetivo
    let porcentajeProgreso: number = (pesoActual / pesoIdeal) * 100;
    console.log("porcentajeProgreso");
    console.log(porcentajeProgreso);

    // Datos para el gráfico
    const data = {
      labels: ['Progreso', 'Restante'],
      datasets: [{
        data: [porcentajeProgreso, 100 - porcentajeProgreso],
        backgroundColor: ['#745af2', '#67757c'], // Colores especificados
        hoverBackgroundColor: ['#745af2', '#67757c'],
        borderWidth: 1, // Grosor de 1 para el área del donut
      }],
    };

    // Configuración del gráfico
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutoutPercentage: 85, // Ajusta este valor según sea necesario para el tamaño del agujero del donut
      legend: {
        display: false, // No mostrar leyenda
      },
      tooltips: {
        enabled: false, // Desactivar información sobre herramientas para ocultar los porcentajes
      },
      elements: {
        arc: {
          borderWidth: 1, // Grosor de 1 para los arcos
        },
      },
      // Agregar un texto personalizado encima del donut
      onRender: (chart) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000'; // Color negro para el texto
        ctx.font = 'bold 20px Arial'; // Tamaño y fuente del texto

        const text = `${porcentajeProgreso.toFixed(1)}%`;
        const textX = width / 2;
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
      },
    };

    // Obtén el contexto del lienzo (canvas)
    const ctx: CanvasRenderingContext2D = this.pieChartCanvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.pieChartCanvas.nativeElement.width, this.pieChartCanvas.nativeElement.height);
    this.pieChartCanvas.nativeElement.width = "200";  // Reemplaza "nuevoAncho" con el valor deseado
    this.pieChartCanvas.nativeElement.height = "200";

    // Crea el gráfico de donut
    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  }

  // Método para inicializar y mostrar el gráfico
  mostrarGrafico(): void {

    // Ordenar los datos por fecha
    this.weightData.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());


    const morrisData = this.weightData.map(item => ({
      y: item.fecha,
      a: item.valor,
    }));

    // Utilizar Morris.js para dibujar el gráfico
    Morris.Line({
      element: 'morris-line-chart',
      data: morrisData,
      xkey: 'y',
      ykeys: ['a'],
      labels: ['Peso (kg)'],
      parseTime: true,
      hideHover: 'auto',
      resize: true,

    });
  }

  // Método para cargar datos de peso desde el servicio
  cargarDatosDePeso(): void {
    this.usuarioPesoService.obtenerPesosUsuario(this.usuario.uid)
      .subscribe(
        (data: any) => {  // Asegurarse de que el tipo esperado sea un array

          this.weightData = data.pesos;


          this.mostrarGrafico();
        },
        error => {
          console.error('Error al cargar datos de peso', error);
        }
      );
  }

  // Método para cambiar la imagen actual del carrusel
  cambiarImagen(index: number): void {
    this.carousel.slideTo(index);
  }

  // Método para manejar la subida de archivos
  onFileChange(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.imagenSubir = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imgTemp = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // Método para subir la imagen
  subirImagen(): void {
    // Lógica para subir la imagen si es necesario
  }

  // initializeSwiper(): void {
  //   console.log(this.swiperContainer.nativeElement);
  //   if (this.swiperContainer && this.swiperContainer.nativeElement) {
  //     const swiperConfig = {
  //       slidesPerView: 1,
  //       spaceBetween: 10,
  //       navigation: {
  //         nextEl: '.swiper-button-next',
  //         prevEl: '.swiper-button-prev',
  //       },
  //     };

  //     this.carousel = new Swiper(this.swiperContainer.nativeElement, swiperConfig);
  //   }
  // }
  // Método para mostrar la gráfica 2
  // mostrarGrafico2(): void {
  // console.log('mostrar hola mundo');
  // console.log('mostrar hola mundo');
  // console.log('mostrar hola mundo');
  // console.log('mostrar hola mundo');
  // console.log('mostrar hola mundo');


  // // Obtener el peso actual del usuario
  // const pesoActual: number = this.weightData[this.weightData.length - 1].valor;
  // console.log('mostrar hola mundo1');
  // console.log(this.pesoActual);

  // // Obtener el peso ideal
  // const pesoIdeal: number = 100;
  // // console.log('mostrar hola mundo2);
  // // console.log(this.pesoActual);
  // // Calcular el porcentaje del progreso hacia el objetivo
  // let porcentajeProgreso: number = (pesoActual / pesoIdeal) * 100;
  // // console.log('mostrar hola mundo3');
  // // console.log(this.pesoActual);
  // // Obtener el elemento que contiene el gráfico circular
  // const myWeightKnob = document.querySelector('#my-weight-knob');
  // // console.log('mostrar hola mundo4');
  // // console.log(this.pesoActual);
  // // Establecer el valor del knob
  // myWeightKnob.setAttribute('value', porcentajeProgreso.toFixed(0));
  // // console.log('mostrar hola mundo5');
  // // console.log(this.pesoActual);

  // // Configurar el knob
  // knob.createKnob(myWeightKnob, {
  //     // console.log('mostrar hola mundo5');
  // // console.log(this.pesoActual);

  //   value: 50, // Valor inicial
  //   min: 0, // Límite inferior del rango
  //   max: 100, // Límite superior del rango
  //   bgColor: '#7460ee', // Color de fondo
  //   thickness: 0.1, // Grosor del indicador

  //   width: 250, // Ancho del control deslizante
  //   height: 250, // Altura del control deslizante
  //   angleOffset: 90, // Ángulo de desplazamiento del knob
  //   lineCap: "round", // Forma del extremo del indicador del knob
  //   fgColor: "#7460ee", // Color del indicador del knob
  //   readOnly: true, // Knob de solo lectura
  //   setValue: (value: any) => { // Función para establecer el valor del knob
  //     this.value = value; // Actualizar la variable de peso con el valor del knob
  //     // Redibujar el knob aquí, si es necesario
  //   },
  //   format: (value: any) => { // Función para formatear el valor del knob
  //     return value + "%";
  //   }

  // });
  //

  // mostrarGrafico3(): void {

  //   // Obtener el peso actual del usuario
  //   const pesoActual: number = this.weightData[this.weightData.length - 1].valor;

  //   // Obtener el peso ideal
  //   const pesoIdeal: number = 100;

  //   // Calcular el porcentaje del progreso hacia el objetivo
  //   const porcentajeProgreso: number = (pesoActual / pesoIdeal) * 100;

  //   // Crear los datos para el gráfico
  //   const morrisData = [
  //     {
  //       y: porcentajeProgreso,
  //       label: 'Progreso',
  //     },
  //     {
  //       y: 100 - porcentajeProgreso,
  //       label: 'Restante',
  //     },
  //   ];

  //   // Utilizar Morris.js para dibujar el gráfico
  //   Morris.Donut({
  //     element: 'morris-donut-chart',
  //     data: morrisData,
  //     colors: ['#7460ee', '#ffffff'],
  //     labelColor: '#000',
  //   });




  // }



  // // Obtener el elemento que contiene el gráfico circular
  // const myWeightKnob = document.querySelector('#my-weight-knob');
  //  // Configurar el knob
  //  const myKnob = knob.createKnob(250, 250);
  //  myKnob.setValue(porcentajeProgreso); // Establecer el valor del knob
  //  myKnob.addTo(myWeightKnob); // Agregar el knob al elemento HTML

  // // Establecer el valor del knob
  // myWeightKnob.setAttribute('value', porcentajeProgreso.toFixed(0));

  // // Configurar el knob
  // knob.createKnob(myWeightKnob, {
  //    value: 50, // Valor inicial
  //    min: 0, // Límite inferior del rango
  //    max: 100, // Límite superior del rango
  //    bgColor: '#7460ee', // Color de fondo
  //    thickness: 0.1, // Grosor del indicador

  //    width: 250, // Ancho del control deslizante
  //    height: 250, // Altura del control deslizante
  //    angleOffset: 90, // Ángulo de desplazamiento del knob
  //    lineCap: "round", // Forma del extremo del indicador del knob
  //    fgColor: "#7460ee", // Color del indicador del knob
  //    readOnly: true, // Knob de solo lectura
  //    setValue: (value: any) => { // Función para establecer el valor del knob
  //      this.value = value; // Actualizar la variable de peso con el valor del knob
  //      // Redibujar el knob aquí, si es necesario
  //    },
  //    format: (value: any) => { // Función para formatear el valor del knob
  //      return value + "%";
  //    }

  // });





}
