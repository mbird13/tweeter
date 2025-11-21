export class Follow {
    private _followerAlias: string;
    private _followeeAlias: string;

    public constructor(follower: string, followee: string) {
        this._followerAlias = follower;
        this._followeeAlias = followee;
    }

    public get follower(): string {
        return this._followerAlias;
    }

    public set follower(value: string) {
        this._followerAlias = value;
    }
    
    public get followee(): string {
        return this._followeeAlias;
    }

    public set followee(value: string) {
        this._followeeAlias = value;
    }    
}
