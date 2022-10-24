import { ReceiveMiddleware } from './receive.middleware';

describe('ReceiveMiddleware', () => {
  it('should be defined', () => {
    expect(new ReceiveMiddleware()).toBeDefined();
  });
});
