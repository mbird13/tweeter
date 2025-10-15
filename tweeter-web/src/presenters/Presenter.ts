export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (id: string) => void;
}

export abstract class Presenter<T extends View> {

    private _view: T;

    protected get view(): T {
        return this._view;
    }

    protected constructor(view: T) {
        this._view = view;
    }

    protected async doFailureReportingOperation (operation : () => Promise<void>, operationDescription : string) {
           try {
             await operation();
           } catch (error) {
             this.view.displayErrorMessage(
               `Failed to ${operationDescription} because of exception: ${error}`
             );
           }
         };
}