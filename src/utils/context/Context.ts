export function Entity(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const method = descriptor.value!;
    let result: any;

    descriptor.value = function () {
      if (!result) {
        result = method.apply(this, arguments);
      }
      return result;
    };
  };
}

export function Context() {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        // @ts-ignore
        const toStart = this['_start'];
        if (toStart && toStart.length > 0) {
          Promise.all(
            toStart.map(async (starter: any) => {
              await starter();
            }),
          )
            .then(() => console.log('App starts'))
            .catch((t: any) => console.log('App failed', t));
        }
      }
    };
  };
}
