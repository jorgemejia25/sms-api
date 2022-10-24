export interface Message {
  channelId?: string;
  contactId: string;
  message: {
    type: string;
    text: string;
  };
}
