import { Blacklist, BlacklistEntryKind, BlacklistType } from './general';

export type GatewayEvent = [string, any];

export type GatewayEventHandler<T = any> = (data: T) => void | Promise<void>;

export interface GatewayIdentifyRequest {
  apiKey: string;
}

export interface GatewayReconnectRequest {
  apiKey: string;
  sessionId: string;
}

interface GatewayResponse<T = any> {
  ok: boolean;
  error?: string;
  data?: T;
}

export interface GatewayIdentifyResponse
  extends GatewayResponse<{
    sessionId: string;
  }> {}

export interface GatewayReconnectResponse extends GatewayResponse {}

/**
 * Contains information about a blacklist mutation (add/remove).
 *
 * @typedef {Object} BlacklistMutation
 *
 * @property {string} value - The value of the blacklist entry.
 * @property {BlacklistType} blacklist - The name of the blacklist.
 * @property {BlacklistEntryKind} kind - The kind of the blacklist entry (regex
 * or substring).
 * @property {boolean} global - Whether or not the blacklist entry is global.
 * @property {string} guild - The ID of the guild that the blacklist entry
 * belongs to.
 * @property {Blacklist} metadata - The metadata of the blacklist entry.
 */
export interface BlacklistMutationData {
  value: string;
  blacklist: BlacklistType;
  kind: BlacklistEntryKind;
  global: boolean;
  guild?: string;
  metadata: Blacklist;
}
