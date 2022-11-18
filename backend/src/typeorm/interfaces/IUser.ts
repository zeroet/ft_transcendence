export interface IUser {
  intra_id: string;
  email: string;
  image_url: string;
  username: string;
  two_factor: boolean;
  created_at: Date;
  modified_at: Date;
}
