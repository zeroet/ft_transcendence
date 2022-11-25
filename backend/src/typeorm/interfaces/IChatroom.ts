export interface IChatroom {
  chatroom_id: number;
  owner_id: number;
  chatroom_name: string;
  password: string;
  max_member_num: number;
  created_at: Date;
  modified_at: Date;
}
