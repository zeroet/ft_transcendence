export interface IChatContent {
  chat_content_id: number;
  chatroom_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  modified_at: Date;
}
