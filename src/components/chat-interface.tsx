"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Loader, Send, User } from "lucide-react";
import { troubleshootProblems } from "@/ai/flows/troubleshoot-problems";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hello! I'm your AI IT Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await troubleshootProblems({ problemDescription: input });
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: result.troubleshootingInstructions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Sorry, I encountered an error and couldn't process your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Troubleshooting error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-4",
              message.role === "user" && "justify-end"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-md rounded-lg p-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              )}
            >
              <p className="whitespace-pre-wrap text-sm">{message.text}</p>
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8 shrink-0">
                 <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="h-5 w-5" />
                 </div>
              </Avatar>
            )}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                </div>
              </Avatar>
              <div className="max-w-md rounded-lg bg-card p-3">
                <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t bg-card p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your IT problem..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
