import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

let socket: Socket | null = null;
export const onlineFamilyMembers = ref<any[]>([]);
export const floatingReactions = ref<any[]>([]);
export const familyAlerts = ref<any[]>([]);

export function getFamilySocket(): Socket {
  if (!socket) {
    // Determina a URL da API / Socket
    const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);
    
    socket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('⚡ [Family Socket] Conectado ao servidor:', socket?.id);
    });

    socket.on('family:presence_update', (members: any[]) => {
      onlineFamilyMembers.value = members;
    });

    socket.on('family:reaction_received', (data: any) => {
      const id = Date.now() + Math.random();
      floatingReactions.value.push({ ...data, id });
      setTimeout(() => {
        floatingReactions.value = floatingReactions.value.filter(r => r.id !== id);
      }, 4000);
    });

    socket.on('family:task_approved_event', (data: any) => {
      familyAlerts.value.unshift(data);
      if (familyAlerts.value.length > 5) familyAlerts.value.pop();
    });
  }

  return socket;
}

export function joinFamilyRoom(characterId?: string, name?: string) {
  const s = getFamilySocket();
  if (s.connected) {
    s.emit('family:join_room', { characterId, name });
  } else {
    s.on('connect', () => {
      s.emit('family:join_room', { characterId, name });
    });
  }
}

export function sendFamilyReaction(characterId: string, characterName: string, emoji: string, text?: string) {
  const s = getFamilySocket();
  s.emit('family:send_reaction', { characterId, characterName, emoji, text });
}

export function sendFamilyBattleAction(battleId: string, characterId: string, actionType: 'ATTACK' | 'SKILL' | 'DEFEND' | 'HEAL', skillName?: string) {
  const s = getFamilySocket();
  s.emit('family:execute_battle_action', { battleId, characterId, actionType, skillName });
}
