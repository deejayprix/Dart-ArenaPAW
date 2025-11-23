// Storage interface - not used for this darts app (all state is client-side)
export interface IStorage {
  // Empty for now - darts game uses client-side state only
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
