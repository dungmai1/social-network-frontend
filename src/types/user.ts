// types/user.ts
export interface UserModel {
  id: number;
  username: string;
  displayname: string;
  avatar: string;
  gmail: string;
  phone: string;
  description: string;
}

export interface RelationshipModel {
  followerCount: number;
  followingCount: number;
  follower: boolean;
  following: boolean;
  self: boolean;
}

export interface UserProfileModel {
  id: number;
  username: string;
  avatar: string;
  description: string | null;
  relationship: RelationshipModel;
}
