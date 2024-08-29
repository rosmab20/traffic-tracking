export interface TrafficDatas {
    typ:number,
    abfrageintervall:number,
    abfragezeitpunktstart:string,
    abfragezeitpunktende:string,
    KRAD: {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    PKW: {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    LFW: {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    PKWA: {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    LKWA: {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    LKW: {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    SATTEL : {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    BUS: {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
    SONST : {
        anzahl: number,
        durchschnittsgeschwindigkeit: number,
    },
}