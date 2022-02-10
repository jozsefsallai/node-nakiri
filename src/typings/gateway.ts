import { Severity } from './models';
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

/**
 * Specifies how the analyzer should behave during the analysis. It allows you
 * to toggle various features of the analyzer and tweak it to your liking or use
 * case.
 *
 * @typedef {Object} AnalyzerOptions
 *
 * @property {boolean} analyzeYouTubeVideoIDs - Whether to check if a message
 * links to forbidden YouTube videos. Defaults to `true`.
 * @property {boolean} analyzeYouTubeChannelIDs - Whether to check if a message
 * links to forbidden YouTube channels. Defaults to `true`.
 * @property {boolean} analyzeYouTubeChannelHandles - Same as the channel ID
 * check, except this checks for YouTube handles. Defaults to `true`.
 * @property {boolean} preemptiveVideoAnalysis - Whether to check if a video
 * belongs to a banned YouTube channel and automatically add it to the database
 * of forbidden videos. Defaults to `true`.
 * @property {boolean} analyzeDiscordInvites - Whether to check if a message
 * links to a forbidden Discord server invite. Defaults to `true`.
 * @property {boolean} analyzeLinks - Whether to check if a message contains
 * links that match one of the forbidden link patterns. Defaults to `true`.
 * @property {boolean} followRedirects - Whether to follow redirects when
 * checking links. Defaults to `true`.
 * @property {boolean} analyzePhrases - Whether to check if the message contains
 * any forbidden phrases. Defaults to `true`.
 * @property {number} phraseAnalysisThreshold - A real number between 0 and 1,
 * which specifies the minimum similarity index for a match to be considered
 * unwanted. Defaults to `0.5`.
 * @property {boolean} greedy - Performs a greedy check, which means it won't
 * stop at the very first result. Defaults to `false`.
 * @property {string} guildId - The ID of the guild whose blacklists to also
 * include.
 * @property {boolean} strictGuildCheck - Only look inside the blacklists of the
 * provided guild. Defaults to `false`.
 * @property {boolean} strictGroupCheck - Only look inside the blacklists of the
 * group. Defaults to `false`.
 */
export interface AnalyzerOptions {
  analyzeYouTubeVideoIDs?: boolean;
  analyzeYouTubeChannelIDs?: boolean;
  analyzeYouTubeChannelHandles?: boolean;
  preemptiveVideoAnalysis?: boolean;
  analyzeDiscordInvites?: boolean;
  analyzeLinks?: boolean;
  followRedirects?: boolean;
  analyzePhrases?: boolean;
  phraseAnalysisThreshold?: number;
  greedy?: boolean;
  guildId?: string;
  strictGuildCheck?: boolean;
  strictGroupCheck?: boolean;
}

/**
 * This is an object that will be passed to the analysis gateway request to
 * include additional information about the message that triggered the analysis.
 * When the analysis result arrives, it will contain this data. You can
 * technically pass anything to this object, since it will just be passed back
 * and forth.
 *
 * @typedef {Object} MessageContext
 *
 * @property {string} guildId - The ID of the guild the message was sent in.
 * @property {string} channelId - The ID of the channel the message was sent in.
 * @property {string} messageId - The ID of the message that triggered the
 * analysis.
 * @property {string} userId - The ID of the author of the message that
 * triggered the analysis.
 */
export type MessageContext<T = any> = T & {
  guildId?: string;
  channelId?: string;
  messageId?: string;
  userId?: string;
};

/**
 * This is the payload that will be sent to the gateway to enqueue an analysis.
 *
 * @typedef {Object} AnalysisRequest
 *
 * @property {string} content - The message to analyze.
 * @property {MessageContext} context - The circumstances the message was sent
 * in.
 * @property {AnalyzerOptions} options - The options to use when analyzing the
 * message.
 */
export interface AnalysisRequest {
  content: string;
  messageContext?: MessageContext;
  options?: AnalyzerOptions;
}

/**
 * Contains information about the similarity of a message to an individual
 * banned phrase.
 *
 * @typedef {Object} PhraseSimilarityMap
 *
 * @property {string} phrase - The banned phrase's content.
 * @property {string} word - The word from the original string that got the
 * similarity index.
 * @property {number} similarity - The similarity index of the message to the
 * banned phrase (real number from 0 to 1).
 * @property {Severity} - The severity rank of the phrase.
 */
export interface PhraseSimilarityMap {
  phrase: string;
  word: string;
  similarity: number;
  severity: Severity;
}

/**
 * Contains information about the result of an analysis.
 *
 * @typedef {Object} AnalyzerResult
 *
 * @property {AnalyzerOptions} options - The options that were used in this
 * analysis.
 * @property {boolean} problematic - Whether the analysis concluded that the
 * message is problematic.
 * @property {string[]} problematicVideoIDs - A list of blacklisted YouTube
 * video IDs that the message contained.
 * @property {string[]} problematicChannelIDs - A list of blacklisted YouTube
 * channel IDs that the message contained.
 * @property {string[]} problematicDiscordInvites - A list of invites to
 * blacklisted Discord servers that the message contained.
 * @property {string[]} problematicLinks - A list of links that matched one of
 * the forbidden link patterns.
 * @property {PhraseSimilarityMap[]} problematicPhrases - An array of phrase
 * similarities that were found in the message.
 * @property {Severity} severity - The highest severity of the found offenses in
 * the message analysis.
 * @property {number} maxPhraseSimilarity - The maximum phrase similarity from
 * the analyzed phrase similarity map.
 */
export interface AnalyzerResult {
  options: AnalyzerOptions;
  problematic: boolean;
  problematicVideoIDs: string[];
  problematicChannelIDs: string[];
  problematicDiscordInvites: string[];
  problematicLinks: string[];
  problematicPhrases: PhraseSimilarityMap[];
  severity?: Severity;
  maxPhraseSimilarity?: number;
}

/**
 * The payload of an analysis notification.
 *
 * @typedef {Object} AnalysisNotification
 *
 * @property {string} content - The content of the message that was analyzed.
 * @property {MessageContext} messageContext - The context that was passed to
 * the analyzer in the request.
 * @property {AnalyzerResult} result - The result of the analysis.
 */
export interface AnalysisNotification {
  content: string;
  messageContext?: MessageContext;
  results: AnalyzerResult;
}
