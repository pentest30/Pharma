import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import Quagga from '@ericblade/quagga2';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BeepService } from 'src/app/shared/beep.service';

@Component({
  selector: 'app-scan-form',
  templateUrl: './scan-form.component.html',
  styleUrls: ['./scan-form.component.scss']
})
export class ScanFormComponent implements OnInit {
  @ViewChild('scanner')
  scanner: ZXingScannerComponent;
  @Output() scanSuccess = new EventEmitter<string>();
  errorMessage: string;
  started: boolean;
  private lastScannedCode: string | undefined;
  private lastScannedCodeDate: number  | undefined;
  constructor(    private changeDetectorRef: ChangeDetectorRef,    private dialogRef: MatDialogRef<ScanFormComponent>,private beepService: BeepService


    ) { }

  ngOnInit(): void {
    // this.initializeScanner();
    
  }
 
  myFn(event) {
    this.beepService.beep();

    this.dialogRef.close(event);
    console.log(event);
  }
  // private initializeScanner(): Promise<void> {
  //   if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
  //     this.errorMessage = 'getUserMedia is not supported. Please use Chrome on Android or Safari on iOS';
  //     this.started = false;
  //     return Promise.reject(this.errorMessage);
  //   }

  //   // enumerate devices and do some heuristics to find a suitable first camera
  //   return Quagga.CameraAccess.enumerateVideoDevices()
  //     .then(mediaDeviceInfos => {
  //       const mainCamera = getMainBarcodeScanningCamera(mediaDeviceInfos);
  //       if (mainCamera) {
  //         console.log(`Using ${mainCamera.label} (${mainCamera.deviceId}) as initial camera`);
  //         return this.initializeScannerWithDevice(mainCamera.deviceId);
  //       } else {
  //         console.error(`Unable to determine suitable camera, will fall back to default handling`);
  //         return this.initializeScannerWithDevice(undefined);
  //       }
  //     })
  //     .catch(error => {
  //       this.errorMessage = `Failed to enumerate devices: ${error}`;
  //       this.started = false;
  //     });
  // }
  
 
  // private initializeScannerWithDevice(preferredDeviceId: string | undefined): Promise<void> {
  //   console.log(`Initializing Quagga scanner...`);

  //   const constraints: MediaTrackConstraints = {};
  //   if (preferredDeviceId) {
  //     // if we have a specific device, we select that
  //     constraints.deviceId = preferredDeviceId;
  //   } else {
  //     // otherwise we tell the browser we want a camera facing backwards (note that browser does not always care about this)
  //     constraints.facingMode = 'environment';
  //   }

  //   return Quagga.init({
  //       inputStream: {
  //         type: 'LiveStream',
  //         constraints: {
  //           width: 520,
  //           height: 150,                  
  //           facingMode: "environment"  //"environment" for back camera, "user" front camera
  //           } ,
  //                     area: { // defines rectangle of the detection/localization area
  //           top: '25%',    // top offset
  //           right: '10%',  // right offset
  //           left: '10%',   // left offset
  //           bottom: '25%'  // bottom offset
  //         },
  //         target: document.querySelector('#scanner-container'),
             
  //       },
  //       decoder: {
  //         readers : ["code_128_reader"],
          
  //         multiple: false
  //       },
  //       // See: https://github.com/ericblade/quagga2/blob/master/README.md#locate
  //       locate: false
  //     },
  //     (err) => {
  //       if (err) {
  //         console.error(`Quagga initialization failed: ${err}`);
  //         this.errorMessage = `Initialization error: ${err}`;
  //         this.started = false;
  //       } else {
  //         console.log(`Quagga initialization succeeded`);
  //         Quagga.start();
  //         this.started = true;
  //         this.changeDetectorRef.detectChanges();
  //         Quagga.onDetected((res) => {
  //           alert(res);
  //           if (res.codeResult.code) {
  //             this.onBarcodeScanned(res.codeResult.code);
  //           }
  //         });
  //       }
  //     });
  // }

  // onBarcodeScanned(code: string) {

  //   // ignore duplicates for an interval of 1.5 seconds
  //   const now = new Date().getTime();
  //   if (code === this.lastScannedCode
  //     && ((this.lastScannedCodeDate !== undefined) && (now < this.lastScannedCodeDate + 1500))) {
  //     return;
  //   }

   

  //   this.lastScannedCode = code;
  //   this.lastScannedCodeDate = now;
  //   alert(code);
  //   // this.beepService.beep();
  //   // this.changeDetectorRef.detectChanges();
  // }
}
// export function isKnownBackCameraLabel(label: string): boolean {
//   const labelLowerCase = label.toLowerCase();
//   return environmentFacingCameraLabelStrings.some(str => {
//     return labelLowerCase.includes(str);
//   });
// }
// export function getMainBarcodeScanningCamera(devices: MediaDeviceInfo[]): MediaDeviceInfo | undefined {
//   const backCameras = devices.filter(v => isKnownBackCameraLabel(v.label));
//   const sortedBackCameras = backCameras.sort((a, b) => a.label.localeCompare(b.label));
//   return sortedBackCameras.length > 0 ? sortedBackCameras[0] : undefined;
// }
// const environmentFacingCameraLabelStrings: string[] = [
//   'rear',
//   'back',
//   'rück',
//   'arrière',
//   'trasera',
//   'trás',
//   'traseira',
//   'posteriore',
//   '后面',
//   '後面',
//   '背面',
//   '后置', // alternative
//   '後置', // alternative
//   '背置', // alternative
//   'задней',
//   'الخلفية',
//   '후',
//   'arka',
//   'achterzijde',
//   'หลัง',
//   'baksidan',
//   'bagside',
//   'sau',
//   'bak',
//   'tylny',
//   'takakamera',
//   'belakang',
//   'אחורית',
//   'πίσω',
//   'spate',
//   'hátsó',
//   'zadní',
//   'darrere',
//   'zadná',
//   'задня',
//   'stražnja',
//   'belakang',
//   'बैक'
// ];
