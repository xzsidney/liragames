const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);

function getHeaders() {
  const token = sessionStorage.getItem('lira_token') || localStorage.getItem('lira_token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const familyApi = {
  // Membros e Personagem
  async getMembers() {
    const res = await fetch(`${API_URL}/api/family/members`, { credentials: 'omit' });
    return res.json();
  },

  async getCharacter(id?: string) {
    const url = id ? `${API_URL}/api/family/character/${id}` : `${API_URL}/api/family/character/me`;
    const res = await fetch(url, { headers: getHeaders(), credentials: 'omit' });
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
