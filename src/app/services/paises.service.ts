import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
import { Pais } from "../models/pais";

@Injectable({
  providedIn: "root"
})
export class PaisesService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    // la barra al final del resourse url es importante para los metodos que concatenan el id del recurso (GetById, Put)
    //this.resourceUrl = "https://pavii.ddns.net/api/articulos/";
    //this.resourceUrl = "https://bitgocba.duckdns.org/api/Articulos/";
    this.resourceUrl = "https://pav2.azurewebsites.net/api/paises/";
  }

  get() {
    let params = new HttpParams();
    return this.httpClient.get(this.resourceUrl, { params: params });
  }

  post(obj: Pais) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
}
