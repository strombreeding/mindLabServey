import { PersistedQueryNotFoundError } from 'apollo-server-errors';
import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express';
import { Request } from 'express';
import { Logger } from 'winston';
import { winstonLogger } from './winston.util';

export const errorCode = [
  'BAD_USER_INPUT',
  'FORBIDDEN',
  'GRAPHQL_PARSE_FAILED',

  'INTERNAL_SERVER_ERROR',
];
export class CustomError {
  private errorCode = [
    'BAD_USER_INPUT',
    'FORBIDDEN',
    'GRAPHQL_PARSE_FAILED',
    'INTERNAL_SERVER_ERROR',
    'NOT_CRITICAL',
  ];
  constructor(message: string, code: number) {
    switch (code) {
      case 400:
        throw new UserInputError(message);
      case 403:
        throw new AuthenticationError(message);
      case 404:
        throw new UserInputError(message, { code: 'NOT_FOUND' });
      default:
        throw new ApolloError(message, 'NOT_CRITICAL');
    }
  }
}
export const errorLog = (err: any, logger: any, req: Request) => {
  if (err.extensions.code) {
    console.log(err.extensions.code);
    if (!errorCode.includes(err.extensions.code)) {
      logger.error(
        err.message,
        { path: __filename, clientOs: req.body.os },
        new Date(),
      );
    }
    throw new ApolloError(err.message, err.extensions.code);
  } else {
    logger.error(
      err.message,
      { path: __filename, clientOs: req.body.os },
      new Date(),
    );
    throw new ApolloError(err.message);
  }
};
// export const customError = (code: number, message: string) => {
//   switch (code) {
//     case 400:
//       throw new UserInputError(message);
//     case 403:
//       throw new AuthenticationError(message);
//     case 404:
//       throw new UserInputError(message, { code: 'NOT_FOUND' });
//     default:
//       throw new ApolloError(message);
//   }
// };
/**
 * 
GRAPHQL_PARSE_FAILED
SyntaxError

The GraphQL operation string contains a syntax error.

GRAPHQL_VALIDATION_FAILED
ValidationError

The GraphQL operation is not valid against the server's schema.

BAD_USER_INPUT
UserInputError

The GraphQL operation includes an invalid value for a field argument.

UNAUTHENTICATED
AuthenticationError

The server failed to authenticate with a required data source, such as a REST API.

FORBIDDEN
ForbiddenError

The server was unauthorized to access a required data source, such as a REST API.

PERSISTED_QUERY_NOT_FOUND
PersistedQueryNotFoundError

A client sent the hash of a query string to execute via automatic persisted queries, but the query was not in the APQ cache.

PERSISTED_QUERY_NOT_SUPPORTED
PersistedQueryNotSupportedError

A client sent the hash of a query string to execute via automatic persisted queries, but the server has disabled APQ.

INTERNAL_SERVER_ERROR
None

An unspecified error occurred.

This is the default error code returned by any ApolloError instance that doesn't specify a different code.
 */
