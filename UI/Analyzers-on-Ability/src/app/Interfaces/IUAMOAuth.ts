export interface IUAMOAuth
{
    expires: Date;
    issued: Date;
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
}