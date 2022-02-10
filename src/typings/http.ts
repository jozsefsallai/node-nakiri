import {
  DiscordGuild,
  LinkPattern,
  Severity,
  YouTubeChannel,
  YouTubeVideo,
} from './models';

export interface NakiriHTTPQueryParams {
  compact?: boolean;
  strict?: boolean;
  group?: string;
  guild?: string;
  cursor?: string;
  limit?: number;
}

export interface NakiriHTTPPaginationData {
  limit: number;
  remainingItems: number;
  nextCursor: string | null;
}

export interface NakiriHTTPResponse {
  ok: boolean;
  error?: string;
}

export interface NakiriHTTPPaginatedResponse extends NakiriHTTPResponse {
  pagination: NakiriHTTPPaginationData;
}

export type NakiriHTTPGetBlacklistResponse<
  K extends string,
  T = any,
> = NakiriHTTPPaginatedResponse & {
  [key in K]: T[] | string[] | undefined;
};

export type NakiriHTTPGetYouTubeVideosResponse = NakiriHTTPGetBlacklistResponse<
  'videoIDs',
  YouTubeVideo
>;

export type NakiriHTTPGetYouTubeChannelsResponse =
  NakiriHTTPGetBlacklistResponse<'channelIDs', YouTubeChannel>;

export type NakiriHTTPGetLinkPatternsResponse = NakiriHTTPGetBlacklistResponse<
  'patterns',
  LinkPattern
>;

export type NakiriHTTPGetDiscordGuildsResponse = NakiriHTTPGetBlacklistResponse<
  'discordGuilds',
  DiscordGuild
>;

export type NakiriHTTPGetPhrasesResponse = NakiriHTTPGetBlacklistResponse<
  'phrases',
  YouTubeVideo
>;

export interface NakiriHTTPAddBlacklistEntryRequest {
  severity?: Severity;
}

export interface NakiriHTTPAddYouTubeVideoEntryRequest
  extends NakiriHTTPAddBlacklistEntryRequest {
  videoID: string;
}

export interface NakiriHTTPAddYouTubeChannelEntryRequest
  extends NakiriHTTPAddBlacklistEntryRequest {
  channelID: string;
}

export interface NakiriHTTPAddLinkPatternEntryRequest
  extends NakiriHTTPAddBlacklistEntryRequest {
  pattern: string;
}

export interface NakiriHTTPAddDiscordGuildEntryRequest
  extends NakiriHTTPAddBlacklistEntryRequest {
  id: string;
  name: string;
}

export interface NakiriHTTPAddPhraseEntryRequest
  extends NakiriHTTPAddBlacklistEntryRequest {
  content: string;
}
