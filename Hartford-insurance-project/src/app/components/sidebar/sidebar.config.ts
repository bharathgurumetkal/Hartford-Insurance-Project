export const SIDEBAR_MENU = {
  admin: [
    { label: 'SystemOverview', route: '/admin/dashboard' },
    { label: 'Policy Management', route: '/admin/policies' },
    { label: 'Agent Management', route: '/admin/agents' },
    { label: 'Claims Monitoring', route: '/admin/claims' },
    { label: 'Revenue Reports', route: '/admin/revenue' },
  ],

  agent: [
    { label: 'Assigned Customers', route: '/agent/assigned-customers' },
    { label: 'Policy Sales Tracking', route: '/agent/policy-sales-tracking' },
    { label: 'Commission Calculator', route: '/agent/commission-calculator' },
    {label:'Customer communication log', route:'/agent/communication-log'}
  ],

  client: [
    { label: 'Policy Portfolio', route: '/client/policy-portfolio' },
    { label: 'Claim History', route: '/client/claim-history' },
    { label: 'Premium Payment Status', route: '/client/premium-payment-status' },
    {label:'Document Storage',route:'/client/document-storage'}
  ]
};
