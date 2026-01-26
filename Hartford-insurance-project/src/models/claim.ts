export interface Claim {
  id: string;
  policyName: string;
  type: string;
  date: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}
