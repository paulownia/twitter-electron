import assert from 'node:assert';
import { describe, it } from 'node:test';
import { PromptRequest } from '../../lib/prompt-request.js';

describe('prompt-request.ts', () => {
  it('should cancel the previous request when starting another request', async () => {
    const request = new PromptRequest();
    const first = request.start();
    const second = request.start();

    await assert.rejects(first);
    request.complete('user_id', 'ok');
    await assert.doesNotReject(second);
    assert.strictEqual(await second, 'user_id');
  });

  it('should reject a canceled request', async () => {
    const request = new PromptRequest();
    const result = request.start();

    request.complete('user_id', 'cancel');

    await assert.rejects(result);
  });
});
