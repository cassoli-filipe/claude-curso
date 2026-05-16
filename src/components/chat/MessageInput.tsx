"use client";

import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative p-4 bg-[#FAF9F6] border-t border-[#E8E3DC]/80">
      <div className="relative max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the React component you want to create..."
          disabled={isLoading}
          className="w-full min-h-[80px] max-h-[200px] pl-4 pr-14 py-3.5 rounded-xl border border-[#E8E3DC] bg-white text-[#1a1714] resize-none focus:outline-none focus:ring-2 focus:ring-[#D97757]/10 focus:border-[#D97757]/50 transition-all placeholder:text-[#a89f96] text-[15px] font-normal shadow-sm"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !input?.trim()}
          className="absolute right-3 bottom-3 p-2.5 rounded-lg transition-all hover:bg-[#FBE9E0] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent group"
        >
          <Send className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isLoading || !input?.trim() ? 'text-[#c9c3bc]' : 'text-[#D97757]'}`} />
        </button>
      </div>
    </form>
  );
}