declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.jsx' {
  import { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}
