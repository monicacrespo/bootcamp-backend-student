import { UserSession } from 'common-app/models';
import { Request, Response } from 'express';
import * as helpers from 'common/helpers/jwt.helpers';
import { authenticationMiddleware } from './security.middleware';

//npm run test:watch security.middleware
describe('pods/security/security.middlewares specs', () => {
  describe('authenticationMiddleware', () => {
    it('should send 401 status code if it feeds authorization cookie equals undefined', async () => {
      // Arrange
      const authorization = undefined;
      const stub = jest
        .spyOn(helpers, 'verifyJWT')
        .mockRejectedValue('Not valid token');

      const req = {
        cookies: {
          authorization,
        },
      } as Request;
      // Spy -> jest.fn()
      const res = {
        sendStatus: jest.fn() as any,
      } as Response;
      const next = jest.fn();

      // Act
      await authenticationMiddleware(req, res, next);

      // Assert
      expect(res.sendStatus).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(stub).toHaveBeenCalled();
    });
    
  });
});

it('should call next function and assign userSession if it feeds authorization cookie with token', async () => {
  // Arrange
  const authorization = 'Bearer my-token';
  const userSession: UserSession = {
    id: '1',
    role: 'admin',
  };

  // Stub -> jest.spyOn()
  const verifyStub = jest
    .spyOn(helpers, 'verifyJWT')
    .mockResolvedValue(userSession);
  const req = {
    cookies: {
      authorization,
    },
  } as Request;
  // Spy -> jest.fn()
  const res = {
    sendStatus: jest.fn() as any,
  } as Response;
  const next = jest.fn();

  // Act
  await authenticationMiddleware(req, res, next);

  // Assert
  expect(verifyStub).toHaveBeenCalled();
  expect(next).toHaveBeenCalled();
  expect(req.userSession).toEqual(userSession);
});