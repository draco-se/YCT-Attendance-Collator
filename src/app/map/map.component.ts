import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { MapService } from './map.service';

declare var google: any;

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() serverElement: {
    sessionId: string;
    programmeId: string;
    courseId: string;
    attendanceRecordId: string;
  };

  @Output() coordinateGenerated = new EventEmitter<Coordinates>();

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;
  map: google.maps.Map;
  isLoading: boolean = false;
  isLoading2: boolean = false;
  error: string;
  success: boolean = false;
  userSub: Subscription;
  isAuthenticated: boolean = false;

  constructor(
    private mapService: MapService,
    private authService: AuthService,
    private router: Router,
  ) {}
  coordinates: Coordinates;
  formattedaddress = '';
  // options = {
  //   componentRestrictions: {
  //     country: 'NG',
  //   },
  // };

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  AddressChange(address: any) {
    //setting address from API to local variable
    this.formattedaddress = address.formatted_address.trim();
  }

  tryAgain() {
    this.success = false;
  }

  autoLocate() {
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

        const coordinate: Coordinates = {
          lat: crd.latitude,
          lng: crd.longitude,
          accuracy: crd.accuracy,
        };

        if (coordinate.accuracy > 100) {
          this.error =
            'Your location is inaccurate! This might be due to a network issue';
          this.isLoading = false;
          return;
        }

        this.coordinates = coordinate;
        await this.render(this.mapEl.nativeElement);
        console.log(JSON.stringify(coordinate));
        this.isLoading = false;
      },
      (err) => {
        this.error =
          'Could not locate you unfortunately. Please enter an address manually';
        this.isLoading = false;
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }

  render(map: HTMLDivElement) {
    this.map = new google.maps.Map(map, {
      center: this.coordinates,
      zoom: 18,
    });

    new google.maps.Marker({
      position: this.coordinates,
      map: this.map,
    });

    this.success = true;
  }

  findAddressHandler(form: NgForm) {
    this.isLoading = true;
    if (form.value.address.trim() == '') {
      throw new Error('Form input field is empty');
    }

    this.mapService.getCoordsFromAddress(form.value.address).subscribe({
      next: async (res) => {
        if (!res['lat']) {
          this.isLoading = false;
          this.error = 'Enter a more precise address!';
          return;
        }

        this.coordinates = res;
        await this.render(this.mapEl.nativeElement);
        this.isLoading = false;
        this.error = '';
      },
      error: (err) => {
        this.isLoading = false;

        if (err['message']) {
          this.error = err.message;
          return;
        }

        this.error = 'Invalid address. try making it more precise!';
      },
    });
  }

  onSubmit() {
    this.isLoading2 = true;

    if (this.isAuthenticated) {
      this.mapService
        .postCoordinates({
          ...this.serverElement,
          coordinates: this.coordinates,
        })
        .subscribe({
          next: (res) => {
            this.router.navigate([
              'programmes',
              res.sessionId,
              res.programmeId,
              res.courseId,
              res.recordId,
            ]);
            console.log(res);
          },
          error: (errorMessage) => {
            this.isLoading2 = false;
            this.error = errorMessage;
          },
        });
    } else {
      this.coordinateGenerated.emit(this.coordinates);
    }
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
