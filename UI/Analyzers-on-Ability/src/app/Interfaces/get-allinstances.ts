export interface GetAllinstances {
    EndDate?: string;
    ResultVerificationId: number;
    DBGUID: string;
    Tag: string;
    ServISId: string;
    Type: string;
    Value: string;
    Time: string;
    Last_Verification_Result: string;
    Time_Stamp: string;
    Date_Stamp: string;
    Actions: any[];
    StartDate?:string;
    Analyzer_Name:string;
}
