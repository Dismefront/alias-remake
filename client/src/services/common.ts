import type { Lobby, UserStore } from '@/types/data';

export const getCurrentHost = (state: Lobby): UserStore | null => {
  return (
    state.teams![state.hostTeamId!]?.members[
      state.teams![state.hostTeamId!]?.currentHost
    ] ?? null
  );
};
