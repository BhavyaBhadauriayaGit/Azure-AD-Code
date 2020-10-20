export interface ISchedulerInfo
{
        InstanceDBGUID: string;
        Name: string;
        TagName: string;
        ServIS_Id: string;
        SchedType: string;
        SchedValue: string;
        SchedTime: string;
        CreatedBy: string;
}


export interface IschedulerAlramInfo
{
        Dbguid:string;
        ExistingAlarmName:string;
        LeadingEdge:number;
        TrailingEdge:number;
}

