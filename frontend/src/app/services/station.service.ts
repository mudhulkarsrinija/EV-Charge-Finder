import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StationResponse } from '../models/station.model';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  private readonly apiUrl =
    'http://localhost:3000/api/stations';

  constructor(private http: HttpClient) {}

  getStations(): Observable<StationResponse> {
    return this.http.get<StationResponse>(this.apiUrl);
  }
}