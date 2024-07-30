export interface BTCData {
    e: string; // Event type
    E: number; // Event time
    s: string; // Symbol
    p: string; // Price
    q: string; // Quantity
    t: number; // Trade ID
    m: boolean; // Is the buyer the market maker?
    M: boolean; // Ignore
    T: number; // Trade time
}