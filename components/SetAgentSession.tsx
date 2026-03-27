// components/SetAgentSession.tsx
"use client";

import { useEffect } from "react";

interface SetAgentSessionProps {
  agentId: string | null; // Allow null since API might return null
}

export default function SetAgentSession({ agentId }: SetAgentSessionProps) {
  useEffect(() => {
    if (agentId) {
      sessionStorage.setItem("agentId", agentId);
      console.log("Agent ID stored:", agentId);
    }
  }, [agentId]);

  return null;
}