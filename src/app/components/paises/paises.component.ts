import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Pais } from "../../models/pais";
import { ModalDialogService } from "../../services/modal-dialog.service";
import { PaisesService } from "../../services/paises.service";

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.css']
})
export class PaisesComponent implements OnInit {
  Titulo = "Paises";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de paises 
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  Lista: Pais[] = [];
  SinBusquedasRealizadas = true;

  Pagina = 1; // inicia pagina 1

  FormFiltro: FormGroup;
  FormReg: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private paisesService: PaisesService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormFiltro = this.formBuilder.group({
      Nombre: [""],
      Activo: [true]
    });
    this.FormReg = this.formBuilder.group({
      IdPais: [0],
      Nombre: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(30)]
      ],
      
      FechaCenso: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      Poblacion: [
        "",
        [Validators.required, Validators.pattern("[0-9]{13}")]
      ],
    });
  }


  Agregar() {
    this.AccionABMC = "A";
    this.FormReg.reset({ Activo: true });
    this.submitted = false;
    //this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
  }

  // Buscar segun los filtros, establecidos en FormReg
  Buscar() {
    this.SinBusquedasRealizadas = false;
    this.paisesService
      .get()
      .subscribe((res: any) => {
        this.Lista = res;
      });
  }


  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };
    console.log("itemCopy",itemCopy);
    

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaCenso.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.FechaCenso = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (itemCopy.IdPais == 0 || itemCopy.IdPais == null) {
      itemCopy.IdPais = 0;
        this.paisesService.post(itemCopy).subscribe((res: any) => {
        console.log("res",res);  
        this.Volver();
        this.modalDialogService.Alert("Registro agregado correctamente.");
        this.Buscar();
      });
    }
  }


  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  ImprimirListado() {
    this.modalDialogService.Alert("Sin desarrollar...");
  }

}
