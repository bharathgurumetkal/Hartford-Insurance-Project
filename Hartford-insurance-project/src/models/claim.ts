export interface Claim {
  id: string;
  policyId:number,
  customerId:number,
  claimId:string,
  policyName: string;
  type: string;
  date: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  "timeline":[
    {
      status:string,
      message:string,
      date:string
    }
  ]
}
