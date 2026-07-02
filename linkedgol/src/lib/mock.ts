export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  nationality: string;
  status: string;
  imageUrl?: string;
  location?: string;
  matches?: number;
  goals?: number;
  assists?: number;
}

export const MOCK_PLAYERS: Player[] = [
  {
    id: 1001,
    name: "J. Suárez",
    position: "Delantero",
    age: 23,
    nationality: "Argentino",
    status: "Libre",
    imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop",
    location: "Buenos Aires, Argentina",
    matches: 84, goals: 32, assists: 15
  },
  {
    id: 1002,
    name: "N. Ramirez",
    position: "Mediocampista",
    age: 24,
    nationality: "Uruguayo",
    status: "Libre",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    location: "Montevideo, Uruguay",
    matches: 112, goals: 12, assists: 45
  },
  {
    id: 1003,
    name: "P. Garcia",
    position: "Defensor",
    age: 26,
    nationality: "Paraguayo",
    status: "Libre",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    location: "Asunción, Paraguay",
    matches: 150, goals: 4, assists: 8
  },
  {
    id: 1004,
    name: "Lucas Martínez",
    position: "Delantero",
    age: 21,
    nationality: "Argentino",
    status: "Libre",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    location: "Rosario, Argentina",
    matches: 45, goals: 18, assists: 5
  }
];
