if(!self.define){let s,e={};const i=(i,n)=>(i=new URL(i+".js",n).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(n,t)=>{const a=s||("document"in self?document.currentScript.src:"")||location.href;if(e[a])return;let c={};const r=s=>i(s,a),o={module:{uri:a},exports:c,require:r};e[a]=Promise.all(n.map((s=>o[s]||r(s)))).then((s=>(t(...s),c)))}}define(["./workbox-4754cb34"],(function(s){"use strict";importScripts(),self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"fe90326bd192e5a84634946a79931ee6"},{url:"/_next/static/chunks/3-f18ecf401f00aaa9.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/365-869497fb7bdc8eec.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/4bd1b696-6ba6b347516ed531.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/517-2baec9db90e5e7aa.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/815-679e0266ee504fce.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/839-116c5895614220c1.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/_not-found/page-251e9a4a0f06f7f6.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/chat/route-b43ccf6f2bcd3c12.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/create-marketplace-preference/route-9299ce9114623d73.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/create-mercadopago-preference/route-f35f268b475b5816.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/create-preference/route-4115e08490d38cf6.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/feedback/route-629781c5090b6a14.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/generate-expectation/route-ce29c00bb32eb20f.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/invitation/codes/route-611bb87b3ab06cb1.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/invitation/route-76307b7853a5aa67.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/save-conversation/route-4683bceec5205414.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/subscription/create/route-5d483a658bba6625.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/subscription/failure/route-b49ae9bb6e6d079e.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/subscription/pending/route-8a3443a945d75a27.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/subscription/success/route-861c8c56eec5fe3c.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/user/profile/route-533a3b2acf38f9f0.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/api/users/vip/route-c17be1bfc853b4de.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/error-bd3e5337d2583ae2.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/global-error-7bb477b191508264.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/layout-2b48f5068e87cda2.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/login/page-96ce91bc6d7cbe71.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/not-found-1c5b7feb00291bc4.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/page-f02fd34e993cd2ee.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/profile/page-4eb16eb306feefea.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/app/register/page-231e471f6f08e415.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/framework-c739b98c230eaa25.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/main-app-d8451422c15dbaf9.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/main-e273bef2a0765391.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/pages/_app-a882fb6335932b59.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/pages/_error-0dc8da009ccb362d.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-e515b474dc439b36.js",revision:"k3o-NisD2Gsbsh8WkXdTY"},{url:"/_next/static/css/80430a3d3e469f86.css",revision:"80430a3d3e469f86"},{url:"/_next/static/k3o-NisD2Gsbsh8WkXdTY/_buildManifest.js",revision:"4bf07e6109c31370127636813c20ed54"},{url:"/_next/static/k3o-NisD2Gsbsh8WkXdTY/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/4473ecc91f70f139-s.p.woff",revision:"78e6fc13ea317b55ab0bd6dc4849c110"},{url:"/_next/static/media/463dafcda517f24f-s.p.woff",revision:"cbeb6d2d96eaa268b4b5beb0b46d9632"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/manifest.json",revision:"adba71f56074cb483fd1d493fc6e24fe"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),s.cleanupOutdatedCaches(),s.registerRoute("/",new s.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:s,response:e,event:i,state:n})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new s.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),s.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new s.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new s.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new s.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),s.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new s.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/image\?url=.+$/i,new s.StaleWhileRevalidate({cacheName:"next-image",plugins:[new s.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp3|wav|ogg)$/i,new s.CacheFirst({cacheName:"static-audio-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:mp4)$/i,new s.CacheFirst({cacheName:"static-video-assets",plugins:[new s.RangeRequestsPlugin,new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:js)$/i,new s.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:css|less)$/i,new s.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new s.StaleWhileRevalidate({cacheName:"next-data",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute(/\.(?:json|xml|csv)$/i,new s.NetworkFirst({cacheName:"static-data-assets",plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;const e=s.pathname;return!e.startsWith("/api/auth/")&&!!e.startsWith("/api/")}),new s.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>{if(!(self.origin===s.origin))return!1;return!s.pathname.startsWith("/api/")}),new s.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),s.registerRoute((({url:s})=>!(self.origin===s.origin)),new s.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new s.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));