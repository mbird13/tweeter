import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
    setImageUrl: (value: string) => void;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setImageFileExtension: (value: string) => void;
    setImageBytes: (value : Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {

  private _imageUrl: string;
    public get imageUrl(): string {
        return this._imageUrl;
    }
    public set imageUrl(value: string) {
        this.view.setImageUrl(value);
        this._imageUrl = value;
    }

  private _firstName: string;
    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(value: string) {
        this.view.setFirstName(value);
        this._firstName = value;
    }
  private _lastName: string;
    public get lastName(): string {
        return this._lastName;
    }
    public set lastName(value: string) {
        this.view.setLastName(value);
        this._lastName = value;
    }
  private _imageFileExtension: string;
    public get imageFileExtension(): string {
        return this._imageFileExtension;
    }
    public set imageFileExtension(value: string) {
        this.view.setImageFileExtension(value);
        this._imageFileExtension = value;
    }
  private _imageBytes: Uint8Array;
    public get imageBytes(): Uint8Array {
        return this._imageBytes;
    }
    public set imageBytes(value: Uint8Array) {
        this.view.setImageBytes(value);
        this._imageBytes = value;
    }

    public constructor(view: RegisterView) {
        super(view);
        this.userService = new UserService();
        this._rememberMe = false;
        this._alias = '';
        this._password = '';
        this._imageUrl = '';
        this._firstName = '';
        this._lastName = '';
        this._rememberMe = false;
        this._imageFileExtension = '';
        this._imageBytes = new Uint8Array();
    }


    public checkSubmitButtonStatus(): boolean {
        return (
      !this.firstName ||
      !this.lastName ||
      !this.alias ||
      !this.password ||
      !this.imageUrl ||
      !this.imageFileExtension
    );
    };

    public registerOnEnter(event: React.KeyboardEvent<HTMLElement>) {
        if (event.key == "Enter" && !this.checkSubmitButtonStatus()) {
      this.doRegister();
    }
    };

    public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        this.handleImageFile(file);
      };

    public handleImageFile(file: File | undefined) {
        if (file) {
          this.imageUrl = URL.createObjectURL(file);
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
    
            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            this.view.setImageBytes(bytes);
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            this.imageFileExtension = fileExtension;
          }
        } else {
          this.imageUrl = "";
          this.imageBytes = new Uint8Array();
        }
    };

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    };
    

public async doRegister() {
      await this.doAuthenticationOperation(async () => this.userService.register(
        this.firstName,
        this.lastName,
        this.alias,
        this.password,
        this.imageBytes,
        this.imageFileExtension
      ), 
      () => this.view.navigate(`/feed/${this.alias}`),
    "register user")
    }

}