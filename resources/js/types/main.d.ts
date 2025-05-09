export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Conversation {
    avatar: string | null;
    id: number;
    user_id1: number;
    user_id2: number;
    created_at: string;
    updated_at: string;
    last_message_id: number | null;
    blocked_at: string | null;
    last_message_date: string | null;
    is_admin: boolean;
    is_user: boolean;
    is_group: boolean;
    name: string | null;
    owner_id: number | null;
    user_ids: number[];
    users: User[];
}

export interface Message {
    id: number;
    conversation_id: number;
    message: string;
    sender_id: number;
    receiver_id: number;
    created_at: string;
    updated_at: string;
    group_id: number | null;
}
