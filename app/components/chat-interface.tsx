import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  apiKey: string;
}

export function ChatInterface({ apiKey }: ChatInterfaceProps) {
  const [sessionId, setSessionId] = useState('default-session');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Auto-resize textarea as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 192)}px`; // 192px = 12rem (max-h-48)
    }
  }, [userInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'error', content: 'API Key Required: Please enter your API key before sending a message.' },
      ]);
      return;
    }

    if (!userInput.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userInput },
      { role: 'assistant', content: '' },
    ]);

    const requestBody = {
      session_id: sessionId,
      text: userInput,
      openai_api_key: apiKey,
    };

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'error', content: errorData.error || 'An error occurred while processing your request.' },
        ]);
        return;
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: data.data },
      ]);
      setUserInput('');
    } catch (e: any) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'error', content: e.message || 'An unexpected error occurred.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-end mx-auto flex-1 gap-4 pb-10 text-base md:gap-5 lg:gap-6 md:w-[30rem] lg:w-[40rem] xl:w-[48rem]">
      <ScrollArea>
          <div className="flex-1 p-4 space-y-4 pb-10">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {m.role === 'error' ? (
                    <Card className="bg-slate-100 dark:bg-slate-900">
                      <CardContent className="p-4">
                        <strong>Error:</strong> {m.content}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className={m.role === 'user' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900'}>
                      <CardContent className="p-4">
                        <strong className="text-gray-700 dark:text-gray-100">{m.role === 'user' ? 'You' : 'Assistant'}:</strong>{' '}
                        {m.content ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        ) : (
                          m.role === 'assistant' && <Skeleton className="h-4 w-[250px]" />
                        )}
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
      </ScrollArea>
      <div className="flex flex-col m-2">
        <div className="sticky bottom-5 bg-white dark:bg-gray-800 drop-shadow-lg p-2 mb-2 border-t rounded-lg border-gray-200 dark:border-gray-700 transition-all duration-200">
          <div className="flex items-start gap-4 max-w-3xl mx-auto">
            <div className="grid w-full gap-1.5 min-h-[44px] items-start">
              <textarea
                ref={textareaRef}
                id="message"
                className="focus:outline-none placeholder:text-gray-500 focus-visible:outline-none bg-transparent p-1 border-r-10 border-none resize-none max-h-48 transition-all duration-200 overflow-y-auto [&::-webkit-resizer]:display-none"
                style={{
                  overflow: 'hidden'
                }}
                placeholder="Message chatbot"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />

            </div>
            <Button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-700 text-muted-foreground">
            Your message will be sent to the ChatGPT Completions API.
        </p>
        <p className="text-sm text-gray-700 text-muted-foreground">
            Source code on <a target="_blank" href="https://github.com/AndreMorise/nextjs-flask-agent-demo" className="underline">GitHub</a>
        </p>
      </div>
    </div>
  );
}