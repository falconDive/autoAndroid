import { Component, OnInit, Input } from '@angular/core';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";  

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';
  string1 = '';
  string2 = '';
  string3 = '';
  string4 = '';
  string5 = '';
  fileInfos: Observable<any>;
  click : boolean = false;

  constructor(private uploadService: UploadFileService,private SpinnerService: NgxSpinnerService) { 
    
  }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;

     
    const img = new Image();
    img.src = window.URL.createObjectURL( this.selectedFiles[0] );
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles[0]);

    console.log("selectedFiles:"+this.selectedFiles[0].name);
    reader.onload = () => {
      setTimeout(() => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      window.URL.revokeObjectURL( img.src );

      if( width !== 1024 && height !== 1024 ) {
         this.message = "picture should be 1024 x 1024 size , Please try another file"
      }else{
        this.message = ""
      }
      //this.imagePreview = reader.result;
      //this.employee.photo = reader.result.split(",")[1];
    }, 2000);
  };
 
  }

  selectinput(inputcomponent): void {
    if(inputcomponent.id == 'string1'){
      this.string1=inputcomponent.value;
    }else if(inputcomponent.id == 'string2'){
      this.string2=inputcomponent.value;
    }else if(inputcomponent.id == 'string3'){
      this.string3=inputcomponent.value;
    }else if(inputcomponent.id == 'string4'){
      this.string4=inputcomponent.value;
    }else if(inputcomponent.id == 'string5'){
      this.string5=inputcomponent.value;
    }
  }

  upload(): void {
//    this.click = !this.click;
    this.progress = 0;
    this.SpinnerService.show(); 
    //if (this.string1 == '' || this.string2 == '' || this.string3 == '' || this.string4 == '' || this.string5 == '') {
    //  return;
    //}

    this.currentFile = this.selectedFiles.item(0);

    console.log('this.string1',this.string1);
    console.log('this.string2',this.string2);
    console.log('this.string3',this.string3);
    console.log('this.string4',this.string4);
    console.log('this.string5',this.string5);
    console.log('this.currentFile',this.currentFile);

    
    this.uploadService.upload(this.currentFile,this.string1,this.string2,this.string3,this.string4,this.string5).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.uploadService.getFiles();
          this.SpinnerService.hide();  
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Error';
        this.currentFile = undefined;
        this.SpinnerService.hide();  
      });

    this.selectedFiles = undefined;
  }

  isValidated(): boolean {
    if (this.string1 == '' || this.string2 == '' || this.string3 == '' || this.string4 == '' || this.string5 == '') {
      return false;
    }else{
      return true;
    }
  }

}
