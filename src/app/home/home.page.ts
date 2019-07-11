import { Component, OnInit } from '@angular/core';
import { FCM } from 'capacitor-fcm';
const fcm = new FCM();

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  PushNotificationChannel } from '@capacitor/core';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}
  ngOnInit() {
    console.log('Initializing HomePage');
  }
  listenRegister() {
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register().then( _ => {
      fcm.subscribeTo({ topic: 'test'})
      .then( r => alert('subscribed to topic'))
      .catch( err => console.log(err));
    });

    // get remote token
    fcm.getToken()
        .then(r => alert(`Token ${r.token}`))
        .catch(err => console.log(err));

    // On succcess, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        alert('Push registration success, token: ' + token.value);
        console.log(JSON.stringify(token.value));
      }
    );

     // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );
    console.log("Pressed Register")
  }

  listenReceived() {
    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );
    console.log("Pressed Received")
  }

  listenPerformed() {
    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
    console.log("Pressed Performed")
  }
}
