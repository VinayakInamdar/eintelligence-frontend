export interface StripePayment{
    productId : number,
    amount :number ,
    userId : string,
    planId : number,
    paymentCycle:  string ,
    campaignId : string
}