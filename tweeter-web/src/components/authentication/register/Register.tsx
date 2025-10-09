import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { RegisterPresenter } from "../../../presenters/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const presenter = useRef<RegisterPresenter | null>(null);
  if (!presenter.current) presenter.current = new RegisterPresenter({
    setIsLoading: setIsLoading,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    setAlias: setAlias,
    setPassword: setPassword,
    setRememberMe: setRememberMe,
    setImageUrl: setImageUrl,
    setFirstName: setFirstName,
    setLastName: setLastName,
    setImageFileExtension: setImageFileExtension,
    setImageBytes: setImageBytes
  })

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={(e) => presenter.current!.registerOnEnter(e)}
            onChange={(event) => presenter.current!.firstName = event.target.value}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={(e) => presenter.current!.registerOnEnter(e)}
            onChange={(event) => presenter.current!.lastName = event.target.value}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields keyDownEvent={(e) => presenter.current!.registerOnEnter(e)} setAlias={(value) => presenter.current!.alias = value} setPassword={(value) => presenter.current!.password = value}/>
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={(e) => presenter.current!.registerOnEnter(e)}
            onChange={(e) => presenter.current!.handleFileChange(e)}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail" alt=""></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={(value) => presenter.current!.rememberMe = value}
      submitButtonDisabled={() => presenter.current!.checkSubmitButtonStatus()}
      isLoading={isLoading}
      submit={() => presenter.current!.doRegister()}
    />
  );
};

export default Register;
