if(!self.define){let e,s={};const c=(c,t)=>(c=new URL(c+".js",t).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(t,a)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let i={};const u=e=>c(e,n),r={module:{uri:n},exports:i,require:u};s[n]=Promise.all(t.map((e=>r[e]||u(e)))).then((e=>(a(...e),i)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"525211e0f35ebb1a0b35dd00ae1a4c8a"},{url:"/_next/static/chunks/110-4b7a01b5b0e8f7ce.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/365-40b6c96bc42b1dc4.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/409-aba04bec9818000f.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/4bd1b696-f43cf3aad36fdca0.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/517-d7ca35c1dd5682c9.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/609-590d9331f65a540c.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/638-1442808e349cb0d8.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/839-c2f83c0b7369b4ac.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/992-9362fde3face1546.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/_not-found/page-d36c97bc40c9878c.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-c73b61d1b4a7392e.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/auth/register/route-c397f3924db5c2c0.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/auth/signin/page-000922a5db5fb57c.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/chat/route-a9ab0b37b415eb12.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/check-subscription/route-c8d6c6a8e5ba9efb.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/create-marketplace-preference/route-97cbc4801f9d2eab.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/create-mercadopago-preference/route-4180c6e31f3e9952.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/create-preference/route-ee6e21f2da0da4b8.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/feedback/route-f5f85b3edf082d2a.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/generate-expectation/route-4d02ff838115d184.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/invitation/codes/route-db36628d9c767d26.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/invitation/route-520a1993db4b03e1.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/save-conversation/route-6fc4dcec8c5bd33f.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/subscription/create/route-acc14f4c61119207.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/subscription/failure/route-0a10b68c9a5e91cb.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/subscription/pending/route-14258e605b0faa75.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/subscription/success/route-12f7e1e4803e24e6.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/test/route-6a96da5c68bfa013.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/update-subscription/route-2cf370d553b0cdc0.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/user/profile/route-1bb9e4189753be2f.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/api/users/vip/route-0a857ef9dfb61926.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/auth/register/page-69d2b889e5d82318.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/auth/signin/page-899aafec06a205f5.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/error-a32a3535bcf6384a.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/global-error-fb1027dd6069242a.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/layout-1384627711cdd2b1.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/login/page-c3dc99181029df76.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/not-found-1c5b7feb00291bc4.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/page-9017cd50bc49ee0b.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/app/profile/page-e73f992c4a1bcea2.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/framework-21e8d55c52def3a3.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/main-7d07f35825c885c3.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/main-app-d8451422c15dbaf9.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/pages/_app-f5efae7be13c9691.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/pages/_error-0dc8da009ccb362d.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-538344e1ec16ef6b.js",revision:"gHc8-3HdhuM2Z6mZm7YZo"},{url:"/_next/static/css/d65a4d761cb797c7.css",revision:"d65a4d761cb797c7"},{url:"/_next/static/gHc8-3HdhuM2Z6mZm7YZo/_buildManifest.js",revision:"dcae519bfea3112ff6069fd16a4d7ec5"},{url:"/_next/static/gHc8-3HdhuM2Z6mZm7YZo/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/manifest.json",revision:"adba71f56074cb483fd1d493fc6e24fe"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
