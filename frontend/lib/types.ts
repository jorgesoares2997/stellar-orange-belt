export type Donation = {
  donor: string;
  amount: number;
  txHash: string;
  createdAt?: string;
};

export type CampaignState = {
  goal: number;
  totalRaised: number;
  recentDonations: Donation[];
};
