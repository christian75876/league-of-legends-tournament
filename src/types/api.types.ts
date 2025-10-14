export type ServerActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export type FieldErrors = Record<string, string | undefined>;

export type ServerErrorCode =
  | 'TEAM_NAME_TAKEN'
  | 'RIOT_ID_EMPTY'
  | 'INVALID_ROSTER_SIZE'
  | 'SERVER_ERROR'
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'BAD_REQUEST'
  | 'INVALID_BESTOF'
  | 'INVALID_GAME_INDEX'
  | 'NOT_ENOUGH_TEAMS'
  | 'FORBIDDEN'
  | 'CONFLICT';

export class AppError extends Error {
  code: ServerErrorCode;
  fieldErrors?: FieldErrors;

  constructor(code: ServerErrorCode, message?: string, fieldErrors?: FieldErrors) {
    super(message ?? code);
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}
