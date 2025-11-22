
export interface AuthtokenDaoInterface {
    getItem(token: string): Promise<AuthtokenDBItem | undefined>;
    addToken(token: string, userHandle: string, lastUsed: number): void;
    deleteToken(token: string): void;
    updateLastUsed(token: string, newDate: number): void;
}

export interface AuthtokenDBItem {
    token: string;
    userHandle: string;
    lastUsed: number;
}