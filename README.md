<p align="center">
  <a href="https://github.com/codercup/unibest">
    <img width="160" src="./src/static/logo.svg">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/codercup/unibest" target="_blank">unibest - 最好的 uniapp 开发框架</a>
</h1>

<div align="center">

[![GitHub Repo stars](https://img.shields.io/github/stars/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)
[![GitHub forks](https://img.shields.io/github/forks/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)
[![star](https://gitee.com/codercup/unibest/badge/star.svg?theme=dark)](https://gitee.com/codercup/unibest/stargazers)
[![fork](https://gitee.com/codercup/unibest/badge/fork.svg?theme=dark)](https://gitee.com/codercup/unibest/members)
![node version](https://img.shields.io/badge/node-%3E%3D18-green)
![pnpm version](https://img.shields.io/badge/pnpm-%3E%3D7.30-green)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/codercup/unibest)
![GitHub License](https://img.shields.io/github/license/codercup/unibest)

</div>

`unibest` —— 最好的 `uniapp` 开发框架，由 `uniapp` + `Vue3` + `Ts` + `Vite5` + `UnoCss` + `uv-ui` + `z-paging` 构成，使用了最新的前端技术栈，无需依靠 `HBuilderX`，通过命令行方式运行 `web`、`小程序` 和 `App`（编辑器推荐 `VSCode`，可选 `webstorm`）。

`unibest` 内置了 `约定式路由`、`layout布局`、`请求封装`、`请求拦截`、`登录拦截`、`UnoCSS`、`i18n多语言` 等基础功能，提供了 `代码提示`、`自动格式化`、`统一配置`、`代码片段` 等辅助功能，让你编写 `uniapp` 拥有 `best` 体验 （ `unibest 的由来`）。

<p align="center">
  <a href="https://codercup.github.io/unibest-docs/" target="_blank">📖 文档地址</a>
  <span style="margin:0 10px;">|</span>
  <a href="https://codercup.github.io/hello-unibest/" target="_blank">📱 DEMO 地址</a>
</p>

## ⚙️ 环境

- node>=18
- pnpm>=7.30

## &#x1F4C2; 快速开始

执行 `pnpm create unibest` 创建项目

执行 `pnpm i` 安装依赖

执行 `pnpm dev` 运行 `H5`

## 📦 运行（支持热更新）

- web平台： `pnpm dev:h5`, 然后打开 [http://localhost:9000/](http://localhost:9000/)。
- weixin平台：`pnpm dev:mp-weixin` 然后打开微信开发者工具，导入本地文件夹，选择本项目的`dist/dev/mp-weixin` 文件。
- APP平台：`pnpm dev:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/dev/app` 文件夹，选择运行到模拟器(开发时优先使用)，或者运行的安卓/ios基座。

## 🔗 发布

- web平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到web服务器，如nginx运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
- weixin平台：`pnpm build:mp-weixin`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的“上传”按钮进行上传。
- APP平台：`pnpm build:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/build/app` 文件夹，选择发行 - APP云打包。

app  
├─ env  
├─ mock  
│ ├─ contackList.js  
│ └─ index.js  
├─ src  
│ ├─ components  
│ │ ├─ BlockHeader  
│ │ │ └─ index.vue  
│ │ ├─ Captcha.vue  
│ │ │ └─ index.vue  
│ │ ├─ jh-card  
│ │ │ └─ index.vue  
│ │ ├─ jh-chart  
│ │ │ └─ index.vue  
│ │ ├─ jh-empty  
│ │ │ └─ index.vue  
│ │ ├─ jh-menus  
│ │ │ └─ index.vue  
│ │ ├─ jh-select  
│ │ │ └─ index.vue  
│ │ └─ jh-upload  
│ │ ├─ libs  
│ │ │ ├─ config  
│ │ │ │ └─ config.js  
│ │ │ ├─ css  
│ │ │ │ ├─ color.scss  
│ │ │ │ ├─ common.scss  
│ │ │ │ ├─ components.scss  
│ │ │ │ ├─ variable.scss  
│ │ │ │ └─ vue.scss  
│ │ │ ├─ function  
│ │ │ │ ├─ colorGradient.js  
│ │ │ │ ├─ debounce.js  
│ │ │ │ ├─ digit.js  
│ │ │ │ ├─ index.js  
│ │ │ │ ├─ platform.js  
│ │ │ │ ├─ test.js  
│ │ │ │ └─ throttle.js  
│ │ │ ├─ luch-request  
│ │ │ │ ├─ adapters  
│ │ │ │ │ └─ index.js  
│ │ │ │ ├─ core  
│ │ │ │ │ ├─ buildFullPath.js  
│ │ │ │ │ ├─ defaults.js  
│ │ │ │ │ ├─ dispatchRequest.js  
│ │ │ │ │ ├─ InterceptorManager.js  
│ │ │ │ │ ├─ mergeConfig.js  
│ │ │ │ │ ├─ Request.js  
│ │ │ │ │ └─ settle.js  
│ │ │ │ ├─ helpers  
│ │ │ │ │ ├─ buildURL.js  
│ │ │ │ │ ├─ combineURLs.js  
│ │ │ │ │ └─ isAbsoluteURL.js  
│ │ │ │ ├─ utils  
│ │ │ │ │ └─ clone.js  
│ │ │ │ ├─ index.d.ts  
│ │ │ │ ├─ index.js  
│ │ │ │ └─ utils.js  
│ │ │ ├─ mixin  
│ │ │ │ ├─ button.js  
│ │ │ │ ├─ mixin.js  
│ │ │ │ ├─ mpMixin.js  
│ │ │ │ ├─ mpShare.js  
│ │ │ │ ├─ openType.js  
│ │ │ │ └─ touch.js  
│ │ │ └─ util  
│ │ │ ├─ dayjs.js  
│ │ │ └─ route.js  
│ │ ├─ index.vue  
│ │ ├─ index_back.vue  
│ │ ├─ mixin.js  
│ │ ├─ props.js  
│ │ ├─ uploadTemplate.vue  
│ │ └─ utils.js  
│ ├─ configs  
│ │ └─ index.ts  
│ ├─ hooks  
│ │ ├─ useRequest.ts  
│ │ └─ useUpload.ts  
│ ├─ interceptors  
│ │ ├─ index.ts  
│ │ ├─ prototype.ts  
│ │ ├─ request.ts  
│ │ └─ route.ts  
│ ├─ layouts  
│ │ ├─ default.vue  
│ │ └─ demo.vue  
│ ├─ pages  
│ │ ├─ application  
│ │ │ ├─ components  
│ │ │ │ ├─ AppGrid.vue  
│ │ │ │ └─ data.js  
│ │ │ └─ index.vue  
│ │ ├─ construction  
│ │ │ ├─ detail.vue  
│ │ │ ├─ index.vue  
│ │ │ └─ list.vue  
│ │ ├─ contactList  
│ │ │ ├─ detail.vue  
│ │ │ └─ index.vue  
│ │ ├─ dolphinWatch  
│ │ │ ├─ dataForm.vue  
│ │ │ ├─ detail.vue  
│ │ │ └─ index.vue  
│ │ ├─ home  
│ │ │ └─ index.vue  
│ │ ├─ inspection  
│ │ │ └─ index.vue  
│ │ ├─ login  
│ │ │ └─ index.vue  
│ │ ├─ mine  
│ │ │ └─ index.vue  
│ │ ├─ QRCode  
│ │ │ └─ index.vue  
│ │ ├─ statement  
│ │ │ └─ index.vue  
│ │ ├─ todo  
│ │ │ └─ index.vue  
│ │ ├─ transportPlan  
│ │ │ ├─ detail.vue  
│ │ │ └─ index.vue  
│ │ ├─ travelRecord  
│ │ │ └─ index.vue  
│ │ ├─ video  
│ │ │ └─ index.vue  
│ │ ├─ weather  
│ │ │ ├─ evaluate.vue  
│ │ │ ├─ index.vue  
│ │ │ ├─ weatherTrend.vue  
│ │ │ └─ weatherWarn.vue  
│ │ └─ windShelter  
│ │ ├─ monitor  
│ │ │ └─ index.vue  
│ │ ├─ notice  
│ │ │ ├─ detail.vue  
│ │ │ └─ index.vue  
│ │ └─ report  
│ │ ├─ detail.vue  
│ │ └─ index.vue  
│ ├─ pages-sub  
│ │ └─ demo  
│ │ └─ index.vue  
│ ├─ service  
│ │ ├─ common  
│ │ │ └─ index.js  
│ │ ├─ construction  
│ │ │ └─ index.js  
│ │ ├─ dict  
│ │ │ └─ index.js  
│ │ ├─ dolphinWatch  
│ │ │ └─ index.js  
│ │ ├─ home  
│ │ │ └─ index.js  
│ │ ├─ index  
│ │ │ └─ foo.ts  
│ │ ├─ inspection  
│ │ │ └─ index.js  
│ │ ├─ todo  
│ │ │ └─ index.js  
│ │ ├─ transportPlan  
│ │ │ └─ index.js  
│ │ ├─ travelRecord  
│ │ │ └─ index.js  
│ │ ├─ video  
│ │ │ └─ index.js  
│ │ ├─ weather  
│ │ │ ├─ evaluate.js  
│ │ │ └─ index.js  
│ │ └─ windShelter  
│ │ ├─ monitor  
│ │ │ └─ index.js  
│ │ ├─ notice  
│ │ │ └─ index.js  
│ │ └─ report  
│ │ ├─ detail.js  
│ │ └─ index.js  
│ ├─ static  
│ │ ├─ app  
│ │ │ └─ icons  
│ │ ├─ common  
│ │ │ └─ empty.png  
│ │ ├─ dolphinWatch  
│ │ │ ├─ add-icon.png  
│ │ │ ├─ date-icon.png  
│ │ │ └─ dolphin.png  
│ │ ├─ home  
│ │ │ ├─ app-add.png  
│ │ │ ├─ app-delete.png  
│ │ │ ├─ avatar.png  
│ │ │ ├─ banner.png  
│ │ │ ├─ card-icon-1.png  
│ │ │ ├─ card-icon-2.png  
│ │ │ ├─ card-icon-3.png  
│ │ │ ├─ checkout-disembark.png  
│ │ │ ├─ checkout-onboard.png  
│ │ │ ├─ code-icon.png  
│ │ │ ├─ comprehensive-chtj.png  
│ │ │ ├─ comprehensive-gtfx.png  
│ │ │ ├─ comprehensive-sgjd.png  
│ │ │ ├─ comprehensive-txl.png  
│ │ │ ├─ comprehensive-ysjd.png  
│ │ │ ├─ construction-dolphin.png  
│ │ │ ├─ construction-fan.png  
│ │ │ ├─ construction-submarine.png  
│ │ │ ├─ empty-fence.png  
│ │ │ ├─ empty-weather.png  
│ │ │ ├─ empty-wind.png  
│ │ │ ├─ menu-icon-default.png  
│ │ │ ├─ record-icon.png  
│ │ │ ├─ safe-bfbb.png  
│ │ │ ├─ safe-bfjk.png  
│ │ │ ├─ safe-bftz.png  
│ │ │ ├─ safe-qxpg.png  
│ │ │ ├─ safe-spjk.png  
│ │ │ └─ weather-1.png  
│ │ ├─ images  
│ │ │ ├─ delete-icon.png  
│ │ │ ├─ edit-icon.png  
│ │ │ ├─ empty-ship.png  
│ │ │ ├─ phone.svg  
│ │ │ ├─ title-icon.png  
│ │ │ ├─ update-icon.png  
│ │ │ ├─ user-icon-1.png  
│ │ │ ├─ user-icon-2.png  
│ │ │ ├─ user-icon-3.png  
│ │ │ └─ user-icon.png  
│ │ ├─ login  
│ │ │ ├─ banner.png  
│ │ │ └─ checkcode.png  
│ │ ├─ shelterWind  
│ │ │ ├─ Group 1321315221@2x.png  
│ │ │ ├─ hourglass.png  
│ │ │ ├─ list-icon.png  
│ │ │ ├─ shelterWind.png  
│ │ │ └─ ship-icon.png  
│ │ ├─ tabbar  
│ │ │ ├─ example.png  
│ │ │ ├─ exampleHL.png  
│ │ │ ├─ home.png  
│ │ │ ├─ homeHL.png  
│ │ │ ├─ mine.png  
│ │ │ ├─ mineHL.png  
│ │ │ ├─ personal.png  
│ │ │ ├─ personalHL.png  
│ │ │ ├─ todo.png  
│ │ │ └─ todoHL.png  
│ │ ├─ travelRecord  
│ │ │ └─ list-icon.png  
│ │ ├─ video  
│ │ │ └─ offline.png  
│ │ ├─ weather  
│ │ │ ├─ img  
│ │ │ │ ├─ icon  
│ │ │ │ │ ├─ 1000.png  
│ │ │ │ │ ├─ 1001.png  
│ │ │ │ │ ├─ 1002.png  
│ │ │ │ │ ├─ 1003.png  
│ │ │ │ │ ├─ 1006.png  
│ │ │ │ │ ├─ 1007.png  
│ │ │ │ │ ├─ 1010.png  
│ │ │ │ │ ├─ 1011.png  
│ │ │ │ │ ├─ 1012.png  
│ │ │ │ │ ├─ 1013.png  
│ │ │ │ │ ├─ 1014.png  
│ │ │ │ │ ├─ 1016.png  
│ │ │ │ │ ├─ 1017.png  
│ │ │ │ │ ├─ 1018.png  
│ │ │ │ │ ├─ 1019.png  
│ │ │ │ │ ├─ 1022.png  
│ │ │ │ │ ├─ 1025.png  
│ │ │ │ │ ├─ 1026.png  
│ │ │ │ │ ├─ 1027.png  
│ │ │ │ │ ├─ 1028.png  
│ │ │ │ │ ├─ 1029.png  
│ │ │ │ │ ├─ 1031.png  
│ │ │ │ │ ├─ 1032.png  
│ │ │ │ │ ├─ 1033.png  
│ │ │ │ │ ├─ 1035.png  
│ │ │ │ │ └─ 1036.png  
│ │ │ │ ├─ cloudy.png  
│ │ │ │ ├─ fog.png  
│ │ │ │ ├─ icon-tem.png  
│ │ │ │ ├─ icon-vis.png  
│ │ │ │ ├─ icon-water.png  
│ │ │ │ ├─ icon-wave.png  
│ │ │ │ ├─ icon-wind.png  
│ │ │ │ ├─ overcastSky.png  
│ │ │ │ ├─ rain.png  
│ │ │ │ ├─ snow.png  
│ │ │ │ ├─ sun.png  
│ │ │ │ └─ windDirection.png  
│ │ │ └─ js  
│ │ │ └─ seaCode.json  
│ │ └─ logo.svg  
│ ├─ store  
│ │ ├─ app.ts  
│ │ ├─ construction.ts  
│ │ ├─ database.ts  
│ │ ├─ dict.ts  
│ │ ├─ index.ts  
│ │ ├─ inspection.ts  
│ │ ├─ network.ts  
│ │ └─ user.ts  
│ ├─ style  
│ │ ├─ uv-ui  
│ │ │ └─ theme.scss  
│ │ ├─ applet.css  
│ │ ├─ iconfont.css  
│ │ └─ index.scss  
│ ├─ types  
│ │ ├─ auto-import.d.ts  
│ │ ├─ global.d.ts  
│ │ ├─ shims-uni.d.ts  
│ │ └─ uni-pages.d.ts  
│ ├─ uni_modules  
│ ├─ utils  
│ │ ├─ modals  
│ │ │ ├─ index.ts  
│ │ │ └─ uniapp.ts  
│ │ ├─ offline  
│ │ │ ├─ fetchBaseData.ts  
│ │ │ └─ offlineDataManager.ts  
│ │ ├─ dict.js  
│ │ ├─ http.ts  
│ │ ├─ index.ts  
│ │ └─ platform.ts  
│ ├─ App.vue  
│ ├─ env.d.ts  
│ ├─ main.ts  
│ ├─ manifest.json  
│ ├─ pages.json  
│ ├─ typings.ts  
│ └─ uni.scss  
├─ uniCloud-aliyun  
├─ uni_modules  
│ └─ uni-sign-in  
│ └─ uniCloud  
│ └─ cloudfunctions  
│ └─ uni-clientDB-actions  
│ └─ signIn.js  
├─ unpackage  
│ ├─ release  
│ │ └─ **UNI**F927A4D.wgt  
│ └─ res  
│ └─ icons  
│ ├─ 1024x1024.png  
│ ├─ 120x120.png  
│ ├─ 144x144.png  
│ ├─ 152x152.png  
│ ├─ 167x167.png  
│ ├─ 180x180.png  
│ ├─ 192x192.png  
│ ├─ 20x20.png  
│ ├─ 29x29.png  
│ ├─ 40x40.png  
│ ├─ 58x58.png  
│ ├─ 60x60.png  
│ ├─ 72x72.png  
│ ├─ 76x76.png  
│ ├─ 80x80.png  
│ ├─ 87x87.png  
│ └─ 96x96.png  
├─ commitlint.config.cjs  
├─ favicon.ico  
├─ index.html  
├─ manifest.config.ts  
├─ package.json  
├─ pages.config.ts  
├─ pnpm-lock.yaml  
├─ README.md  
├─ tsconfig.json  
├─ uni-pages.d.ts  
├─ uno.config.ts  
└─ vite.config.ts
