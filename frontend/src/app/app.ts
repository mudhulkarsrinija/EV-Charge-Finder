
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import * as L from 'leaflet';

import { StationService } from './services/station.service';
import { ChargingStation } from './models/station.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  stations: ChargingStation[] = [];
  filteredStations: ChargingStation[] = [];

  searchText = '';
  loading = true;
  errorMessage = '';

  favorites: number[] = [];
  selectedStation: ChargingStation | null = null;

  private map?: L.Map;
  private markers: L.CircleMarker[] = [];

  constructor(
    private stationService: StationService,
    private changeDetector: ChangeDetectorRef
  ) {
    try {
      const savedFavorites = localStorage.getItem('ev-favorites');

      this.favorites = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      if (!Array.isArray(this.favorites)) {
        this.favorites = [];
      }
    } catch {
      this.favorites = [];
    }
  }

  ngAfterViewInit(): void {
    this.loadStations();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
    this.markers = [];
  }

  // Load charging stations from the Node.js API.
  loadStations(): void {
    this.loading = true;
    this.errorMessage = '';
    this.changeDetector.detectChanges();

    console.log('Loading stations from API...');

    this.stationService.getStations().subscribe({
      next: (response) => {
        console.log('Stations received:', response);

        if (
          !response ||
          response.success !== true ||
          !Array.isArray(response.data)
        ) {
          this.errorMessage =
            'The server returned an unexpected response.';

          this.loading = false;
          this.changeDetector.detectChanges();
          return;
        }

        // Store the received stations.
        this.stations = response.data;
        this.filteredStations = [...response.data];

        // Finish loading.
        this.loading = false;

        console.log('Total stations:', this.stations.length);
        console.log(
          'Filtered stations:',
          this.filteredStations.length
        );
        console.log('Loading status:', this.loading);

        // Update the Angular view.
        this.changeDetector.detectChanges();

        // Initialize the map after the station cards render.
        setTimeout(() => {
          this.initializeMap();
        }, 300);
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to load stations:', error);

        this.errorMessage =
          'Could not load charging stations. Check that the backend is running at http://localhost:3000.';

        this.loading = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  // Search by station name, location, or charger type.
  searchStations(): void {
    const query = this.searchText.trim().toLowerCase();

    this.filteredStations = this.stations.filter(station =>
      station.name.toLowerCase().includes(query) ||
      station.location.toLowerCase().includes(query) ||
      station.chargerType.toLowerCase().includes(query)
    );

    this.updateMarkers();
  }

  // Add or remove a station from favorites.
  toggleFavorite(station: ChargingStation): void {
    if (this.isFavorite(station)) {
      this.favorites = this.favorites.filter(
        id => id !== station.id
      );
    } else {
      this.favorites = [
        ...this.favorites,
        station.id
      ];
    }

    try {
      localStorage.setItem(
        'ev-favorites',
        JSON.stringify(this.favorites)
      );
    } catch (error) {
      console.error('Could not save favorites:', error);
    }
  }

  // Check whether a station is saved.
  isFavorite(station: ChargingStation): boolean {
    return this.favorites.includes(station.id);
  }

  // Select a station and move the map to it.
  selectStation(station: ChargingStation): void {
    this.selectedStation = station;

    if (this.map) {
      this.map.setView(
        [station.latitude, station.longitude],
        15
      );
    }
  }

  // Initialize the Leaflet map.
  private initializeMap(): void {
    const mapElement = document.getElementById('map');

    if (!mapElement) {
      console.warn('Map element was not found.');
      return;
    }

    // Avoid initializing Leaflet twice on the same element.
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    this.map = L.map(mapElement).setView(
      [17.4435, 78.3772],
      12
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }
    ).addTo(this.map);

    this.updateMarkers();

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 200);
  }

  // Display map markers for filtered stations.
  private updateMarkers(): void {
    if (!this.map) {
      return;
    }

    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    this.filteredStations.forEach(station => {
      const marker = L.circleMarker(
        [station.latitude, station.longitude],
        {
          radius: 9,
          color: station.available ? '#a7f36b' : '#ff7272',
          fillColor: station.available ? '#a7f36b' : '#ff7272',
          fillOpacity: 0.9,
          weight: 2
        }
      ).addTo(this.map!);

      marker.bindPopup(
        `<strong>${this.escapeHtml(station.name)}</strong><br>` +
        `${this.escapeHtml(station.location)}<br>` +
        `${this.escapeHtml(station.chargingSpeed)}`
      );

      marker.on('click', () => {
        this.selectedStation = station;
        this.changeDetector.detectChanges();
      });

      this.markers.push(marker);
    });
  }

  // Escape text before inserting it into a map popup.
  private escapeHtml(value: string): string {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return value.replace(/[&<>"']/g, char => entities[char]);
  }

  // Number of stations marked available.
  get availableCount(): number {
    return this.stations.filter(
      station => station.available
    ).length;
  }

  // Number of stations saved as favorites.
  get favoriteCount(): number {
    return this.favorites.length;
  }
}
