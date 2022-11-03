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
