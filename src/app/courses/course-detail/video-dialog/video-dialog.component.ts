import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-video-dialog',
  template:`
    <h2 mat-dialog-title>Video</h2>
    <mat-dialog-content>
      <iframe width="560" height="315"
      [src]="trustedUrl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class VideoDialogComponent {
  trustedUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<VideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
  }
}
