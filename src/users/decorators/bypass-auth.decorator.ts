import { Reflector } from "@nestjs/core";

export const BypassAuth = Reflector.createDecorator<boolean>({
  transform: (value) => (value != null ? value : true),
});
