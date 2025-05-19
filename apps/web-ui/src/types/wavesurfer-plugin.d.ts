// types/wavesurfer-plugins.d.ts
declare module 'wavesurfer.js/dist/plugins/hover.esm.js' {
  import type { PluginDefinition } from 'wavesurfer.js';

  interface HoverPluginOptions {
    lineColor?: string;
    lineWidth?: number;
    labelBackground?: string;
    labelColor?: string;
  }

  const HoverPlugin: {
    create: (options: HoverPluginOptions) => PluginDefinition;
  };

  export default HoverPlugin;
}
