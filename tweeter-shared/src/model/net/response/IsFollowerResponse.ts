import { TweeterResponse } from "./TweeterResponse";

export interface IsFollowerResponse extends TweeterResponse {
    readonly status: boolean;
}