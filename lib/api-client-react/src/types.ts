// Types mirror the schemas in lib/api-spec/openapi.yaml.

export type Player = {
  id: number;
  name: string;
  position: string;
  age: number;
  nationality: string;
  status: string;
  location?: string | null;
  bio?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  goals?: number | null;
  assists?: number | null;
  matches?: number | null;
  verified?: boolean;
  createdAt?: string;
};

export type AdminPlayer = Player & {
  email?: string | null;
  phone?: string | null;
};

export type Agent = {
  id: number;
  name: string;
  license?: string | null;
  country: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  verified?: boolean;
  createdAt?: string;
};

export type Club = {
  id: number;
  name: string;
  country: string;
  category?: string | null;
  email: string;
  phone?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  verified?: boolean;
  createdAt?: string;
};

export type Opportunity = {
  id: number;
  title: string;
  description?: string | null;
  country: string;
  clubName: string;
  role: string;
  createdAt?: string;
};

export type AdminOpportunity = Opportunity & {
  clubId?: number | null;
  email?: string | null;
};

export type SiteContent = {
  id: number;
  key: string;
  value: string;
  updatedAt?: string;
};

export type UserInfo = {
  id: number;
  email: string;
  role: "player" | "agent" | "club";
  playerId?: number | null;
  agentId?: number | null;
  clubId?: number | null;
  emailVerified?: boolean;
};

export type AuthResponse = {
  token: string;
  user: UserInfo;
  profile: any;
};

export type MeResponse = {
  user: UserInfo;
  profile: any;
};

export type ErrorResponse = { error: string };
