import { Injectable } from '@angular/core';
import firebase from 'firebase';
// import { DataSnapshot } from 'firebase/database/DataSnapshot';
import { Subject } from 'rxjs';
import { Book } from '../models/Book.model';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>();
  constructor() {
    this.getBooks();
   }

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks() {
    firebase.database().ref('/books').
    on('value', (data) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
    });
  }

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    if(book.photo){
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log("photo supprimée ! ! !");
        }
      ).catch(
        (error) => {
          console.log('Fichier non trouvé en base : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    // save books sauvegarde l'arret local, si le livre est supprimé, le fait de saveBooks() ////savegardera sans le livre supprimer
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
    // return new Promise(
    //   (resolve, reject) => {
    //     const almostUniqueFileName = Date.now().toString();
    //     const upload = firebase.storage().ref()
    //     .child('images/' + almostUniqueFileName + file.name)
    //     .put(file);
    //     // put(file) enregistre le fhichier à l'addresse définie précéd
    //     // upload avec .on va réagir aux 3 différents types d'evnt lier à cet upload: 1. debut chargement, 2. eventuelle erreur, 3. chargement réussi 
    //     // on cherche a réagir à chaue changement d'état 
    //     upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
    //       () => {
    //         // pour suivre le chargement
    //         console.log('Chargement en cours');
    //         upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
    //           console.log('File available at', downloadURL);
    //         });
    //       },
    //       (error) => {
    //         console.log('Erreur lors du chargement vers la base : ' + error);
    //         reject();
    //       },
    //       () => {
    //         upload.snapshot.ref.getDownloadURL().then(
    //           (downloadUrl) => {
    //             console.log('Upload successful! ('+downloadUrl+')');
    //             resolve(downloadUrl);
    //           }
    //         );
    //       }
    //         // resolve(upload.snapshot.downloadURL);
    //         // l'url direct à l'amage dans le storage, pour enregister dans la bdd et l'afficher dans single book component
    //         // resolve(upload.snapshot.getDownloadURL())
          
    //       );
    //   }
    // );
  }
}
