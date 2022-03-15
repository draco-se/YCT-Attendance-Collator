import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  email: string;
  id: string;
  name: string;
  isAdmin: boolean;
  token: string;
  expiresIn: number;
}

const bufferToBase64URLString = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let str = '';

  for (const charCode of bytes) {
    str += String.fromCharCode(charCode);
  }

  const base64String = btoa(str);

  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const base64URLStringToBuffer = (base64URLString: string): ArrayBuffer => {
  // Convert from Base64URL to Base64
  const base64 = base64URLString.replace(/-/g, '+').replace(/_/g, '/');
  /**
   * Pad with '=' until it's a multiple of four
   * (4 - (85 % 4 = 1) = 3) % 4 = 3 padding
   * (4 - (86 % 4 = 2) = 2) % 4 = 2 padding
   * (4 - (87 % 4 = 3) = 1) % 4 = 1 padding
   * (4 - (88 % 4 = 0) = 4) % 4 = 0 padding
   */
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64.padEnd(base64.length + padLength, '=');

  // Convert to a binary string
  const binary = atob(padded);

  // Convert binary string to buffer
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return buffer;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  signedUSer: string;
  sucessMessage = new Subject<boolean>();

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(environment.restApiAddress + '/login', {
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleErrors),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.id,
            resData.name,
            resData.isAdmin,
            resData.token,
            +resData.expiresIn,
          );
        }),
      );
  }

  signup(
    email: string,
    fullName: string,
    password: string,
    confirmPassword: string,
  ) {
    return this.http
      .post(environment.restApiAddress + '/signup', {
        email,
        fullName,
        password,
        confirmPassword,
      })
      .pipe(
        catchError(this.handleErrors),
        tap((resData: any) => {
          this.signedUSer = resData.userId;
        }),
      );
  }

  webAuthnReg() {
    return this.http
      .post<any>(environment.restApiAddress + '/webauthn-reg', {
        userId: this.signedUSer,
      })
      .pipe(
        switchMap((createCredentialDefaultArgs) => {
          const credentials: PublicKeyCredentialCreationOptions = {
            ...createCredentialDefaultArgs,
            challenge: Uint8Array.from(
              createCredentialDefaultArgs.challenge,
              (c: any) => c.charCodeAt(0),
            ),
            user: {
              ...createCredentialDefaultArgs.user,
              id: Uint8Array.from(
                atob(createCredentialDefaultArgs.user.id),
                (c: any) => c.charCodeAt(0),
              ),
            },
          };

          this.signedUSer = null;
          console.log(credentials);
          return navigator.credentials.create({ publicKey: credentials });
        }),
        switchMap(async (resData: any) => {
          console.log(resData);

          const credential = {
            response: {
              clientDataJSON: bufferToBase64URLString(
                resData.response.clientDataJSON,
              ),
              attestationObject: bufferToBase64URLString(
                resData.response.attestationObject,
              ),
            },
          };

          this.http
            .post<{ message: string }>(
              environment.restApiAddress + '/webauthn-reg-verification',
              {
                credential,
              },
            )
            .subscribe((res: any) => {
              this.sucessMessage.next(!!res.message);
            });
        }),
      );
  }

  webauthnLogin(email: string) {
    return this.http
      .post<any>(environment.restApiAddress + '/webauthn-login', {
        email,
      })
      .pipe(
        switchMap((createCredentialDefaultArgs) => {
          const credentials: PublicKeyCredentialRequestOptions = {
            ...createCredentialDefaultArgs,
            challenge: base64URLStringToBuffer(
              createCredentialDefaultArgs.challenge,
            ),

            allowCredentials: [
              {
                ...createCredentialDefaultArgs.allowCredentials[0],
                id: base64URLStringToBuffer(
                  createCredentialDefaultArgs.allowCredentials[0].id,
                ),
              },
            ],
          };

          console.log(credentials);
          return navigator.credentials.get({ publicKey: credentials });
        }),
        switchMap(async (resData: any) => {
          console.log(resData);

          const credential = await {
            id: resData.id,
            response: {
              authenticatorData: bufferToBase64URLString(
                resData.response.authenticatorData,
              ),
              clientDataJSON: bufferToBase64URLString(
                resData.response.clientDataJSON,
              ),
              signature: bufferToBase64URLString(resData.response.signature),
              userHandle: bufferToBase64URLString(resData.response.userHandle),
            },
          };

          this.http
            .post<{ message: string }>(
              environment.restApiAddress + '/webauthn-login-verification',
              {
                credential,
              },
            )
            .subscribe((resData) => {
              console.log(resData.message);
            });
        }),
      );
  }

  googleAuth(idToken: string) {
    return this.http
      .post<AuthResponseData>(environment.restApiAddress + '/google-auth', {
        idToken,
      })
      .pipe(
        catchError(this.handleErrors),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.id,
            resData.name,
            resData.isAdmin,
            resData.token,
            +resData.expiresIn,
          );
        }),
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      name: string;
      isAdmin: boolean;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('YctUserData'));
    if (!userData) return;
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData.name,
      userData.isAdmin,
      userData._token,
      new Date(userData._tokenExpirationDate),
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - Date.now();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('YctUserData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    name: string,
    isAdmin: boolean,
    token: string,
    expiresIn: number,
  ) {
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    const user = new User(email, userId, name, isAdmin, token, expirationDate);
    this.autoLogout(expiresIn * 1000);
    this.user.next(user);
    localStorage.setItem('YctUserData', JSON.stringify(user));
  }

  private handleErrors(errorRes: HttpErrorResponse) {
    let errorMeassge = 'An unknown error occurred';
    console.log(errorRes.error);
    if (!errorRes.error) {
      return throwError(errorMeassge);
    }
    switch (errorRes.error.message) {
      case 'E-mail already exist!':
        errorMeassge = 'This email exist already!';
        break;

      case 'Please enter a valid email':
        errorMeassge = 'Invalid email!';
        break;

      case 'Email not found':
      case 'Wrong password!':
        errorMeassge = 'Wrong Email or password!';
        break;

      case 'Password has to be valid':
        errorMeassge = 'Enter password!';
        break;

      case 'Passwords have to match':
        errorMeassge = 'passwords have to match!';
        break;

      case 'Password not strong':
        errorMeassge =
          'Password must contain 8 charcters+, capital letter(s) and number(s)!';
        break;

      case 'Enter Full Name':
        errorMeassge = 'Enter Full Name!';
        break;
    }

    return throwError(errorMeassge);
  }
}
