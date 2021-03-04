type Nullable<T> = T | null | undefined;
type IAccessTokenFormat = {
    userId: string;
    email?: string;
};
declare namespace Express {
    export interface Request {
        appData?: IAccessTokenFormat;
    }
}
