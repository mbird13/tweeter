import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { Status, User } from "tweeter-shared";
import { FollowService } from "./model.service/FollowService";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";
import { StatusService } from "./model.service/StatusService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  function userComponentFactory(item: User, featurePath: string) {
    return <UserItem user={item} featurePath={featurePath} />
  }

  function statusComponentFactory(item: Status, featurePath: string) {
    return <StatusItem status={item} featurePath={featurePath} />
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<ItemScroller<Status, StatusService> key={`feed-${displayedUser!.alias}`} featureUrl="/feed" presenterFactory={(listener) => new FeedPresenter(listener)} itemComponentFactory={(item, featurePath) => statusComponentFactory(item, featurePath)}/>} />
        <Route path="story/:displayedUser" element={<ItemScroller<Status, StatusService> key={`story-${displayedUser!.alias}`} featureUrl="/story" presenterFactory={(listener) => new StoryPresenter(listener)} itemComponentFactory={(item, featurePath) => statusComponentFactory(item, featurePath)}/>} />
        <Route path="followees/:displayedUser" element={<ItemScroller<User, FollowService> key={`followees-${displayedUser!.alias}`}  featureUrl="/followees" presenterFactory={(listener) => new FolloweePresenter(listener)} itemComponentFactory={(item, featurePath) => userComponentFactory(item, featurePath)}/>} />
        <Route path="followers/:displayedUser" element={<ItemScroller<User, FollowService> key={`followers-${displayedUser!.alias}`} featureUrl="/followers" presenterFactory={(listener) => new FollowerPresenter(listener)} itemComponentFactory={(item, featurePath) => userComponentFactory(item, featurePath)}/>} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
