import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const presenter = useRef<LoginPresenter | null>(null)
  if (!presenter.current) {
    presenter.current = props.presenter ?? new LoginPresenter({
      setIsLoading,
      navigate,
      updateUserInfo,
      displayErrorMessage,
      setAlias,
      setPassword,
      setRememberMe
    });
}


  const inputFieldFactory = () => {
    return (
      <AuthenticationFields keyDownEvent={(e) => presenter.current!.loginOnEnter(e)} setAlias={(value) => presenter.current!.alias = value} setPassword={(value) => presenter.current!.password = value}/>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={(value) => presenter.current!.rememberMe = value}
      submitButtonDisabled={() => presenter.current!.checkSubmitButtonStatus()}
      isLoading={isLoading}
      submit={() => presenter.current!.doLogin(props.originalUrl)}
    />
  );
};

export default Login;
