import { Tracker } from "./trackers";

export type UserPublic = {
  is_public_page_enabled?: boolean;
  title?: string;
  is_api_enabled?: boolean;
};

export type User = {
  id: string;
  email: string;
  login: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_email_confirmed: boolean;
  public?: UserPublic;

  subscribed_at?: string;
  stripe_session_id?: string;
  stripe_subscription_cancel_url?: string;

  can_update_older_entries: boolean;
};

export type NewUser = {
  email: string;
  login: string;
  password: string;
};

export type PatchedUser = {
  email?: string;
  login?: string;
  old_password?: string;
  password?: string;
  email_confirmation_token?: string;
  public?: UserPublic;
};

export type UserResponse = {
  user: User;
  until: number;
};

export type GetUserResponse = UserResponse & {
  trackers: Tracker[];
};

export type LocalStorageData = {
  user?: User;
  until?: 0;
};
