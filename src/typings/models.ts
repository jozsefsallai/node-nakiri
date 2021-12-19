/**
 * The severity of a blacklisted entry.
 *
 * @enum
 */
export enum Severity {
  VERY_LOW,
  LOW,
  MEDIUM,
  HIGH,
  VERY_HIGH,
}

/**
 * The processing state of a blacklisted entry.
 *
 * @enum
 */
export enum ProcessingState {
  QUEUED,
  PENDING,
  DONE,
  FAILED,
}

interface GenericModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  guildId?: string | null;
  group?: any | null;
  severity?: Severity | null;
}

/**
 * A blacklisted YouTube video ID.
 *
 * @typedef {Object} YouTubeVideo
 */
export interface YouTubeVideo extends GenericModel {
  videoId: string;
  status: ProcessingState;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  uploaderId?: string | null;
  uploaderName?: string | null;
  uploadDate?: Date | null;
}

/**
 * A blacklisted YouTube channel ID.
 *
 * @typedef {Object} YouTubeChannel
 */
export interface YouTubeChannel extends GenericModel {
  channelId: string;
  status: ProcessingState;
  name?: string | null;
  description?: string | null;
  publishedAt?: Date | null;
  thumbnailUrl?: string | null;
}

/**
 * A blacklisted link pattern.
 *
 * @typedef {Object} LinkPattern
 */
export interface LinkPattern extends GenericModel {
  pattern: string;
}

/**
 * A blacklisted Discord guild ID.
 *
 * @typedef {Object} DiscordGuild
 */
export interface DiscordGuild extends GenericModel {
  name: string;
  blacklistedId: string;
}

/**
 * A blacklisted phrase.
 *
 * @typedef {Object} Phrase
 */
export interface Phrase extends GenericModel {
  content: string;
}
