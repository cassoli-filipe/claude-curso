"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div className="h-screen w-screen overflow-hidden bg-[#FAF9F6]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Chat */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full flex flex-col bg-[#FAF9F6]">
                {/* Chat Header */}
                <div className="h-14 flex items-center px-5 border-b border-[#E8E3DC]/80 gap-2.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#D97757" opacity="0.15"/>
                    <path d="M8.5 8.5C8.5 7.12 9.62 6 11 6h2c1.38 0 2.5 1.12 2.5 2.5v1c0 .83-.41 1.56-1.03 2l1.78 4.5H14.5L13 12h-2l-1.5 4H7.75l1.78-4.5C8.91 11.06 8.5 10.33 8.5 9.5v-1z" fill="#D97757"/>
                    <circle cx="11" cy="8.5" r="1" fill="#D97757"/>
                    <circle cx="13" cy="8.5" r="1" fill="#D97757"/>
                  </svg>
                  <h1 className="text-[15px] font-semibold text-[#1a1714] tracking-tight">UI Generator</h1>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-[1px] bg-[#E8E3DC] hover:bg-[#D97757]/30 transition-colors" />

            {/* Right Panel - Preview/Code */}
            <ResizablePanel defaultSize={65}>
              <div className="h-full flex flex-col bg-[#FAF9F6]">
                {/* Top Bar */}
                <div className="h-14 border-b border-[#E8E3DC]/80 px-6 flex items-center justify-between bg-[#FAF9F6]">
                  <Tabs
                    value={activeView}
                    onValueChange={(v) =>
                      setActiveView(v as "preview" | "code")
                    }
                  >
                    <TabsList className="bg-white/70 border border-[#E8E3DC]/80 p-0.5 h-9 shadow-sm">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-white data-[state=active]:text-[#1a1714] data-[state=active]:shadow-sm text-[#6b6560] px-4 py-1.5 text-sm font-medium transition-all">Preview</TabsTrigger>
                      <TabsTrigger value="code" className="data-[state=active]:bg-white data-[state=active]:text-[#1a1714] data-[state=active]:shadow-sm text-[#6b6560] px-4 py-1.5 text-sm font-medium transition-all">Code</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-[#F5F3EF]">
                  {activeView === "preview" ? (
                    <div className="h-full bg-white">
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      {/* File Tree */}
                      <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        maxSize={50}
                      >
                        <div className="h-full bg-[#F5F3EF] border-r border-[#E8E3DC]">
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle className="w-[1px] bg-[#E8E3DC] hover:bg-[#D97757]/30 transition-colors" />

                      {/* Code Editor */}
                      <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-white">
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
