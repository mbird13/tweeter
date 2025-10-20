import { AuthToken } from "tweeter-shared";
import {AppNavBarPresenter, AppNavBarView} from "../../src/presenters/AppNavBarPresenter"
import {anything, instance, mock, spy, verify, when} from "@typestrong/ts-mockito"
import { UserService } from "../../src/model.service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavBarView: AppNavBarView;
    let appNavbarPresenter: AppNavBarPresenter;
    let mockService: UserService;

    const authToken: AuthToken = new AuthToken("ABC", Date.now());

    beforeEach(() => {
        mockAppNavBarView = mock<AppNavBarView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavBarView);
        when(mockAppNavBarView.displayInfoMessage(anything(), 0)).thenReturn("messageID");

        const appNavbarPresenterSpy = spy(new AppNavBarPresenter(mockAppNavbarPresenterViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockService = mock<UserService>()

        when(appNavbarPresenterSpy.service).thenReturn(instance(mockService));
    })

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavBarView.displayInfoMessage("Logging Out...", 0)).once();
    })

    it("calls logout on the user service with the correct authtoken", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockService.logout(authToken)).once();
    })

    it("tells the view to clear the user info and navigate to the login page when logout is successful", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavBarView.deleteMessage("messageID")).once();
        verify(mockAppNavBarView.clearUserInfo()).once();
        verify(mockAppNavBarView.navigate('/login')).once();

        verify(mockAppNavBarView.displayErrorMessage(anything())).never();
    })

    it("tells the view to display an error message and does not clear the info message, clear the user info or navigate to login when logout is unsuccessful", async () => {
        when(mockService.logout).thenThrow(new Error("An error occurred"));

        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavBarView.displayErrorMessage("Failed to log user out because of exception: Error: An error occurred")).once();

        verify(mockAppNavBarView.clearUserInfo()).never();
        verify(mockAppNavBarView.deleteMessage(anything())).never();
        verify(mockAppNavBarView.navigate(anything())).never();

    })
})