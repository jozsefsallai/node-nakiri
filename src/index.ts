import { GatewayError, HTTPError } from './common/errors';
import { Gateway } from './gateway/Gateway';
import { HTTPClient } from './http/HTTP';
import {
  GatewayEventHandler,
  BlacklistMutationData,
  GatewayIdentifyRequest,
  GatewayIdentifyResponse,
  GatewayReconnectRequest,
} from './typings/gateway';
import {
  GatewayEventHandlers,
  NakiriClientOptions,
  NakiriPostRequestOptions,
  NakiriPostRequestParams,
  NakiriRequestOptions,
  NakiriRequestParams,
} from './typings/general';
import {
  NakiriHTTPAddDiscordGuildEntryRequest,
  NakiriHTTPAddLinkPatternEntryRequest,
  NakiriHTTPAddPhraseEntryRequest,
  NakiriHTTPAddYouTubeChannelEntryRequest,
  NakiriHTTPAddYouTubeVideoEntryRequest,
  NakiriHTTPGetBlacklistResponse,
} from './typings/http';
import {
  DiscordGuild,
  LinkPattern,
  Phrase,
  Severity,
  YouTubeChannel,
  YouTubeVideo,
} from './typings/models';

/**
 * @api public
 */
export class Client {
  public readonly baseUrl: string;
  protected apiKey?: string;
  private readonly group?: string;
  protected readonly useGateway: boolean;
  protected readonly useHTTP: boolean;

  private gateway?: Gateway;
  private handlers: GatewayEventHandlers = {};

  private http?: HTTPClient;

  /**
   * @constructor
   *
   * @param {NakiriClientOptions} opts - The options of the Nakiri client.
   */
  constructor(opts: NakiriClientOptions = {}) {
    this.baseUrl = opts?.baseUrl ?? 'https://nakiri.one/api';
    this.useGateway = opts?.useGateway ?? true;
    this.useHTTP = opts?.useHTTP ?? true;
    this.group = opts?.group;

    if (this.useGateway) {
      this.gateway = new Gateway(this);
      this.bootstrapGateway();
    }
  }

  private bootstrapGateway() {
    this.on('error', (err) => {
      throw err;
    });
  }

  /**
   * Method used to authenticate to the Nakiri Gateway and set the API key to be
   * used for HTTP requests.
   *
   * @param {string} apiKey - The API key which will be used for authentication.
   */
  public async login(apiKey: string) {
    this.apiKey = apiKey;

    if (this.useHTTP) {
      this.http = new HTTPClient(this.apiKey);
    }

    if (this.useGateway) {
      await this.gateway!.waitForWebsocket();

      if (this.gateway!.hasSession) {
        this.gateway!.emit<GatewayReconnectRequest>('reconnect', {
          apiKey: this.apiKey,
          sessionId: this.gateway!.getSessionId(),
        });
      } else {
        this.gateway!.emit<GatewayIdentifyRequest>('identify', {
          apiKey: this.apiKey,
        });
      }
    }

    return Promise.resolve();
  }

  // GATEWAY START

  /**
   * Error event handler. Will fire when the Gateway emits an error.
   *
   * @param {'error'} event - The event name.
   * @param {GatewayEventHandler<GatewayError>} handler - The event handler.
   */
  public on(event: 'error', handler: GatewayEventHandler<GatewayError>): void;

  /**
   * Entry Added event handler. Will fire when the Gateway sends a notification
   * about the addition of a new entry.
   *
   * @param {'entryAdded'} event - The event name.
   * @param {GatewayEventHandler<BlacklistMutationData>} handler - The event
   * handler.
   */
  public on(
    event: 'entryAdded',
    handler: GatewayEventHandler<BlacklistMutationData>,
  ): void;

  /**
   * Entry Removed event handler. Will fire when the Gateway sends a
   * notification about the removal of an entry.
   *
   * @param {'entryRemoved'} event - The event name.
   * @param {GatewayEventHandler<BlacklistMutationData>} handler - The event
   * handler.
   */
  public on(
    event: 'entryRemoved',
    handler: GatewayEventHandler<BlacklistMutationData>,
  ): void;

  /**
   * Ready event handler. Will fire when the Gateway was successfully
   * authenticated and a session has been established.
   *
   * @param {'ready'} event - The event name.
   * @param {GatewayEventHandler<GatewayIdentifyResponse>} handler - The event
   * handler.
   */
  public on(
    event: 'ready',
    handler: GatewayEventHandler<GatewayIdentifyResponse>,
  ): void;

  /**
   * Generic event handler.
   *
   * @param {string} event - The event name.
   * @param {GatewayEventHandler<any>} handler - The event handler.
   */
  public on<T>(event: string, handler: GatewayEventHandler<T>) {
    this.handlers[event] = handler;
  }

  /**
   * Unregisters an event handler.
   *
   * @param {string} event - The event name.
   */
  public off(event: string) {
    delete this.handlers[event];
  }

  /**
   * Will emit an event, if it exists. Otherwise it will do nothing.
   * @param {string} event - The event name.
   * @param {any} data - The data which will be passed to the event handler.
   */
  public emit<T = any>(event: string, data?: T) {
    if (this.handlers[event]) {
      this.handlers[event](data);
    }
  }

  // GATEWAY END

  // HTTP START

  private static GET_YOUTUBE_VIDEOS_URL = '/lists/youtube/videos';
  private static GET_YOUTUBE_CHANNELS_URL = '/lists/youtube/channels';
  private static GET_LINK_PATTERNS_URL = '/lists/link-patterns';
  private static GET_DISCORD_GUILDS_URL = '/lists/discord';
  private static GET_PHRASES_URL = '/lists/phrases';

  private static ADD_YOUTUBE_VIDEOS_URL = '/lists/youtube/videos';
  private static ADD_YOUTUBE_CHANNELS_URL = '/lists/youtube/channels';
  private static ADD_LINK_PATTERNS_URL = '/lists/link-patterns';
  private static ADD_DISCORD_GUILDS_URL = '/lists/discord';
  private static ADD_PHRASES_URL = '/lists/phrases';

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private async getBlacklistEntries<K extends string, T = any>(
    key: K,
    endpoint: string,
    opts?: NakiriRequestOptions,
  ): Promise<(T | string)[]> {
    if (!this.http) {
      throw new Error('You need to enable the HTTP client to use this method.');
    }

    const params: NakiriRequestParams = {};

    params.group = this.group;
    params.limit = 15;
    params.cursor = '0';

    if (opts) {
      params.guild = opts.guild;
      params.compact = opts.compact ?? true;
    }

    const list: (T | string)[] = [];

    const url = this.buildUrl(endpoint);
    const entries = await this.http!.getAll<
      NakiriHTTPGetBlacklistResponse<K, T>
    >(url, { params });

    for await (const entry of entries) {
      try {
        list.push(...entry[key]!);
      } catch (err: any) {
        const message = err.response?.data?.error;
        if (message) {
          throw new HTTPError(message);
        }

        throw err;
      }
    }

    return list;
  }

  /**
   * Will get a list of blacklisted YouTube videos.
   *
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   *
   * @returns The list of blacklisted YouTube videos.
   */
  public async getYouTubeVideos(
    opts?: NakiriRequestOptions,
  ): Promise<(YouTubeVideo | string)[]> {
    return this.getBlacklistEntries<'videoIDs', YouTubeVideo>(
      'videoIDs',
      Client.GET_YOUTUBE_VIDEOS_URL,
      opts,
    );
  }

  /**
   * Will get a list of blacklisted YouTube channels.
   *
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   *
   * @returns The list of blacklisted YouTube channels.
   */
  public async getYouTubeChannels(
    opts?: NakiriRequestOptions,
  ): Promise<(YouTubeChannel | string)[]> {
    return this.getBlacklistEntries<'channelIDs', YouTubeChannel>(
      'channelIDs',
      Client.GET_YOUTUBE_CHANNELS_URL,
      opts,
    );
  }

  /**
   * Will get a list of blacklisted link patterns.
   *
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   *
   * @returns The list of blacklisted link patterns.
   */
  public async getLinkPatterns(
    opts?: NakiriRequestOptions,
  ): Promise<(LinkPattern | string)[]> {
    return this.getBlacklistEntries<'patterns', LinkPattern>(
      'patterns',
      Client.GET_LINK_PATTERNS_URL,
      opts,
    );
  }

  /**
   * Will get a list of blacklisted Discord guilds.
   *
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   *
   * @returns The list of blacklisted Discord guilds.
   */
  public async getDiscordGuilds(
    opts?: NakiriRequestOptions,
  ): Promise<(DiscordGuild | string)[]> {
    return this.getBlacklistEntries<'discordGuilds', DiscordGuild>(
      'discordGuilds',
      Client.GET_DISCORD_GUILDS_URL,
      opts,
    );
  }

  /**
   * Will get a list of blacklisted phrases.
   *
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   *
   * @returns The list of blacklisted phrases.
   */
  public async getPhrases(
    opts?: NakiriRequestOptions,
  ): Promise<(Phrase | string)[]> {
    return this.getBlacklistEntries<'phrases', Phrase>(
      'phrases',
      Client.GET_PHRASES_URL,
      opts,
    );
  }

  private async addBlacklistEntry(
    endpoint: string,
    data: any,
    opts?: NakiriPostRequestOptions,
  ) {
    if (!this.http) {
      throw new Error('You need to enable the HTTP client to use this method.');
    }

    const body: NakiriPostRequestOptions = {};
    const params: NakiriPostRequestParams = {};

    if (opts) {
      if (!opts.global) {
        params.guild = opts.guild;
        params.group = this.group;
      }

      body.severity = opts.severity ?? Severity.MEDIUM;
    }

    const url = this.buildUrl(endpoint);

    try {
      const response = await this.http!.post(
        url,
        {
          ...body,
          ...data,
        },
        {
          params,
        },
      );

      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error;
      if (message) {
        throw new HTTPError(message);
      }

      throw err;
    }
  }

  /**
   * Adds a YouTube video ID to the blacklist.
   *
   * @param {NakiriHTTPAddYouTubeVideoEntryRequest} data - The request body.
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   */
  public async addYouTubeVideo(
    data: NakiriHTTPAddYouTubeVideoEntryRequest,
    opts?: NakiriPostRequestOptions,
  ) {
    return this.addBlacklistEntry(Client.ADD_YOUTUBE_VIDEOS_URL, data, opts);
  }

  /**
   * Adds a YouTube channel ID to the blacklist.
   *
   * @param {NakiriHTTPAddYouTubeChannelEntryRequest} data - The request body.
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   */
  public async addYouTubeChannel(
    data: NakiriHTTPAddYouTubeChannelEntryRequest,
    opts?: NakiriPostRequestOptions,
  ) {
    return this.addBlacklistEntry(Client.ADD_YOUTUBE_CHANNELS_URL, data, opts);
  }

  /**
   * Adds a link pattern to the blacklist.
   *
   * @param {NakiriHTTPAddLinkPatternEntryRequest} data - The request body.
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   */
  public async addLinkPattern(
    data: NakiriHTTPAddLinkPatternEntryRequest,
    opts?: NakiriPostRequestOptions,
  ) {
    return this.addBlacklistEntry(Client.ADD_LINK_PATTERNS_URL, data, opts);
  }

  /**
   * Adds a Discord guild ID to the blacklist.
   *
   * @param {NakiriHTTPAddDiscordGuildEntryRequest} data - The request body.
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   */
  public async addDiscordGuild(
    data: NakiriHTTPAddDiscordGuildEntryRequest,
    opts?: NakiriPostRequestOptions,
  ) {
    return this.addBlacklistEntry(Client.ADD_DISCORD_GUILDS_URL, data, opts);
  }

  /**
   * Adds a phrase to the blacklist.
   *
   * @param {NakiriHTTPAddPhraseEntryRequest} data - The request body.
   * @param {NakiriRequestOptions} opts - The options which will be used for
   * the request.
   */
  public async addPhrase(
    data: NakiriHTTPAddPhraseEntryRequest,
    opts?: NakiriPostRequestOptions,
  ) {
    return this.addBlacklistEntry(Client.ADD_PHRASES_URL, data, opts);
  }

  // HTTP END
}

export * from './typings';
