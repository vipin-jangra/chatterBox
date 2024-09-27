interface IncomingFriendRequests {
    senderId: string,
    senderEmail : string | null | undefined
}

interface Friends {
    _id: string;
    username: string;
    image?: string | undefined; 
  }

export {Friends}