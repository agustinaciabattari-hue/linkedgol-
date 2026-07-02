import { useQuery } from "@tanstack/react-query";
import { MOCK_PLAYERS, MOCK_OPPORTUNITIES, Player, Opportunity } from "@/lib/mock";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function usePlayers(filters?: { position?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['players', filters],
    queryFn: async () => {
      await delay(600); // Fake API latency
      let data = [...MOCK_PLAYERS];
      
      if (filters?.position && filters.position !== "Todos") {
        data = data.filter(p => p.position.toLowerCase() === filters.position!.toLowerCase());
      }
      if (filters?.status && filters.status !== "Todos") {
        data = data.filter(p => p.status.toLowerCase() === filters.status!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(p => p.name.toLowerCase().includes(q) || p.nationality.toLowerCase().includes(q));
      }
      
      return data;
    }
  });
}

export function usePlayer(id: string) {
  return useQuery({
    queryKey: ['player', id],
    queryFn: async () => {
      await delay(400);
      const player = MOCK_PLAYERS.find(p => p.id === id);
      if (!player) throw new Error("Player not found");
      return player;
    }
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      await delay(700);
      return MOCK_OPPORTUNITIES;
    }
  });
}
