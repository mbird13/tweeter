import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login"
import {render, screen} from "@testing-library/react"
import {UserEvent, userEvent} from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {instance, mock, verify} from "@typestrong/ts-mockito"
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";

library.add(fab);

describe("Login Component", () => {

    it("starts with the sign in button disabled", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    })

    it("enables sign in button when alias and password have text", async () => {
        const { signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/");
        
        await enableButton(user, aliasField, passwordField, signInButton);
    })

    it("disables sign in button when alias or password is cleared", async () => {
        const { signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/");
        
        await enableButton(user, aliasField, passwordField, signInButton);

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await enableButton(user, aliasField, passwordField, signInButton);
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
        
    })

    it("calls the presenter's login method with correct parameters when sign in button clicked", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const { signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/path", mockPresenterInstance);

        await enableButton(user, aliasField, passwordField, signInButton);

        await user.click(signInButton);

        verify(mockPresenter.doLogin("/path")).once();
    })
})



async function enableButton(user: UserEvent, aliasField: HTMLElement, passwordField: HTMLElement, signInButton: HTMLElement) {
    await user.type(aliasField, "TEXT HERE");
    await user.type(passwordField, "text there");
    expect(signInButton).toBeEnabled();
}

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (<Login originalUrl={originalUrl} presenter={presenter}/>) : (<Login originalUrl={originalUrl} />)}
        </MemoryRouter>
    );
}

function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign In/i});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return {user, signInButton, aliasField, passwordField}
}