import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  form: FormGroup;
  payload;
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private chatService: ChatServiceService,
    private toastController: ToastController,
    private router: Router) { }

  ngOnInit() {

    this.chatService.getStudentData(this.chatService.getUserId()).subscribe(res => {
      this.payload = res;
      if (this.payload) {
        this.form = this.fb.group({
          emailId: [this.payload.emailId],
          firstName: [this.payload.firstName, [Validators.required, Validators.pattern(/^[A-Za-z ,'-]+$/i)]],
          lastName: [this.payload.lastName, [Validators.required, Validators.pattern(/^[A-Za-z ,'-]+$/i)]],
          degree: [this.payload.degree, [Validators.required, Validators.pattern(/^[A-Za-z ,'-]+$/i)]],
          university: [this.payload.university, [Validators.required, Validators.pattern(/^[A-Za-z ,'-]+$/i)]],
          subject: [this.payload.subject, [Validators.required, Validators.pattern(/^[A-Za-z ,'-]+$/i)]],
          phoneNumber: [this.payload.phoneNumber, [Validators.required, Validators.pattern(/^[0-9 -+]+$/i)]],
        });
        this.form.controls['emailId'].disable();
      }
    });

  }

  saveData() {
    this.chatService.saveStudentData(this.form.getRawValue()).subscribe(res=>{
      const toast = this.toastController.create({
        message: 'Your settings have been saved.',
        duration: 2000
      });
      toast.then((toast)=>{toast.present()});
    });
  }

  moveToHome() {
    this.router.navigate['/tabs/tab1/0']
  }

}
