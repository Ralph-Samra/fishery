import { GeneratorFn, HookFn, GeneratorFnOptions } from './types';

export class FactoryBuilder<T, F> {
  private afterCreate?: HookFn<T>;
  constructor(
    private generator: GeneratorFn<T, F>,
    private factories: F,
    private sequence: number,
    private params: Partial<T>,
  ) {}

  build() {
    const generatorOptions: GeneratorFnOptions<T, F> = {
      sequence: this.sequence,
      afterCreate: this.setAfterCreate,
      factories: this.factories,
      params: this.params,
    };

    const object = this.generator(generatorOptions);
    Object.assign(object, this.params);
    this._callAfterCreate(object);
    return object;
  }

  setAfterCreate = (hook: HookFn<T>) => {
    this.afterCreate = hook;
  };

  _callAfterCreate(object: T) {
    if (this.afterCreate) {
      if (typeof this.afterCreate === 'function') {
        this.afterCreate(object);
      } else {
        throw new Error('"afterCreate" must be a function');
      }
    }
  }
}