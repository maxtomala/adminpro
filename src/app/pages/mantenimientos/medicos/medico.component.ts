import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;



  constructor( private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params
    .subscribe( ({ id }) => this.cargarMedico( id ) );


    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
    .subscribe( hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
    })

  }
  cargarMedico(id: string): void {
    if (id === 'nuevo') {
      return; // No es necesario continuar, ya que no hay operaciones adicionales
    }

    this.medicoService.obtenerMedicoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe(medico => {
        if (!medico) {
          this.router.navigateByUrl(`/dashboard/medicos`);
          return; // Finaliza la función después de la redirección
        }

        const { nombre, hospital: { _id } } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      });

    // Agrega un retorno fuera del bloque if
    return; // Aunque no es necesario, se añade para indicar que la función no devuelve nada directamente
  }





  cargarHospitales() {

    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        console.log(hospitales)
      })

  }

  guardarMedico() {

    const { nombre } = this.medicoForm.value;

    if ( this.medicoSeleccionado ) {
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {
          Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
        })

    } else {
      // crear

      this.medicoService.crearMedico( this.medicoForm.value )
          .subscribe( (resp: any) => {
            Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
            this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
        })
    }



  }

}
