'use client';

import axios from 'axios';
import { find } from 'lodash';
import { FC, useEffect, useRef, useState } from 'react';

import MessageBox from '@/app/conversations/[conversationId]/components/MessageBox';
import { useConversation } from '@/hooks';
import { pusherClient } from '@/libs/pusher';
import { FullMessageType } from '@/types';

type Props = {
  initialMessages: FullMessageType[];
};

const Body: FC<Props> = ({ initialMessages }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    const channel = pusherClient.subscribe(conversationId);

    bottomRef?.current?.scrollTo(73, bottomRef.current.scrollHeight);

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollTo(73, bottomRef.current.scrollHeight);
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    channel.bind('messages:new', messageHandler);
    channel.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      channel.unbind('messages:new', messageHandler);
      channel.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div ref={bottomRef} className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" />
    </div>
  );
};

export default Body;
