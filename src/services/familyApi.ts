const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);

function getHeaders() {
  const token = sessionStorage.getItem('lira_token') || localStorage.getItem('lira_token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const familyApi = {
  // Membros e Personagens
  async getMembers() {
    const res = await fetch(`${API_URL}/api/family/members`, { credentials: 'omit' });
    return res.json();
  },

  async getMyCharacters() {
    const res = await fetch(`${API_URL}/api/family/my-characters`, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  async claimCharacter(characterId: string) {
    const res = await fetch(`${API_URL}/api/family/claim-character`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ characterId }),
      credentials: 'omit',
    });
    return res.json();
  },

  async createCharacter(data: { name: string; characterClass: string; title: string; avatarUrl?: string; isParent?: boolean }) {
    const res = await fetch(`${API_URL}/api/family/create-character`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'omit',
    });
    return res.json();
  },

  async getCharacter(id?: string) {
    const url = id ? `${API_URL}/api/family/character/${id}` : `${API_URL}/api/family/character/me`;
    const res = await fetch(url, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  async updateCharacterStats(characterId: string, attribute: string) {
    const res = await fetch(`${API_URL}/api/family/character/update-stats`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ characterId, attribute }),
      credentials: 'omit',
    });
    return res.json();
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('folder', 'family');
    const token = sessionStorage.getItem('lira_token') || localStorage.getItem('lira_token') || localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
      credentials: 'omit',
    });
    return res.json();
  },

  async updateCharacterAvatar(characterId: string, avatarUrl: string) {
    const res = await fetch(`${API_URL}/api/family/character/update-avatar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ characterId, avatarUrl }),
      credentials: 'omit',
    });
    return res.json();
  },

  // Tarefas da Casa
  async getTasks(characterId?: string) {
    const query = characterId ? `?characterId=${characterId}` : '';
    const res = await fetch(`${API_URL}/api/family/tasks${query}`, { credentials: 'omit' });
    return res.json();
  },

  async requestCompleteTask(characterId: string, taskId: string, notes?: string) {
    const res = await fetch(`${API_URL}/api/family/tasks/complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ characterId, taskId, notes }),
      credentials: 'omit',
    });
    return res.json();
  },

  // Batalha
  async getActiveBattle() {
    const res = await fetch(`${API_URL}/api/family/battle/active`, { credentials: 'omit' });
    return res.json();
  },

  // Loja
  async getShopItems() {
    const res = await fetch(`${API_URL}/api/family/shop`, { credentials: 'omit' });
    return res.json();
  },

  async buyItem(characterId: string, itemId: string) {
    const res = await fetch(`${API_URL}/api/family/shop/buy`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ characterId, itemId }),
      credentials: 'omit',
    });
    return res.json();
  },

  // Radar da Casa & Vizinhança
  async getLocations() {
    const res = await fetch(`${API_URL}/api/family/locations`, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  // Missão Ativa & Foco
  async startActiveMission(data: { characterId: string; title: string; category?: string; durationMinutes: number; rewardXp?: number; rewardGold?: number }) {
    const res = await fetch(`${API_URL}/api/family/missions/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'omit',
    });
    return res.json();
  },

  async getCurrentActiveMission(characterId: string) {
    const res = await fetch(`${API_URL}/api/family/missions/current?characterId=${characterId}`, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  async completeActiveMission(missionId: string) {
    const res = await fetch(`${API_URL}/api/family/missions/complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ missionId }),
      credentials: 'omit',
    });
    return res.json();
  },

  // Contos & Livro-Jogo Solo
  async getStoryAdventures() {
    const res = await fetch(`${API_URL}/api/family/stories`, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  async getStoryNode(adventureId: string, nodeId: string) {
    const res = await fetch(`${API_URL}/api/family/stories/${adventureId}/node/${nodeId}`, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  async executeStoryChoice(characterId: string, choiceId: string) {
    const res = await fetch(`${API_URL}/api/family/stories/choice`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ characterId, choiceId }),
      credentials: 'omit',
    });
    return res.json();
  },

  // Mural do Clã & Conquistas
  async getFamilyFeed() {
    const res = await fetch(`${API_URL}/api/family/feed`, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  // Painel dos Pais (Mestre)
  async getPendingTasks() {
    const res = await fetch(`${API_URL}/api/family/master/pending-tasks`, { headers: getHeaders(), credentials: 'omit' });
    return res.json();
  },

  async approveTask(logId: string) {
    const res = await fetch(`${API_URL}/api/family/master/tasks/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ logId }),
      credentials: 'omit',
    });
    return res.json();
  },

  async rejectTask(logId: string, notes?: string) {
    const res = await fetch(`${API_URL}/api/family/master/tasks/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ logId, notes }),
      credentials: 'omit',
    });
    return res.json();
  },

  async createTask(data: { title: string; description: string; category: string; rewardXp: number; rewardGold: number; icon: string }) {
    const res = await fetch(`${API_URL}/api/family/master/tasks/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'omit',
    });
    return res.json();
  },
};
