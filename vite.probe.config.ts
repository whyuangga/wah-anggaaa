import { defineConfig, type Plugin } from 'vite';
function probe(): Plugin {
  return {
    name: 'probe',
    enforce: 'post',
    transformIndexHtml(_html, ctx) {
      console.log('[probe] bundle?', Boolean(ctx.bundle), '| keys sample:',
        ctx.bundle ? Object.keys(ctx.bundle).filter(k => k.includes('woff2')).slice(0,3) : '(dev)');
      return { html: _html, tags: [{ tag: 'meta', attrs: { name: 'probe', content: 'ok' }, injectTo: 'head-prepend' }] };
    },
  };
}
export default defineConfig({ plugins: [probe()] });
