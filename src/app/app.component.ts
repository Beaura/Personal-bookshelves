import { Component } from '@angular/core';
import firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    var config = {
      apiKey: "AIzaSyC3_ob5JikAMryOLs9mvuCTI0F58u7evTw",
      authDomain: "personal-booksheleves.firebaseapp.com",
      databaseURL: "https://personal-booksheleves.firebaseio.com",
      projectId: "personal-booksheleves",
      storageBucket: "personal-booksheleves.appspot.com",
      messagingSenderId: "318402133892",
      appId: "1:318402133892:web:1f087eeabf579df26767d1"
    };
    // Initialize Firebase
    firebase.initializeApp(config);
  }
}
