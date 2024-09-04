export interface TrafficDatas {
    type:number,
    queryInterval:number,
    queryStartTime:string,
    queryEndTime:string,
    KRAD: {
        amount: number,
        averageSpeed: number,
    },
    PKW: {
        amount: number,
        averageSpeed: number,
    },
    LFW: {
        amount: number,
        averageSpeed: number,
    },
    PKWA: {
        amount: number,
        averageSpeed: number,
    },
    LKWA: {
        amount: number,
        averageSpeed: number,
    },
    LKW: {
        amount: number,
        averageSpeed: number,
    },
    SATTEL : {
        amount: number,
        averageSpeed: number,
    },
    BUS: {
        amount: number,
        averageSpeed: number,
    },
    SONST : {
        amount: number,
        averageSpeed: number,
    },
}