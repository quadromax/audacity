export type Mission = {
  id: string;
  title: string;
  description: string;
  points: number;
  action_url: string | null;
  requirements: string;
  active: boolean;
};
export type Post = {
  id: string;
  title: string;
  url: string;
  image_path: string | null;
  video_path: string | null;
  views: number | null;
  likes: number | null;
  published_at: string;
};
export type Reward = {
  id: string;
  title: string;
  description: string;
  image_path: string | null;
  rules: string;
  eligibility: string;
  status: string;
  claim_url: string | null;
};
export type Rank = {
  user_id: string;
  username: string;
  score: number;
  rank: number;
};
export type Market = {
  status:
    | "prelaunch"
    | "live"
    | "unlisted"
    | "unavailable"
    | "invalid"
    | "unverified";
  mint: string | null;
  verification: "verified" | "not-mint" | "unavailable" | "pending";
  pumpAvailable: boolean;
  pairAddress: string | null;
  dexName: string | null;
  price: number | null;
  marketCap: number | null;
  change: number | null;
  volume: number | null;
  liquidity: number | null;
  holders: number | null;
  network: "online" | "unavailable";
  updatedAt: string | null;
  pairUrl: string | null;
  metadata: import("./token-data").TokenMetadata;
};
