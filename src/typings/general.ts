import { GatewayEventHandler } from './gateway';
import {
  DiscordGuild,
  LinkPattern,
  Phrase,
  Severity,
  YouTubeChannel,
  YouTubeVideo,
} from './models';

/**
 * Specifies the name of the blacklist's type.
 * @typedef
 */
export type BlacklistType =
  | 'youtubeVideoID'
  | 'youtubeChannelID'
  | 'linkPattern'
  | 'discordGuildID'
  | 'phrase';

/**
 * Specifies the kind of a blacklisted entry.
 * @typedef
 */
export type BlacklistEntryKind = 'regex' | 'substring';

/**
 * Specifies one of the many blacklist types.
 * @typedef
 */
export type Blacklist =
  | YouTubeVideo
  | YouTubeChannel
  | LinkPattern
  | DiscordGuild
  | Phrase;

/**
 * Specifies the options of the Nakiri client.
 *
 * @typedef {Object} NakiriOptions
 *
 * @property {string} baseUrl - The base URL of the Nakiri API. If not provided,
 * the default value is `https://nakiri.one/api`.
 * @property {boolean} useGateway - Whether or not to use the gateway. If not
 * provided, the default value is `true`.
 * @property {boolean} useHTTP - Whether or not to use the HTTP client. If not
 * provided, the default value is `true`.
 * @property {string} group - The ID of the group that the API key belongs to.
 */
export interface NakiriClientOptions {
  baseUrl?: string;
  useGateway?: boolean;
  useHTTP?: boolean;
  group?: string;
}

/**
 * Key-value pairs that represent an event handler in the Websocket Gateway.
 *
 * @typedef {Object} GatewayEventHandler
 */
export interface GatewayEventHandlers {
  [key: string]: GatewayEventHandler;
}

/**
 * Specifies the options of an HTTP GET request.
 *
 * @typedef {Object} NakiriRequestOptions
 *
 * @property {string} guild - The ID of the guild whose blacklists are to be
 * included in the response (if any).
 * @property {boolean} compact - Whether or not to include metadata about each
 * blacklist entry in the response.
 */
export interface NakiriRequestOptions {
  guild?: string;
  compact?: boolean;
}

/**
 * Specifies the options of an HTTP GET request.
 *
 * @typedef {Object} NakiriRequestParams
 *
 * @typedef {string} cursor - The cursor from which the retrieval should start.
 * @typedef {number} limit - The number of entries per request.
 * @typedef {string} group - The ID of the group whose blacklists are to be
 * included in the response.
 */
export interface NakiriRequestParams extends NakiriRequestOptions {
  cursor?: string;
  limit?: number;
  group?: string;
}

/**
 * Specifies the partial payload of an HTTP POST request.
 *
 * @typedef {Object} NakiriPostRequestParams
 *
 * @typedef {string} guild - The ID of the guild where the entry will be added.
 * @typedef {boolean} global - Whether or not the entry should be added to the
 * global blacklist.
 * @typedef {Severity} severity - The severity of the entry.
 */
export interface NakiriPostRequestOptions {
  guild?: string;
  global?: boolean;
  severity?: Severity;
}

/**
 * Specifies the request params of an HTTP POST request.
 *
 * @typedef {Object} NakiriPostRequestParams
 *
 * @typedef {string} group - The ID of the group where the entry will be added.
 * @typedef {string} guild - The ID of the guild where the entry will be added.
 */
export interface NakiriPostRequestParams {
  group?: string;
  guild?: string;
}
