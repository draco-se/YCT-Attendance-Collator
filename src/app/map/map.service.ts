import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor() {}

  locateUserHandler() {
    if (!navigator.geolocation) {
      alert(
        'Location feature is not available on your browser - please use a more modern one',
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        var crd = pos.coords;

        const coordinate = {
          lat: crd.latitude,
          lng: crd.longitude,
          accuracy: crd.accuracy,
        };

        console.log(JSON.stringify(coordinate));
      },
      (err) => {
        alert(
          'Could not locate you unfortunately. Please enter an address manually',
        );
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }
}
