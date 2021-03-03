import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(file: File,string1: string,string2: string,string3: string,string4: string,string5: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('string1', string1);
    formData.append('string2', string2);
    formData.append('string3', string3);
    formData.append('string4', string4);
    formData.append('string5', string5);
console.log(file);
    const req = new HttpRequest('POST', `${this.baseUrl}/generateapk`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
