import { useState } from 'react';
import { sendMessage as sendMessageRequest } from '../services/api';

const createMessageId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `message-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (query) => {
    if (!query.trim() || !sessionId || isLoading) {
      return;
    }

    const userMessage = {
      id: createMessageId(),
      role: 'user',
      content: query.trim(),
      isStreaming: false
    };

    const assistantMessageId = createMessageId();

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        sources: [],
        isStreaming: true
      }
    ]);

    setIsLoading(true);

    try {
      await sendMessageRequest(
        query.trim(),
        sessionId,
        (chunk) => {
          if (!chunk) return;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: `${msg.content}${chunk}` }
                : msg
            )
          );
        },
        (sources) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, sources }
                : msg
            )
          );
        },
        () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
        }
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: error?.message || 'Something went wrong.',
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}

export default useChat;
