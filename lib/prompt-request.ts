export class PromptRequest {
  #resolve: ((value: string) => void) | null = null;
  #reject: (() => void) | null = null;

  start(): Promise<string> {
    // 新しいプロンプトへ切り替える際に、呼び出し元へ古い要求のキャンセルを通知する。
    this.cancel();

    return new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  complete(value: unknown, button: unknown): void {
    const resolve = this.#resolve;
    const reject = this.#reject;
    this.#clear();

    if (button === 'cancel' || typeof value !== 'string' || value === '') {
      reject?.();
    } else {
      resolve?.(value);
    }
  }

  cancel(): void {
    const reject = this.#reject;
    this.#clear();
    reject?.();
  }

  #clear(): void {
    this.#resolve = null;
    this.#reject = null;
  }
}
