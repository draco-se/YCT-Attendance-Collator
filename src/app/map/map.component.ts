import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import {} from 'googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // @ViewChild('map') mapElement: any;
  map: google.maps.Map;
  isLoading: boolean = false;

  constructor(private mapService: MapService) {}
  coordinates: { lat: number; lng: number };

  ngOnInit(): void {}

  autoLocate(map: HTMLDivElement) {
    if (!navigator.geolocation) {
      alert(
        'Location feature is not available on your browser - please use a more modern one',
      );
      return;
    }
    this.isLoading = true;
    return navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const crd = pos.coords;

        const coordinate = {
          lat: crd.latitude,
          lng: crd.longitude,
          accuracy: crd.accuracy,
        };

        this.coordinates = coordinate;
        this.render(map);
        console.log(coordinate);
        this.isLoading = false;
      },
      (err) => {
        alert(
          'Could not locate you unfortunately. Please enter an address manually',
        );
        this.isLoading = false;
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }

  render(map: HTMLDivElement) {
    this.map = new google.maps.Map(map, {
      center: this.coordinates,
      zoom: 16,
    });

    new google.maps.Marker({
      position: this.coordinates,
      map: this.map,
    });
  }
}
