export class GatewayError extends Error {
  code: string;

  static errors: { [code: string]: string } = {
    API_KEY_NOT_PROVIDED: 'The API key was not provided.',
    INVALID_API_KEY: 'Invalid API key.',
    SESSION_ID_NOT_PROVIDED: 'You have not provided a session ID.',
    INVALID_SESSION: 'You have provided an invalid session ID.',
    API_KEY_DOES_NOT_MATCH_PREVIOUS_SESSION:
      'The provided API key does not belong to the provided session.',
    NOTIFICATION_ID_NOT_PROVIDED: 'Empty ack sent to server.',
    NOT_AUTHENTICATED: 'You are not authenticated.',
    NOTIFICATION_NOT_FOUND: 'The notification was not found.',
    UNAUTHORIZED_TO_ACK_NOTIFICATION:
      'You are not authorized to ack this notification.',
    UNKNOWN_ERROR: 'Unknown error.',
  };

  constructor(code: string) {
    super(GatewayError.errors[code]);
    this.name = 'GatewayError';
    this.code = code;
  }
}

export class HTTPError extends Error {
  code: string;

  static errors: { [code: string]: string } = {
    CANNOT_MANAGE_GUILD: 'You do not have access to managing this guild.',
    GUILD_ALREADY_ADDED: 'The guild has already been authorized.',
    GUILD_ID_NOT_PROVIDED: 'You have not specified a guild.',

    GROUP_NOT_FOUND: 'The specified guild coult not be found.',

    MISSING_VIDEO_ID: 'You have not provided the ID of the video.',
    INVALID_VIDEO_ID:
      'Invalid YouTube video ID. An ID must be 11 characters long and only contain letters, numbers, dashes, and underscores.',
    ID_ALREADY_EXISTS: 'The provided ID already exists in the database.',

    MISSING_CHANNEL_ID: 'You have not provided the ID of the channel.',
    INVALID_CHANNEL_ID:
      'Invalid YouTube channel ID. An ID must be 24 characters long, start with "UC", and only contain letters, numbers, dashes, and underscores.',

    MISSING_REGEX_PATTERN:
      'You have not provided a regular expression pattern.',
    INVALID_REGEX_PATTERN: 'The provided regex pattern is invalid.',
    PATTERN_ALREADY_EXISTS:
      'The provided pattern already exists in the database.',

    MISSING_PHRASE_CONTENT: 'You have not provided a phrase.',
    PHRASE_TOO_SHORT: 'The provided phrase is too short.',
    PHRASE_ALREADY_EXISTS:
      'The provided phrase already exists in the database.',

    ENTRY_NOT_FOUND: 'The requested entry could not be found.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    CANNOT_MANAGE_OWN_BLACKLISTS:
      'You cannot manage your own per-guild blacklists.',
    CANNOT_ACCESS_ENTRY_FROM_THIS_GUILD:
      'You cannot access this entry from this guild.',
    CANNOT_UPDATE_ENTRY_FROM_THIS_GUILD:
      'You cannot update entries from this guild.',
    CANNOT_DELETE_ENTRY_FROM_THIS_GUILD:
      'You cannot delete entries from this guild.',
    CANNOT_MANAGE_GLOBAL_BLACKLISTS: 'You cannot manage the global blacklist.',

    NOT_AUTHENTICATED: 'You need to be logged in to perform this request.',
    NOT_ANONYMOUS: 'You need to be logged out to perform this request.',
    INSUFFICIENT_PERMISSIONS:
      'You do not have the required permissions to perform this action.',
    ACCESS_TO_GUILD_DENIED: 'You do not have access to this group or guild.',
    INTERNAL_SERVER_ERROR: 'Internal server error.',
  };

  constructor(code: string) {
    super(HTTPError.errors[code]);
    this.name = 'HTTPError';
    this.code = code;
  }
}
