/* jshint esversion: 9 */
// ==UserScript==
// @name              字体渲染（自用脚本）
// @name:zh           字体渲染（自用脚本）
// @name:zh-TW        字體渲染（自用腳本）
// @name:ja           フォントレンダリング（カスタマイズ）
// @name:en           Font Rendering (Customized)
// @version           2021.11.14.1
// @author            F9y4ng
// @description       无需安装MacType，优化浏览器字体显示，让每个页面的中文字体变得有质感，默认使用微软雅黑字体，亦可自定义设置多种中文字体，附加字体描边、字体重写、字体阴影、字体平滑、对特殊样式元素的过滤和许可等效果，脚本菜单中可使用设置界面进行参数设置，亦可对某域名下所有页面进行排除渲染，兼容常用的Greasemonkey脚本和浏览器插件。
// @description:zh    无需安装MacType，优化浏览器字体显示，让每个页面的中文字体变得有质感，默认使用微软雅黑字体，亦可自定义设置多种中文字体，附加字体描边、字体重写、字体阴影、字体平滑、对特殊样式元素的过滤和许可等效果，脚本菜单中可使用设置界面进行参数设置，亦可对某域名下所有页面进行排除渲染，兼容常用的Greasemonkey脚本和浏览器插件。
// @description:zh-TW 無需安裝MacType，優化浏覽器字體顯示，讓每個頁面的中文字體變得有質感，默認使用微軟雅黑字體，亦可自定義設置多種中文字體，附加字體描邊、字體重寫、字體陰影、字體平滑、對特殊樣式元素的過濾和許可等效果，腳本菜單中可使用設置界面進行參數設置，亦可對某域名下所有頁面進行排除渲染，兼容常用的Greasemonkey腳本和瀏覽器插件。
// @description:ja    各ページの中国語フォントをテクスチャにしたり、デフォルトでMicrosoft Yaheiフォントを使用したり、複数の中国語フォントをカスタマイズしたり、フォントストローク、フォント書き換え、フォントシャドウ、フォントスムージング、特別なスタイル要素のフィルタリングやライセンスなどの効果を追加したり、スクリプトメニューで設定インターフェイスを使用してパラメータ設定を行ったり、ドメイン名の下にあるすべてのページを除外してレンダリングしたり、一般的なGreasemonkeyスクリプトやブラウザプラグインと互換性があります。
// @description:en    Let each page of the Chinese font becomes texture, the default uses Microsoft YaHei font, and you can customize the set of Chinese fonts, additional font strokes, font rewriting, font shadows, smooth, and special Filtering and licensing of style elements, etc., you can use the setting interface to perform parameter settings in the script menu, or you can exclude all pages under a domain name, compatible with common Greasemonkey scripts and browser plugins.
// @namespace       https://openuserjs.org/scripts/f9y4ng/Font_Rendering_(Customized)
// @icon            https://img.icons8.com/ios-filled/50/26e07f/font-style-formatting.png
// @homepageURL     https://f9y4ng.github.io/GreasyFork-Scripts/
// @supportURL      https://github.com/F9y4ng/GreasyFork-Scripts/issues
// @updateURL       https://github.com/F9y4ng/GreasyFork-Scripts/raw/master/Font%20Rendering.meta.js
// @downloadURL     https://github.com/F9y4ng/GreasyFork-Scripts/raw/master/Font%20Rendering.user.js
// @include         *
// @grant           GM_info
// @grant           GM_registerMenuCommand
// @grant           GM.registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_openInTab
// @grant           GM.openInTab
// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_setValue
// @grant           GM.setValue
// @grant           GM_deleteValue
// @grant           GM.deleteValue
// @compatible      edge 兼容TamperMonkey, ViolentMonkey
// @compatible      Chrome 兼容TamperMonkey, ViolentMonkey
// @compatible      Firefox 兼容Greasemonkey, TamperMonkey, ViolentMonkey
// @compatible      Opera 兼容TamperMonkey, ViolentMonkey
// @compatible      Safari 兼容Tampermonkey • Safari
// @license         GPL-3.0-only
// @create          2020-11-24
// @copyright       2020-2021, F9y4ng
// @run-at          document-start
// ==/UserScript==

!(function () {
  "use strict";

  /* customize */

  const isdebug = false; // set "true" to debug scripts, May cause script response slower.

  /* Perfectly Compatible For Greasemonkey4.0+, TamperMonkey, ViolentMonkey * F9y4ng * 20210609 */

  let GMsetValue, GMgetValue, GMdeleteValue, GMregisterMenuCommand, GMunregisterMenuCommand, GMopenInTab;
  const GMinfo = GM_info;
  const handlerInfo = GMinfo.scriptHandler;
  const GMversion = GMinfo.version;
  const isGM = Boolean(handlerInfo.toLowerCase() === "greasemonkey");
  const debug = isdebug ? console.log.bind(console) : () => {};
  const error = isdebug ? console.error.bind(console) : () => {};

  /* GM selector */

  if (isGM) {
    GMsetValue = GM.setValue;
    GMgetValue = GM.getValue;
    GMdeleteValue = GM.deleteValue;
    GMregisterMenuCommand = GM.registerMenuCommand;
    GMunregisterMenuCommand = () => {};
    GMopenInTab = GM.openInTab;
  } else {
    GMsetValue = GM_setValue;
    GMgetValue = GM_getValue;
    GMdeleteValue = GM_deleteValue;
    GMregisterMenuCommand = GM_registerMenuCommand;
    GMunregisterMenuCommand = GM_unregisterMenuCommand;
    GMopenInTab = GM_openInTab;
  }

  /* default CONST Values */

  const defCon = {
    scriptAuthor: GMinfo.scriptMetaStr.match(/(\u0061\u0075\u0074\u0068\u006f\u0072\s+)(\S+)/)[2],
    scriptName: getScriptNameViaLanguage(),
    curVersion: GMinfo.script.version,
    supportURL: GMinfo.script.supportURL,
    vals: [],
    errors: [],
    domainCount: 0,
    successId: false,
    options: isGM ? false : { active: true, insert: true, setParent: true },
    encrypt: n => {
      return window.btoa(encodeURIComponent(n));
    },
    decrypt: n => {
      return decodeURIComponent(window.atob(n));
    },
    randString: (n, v, s = "") => {
      const a = "0123456789";
      const b = "abcdefghijklmnopqrstuvwxyz";
      const c = b.toUpperCase();
      const x = b + c;
      const y = c + a + b;
      const r = v ? x : y;
      n = Number(n) ? n : 10;
      for (; n > 0; --n) {
        s += r[Math.floor(Math.random() * r.length)];
      }
      return v ? s : x[Math.floor(Math.random() * x.length)].concat(s);
    },
    sqliteDB: (e, t, p, d = "", g = "", o = "") => {
      for (let i = 0; i < p.length; i += 1) {
        d += p.charCodeAt(i).toString();
      }
      const s = Math.floor(d.length / 5);
      const m = parseInt(d.charAt(s) + d.charAt(s * 2) + d.charAt(s * 3) + d.charAt(s * 4) + d.charAt(s * 5));
      const c = Math.ceil(p.length / 2);
      const u = Math.pow(2, 31) - 1;
      if (t) {
        if (m < 2) {
          return "";
        }
        let l = Math.round(Math.random() * 1e9) % 1e8;
        d += l;
        while (d.length > 10) {
          d = (parseInt(d.substring(0, 10)) + parseInt(d.substring(10, d.length))).toString();
        }
        d = (m * d + c) % u;
        for (let i = 0, len = e.length; i < len; i += 1) {
          g = parseInt(e.charCodeAt(i) ^ Math.floor((d / u) * 255));
          if (g < 16) {
            o += "0" + g.toString(16);
          } else {
            o += g.toString(16);
          }
          d = (m * d + c) % u;
        }
        l = l.toString(16);
        while (l.length < 8) {
          l = "0" + l;
        }
        o += l;
        return o;
      } else {
        const l = parseInt(e.substring(e.length - 8, e.length), 16);
        e = e.substring(0, e.length - 8);
        d += l;
        while (d.length > 10) {
          d = (parseInt(d.substring(0, 10)) + parseInt(d.substring(10, d.length))).toString();
        }
        d = (m * d + c) % u;
        for (let i = 0, len = e.length; i < len; i += 2) {
          g = parseInt(parseInt(e.substring(i, i + 2), 16) ^ Math.floor((d / u) * 255));
          o += String.fromCharCode(g);
          d = (m * d + c) % u;
        }
        return decodeURIComponent(o);
      }
    },
    getHostname: () => {
      try {
        return top.location.hostname;
      } catch (e) {
        error("\u27A4 hostname:", e.name);
        return location.hostname;
      }
    },
    isWinTop: () => {
      try {
        return window.self === window.top;
      } catch (e) {
        error("\u27A4 isWinTop:", e.name);
        const eI = parent.frames.length > 0;
        return !eI;
      }
    },
  };

  /* Define random aliases */

  defCon.id = {
    rndId: defCon.randString(12, true),
    dialogbox: defCon.randString(12, true),
    container: defCon.randString(10, true),
    field: defCon.randString(9, true),
    fontList: defCon.randString(8, true),
    fontFace: defCon.randString(8, true),
    fontSmooth: defCon.randString(8, true),
    fontStroke: defCon.randString(8, true),
    fontShadow: defCon.randString(8, true),
    shadowColor: defCon.randString(8, true),
    fontCSS: defCon.randString(8, true),
    fontEx: defCon.randString(8, true),
    submit: defCon.randString(8, true),
    fface: defCon.randString(6, true),
    smooth: defCon.randString(6, true),
    fontSize: defCon.randString(8, true),
    fontZoom: defCon.randString(6, true),
    zoomSize: defCon.randString(7, true),
    strokeSize: defCon.randString(6, false),
    stroke: defCon.randString(7, true),
    shadowSize: defCon.randString(6, false),
    shadow: defCon.randString(7, true),
    cps: defCon.randString(9, true),
    cpm: defCon.randString(9, true),
    color: defCon.randString(7, true),
    cssfun: defCon.randString(7, true),
    exclude: defCon.randString(7, true),
    selector: defCon.randString(9, true),
    cleaner: defCon.randString(7, true),
    fonttooltip: defCon.randString(7, true),
    fontName: defCon.randString(6, true),
    cSwitch: defCon.randString(5, false),
    eSwitch: defCon.randString(5, false),
    backup: defCon.randString(6, true),
    files: defCon.randString(5, false),
    tfiles: defCon.randString(5, false),
    db: defCon.randString(12, true),
    bk: defCon.randString(7, true),
    isbackup: defCon.randString(6, false),
    pv: defCon.randString(7, true),
    ispreview: defCon.randString(6, false),
    fs: defCon.randString(7, true),
    isfontsize: defCon.randString(6, false),
    mps: defCon.randString(7, true),
    maxps: defCon.randString(6, true),
    feedback: defCon.randString(6, true),
    seed: defCon.randString(4, false),
    fontTest: defCon.randString(16, true),
    flc: defCon.randString(6, true),
    flcid: defCon.randString(5, false),
  };
  defCon.class = {
    rndClass: defCon.randString(10, true),
    rndStyle: defCon.randString(10, true),
    guide: defCon.randString(5, false),
    title: defCon.randString(7, true),
    help: defCon.randString(5, false),
    rotation: defCon.randString(6, true),
    main: defCon.randString(7, true),
    fontList: defCon.randString(7, true),
    spanlabel: defCon.randString(5, false),
    label: defCon.randString(5, false),
    placeholder: defCon.randString(5, false),
    checkbox: defCon.randString(7, true),
    flex: defCon.randString(9, true),
    tooltip: defCon.randString(8, true),
    tooltiptext: defCon.randString(9, true),
    ps1: defCon.randString(4, false),
    ps2: defCon.randString(4, false),
    ps3: defCon.randString(4, false),
    ps4: defCon.randString(4, false),
    slider: defCon.randString(7, true),
    colorPicker: defCon.randString(8, true),
    colorPicker2: defCon.randString(8, true),
    readonly: defCon.randString(7, true),
    notreadonly: defCon.randString(7, true),
    reset: defCon.randString(6, false),
    cancel: defCon.randString(6, false),
    submit: defCon.randString(6, false),
    selector: defCon.randString(9, true),
    selectFontId: defCon.randString(8, true),
    close: defCon.randString(6, true),
    cp: defCon.randString(10, true),
    cpcb: defCon.randString(6, true),
    cpcw: defCon.randString(6, false),
    cprbp: defCon.randString(7, true),
    cpg: defCon.randString(7, true),
    cpgc: defCon.randString(6, true),
    cpgb: defCon.randString(6, false),
    cpc: defCon.randString(7, true),
    cprb: defCon.randString(7, true),
    db: defCon.randString(10, true),
    dbbc: defCon.randString(8, true),
    dbb: defCon.randString(7, true),
    dbm: defCon.randString(7, true),
    dbt: defCon.randString(7, true),
    dbbt: defCon.randString(6, false),
    dbbf: defCon.randString(6, false),
    dbbn: defCon.randString(6, false),
    switch: defCon.randString(5, false),
    anim: defCon.randString(5, false),
    range: defCon.randString(11, true),
    rangeProgress: defCon.randString(10, false),
  };

  const defaultArray = [];
  const curHostname = defCon.getHostname();
  const curWindowtop = defCon.isWinTop();
  const guideURI = defCon.decrypt("aHR0cHMlM0ElMkYlMkZncmVhc3lmb3JrLm9yZyUyRnNjcmlwdHMlMkY0MTY2ODglMjNndWlkZQ==");
  const fontlistIMG = defCon.decrypt("aHR0cHMlM0ElMkYlMkZ6My5heDF4LmNvbSUyRjIwMjElMkYwOSUyRjA0JTJGaDJLdWRLLmdpZg==");
  const loadingIMG = defCon.decrypt("aHR0cHMlM0ElMkYlMkZpbWcuemNvb2wuY24lMkZjb21tdW5pdHklMkYwMzhkZGU0NThmOWE4NzRhODAxMjE2MGY3NDE3ZjZlLmdpZg==");
  const qS = str => {
    return document.querySelector(str);
  };
  const cE = str => {
    return document.createElement(str);
  };

  /* Passive event listeners */

  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, "passive", {
      get: () => {
        supportsPassive = true;
        return supportsPassive;
      },
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (e) {
    error("\u27A4 supportsPassive:", e.name);
  }

  /* Initialized important functions */

  function getScriptNameViaLanguage() {
    const language = navigator.browserLanguage || navigator.language;
    const name_i18n = new RegExp(`(@name:${language}\\s+)(\\S+)`);
    const languageString = GMinfo.scriptMetaStr.match(name_i18n);
    return languageString ? languageString[2] : GMinfo.script.name;
  }

  function RAFInterval(callback, period, runNow, times = 0) {
    const needCount = (period / 1000) * 60;
    if (runNow === true) {
      const shouldFinish = callback();
      if (shouldFinish) {
        return;
      }
    }
    const step = () => {
      if (times < needCount) {
        times++;
        requestAnimationFrame(step);
      } else {
        const shouldFinish = callback() || false;
        if (!shouldFinish) {
          times = 0;
          requestAnimationFrame(step);
        } else {
          return;
        }
      }
    };
    requestAnimationFrame(step);
  }

  function addStyle(css, className, addToTarget, T = "T", isReload = false, initType = "text/css", reNew = false) {
    RAFInterval(
      () => {
        try {
          if (typeof addToTarget === "object" && addToTarget) {
            if (isReload === true && addToTarget.querySelector(`.${className}`)) {
              safeRemove(`.${className}`, addToTarget);
              debug(`\u27A4 style[${T}] View:`, Boolean(addToTarget.querySelector(`.${className}`)));
              while (addToTarget.querySelector(`style[id^="${T}"]`)) {
                safeRemove(`style[id^="${T}"]`, addToTarget);
                debug(`\u27A4 style[${T}] Review:`, Boolean(addToTarget.querySelector(`style[id^="${T}"]`)));
              }
              reNew = true;
            } else if (isReload === false && addToTarget.querySelector(`.${className}`)) {
              return true;
            }
            const cssNode = cE("style");
            if (className !== null) {
              cssNode.className = className;
            }
            cssNode.id = T + Date.now().toString().slice(-8);
            cssNode.setAttribute("type", initType);
            cssNode.innerHTML = css;
            addToTarget.appendChild(cssNode);
            if (reNew && addToTarget.querySelector(`.${className}`)) {
              return true;
            }
          }
        } catch (e) {
          error("\u27A4 addStyle", e);
        }
      },
      20,
      true
    );
  }

  function convert2Unicode(str, value = "") {
    for (let i = 0; i < str.length; i++) {
      value += "\\" + ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return value.toUpperCase();
  }

  function scrollInsteadFixed(target, size, distTop) {
    let sT = 0 - (document.body.getBoundingClientRect().top || document.documentElement.getBoundingClientRect().top || 0);
    target.style.top = `${sT / size}px`;
    window.scrollTo(0, sT - 1e-5);
    defCon[distTop] = () => {
      sT = 0 - (document.body.getBoundingClientRect().top || document.documentElement.getBoundingClientRect().top || 0);
      target.style.top = `${sT / size}px`;
    };
    document.addEventListener("scroll", defCon[distTop]);
  }

  function safeRemove(s, t) {
    try {
      const removeNodes = t.querySelectorAll(s);
      for (let i = 0; i < removeNodes.length; i++) {
        removeNodes[i].parentNode.removeChild(removeNodes[i]);
      }
    } catch (e) {
      error("\u27A4 safeRemove:", e);
    }
  }

  function __preview__(_preview_, ts = defCon.tStyle, s = true) {
    try {
      if (_preview_) {
        addStyle(ts, `${defCon.class.rndStyle}`, document.head, "TS", true);
        document.querySelectorAll("iframe").forEach(items => {
          const h = items.contentWindow;
          try {
            const hn = h.location.hostname;
            if (hn === curHostname) {
              const sT = h.document.head.querySelectorAll("style[id^='TS']");
              if (sT.length) {
                addStyle(ts, sT[0].className, h.document.head, "TS", true);
              } else {
                addStyle(ts, `${defCon.class.rndStyle}`, h.document.head, "TS", false);
              }
            }
          } catch (e) {
            error("\u27A4 window.frames:", e);
          }
        });
        defCon.preview = !s;
      }
    } catch (e) {
      error("\u27A4 __preview__:", e);
    }
  }

  /* expire for fontlist cache */

  const cache = {
    value: data => {
      const exp = 864e5; // 24 hrs
      debug("\u27A4 cache expires define: %s hrs", exp / 36e5);
      return {
        data: data,
        expired: Date.now() + exp,
      };
    },

    set: (key, options) => {
      const obj = defCon.encrypt(JSON.stringify(cache.value(options)));
      localStorage.setItem(key, obj);
    },

    get: key => {
      const obj = localStorage.getItem(key);
      if (!obj) {
        return obj;
      } else {
        try {
          const value = JSON.parse(defCon.decrypt(obj));
          const data = value.data;
          const expiredTime = value.expired;
          const curTime = Date.now();
          debug("\u27A4 cache expires remain: %s hrs", ((expiredTime - curTime) / 36e5).toFixed(2));
          if (expiredTime > curTime && typeof data === "object") {
            return data;
          } else {
            cache.remove(key);
            return null;
          }
        } catch (e) {
          error("\u27A4 cache.get error:", e);
          cache.remove(key);
          return null;
        }
      }
    },

    remove: key => {
      localStorage.removeItem(key);
    },
  };

  /* Data download */

  function dataDownload(f, d) {
    let e = cE("a");
    e.setAttribute("href", "data:application/octet-stream;charset=utf-8," + defCon.encrypt(d));
    e.setAttribute("download", f);
    e.style.display = "none";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
  }

  /* Get browser core & system parameters */

  const getBrowser = {
    type: (info, system = "other", browserArray = {}, browserInfo = "unknow") => {
      const u = navigator.userAgent.toLowerCase();
      switch (info) {
        case "core":
          return {
            Trident: u.includes("trident") || u.includes("compatible"),
            Presto: u.includes("presto") || u.includes("opr"),
            WebKit: u.includes("applewebkit"),
            Gecko: u.includes("gecko") && !u.includes("khtml"),
            EdgeHTML: u.includes("edge"),
          };
        case "system":
          if (/windows|win32|win64|wow32|wow64/g.test(u)) {
            system = "Windows";
          } else if (/macintosh|macintel/g.test(u) || u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            system = "MacOS";
          } else if (/x11/g.test(u)) {
            system = "Linux";
          } else if (/android|adr/g.test(u)) {
            system = "Android";
          } else if (/ios|iphone|ipad|ipod|iwatch/g.test(u)) {
            system = "iOS";
          }
          return system;
        case "browser":
          browserArray = {
            IE: window.ActiveXObject || "ActiveXObject" in window,
            Chromium: u.includes("chromium"),
            Chrome: u.includes("chrome") && !u.includes("edg") && !u.includes("chromium"),
            Firefox: u.includes("firefox") && u.includes("gecko"),
            Opera: u.includes("presto") || u.includes("opr") || u.includes("opera"),
            Safari: u.includes("safari") && !u.includes("chrome"),
            Edge: u.includes("edg"),
            QQBrowser: /qqbrowser/g.test(u),
            Wechat: /micromessenger/g.test(u),
            UCBrowser: /ucbrowser/g.test(u),
            Sougou: /metasr/g.test(u),
            Maxthon: /maxthon/g.test(u),
            CentBrowser: /cent/g.test(u),
          };
          for (let i in browserArray) {
            if (browserArray[i]) {
              browserInfo = i;
            }
          }
          return browserInfo;
        default:
          return u;
      }
    },
  };

  /* Redefine Propertise */

  const definePropertyForZoom = function (t) {
    const setValue = (s, g, mod, z = 0) => {
      const f = getBrowser.type("core").Gecko;
      switch (mod) {
        case 1:
          if (s.target.parentNode && s.target.parentNode !== document) {
            z = s.target.parentNode.getBoundingClientRect()[g] / (f ? t : 1);
          }
          return z;
        case 2:
          return 0 - s.getBoundingClientRect()[g] / t;
      }
    };
    // HTMLelements
    Object.defineProperties(document.documentElement, {
      scrollLeft: {
        get: function () {
          return setValue(this, "left", 2);
        },
        set: Value => {},
        configurable: true,
      },
      scrollTop: {
        get: function () {
          return setValue(this, "top", 2);
        },
        set: Value => {},
        configurable: true,
      },
    });
    // MouseEvents
    Object.defineProperties(MouseEvent.prototype, {
      clientX: {
        get: function () {
          return this.x / t;
        },
        configurable: false,
      },
      clientY: {
        get: function () {
          return this.y / t;
        },
        configurable: false,
      },
      pageX: {
        get: function () {
          return this.x / t + (window.scrollX || window.pageXOffset);
        },
        configurable: false,
      },
      pageY: {
        get: function () {
          return this.y / t + (window.scrollY || window.pageYOffset);
        },
        configurable: false,
      },
      layerX: {
        get: function () {
          return this.x / t - setValue(this, "left", 1);
        },
        configurable: false,
      },
      layerY: {
        get: function () {
          return this.y / t - setValue(this, "top", 1);
        },
        configurable: false,
      },
      offsetX: {
        get: function () {
          return this.x / t - setValue(this, "left", 1);
        },
        configurable: false,
      },
      offsetY: {
        get: function () {
          return this.y / t - setValue(this, "top", 1);
        },
        configurable: false,
      },
    });
  };

  /* Slider Movements init */

  function setSliderProperty(a, b, c) {
    a.value = Number(b).toFixed(c);
    a.setAttribute("value", Number(b));
    a.parentNode.style.setProperty("--value", Number(b));
    a.parentNode.style.setProperty("--text-value", JSON.stringify(Number(b).toFixed(c).toString()));
  }

  function checkDraw(b, a, c, f, g = false) {
    b.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9.]/, "");
    });
    b.addEventListener("change", function () {
      const thatValue = this.value === "OFF" ? (g ? 1 : 0) : Number(this.value);
      const d = Number(a.parentNode.style.getPropertyValue("--value"));
      if (!c.test(thatValue) || thatValue < a.parentNode.style.getPropertyValue("--min") || thatValue > a.parentNode.style.getPropertyValue("--max")) {
        setSliderProperty(a, d, f);
        b.value = g ? (d === 1 ? "OFF" : d.toFixed(f)) : d === 0 ? "OFF" : d.toFixed(f);
        b._value_ = d;
      } else {
        setSliderProperty(a, thatValue, f);
        b.value = g ? (thatValue === 1 ? "OFF" : thatValue.toFixed(f)) : thatValue === 0 ? "OFF" : thatValue.toFixed(f);
        b._value_ = thatValue;
      }
    });
  }

  /* Color Picker initialized */

  const addClassName = (node, str) => {
    if (
      node.className.split(" ").filter(s => {
        return s === str;
      }).length === 0
    ) {
      node.className += ` ${str}`;
    }
  };

  const removeClassName = (node, str) => {
    node.className = node.className
      .split(" ")
      .filter(s => {
        return s !== str;
      })
      .join(" ");
  };

  const numberBorder = (num, max, min) => {
    return Math.max(Math.min(num, max), min);
  };

  const rgbToHsb = hex => {
    const hsb = { h: 0, s: 0, b: 0 };
    if (hex.indexOf("#") === 0) {
      hex = hex.substring(1);
    }
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map(s => {
          return s + s;
        })
        .join("");
    }
    if (hex.length !== 6) {
      return false;
    }
    hex = [hex.substr(0, 2), hex.substr(2, 2), hex.substr(4, 2)].map(s => {
      return parseInt(s, 16);
    });
    const rgb = {
      r: hex[0],
      g: hex[1],
      b: hex[2],
    };
    const MAX = Math.max(...hex);
    const MIN = Math.min(...hex);
    if (MAX === MIN) {
      hsb.h = 0;
    } else if (MAX === rgb.r && rgb.g >= rgb.b) {
      hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 0;
    } else if (MAX === rgb.r && rgb.g < rgb.b) {
      hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 360;
    } else if (MAX === rgb.g) {
      hsb.h = (60 * (rgb.b - rgb.r)) / (MAX - MIN) + 120;
    } else if (MAX === rgb.b) {
      hsb.h = (60 * (rgb.r - rgb.g)) / (MAX - MIN) + 240;
    }
    if (MAX === 0) {
      hsb.s = 0;
    } else {
      hsb.s = 1 - MIN / MAX;
    }
    hsb.b = MAX / 255;
    return hsb;
  };

  const heightToRgb = heightPercent => {
    heightPercent = 1 - heightPercent;
    let rgb = { r: undefined, g: undefined, b: undefined };
    const percentInEach = heightPercent * 6;
    return Object.entries(rgb).reduce((lastObj, nowArr, index) => {
      return Object.assign(lastObj, {
        [nowArr[0]]: Math.floor(
          (() => {
            const left = ((index + 1) % 3) * 2;
            const right = left + 2;
            const differenceL = percentInEach - left;
            const differenceR = right - percentInEach;
            if (differenceL >= 0 && differenceR >= 0) {
              return 0;
            }
            const distance = Math.min(Math.abs(differenceL), Math.abs(differenceR), Math.abs(6 - differenceL), Math.abs(6 - differenceR));
            return Math.min(255, 255 * distance);
          })()
        ),
      });
    }, {});
  };

  const heightAddLAndT_ToRGB = (height, left, top) => {
    const rgb = heightToRgb(height);
    for (const key in rgb) {
      rgb[key] = (255 - rgb[key]) * (1 - left) + rgb[key];
      rgb[key] = rgb[key] * (1 - top);
    }
    return rgb;
  };

  const rgbAToHex = (rgba, err) => {
    rgba = rgba.replace(/\s+/g, "");
    const pattern = /^rgba?\((\d+),(\d+),(\d+),?(\d*(\.\d+)?)?\)$/;
    const result = pattern.exec(rgba);
    if (!result) {
      return err;
    }
    const colors = defaultArray;
    let alpha, r, g, b;
    if (/^rgba/.test(result[0])) {
      alpha = result[4];
      r = Math.floor(alpha * parseInt(result[1]) + (1 - alpha) * 255);
      g = Math.floor(alpha * parseInt(result[2]) + (1 - alpha) * 255);
      b = Math.floor(alpha * parseInt(result[3]) + (1 - alpha) * 255);
      return String(("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2));
    } else {
      for (let i = 1, len = 3; i <= len; ++i) {
        let str = Number(result[i]).toString(16);
        if (str.length === 1) {
          str = 0 + str;
        }
        colors.push(str);
      }
      rgba = colors.join("");
      return rgba;
    }
  };

  const rgbToHex = rgb => {
    const { r, g, b } = rgb;
    return Math.floor(r).toString(16).padStart(2, "0") + Math.floor(g).toString(16).padStart(2, "0") + Math.floor(b).toString(16).padStart(2, "0");
  };

  const hexToRgb = hex => {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
    };
  };

  const toColordepth = (hex, s, t = "light") => {
    hex = hex.toLowerCase() === "currentcolor" ? "FFFFFF" : hex.substring(1);
    const { r, g, b } = hexToRgb(hex);
    const tl = x => {
      switch (t) {
        case "dark":
          return Math.floor(x * s);
        default:
          return x * s > 255 ? 255 : Math.floor(x * s);
      }
    };
    return `#${rgbToHex({ r: tl(r), g: tl(g), b: tl(b) })}`;
  };

  class ColorPicker {
    constructor({ dom = cE("div"), value = "FFF", def = "FFF" } = {}) {
      this.dom = dom;
      this.def = def;
      const thisClass = this;
      Array.prototype.forEach.call(this.getDOM().children, node => {
        node.remove();
      });
      addClassName(dom, `${defCon.class.cp}`);

      const rightBar = cE("div");
      rightBar.className = `${defCon.class.cprb}`;
      const rightBarPicker = cE("div");
      rightBarPicker.className = `${defCon.class.cprbp}`;
      rightBar.appendChild(rightBarPicker);
      const gradientColor = cE("div");
      gradientColor.className = `${defCon.class.cpg} ${defCon.class.cpgc}`;
      const gradientBlack = cE("div");
      gradientBlack.className = `${defCon.class.cpg} ${defCon.class.cpgb}`;
      gradientColor.style.background = "linear-gradient(to right,#FFFFFF,#FF0000)";
      const gradientCircle = cE("div");
      gradientCircle.className = `${defCon.class.cpc}`;

      gradientBlack.appendChild(gradientCircle);
      this.getDOM().appendChild(rightBar);
      this.getDOM().appendChild(gradientColor);
      this.getDOM().appendChild(gradientBlack);

      qS(`.${defCon.class.colorPicker2} #${defCon.id.color}`).addEventListener("change", () => {
        let color = qS(`.${defCon.class.colorPicker2} #${defCon.id.color}`).value.trim();
        this.setValue(color, true);
        this.onchange();
        this.updatePicker();
      });

      this.textInput = qS(`.${defCon.class.colorPicker2} #${defCon.id.color}`);
      this._gradientBlack = gradientBlack;
      this._gradientColor = gradientColor;
      this._rightBar = rightBar;
      this._rightBarPicker = rightBarPicker;
      this._colorBlock = qS(`#${defCon.id.cps}`);
      this._gradientCircle = gradientCircle;

      this._height = 0;
      this._mouseX = 0;
      this._mouseY = 0;

      this.setValue(value, true);
      this._lastValue = this.value;
      this._def = this.def.substring(1);
      this.updatePicker();

      const mouseMoveFun = e => {
        window.addEventListener("mouseup", function mouseUpFun() {
          thisClass.getDOM().style.userSelect = "text";
          window.removeEventListener("mousemove", mouseMoveFun);
          window.removeEventListener("mouseup", mouseUpFun);
        });
        const bbox = thisClass._gradientBlack.getBoundingClientRect();
        this._mouseX = e.x - bbox.left;
        this._mouseY = e.y - bbox.top;
        this.mouseBorder();
        this.setValue(heightAddLAndT_ToRGB(this.height, this.position.x, this.position.y));
        this.updatePicker();
      };
      const mouseMoveFunBar = e => {
        window.addEventListener("mouseup", function mouseUpFunBar() {
          thisClass.getDOM().style.userSelect = "text";
          window.removeEventListener("mousemove", mouseMoveFunBar);
          window.removeEventListener("mouseup", mouseUpFunBar);
        });
        const bbox = thisClass._rightBar.getBoundingClientRect();
        this._height = e.y - bbox.top;
        this.mouseBorderBar();
        this.setValue(heightAddLAndT_ToRGB(this.height, this.position.x, this.position.y));
        this.updatePicker();
      };
      this._gradientBlack.addEventListener("mousedown", e => {
        this.getDOM().style.userSelect = "none";
        mouseMoveFun(e);
        window.addEventListener("mousemove", mouseMoveFun);
      });
      this._rightBar.addEventListener("mousedown", e => {
        this.getDOM().style.userSelect = "none";
        mouseMoveFunBar(e);
        window.addEventListener("mousemove", mouseMoveFunBar);
      });
      if ("ontouchstart" in window) {
        const touchFun = e => {
          e.preventDefault();
          e = e.touches[0];
          const bbox = thisClass._gradientBlack.getBoundingClientRect();
          this._mouseX = e.x - bbox.left;
          this._mouseY = e.y - bbox.top;
          this.mouseBorder();
          this.setValue(heightAddLAndT_ToRGB(this.height, this.position.x, this.position.y));
          this.updatePicker();
        };
        const touchFunBar = e => {
          e.preventDefault();
          e = e.touches[0];
          const bbox = this._rightBar.getBoundingClientRect();
          this._height = e.y - bbox.top;
          this.mouseBorderBar();
          this.setValue(heightAddLAndT_ToRGB(this.height, this.position.x, this.position.y));
          this.updatePicker();
        };
        this._gradientBlack.addEventListener("touchmove", touchFun, supportsPassive ? { passive: true } : false);
        this._gradientBlack.addEventListener("touchstart", touchFun, supportsPassive ? { passive: true } : false);
        this._rightBar.addEventListener("touchmove", touchFunBar, supportsPassive ? { passive: true } : false);
        this._rightBar.addEventListener("touchstart", touchFunBar, supportsPassive ? { passive: true } : false);
      }
      this._changeFunctions = defaultArray;
    }
    onchange() {
      this._changeFunctions.forEach(fun => {
        return fun({
          target: this,
          type: "change",
          timeStamp: performance.now(),
        });
      });
    }
    addEventListener(type, fun) {
      if (typeof fun !== "function") {
        return;
      }
      switch (type) {
        case "change": {
          this._changeFunctions.push(fun);
          break;
        }
      }
    }
    getValue(mode = "value") {
      switch (mode) {
        case "hex": {
          return this._value;
        }
        case "rgb": {
          return hexToRgb(this.getValue("hex"));
        }
        case "hsb": {
          return rgbToHsb(this.getValue("hex"));
        }
        case "value":
        default: {
          return "#" + this._value;
        }
      }
    }
    getBrightness() {
      const { r, g, b } = this.getValue("rgb");
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }
    setValue(value, resetPosition = false, hex = "") {
      const Hex6Reg = /^#([A-F0-9]{6}|[a-f0-9]{6})$/;
      const Hex3Reg = /^#([A-F0-9]{3}|[a-f0-9]{3})$/;
      const rgbaReg = new RegExp(
        String(
          "^rgba\\(([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2([0-4][0-9]|5[0-5])))" +
            ",\\s*([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2([0-4][0-9]|5[0-5])))" +
            ",\\s*([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2([0-4][0-9]|5[0-5])))" +
            ",\\s*((?!1\\.[0-9]+)[0-1]?(\\.[0-9]{1,5})?)\\)$"
        )
      );
      const rgbReg = new RegExp(
        String(
          "^rgb\\(([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2([0-4][0-9]|5[0-5])))" +
            ",\\s*([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2([0-4][0-9]|5[0-5])))" +
            ",\\s*([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2([0-4][0-9]|5[0-5])))\\)$"
        )
      );
      switch (typeof value) {
        case "string": {
          if (Hex6Reg.test(value)) {
            value = value.substring(1);
          } else if (Hex3Reg.test(value)) {
            value = value
              .substring(1)
              .split("")
              .map(s => {
                return s + s;
              })
              .join("");
          } else if (rgbaReg.test(value)) {
            value = rgbAToHex(value, this._def);
          } else if (rgbReg.test(value)) {
            value = rgbAToHex(value, this._def);
          } else if (value === "currentcolor") {
            value = "FFFFFF";
          } else {
            value = this._def;
          }
          hex = value;
          break;
        }
        case "object": {
          hex = rgbToHex(value);
        }
      }
      let rgb;
      try {
        rgb = hexToRgb(hex);
      } catch (error) {
        rgb = {
          r: 255,
          g: 255,
          b: 255,
        };
      }
      const { r, g, b } = rgb;
      this._value = rgbToHex({ r, g, b }).toUpperCase();
      this.textInput.value = this._value === "FFFFFF" ? "currentcolor" : "#" + this._value;
      this.textInput._value_ = this.textInput.value;
      this._colorBlock.style.backgroundColor = this.getValue();
      if (resetPosition) {
        const { h, s, b } = rgbToHsb(hex);
        this._height = 1 - h / 360;
        if (h === 0) {
          this._height = 0;
        }
        this._mouseX = s;
        this._mouseY = 1 - b;
      } else {
        if (this._lastValue !== this.value) {
          this.onchange();
        }
      }
      this._lastValue = this.value;
    }
    getDOM() {
      return this.dom;
    }
    mouseBorder() {
      this._mouseX = numberBorder(this._mouseX / (this._gradientBlack.getBoundingClientRect().width - 2), 1, 0);
      this._mouseY = numberBorder(this._mouseY / (this._gradientBlack.getBoundingClientRect().height - 2), 1, 0);
    }
    mouseBorderBar() {
      this._height = numberBorder(this._height / (this._rightBar.getBoundingClientRect().height - 2), 1, 0);
    }
    updatePicker() {
      const position = this.position;
      const target = this._gradientCircle;
      target.style.left = `${position.x * 100}%`;
      target.style.top = `${position.y * 100}%`;
      this._rightBarPicker.style.top = `${this.height * 100}%`;
      this._gradientColor.style.background = `linear-gradient(to right,#FFFFFF,#${rgbToHex(heightToRgb(this.height))})`;
      if (this.getBrightness() > 152) {
        addClassName(target, `${defCon.class.cpcb}`);
        removeClassName(target, `${defCon.class.cpcw}`);
      } else {
        removeClassName(target, `${defCon.class.cpcb}`);
        addClassName(target, `${defCon.class.cpcw}`);
      }
    }
    get position() {
      return {
        x: this._mouseX,
        y: this._mouseY,
      };
    }
    get height() {
      return this._height;
    }
    get value() {
      return this.getValue();
    }
    set value(value) {
      this.setValue(value, true);
      this.updatePicker();
    }
  }

  /* new frDialogBox */

  class frDialogBox {
    constructor({
      titleText = "Error",
      messageText = "Something unexpected has gone wrong. If the problem persists, contact your administrator",
      trueButtonText = "OK",
      falseButtonText = null,
      neutralButtonText = null,
    } = {}) {
      this.titleText = titleText;
      this.messageText = messageText;
      this.trueButtonText = trueButtonText;
      this.falseButtonText = falseButtonText;
      this.neutralButtonText = neutralButtonText;

      this.hasFalse = falseButtonText !== null;
      this.hasNeutral = neutralButtonText !== null;

      this.container = undefined;
      this.frDialog = undefined;
      this.trueButton = undefined;
      this.falseButton = undefined;
      this.neutralButton = undefined;

      this.parent = document.body;
      this.zoomText = undefined;

      this._createfrDialog(this);
      this._appendfrDialog();
      this._resetfrDialog(0);
    }

    _createfrDialog(context) {
      this.container = cE("fr-dialogbox");
      this.container.id = defCon.id.dialogbox;

      this.frDialog = cE("div");
      this.frDialog.classList.add(`${defCon.class.db}`);
      this.frDialog.style.opacity = 0;
      this.container.appendChild(this.frDialog);

      const title = cE("div");
      title.textContent = this.titleText;
      title.classList.add(`${defCon.class.dbt}`);
      this.frDialog.appendChild(title);

      const question = cE("div");
      question.innerHTML = this.messageText;
      question.classList.add(`${defCon.class.dbm}`);
      this.frDialog.appendChild(question);

      const buttonContainer = cE("div");
      buttonContainer.classList.add(`${defCon.class.dbbc}`);
      this.frDialog.appendChild(buttonContainer);

      this.trueButton = cE("a");
      this.trueButton.classList.add(`${defCon.class.dbb}`, `${defCon.class.dbbt}`);
      this.trueButton.textContent = this.trueButtonText;
      this.trueButton.addEventListener("click", () => {
        context._destroy();
      });
      buttonContainer.appendChild(this.trueButton);

      if (this.hasFalse) {
        this.falseButton = cE("a");
        this.falseButton.classList.add(`${defCon.class.dbb}`, `${defCon.class.dbbf}`);
        this.falseButton.textContent = this.falseButtonText;
        this.falseButton.addEventListener("click", () => {
          context._destroy();
        });
        buttonContainer.appendChild(this.falseButton);
      }

      if (this.hasNeutral) {
        this.neutralButton = cE("a");
        this.neutralButton.classList.add(`${defCon.class.dbb}`, `${defCon.class.dbbn}`);
        this.neutralButton.textContent = this.neutralButtonText;
        this.neutralButton.addEventListener("click", () => {
          context._destroy();
        });
        buttonContainer.appendChild(this.neutralButton);
      }
    }

    _appendfrDialog() {
      const container = this.container;
      const diag = this.frDialog;
      if (container) {
        if (!qS(`#${defCon.id.dialogbox}`)) {
          this.parent.appendChild(container);
          setTimeout(() => {
            diag.style.opacity = 1;
          }, 10);
        }
      }
    }

    _resetfrDialog(initTop) {
      const zoom = Number(window.getComputedStyle(this.parent, null).getPropertyValue("zoom")) || defCon.tZoom || 1;
      if (zoom !== 1) {
        if (getBrowser.type("core").Gecko) {
          this.zoomText = String(
            `transform-origin:left top 0px;
            transform:scale(${1 / zoom});
            width:${document.documentElement.clientWidth}px;
            height:${document.documentElement.clientHeight}px;
            top:${initTop}px`
          ).trim();
          this.container.style.cssText += this.zoomText;
          scrollInsteadFixed(this.container, zoom, "dialogbox");
        } else {
          this.zoomText = `zoom:${1 / zoom}`;
          this.container.style.cssText += this.zoomText;
        }
      }
    }

    _destroy() {
      if (this.container) {
        if (getBrowser.type("core").Gecko && defCon.dialogbox) {
          document.removeEventListener("scroll", defCon.dialogbox);
          delete defCon.dialogbox;
        }
        this.container.remove();
        for (let key in this) {
          delete this[key];
        }
        debug("\u27A4", this);
      }
    }

    respond() {
      return new Promise((resolve, reject) => {
        const somethingWentWrongUponCreation = !this.frDialog || !this.trueButton;
        if (somethingWentWrongUponCreation) {
          reject(new Error("Something went wrong upon modal creation"));
        }
        this.trueButton.addEventListener("click", () => {
          resolve(true);
        });
        if (this.hasFalse) {
          this.falseButton.addEventListener("click", () => {
            resolve(false);
          });
        }
      });
    }
  }

  function closeAllDialog(e) {
    if (qS(e)) {
      if (getBrowser.type("core").Gecko && defCon.dialogbox) {
        document.removeEventListener("scroll", defCon.dialogbox);
        delete defCon.dialogbox;
      }
      qS(e).remove();
    }
  }

  /* Font filtering & discriminating list */

  let fontCheck = new Set([
    { ch: "微软雅黑", en: "Microsoft YaHei" },
    { ch: "微軟正黑體", en: "Microsoft JhengHei" },
    { ch: "苹方-简", en: "PingFang SC" },
    { ch: "蘋方-繁", en: "PingFang TC" },
    { ch: "蘋方-港", en: "PingFang HK" },
    { ch: "更纱黑体 SC", en: "Sarasa Gothic SC" },
    { ch: "更紗黑體 TC", en: "Sarasa Gothic TC" },
    { ch: "冬青黑体简", en: "Hiragino Sans GB" },
    { ch: "兰亭黑-简", en: "Lantinghei SC" },
    { ch: "OPPOSans", en: "OPPOSans" },
    { ch: "霞鹜文楷", en: "LXGW WenKai" },
    { ch: "鸿蒙黑体", en: "HarmonyOS Sans SC" },
    { ch: "浪漫雅圆", en: "LMYY" },
    { ch: "思源黑体", en: "Source Han Sans SC" },
    { ch: "思源宋体", en: "Source Han Serif SC" },
    { ch: "汉仪旗黑", en: "HYQiHei" },
    { ch: "文泉驿微米黑", en: "WenQuanYi Micro Hei" },
    { ch: "方正舒体", en: "FZShuTi" },
    { ch: "方正姚体", en: "FZYaoti" },
    { ch: "华文仿宋", en: "STFangsong" },
    { ch: "华文楷体", en: "STKaiti" },
    { ch: "华文细黑", en: "STXihei" },
    { ch: "华文彩云", en: "STCaiyun" },
    { ch: "华文琥珀", en: "STHupo" },
    { ch: "华文新魏", en: "STXinwei" },
    { ch: "华文隶书", en: "STLiti" },
    { ch: "华文行楷", en: "STXingkai" },
    { ch: "华康翩翩体", en: "Hanzipen SC" },
    { ch: "华康手札体", en: "Hannotate SC" },
    { ch: "娃娃体-简", en: "Wawati SC" },
    { ch: "雅痞-简", en: "Yapi SC" },
    { ch: "圆体-简", en: "Yuanti SC" },
    { ch: "手书体", en: "ShouShuti" },
    { ch: "幼圆", en: "YouYuan" },
  ]);

  class isSupportFontFamily {
    constructor() {
      const baseFonts = ["monospace", "serif", "Georgia", "sans-serif", "Tahoma"];
      const testString = "这是测试、這是測試：1234567890, WWWwwwMMMmmmLlOoIi.";
      const testSize = "72px";
      const h = qS("body");
      const s = cE("fr-fontfamily");
      s.classList.add(`fa`, `${defCon.id.seed}_fontTest`);
      s.id = `${defCon.id.fontTest}`;
      s.innerHTML = testString;
      let defaultWidth = {};
      let defaultHeight = {};
      for (let index in baseFonts) {
        s.style.cssText = `font-size:${testSize}!important;font-family:${baseFonts[index]}!important;`;
        try {
          h.appendChild(s);
          defaultWidth[baseFonts[index]] = s.offsetWidth;
          defaultHeight[baseFonts[index]] = s.offsetHeight;
          h.removeChild(s);
        } catch (e) {
          error("\u27A4 isSupportFontFamily:", e);
        }
      }
      const detect = font => {
        let detected = false;
        try {
          for (let index in baseFonts) {
            s.style.cssText = `font-size:${testSize}!important;font-family:'${font}',${baseFonts[index]}!important;`;
            h.appendChild(s);
            const _offsetWidth = s.offsetWidth;
            const _offsetHeight = s.offsetHeight;
            const matched = _offsetWidth !== defaultWidth[baseFonts[index]] || _offsetHeight !== defaultHeight[baseFonts[index]];
            h.removeChild(s);
            detected = detected || matched;
            if (detected) {
              debug("\u27A4 detect:", {
                font: font,
                width: _offsetWidth,
                defwidth: defaultWidth[baseFonts[index]],
                height: _offsetHeight,
                defheihgt: defaultHeight[baseFonts[index]],
              });
              break;
            }
          }
        } catch (e) {
          error("\u27A4 FontFamily.detect:", e);
        }
        return detected;
      };
      this.detect = detect;
    }
  }

  function unique(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].ch === arr[j].ch || arr[i].en === arr[j].en) {
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  }

  const ddRemove = item => {
    const temp = item.nextElementSibling;
    item.remove();
    if (temp !== null && temp.nodeName === "DD") {
      ddRemove(temp);
    }
  };

  const fontSet = function (s) {
    return {
      that: Array.prototype.slice.call(document.querySelectorAll(s), 0),
      stopPropagation: e => {
        e = e || window.event;
        e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
      },

      hide: () => {
        fontSet(s).that.forEach(item => {
          item.style.cssText += "display:none";
        });
      },

      show: () => {
        fontSet(s).that.forEach(item => {
          item.style.cssText += "display:block";
        });
      },

      cloze: async (item, fontData) => {
        ddRemove(item.parentNode);
        const value = item.parentNode.children[1].value;
        const sort = Number(item.parentNode.children[1].attributes.sort.value);
        const text = item.parentNode.children[0].innerHTML;
        fontData.push({ ch: text, en: value, sort: sort });
        fontData.sort((a, b) => {
          return a.sort - b.sort;
        });
        if (fontSet(`#${defCon.id.fontList} .${defCon.class.close}`).that.length === 0) {
          const submitButton = qS(`#${defCon.id.submit} .${defCon.class.submit}`);
          const ffaceT = qS(`#${defCon.id.fface}`);
          const inputFont = qS(`#${defCon.id.fontList} .${defCon.class.selectFontId} input`);
          if (ffaceT.checked) {
            const cfl = await GMgetValue("_Custom_fontlist_");
            const cusFontCheck = cfl ? JSON.parse(defCon.decrypt(cfl)) : defaultArray;
            fontCheck = unique([...fontCheck, ...cusFontCheck]);
            fontCheck.forEach(item => {
              if (item.en === defCon.refont || convert2Unicode(item.ch) === defCon.refont) {
                defCon.curFont = item.ch;
              }
            });
            inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${defCon.curFont}`);
          }
          for (let i = defCon.vals.length - 1; i >= 0; i--) {
            if (defCon.vals[i] === `${defCon.id.fontName}`) {
              defCon.vals.splice(i, 1);
              break;
            }
          }
          if (submitButton.classList.contains(`${defCon.class.anim}`)) {
            if (!defCon.vals.length) {
              submitButton.classList.remove(`${defCon.class.anim}`);
              if (defCon.isPreview) {
                submitButton.innerText = "\u4fdd\u5b58";
                submitButton.removeAttribute("style");
                submitButton.removeAttribute("v-Preview");
                __preview__(defCon.preview);
              }
            } else if (!defCon.vals.includes(`${defCon.id.fontName}`) && defCon.isPreview) {
              submitButton.innerText = "\u9884\u89c8";
              submitButton.setAttribute("style", "background-color:coral!important;border-color:coral!important");
              submitButton.setAttribute("v-Preview", "true");
            }
          }
          fontSet(`#${defCon.id.selector}`).that[0].style.cssText += "display:none;";
        }
      },

      fdeleteList: fontData => {
        const close = fontSet(`#${defCon.id.fontList} .${defCon.class.close}`);
        close.that.forEach(item => {
          fontSet().cloze(item, fontData);
        });
        return Boolean(close.that.length);
      },

      fresetList: fontData => {
        fontSet().fdeleteList(fontData);
        for (let i = 0; i < fontData.length; i++) {
          if (fontData[i].en === "Microsoft YaHei") {
            fontData.splice(i, 1);
            i = fontData.length;
          }
        }
        fontSet(`#${defCon.id.fontList} .${defCon.class.selector}`).that[0].innerHTML += String(
          `<a class="${defCon.class.label}"><span style="border-bottom-left-radius:4px;border-top-left-radius:4px;font-family:'Microsoft YaHei'!important">微软雅黑</span><input type="hidden" name="${defCon.id.fontName}" sort="1" value="Microsoft YaHei"/><span class="${defCon.class.close}" style="border-bottom-right-radius:4px;border-top-right-radius:4px;cursor:pointer;font-family:system-ui,-apple-system,BlinkMacSystemFont,serif!important">\u0026\u0023\u0032\u0031\u0035\u003b</span></a>`
        );
        fontSet(`#${defCon.id.fontList} .${defCon.class.selector}`).that[0].parentNode.style.cssText += "display:block;";
        defCon.vals.push(`${defCon.id.fontName}`);
        qS(`#${defCon.id.cleaner}`).addEventListener("click", () => {
          fontSet().fdeleteList(fontData);
        });
        fontSet(`#${defCon.id.fontList} .${defCon.class.close}`).that.forEach(function (item) {
          item.onclick = function () {
            fontSet().cloze(item, fontData);
          };
        });
      },

      fsearchList: (name, arr = []) => {
        fontSet("input[name=" + name + "]").that.forEach(item => {
          arr.push(item.value);
        });
        return arr;
      },

      fsearch: fontData => {
        const html = String(
          `<div id="${defCon.id.selector}">
            <span class="${defCon.class.spanlabel}">已选择字体：<span id="${defCon.id.cleaner}">[清空]</span></span>
            <div class="${defCon.class.selector}"></div>
          </div>
          <div class="${defCon.class.selectFontId}">
            <span class="${defCon.class.spanlabel}">设置字体，请选择：</span>
            <input type="search" placeholder="输入关键字可检索字体" autocomplete="off" class="${defCon.class.placeholder}">
            <dl style="display:none"></dl>
            <span title="单击查看帮助" class="${defCon.class.tooltip} ${defCon.class.ps1}" id="${defCon.id.fonttooltip}">
              <span>\ud83d\udd14</span>
              <span class="${defCon.class.tooltip} ${defCon.class.ps2}">
              <p><strong>温馨提示 </strong>脚本预载了常用的中文字体，下拉菜单中所罗列的字体是在代码字体表中您已安装过的字体，没有安装过则不会显示。</p>
              <p><em style="color:darkred">（注一）</em>如果没有重新选择字体，则使用上一次保存的字体。首次使用默认为微软雅黑字体。</p>
              <p><em style="color:darkred">（注二）</em>输入框可输入关键字进行搜索，支持中文和英文字体名。</p>
              <p><em style="color:darkred">（注三）</em>字体是按您选择的先后顺序进行优先渲染的，所以多选不如只选一个您最想要的。</p>
              <p><em style="color:darkred">（注四）</em>如果“字体重写”被关闭，那么本功能将自动禁用，网页字体将采用“网站默认”的字体设置。</p>
              <p><em style="color:darkred">（注五）</em>双击我可以打开自定义字体的添加工具，以使用更多新字体。</p>
              </span>
            </span>
          </div>`
        ).trim();
        const domId = fontSet(s).that[0];
        RAFInterval(
          () => {
            if (!fontSet(`#${defCon.id.selector}`).that[0] && domId) {
              domId.innerHTML = html;
              return !!fontSet(`#${defCon.id.selector}`).that[0];
            }
          },
          50,
          true
        );
        const ffaceT = qS(`#${defCon.id.fface}`);
        const fselectorT = fontSet(`#${defCon.id.fontList} .${defCon.class.selectFontId} input`).that[0];
        if (ffaceT && fselectorT) {
          changeSelectorStatus(ffaceT.checked, fselectorT, `${defCon.class.readonly}`);
          ffaceT.addEventListener("change", () => {
            changeSelectorStatus(ffaceT.checked, fselectorT, `${defCon.class.readonly}`);
          });
        }
        fontSet(`#${defCon.id.selector}`).that[0].style.cssText += "display:none;";
        fselectorT.oninput = function () {
          searchEvent(this.value);
        };
        fselectorT.onclick = function (e) {
          if (this.value.length === 0) {
            const dlshow = fontSet(`#${defCon.id.fontList} .${defCon.class.selectFontId} dl`);
            dlshow.show();
            if (fontData.length === 0) {
              dlshow.that[0].innerHTML = "<dd>\u6570\u636e\u6e90\u6682\u65e0\u6570\u636e</dd>";
            } else {
              dlshow.that[0].innerHTML = "";
              fontData.sort((a, b) => {
                return a.sort - b.sort;
              });
              fontData.forEach(item => {
                dlshow.that[0].innerHTML += String(`<dd title="${item.ch}" style="font-family:'${item.en}'!important" sort="${item.sort}" value="${item.en}">${item.ch}</dd>`);
              });
            }
            clickEvent();
            e.stopPropagation();
          } else {
            searchEvent(this.value);
            e.stopPropagation();
          }
        };

        function changeSelectorStatus(inputCheckedStatus, f, css) {
          if (inputCheckedStatus) {
            f.removeAttribute("disabled");
            f.classList.remove(css);
          } else {
            fontSet().fdeleteList(fontData);
            f.setAttribute("disabled", "disabled");
            f.classList.add(css);
          }
        }

        function searchEvent(t) {
          const dlshow = fontSet(`#${defCon.id.fontList} .${defCon.class.selectFontId} dl`);
          dlshow.hide();
          if (fontData.length > 0) {
            dlshow.show();
            const searchReg = new RegExp(t, "i");
            let searchResult = false;
            dlshow.that[0].innerHTML = "";
            fontData.forEach(item => {
              if (searchReg.test(item.ch) || searchReg.test(item.en)) {
                searchResult = true;
                dlshow.that[0].innerHTML += String(`<dd title="${item.ch}" style="font-family:'${item.en}'!important" sort="${item.sort}" value="${item.en}">${item.ch}</dd>`);
              }
            });
            if (!searchResult) {
              dlshow.that[0].innerHTML = "<dd>\u6682\u65e0\u60a8\u641c\u7d22\u7684\u5b57\u4f53</dd>";
            }
            clickEvent();
          }
        }

        function clickEvent() {
          fontSet(`#${defCon.id.fontList} .${defCon.class.selectFontId} dl dd`).that.forEach(function (item) {
            item.onclick = function (e) {
              const value = this.attributes.value.value.toString();
              const sort = this.attributes.sort.value;
              if (value) {
                fontSet(`#${defCon.id.fontList} .${defCon.class.selector}`).that[0].innerHTML += String(
                  `<a class="${defCon.class.label}"><span style="border-bottom-left-radius:4px;border-top-left-radius:4px;font-family:'${value}'!important">${this.innerHTML}</span><input type="hidden" name="${defCon.id.fontName}" sort="${sort}" value="${value}"/><span class="${defCon.class.close}" style="border-bottom-right-radius:4px;border-top-right-radius:4px;cursor:pointer;font-family:system-ui,-apple-system,BlinkMacSystemFont,serif!important">\u0026\u0023\u0032\u0031\u0035\u003b</span></a>`
                );
                fontSet(`#${defCon.id.fontList} .${defCon.class.selector}`).that[0].parentNode.style.cssText += "display:block;";
                qS(`#${defCon.id.cleaner}`).addEventListener("click", () => {
                  fontSet().fdeleteList(fontData);
                });
                for (let i = 0; i < fontData.length; i++) {
                  if (fontData[i].en === value) {
                    fontData.splice(i, 1);
                    i = fontData.length;
                  }
                }
                fontSet(`#${defCon.id.fontList} .${defCon.class.close}`).that.forEach(function (item) {
                  item.onclick = async function () {
                    ddRemove(this.parentNode);
                    const value = this.parentNode.children[1].value;
                    const sort = Number(item.parentNode.children[1].attributes.sort.value);
                    const text = this.parentNode.children[0].innerHTML;
                    fontData.push({ ch: text, en: value, sort: sort });
                    fontData.sort((a, b) => {
                      return a.sort - b.sort;
                    });
                    const submitButton = qS(`#${defCon.id.submit} .${defCon.class.submit}`);
                    if (fontSet(`#${defCon.id.fontList} .${defCon.class.close}`).that.length === 0) {
                      const ffaceT = qS(`#${defCon.id.fface}`);
                      const inputFont = qS(`#${defCon.id.fontList} .${defCon.class.selectFontId} input`);
                      if (ffaceT.checked) {
                        const cfl = await GMgetValue("_Custom_fontlist_");
                        const cusFontCheck = cfl ? JSON.parse(defCon.decrypt(cfl)) : defaultArray;
                        fontCheck = unique([...fontCheck, ...cusFontCheck]);
                        fontCheck.forEach(item => {
                          if (item.en === defCon.refont || convert2Unicode(item.ch) === defCon.refont) {
                            defCon.curFont = item.ch;
                          }
                        });
                        inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${defCon.curFont}`);
                      }
                      for (let i = defCon.vals.length - 1; i >= 0; i--) {
                        if (defCon.vals[i] === `${defCon.id.fontName}`) {
                          defCon.vals.splice(i, 1);
                          break;
                        }
                      }
                      if (submitButton.classList.contains(`${defCon.class.anim}`)) {
                        if (!defCon.vals.length) {
                          submitButton.classList.remove(`${defCon.class.anim}`);
                          if (defCon.isPreview) {
                            submitButton.innerText = "\u4fdd\u5b58";
                            submitButton.removeAttribute("style");
                            submitButton.removeAttribute("v-Preview");
                            __preview__(defCon.preview);
                          }
                        } else if (!defCon.vals.includes(`${defCon.id.fontName}`) && defCon.isPreview) {
                          submitButton.innerText = "\u9884\u89c8";
                          submitButton.setAttribute("style", "background-color:coral!important;border-color:coral!important");
                          submitButton.setAttribute("v-Preview", "true");
                        }
                      }
                      fontSet(`#${defCon.id.fontList} .${defCon.class.selector}`).that[0].parentNode.style.cssText += "display:none;";
                    } else if (defCon.isPreview) {
                      submitButton.innerText = "\u9884\u89c8";
                      submitButton.setAttribute("style", "background-color:coral!important;border-color:coral!important");
                      submitButton.setAttribute("v-Preview", "true");
                    }
                  };
                });
                const submitButton = qS(`#${defCon.id.submit} .${defCon.class.submit}`);
                if (!defCon.vals.includes(`${defCon.id.fontName}`)) {
                  defCon.vals.push(`${defCon.id.fontName}`);
                }
                if (!submitButton.classList.contains(`${defCon.class.anim}`)) {
                  submitButton.classList.add(`${defCon.class.anim}`);
                }
                if (defCon.isPreview) {
                  submitButton.innerText = "\u9884\u89c8";
                  submitButton.setAttribute("style", "background-color:coral!important;border-color:coral!important");
                  submitButton.setAttribute("v-Preview", "true");
                }
              }
              fontSet(`.${defCon.class.selectFontId} dl`).hide();
              const _input = fontSet(`#${defCon.id.fontList} .${defCon.class.selectFontId} input`).that[0];
              if (_input) {
                _input.value = "";
              }
              e.stopPropagation();
            };
          });
        }

        document.onclick = e => {
          fontSet(`#${defCon.id.fontList} .${defCon.class.selectFontId} dl`).hide();
          const _input = fontSet(`#${defCon.id.fontList} .${defCon.class.selectFontId} input`).that[0];
          if (_input) {
            _input.value = "";
          }
        };
      },
    };
  };

  /* define default value */

  const defValue = {
    fontSelect: `'Microsoft YaHei',system-ui,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif,'iconfont','icomoon','FontAwesome','Material Icons Extended','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji',emoji`,
    fontFace: true,
    fontSmooth: true,
    fontSize: 1.0,
    fontStroke: getBrowser.type("core").Gecko ? 0.04 : 0.0,
    fontShadow: getBrowser.type("core").Gecko ? 1.0 : 1.5,
    shadowColor: getBrowser.type("core").Gecko ? "#808080" : "#7B7B7B",
    fontCSS: `:not(i):not(.fa):not([class*='icon']):not([class*='logo']):not([class*='code'])`,
    fontEx: `input,select,button,textarea,kbd,pre,pre *,code,code *`,
  };
  const root = `\u8ab1\u004a\u0056\u0069\u0059\u7409\u67d3\u5b7a\u80ba\u0070\u0032\u004f\u64d3\u0030\u8151\u0074\u5c80\u5b9a\u81ba\u0065`;
  const feedback = defCon.supportURL ? defCon.supportURL : defCon.decrypt("aHR0cHMlM0ElMkYlMkZncmVhc3lmb3JrLm9yZyUyRnNjcmlwdHMlMkY0MTY2ODglMkZmZWVkYmFjaw==");
  const CONST = {};

  /* Determine whether the DOM is loaded */

  function addLoadEvent(fn) {
    document.addEventListener("readystatechange", event => {
      if (event.target.readyState === "interactive") {
        fn();
        debug("\u27A4 %c[DOM]: Loading...", "background-color:darkorange;color:snow");
      } else if (event.target.readyState === "complete") {
        debug(
          "\u27A4 %c[DOM]: Load complete!\n%c\u3000 \u27A6 %s %c%s",
          "background-color:green;color:snow",
          "color:0;line-height:180%",
          window.location.hostname,
          "color:grey;line-height:180%",
          window.location.pathname
        );
      }
    });
  }

  /* Start specific operation */

  !(async function (loading) {
    /* eslint-disable no-alert */
    /* Content-Security-Policy: trusted-types */

    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      window.trustedTypes.createPolicy("default", {
        createHTML: (string, sink) => {
          return string;
        },
      });
    }

    /* initialling Menus */

    if (curWindowtop && !isGM) {
      loading = GMregisterMenuCommand("\ufff0\ud83d\udd52 正在载入脚本菜单，请稍候…", () => {});
    }

    /* get promise value */

    let maxPersonalSites, isBackupFunction, isPreview, isFontsize, rebuild, curVersion, _config_data_;
    let configure = await GMgetValue("_configure_");
    if (!configure) {
      maxPersonalSites = 100;
      isBackupFunction = true;
      isPreview = false;
      isFontsize = false;
      rebuild = undefined;
      curVersion = undefined;
      _config_data_ = { maxPersonalSites, isBackupFunction, isPreview, rebuild, curVersion };
      GMsetValue("_configure_", defCon.encrypt(JSON.stringify(_config_data_)));
    } else {
      _config_data_ = JSON.parse(defCon.decrypt(configure));
      maxPersonalSites = Number(_config_data_.maxPersonalSites);
      isBackupFunction = Boolean(_config_data_.isBackupFunction);
      isPreview = Boolean(_config_data_.isPreview);
      isFontsize = Boolean(_config_data_.isFontsize);
      rebuild = _config_data_.rebuild;
      curVersion = _config_data_.curVersion;
    }
    defCon.isPreview = isPreview;

    /* Rebuild data for update */

    const bool = true;
    const res = Boolean(rebuild);
    if (curWindowtop) {
      if (res === bool && rebuild !== undefined) {
        GMdeleteValue("_fonts_set_");
        GMdeleteValue("_Exclude_site_");
        GMdeleteValue("_domains_fonts_set_");
        GMdeleteValue("_Custom_fontlist_");
        _config_data_.rebuild = !bool;
        _config_data_.curVersion = undefined;
        GMsetValue("_configure_", defCon.encrypt(JSON.stringify(_config_data_)));
        debug("\u27A4 %cData has been rebuilt: %s", "font-style:italic;background-color:red;color:snow", res === bool);
      } else if (rebuild === undefined) {
        _config_data_.rebuild = !bool;
        GMsetValue("_configure_", defCon.encrypt(JSON.stringify(_config_data_)));
        debug(`\u27A4 %c${!curVersion ? "Configdata is undefined, rebuilding!" : "Data has been restored!"}`, `font-style:italic;color:${!curVersion ? "crimson" : "dodgerblue"}`);
      } else {
        debug("\u27A4 %cGood data status: %s", "font-style:italic;color:green", curVersion === defCon.curVersion);
      }
    }

    /* DialogBox for the first visit after upgrading */

    addLoadEvent(async (curVersion = _config_data_.curVersion) => {
      if (curVersion !== defCon.curVersion && curWindowtop) {
        let frDialog = new frDialogBox({
          trueButtonText: "好，去看看",
          falseButtonText: "不，算了吧",
          messageText: String(
            `<p><span style="font-style:italic;font-weight:bold;font-size:20px;color:tomato">您好！</span>这是您首次运行<span style="margin-left:3px;font-weight:700">${defCon.scriptName}</span>的更新版本<span style="margin-left:3px;color:tomato;font:italic 900 22px/1.5 Candara,monospace!important">V${defCon.curVersion}</span>，以下为更新内容：</p>
            <p><ul id="${defCon.id.seed}_update">
              <li class="${defCon.id.seed}_fix">修正设置页面的样式问题，优化超长字体名的截取。</li>
              <li class="${defCon.id.seed}_fix">修正一些bugs，优化代码。</li>
            </ul></p>
            <p>建议您先看看 <strong style="color:tomato;font-weight:700">新版帮助文档</strong> ，去看一下吗？</p>`
          ).trim(),
          titleText: "温馨提示",
        });
        _config_data_.curVersion = defCon.curVersion;
        GMsetValue("_configure_", defCon.encrypt(JSON.stringify(_config_data_)));
        debug("\u27A4 %cThe script has been upgraded to V%s", "font-style:italic;background-color:yellow;color:crimson", defCon.curVersion);
        if (await frDialog.respond()) {
          GMopenInTab(defCon.decrypt("aHR0cHMlM0ElMkYlMkZncmVhc3lmb3JrLm9yZyUyRnNjcmlwdHMlMkY0MTY2ODglMjN1cGRhdGU="), defCon.options);
        }
        frDialog = null;
      }
    });

    /* initialize Exclude site */

    const fonts = await GMgetValue("_fonts_set_");
    let exSite = await GMgetValue("_Exclude_site_");
    let domains = await GMgetValue("_domains_fonts_set_");

    function real_Time_Update(e) {
      for (let i = 0; i < e.length; i++) {
        if (e[i] === curHostname) {
          return i;
        }
      }
    }
    const obj = ["workstation-xi"].sort();
    if (!exSite) {
      GMsetValue("_Exclude_site_", defCon.encrypt(JSON.stringify(obj)));
      exSite = obj;
    } else {
      exSite = JSON.parse(defCon.decrypt(exSite));
      defCon.siteIndex = real_Time_Update(exSite);
    }

    /* Set Default Value & initialize */

    let fontValue, domainValue, domainValueIndex;
    function update_domain_index(s, t = curHostname) {
      for (let i = 0; i < s.length; i++) {
        if (s[i].domain === t) {
          return i;
        }
      }
    }
    if (!domains) {
      GMsetValue("_domains_fonts_set_", defCon.encrypt(JSON.stringify(defaultArray)));
    } else {
      domainValue = JSON.parse(defCon.decrypt(domains));
      defCon.domainCount = domainValue.length;
      defCon.domainIndex = update_domain_index(domainValue);
    }

    if (!fonts) {
      saveDate("_fonts_set_", {
        fontSelect: defValue.fontSelect,
        fontFace: defValue.fontFace,
        fontStroke: defValue.fontStroke,
        fontShadow: defValue.fontShadow,
        fontSize: defValue.fontSize,
        shadowColor: defValue.shadowColor,
        fontSmooth: defValue.fontSmooth,
        fontCSS: defValue.fontCSS,
        fontEx: defValue.fontEx,
      });
      CONST.fontSelect = defValue.fontSelect;
      CONST.fontFace = defValue.fontFace;
      CONST.fontStroke = defValue.fontStroke;
      CONST.fontShadow = defValue.fontShadow;
      CONST.fontSize = defValue.fontSize;
      CONST.shadowColor = defValue.shadowColor;
      CONST.fontSmooth = defValue.fontSmooth;
      CONST.fontCSS = defValue.fontCSS;
      CONST.fontEx = defValue.fontEx;
    } else {
      fontValue = JSON.parse(defCon.decrypt(fonts));
      if (domains) {
        domainValue = JSON.parse(defCon.decrypt(domains));
        domainValueIndex = update_domain_index(domainValue);
      }
      if (domainValueIndex !== undefined) {
        CONST.fontSelect = filterHtml(domainValue[domainValueIndex].fontSelect);
        CONST.fontFace = Boolean(domainValue[domainValueIndex].fontFace);
        CONST.fontStroke = Number(domainValue[domainValueIndex].fontStroke);
        CONST.fontShadow = Number(domainValue[domainValueIndex].fontShadow);
        CONST.fontSize = isFontsize ? Number(domainValue[domainValueIndex].fontSize) || 1 : 1;
        CONST.shadowColor = filterHtml(domainValue[domainValueIndex].shadowColor);
        CONST.fontSmooth = Boolean(domainValue[domainValueIndex].fontSmooth);
        CONST.fontCSS = filterHtml(domainValue[domainValueIndex].fontCSS);
        CONST.fontEx = filterHtml(domainValue[domainValueIndex].fontEx);
      } else {
        CONST.fontSelect = filterHtml(fontValue.fontSelect);
        CONST.fontFace = Boolean(fontValue.fontFace);
        CONST.fontStroke = Number(fontValue.fontStroke);
        CONST.fontShadow = Number(fontValue.fontShadow);
        CONST.fontSize = isFontsize ? Number(fontValue.fontSize) || 1 : 1;
        CONST.shadowColor = filterHtml(fontValue.shadowColor);
        CONST.fontSmooth = Boolean(fontValue.fontSmooth);
        CONST.fontCSS = filterHtml(fontValue.fontCSS);
        CONST.fontEx = filterHtml(fontValue.fontEx);
      }
    }
    defCon.tZoom = CONST.fontSize;

    /* Operation of CSS value */

    let shadow = "";
    const shadow_r = parseFloat(CONST.fontShadow);
    const shadow_c = CONST.shadowColor;
    if (!isNaN(shadow_r) && shadow_r > 0 && shadow_r <= 8) {
      shadow = `text-shadow:0 0 ${shadow_r * 1.25}px ${toColordepth(shadow_c, 1.5)},0 0 ${shadow_r}px ${shadow_c},0 0 ${shadow_r / 4}px ${toColordepth(shadow_c, 0.975, "dark")};`;
    }
    let stroke = "";
    const stroke_r = parseFloat(CONST.fontStroke);
    if (!isNaN(stroke_r) && stroke_r > 0 && stroke_r <= 1.0) {
      stroke = `-webkit-text-stroke:${stroke_r}px currentcolor;paint-order:stroke fill;`;
    }
    let selection = "";
    if (stroke) {
      selection = `::selection{color:#ffffff!important;background:#338fff!important}`;
    }
    let smoothing = "";
    const smooth_i = CONST.fontSmooth;
    if (smooth_i) {
      const kernel_define = getBrowser.type("core").WebKit
        ? "-webkit-font-smoothing:antialiased!important;-webkit-text-size-adjust:none;"
        : getBrowser.type("core").Gecko
        ? "-moz-text-size-adjust:none;"
        : "";
      smoothing = String(
        `font-feature-settings:"liga" 0;font-variant:no-common-ligatures proportional-nums;font-optical-sizing:auto;font-stretch:normal;font-kerning:auto;${kernel_define}text-rendering:optimizeLegibility!important;`
      );
    }
    let bodyZoom = "";
    if (CONST.fontSize >= 0.8 && CONST.fontSize <= 1.5 && isFontsize && CONST.fontSize !== 1) {
      if (defCon.siteIndex === undefined) {
        definePropertyForZoom(CONST.fontSize);
      }
      bodyZoom = String(
        `body{` +
          String(
            getBrowser.type("core").Gecko
              ? `transform:scale(${CONST.fontSize});transform-origin:left top 0px;width:${100 / CONST.fontSize}%;height:${100 / CONST.fontSize}%`
              : `zoom:${CONST.fontSize}!important;`
          ) +
          `}`
      ).trim();
    }
    const prefont = CONST.fontSelect.split(",")[0];
    const refont = prefont ? prefont.replace(/"|'/g, "") : "";
    let fontfamily = "";
    let fontfaces = "";
    const fontface_i = CONST.fontFace;
    if (fontface_i) {
      fontfamily = `font-family:${CONST.fontSelect};`;
      fontfaces = refont.length
        ? String(
            `@font-face{font-family:"宋体";src:local("${refont}")}@font-face{font-family:"SimSun";src:local("${refont}")}@font-face{font-family:"新宋体";src:local("${refont}")}@font-face{font-family:"NSimSun";src:local("${refont}")}@font-face{font-family:"黑体";src:local("${refont}")}@font-face{font-family:"SimHei";src:local("${refont}")}@font-face{font-family:"Microsoft YaHei UI";src:local("${refont}")}@font-face{font-family:"Microsoft JhengHei UI";src:local("${refont}")}@font-face{font-family:"MingLiU";src:local("${refont}")}@font-face{font-family:"MingLiU-ExtB";src:local("${refont}")}@font-face{font-family:"PMingLiU";src:local("${refont}")}@font-face{font-family:"PMingLiU-ExtB";src:local("${refont}")}@font-face{font-family:Arial;src:local("${refont}")}@font-face{font-family:"Georgia";src:local("${refont}")}@font-face{font-family:"MS Gothic";src:local("${refont}")}@font-face{font-family:"MS PGothic";src:local("${refont}")}@font-face{font-family:"MS UI Gothic";src:local("${refont}")}@font-face{font-family:"Yu Gothic";src:local("${refont}")}@font-face{font-family:"Yu Gothic UI";src:local("${refont}")}@font-face{font-family:"Malgun Gothic";src:local("${refont}")}`
          )
        : ``;
    }
    let exclude = "";
    let codeFont = "";
    const cssexlude = CONST.fontEx;
    if (cssexlude) {
      exclude = `${cssexlude}{-webkit-text-stroke:initial!important;text-shadow:initial!important}`;
      if (cssexlude.search(/\bpre\b|\bcode\b/gi) !== -1) {
        const pre = cssexlude.search(/\bpre\b/gi) > -1 ? ["pre", "pre *"] : [];
        const code = cssexlude.search(/\bcode\b/gi) > -1 ? ["code", "code *"] : [];
        const precode = pre.concat(code);
        codeFont = `${precode.toString()}{font:normal 400 14px/150% 'Operator Mono Lig','Fira Code','Roboto Mono',Monaco,monospace,Consolas!important;font-feature-settings:"liga" 0,"zero"!important;}`;
      }
    }
    const fontTest = String(
      `body span.${defCon.id.seed}_fontTest{font-stretch:normal!important;font-weight:normal!important;line-height:initial!important;text-align:left!important;font-style:normal!important;text-decoration:none!important;letter-spacing:normal!important;word-wrap:normal!important;text-indent:initial!important}body #${defCon.id.fontTest}{margin:0!important;padding:0!important;width:max-content!important;height:max-content!important;text-shadow:none!important;-webkit-text-stroke:initial!important;-webkit-text-size-adjust:none!important;-moz-text-size-adjust:none!important}`
    );
    const cssfun = CONST.fontCSS;
    let tshadow = "";
    if (defCon.siteIndex === undefined) {
      tshadow = `${bodyZoom}${codeFont}${selection}${cssfun}{${shadow}${stroke}${smoothing}${fontfamily}}${fontfaces}${exclude}${fontTest}`;
    }
    const fontStyle_db = String(
      `#${defCon.id.dialogbox}{width:100%;height:100%;background:transparent;position:fixed;top:0;left:0;z-index:1999999992}#${defCon.id.dialogbox} .${defCon.class.db}{box-sizing:content-box;max-width:420px;color:#444;border:2px solid #efefef}.${defCon.class.db}{display:block;overflow:hidden;position:fixed;top:200px;right:15px;border-radius:6px;width:100%;background:#fff;-webkit-box-shadow:0 0 10px 0 rgba(0,0,0,.3);box-shadow:0 0 10px 0 rgba(0,0,0,.3);transition:opacity .5s}.${defCon.class.db} *{line-height:1.5!important;font-family:"Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;-webkit-text-stroke:initial!important;text-shadow:0 0 1px #7b7b7b!important}.${defCon.class.dbt}{background:#efefef;margin-top:0;padding:12px;font-size:20px!important;font-weight:700;text-align:left;width:100%}.${defCon.class.dbm}{color:#444;padding:10px;margin:5px;font-size:16px!important;font-weight:500;text-align:left}.${defCon.class.dbb}{display:inline-block;margin:0 1%;border-radius:4px;padding:8px 12px;min-width:12%;font-weight:400;text-align:center;letter-spacing:0;cursor:pointer;text-decoration:none!important;box-sizing:content-box}.${defCon.class.dbb}:hover{color:#fff;opacity:.8;font-weight:900;text-decoration:none!important;box-sizing:content-box}.${defCon.class.db} .${defCon.class.dbt},.${defCon.class.dbb},.${defCon.class.dbb}:hover{text-shadow:initial!important;-webkit-text-stroke:initial!important;user-select:none}.${defCon.class.dbbf},.${defCon.class.dbbf}:hover{background:#d93223!important;color:#fff!important;border:1px solid #d93223!important;border-radius:6px;font-size:14px!important}.${defCon.class.dbbf}:hover{box-shadow:0 0 3px #d93223!important}.${defCon.class.dbbt},.${defCon.class.dbbt}:hover{background:#038c5a!important;color:#fff!important;border:1px solid #038c5a!important;border-radius:6px;font-size:14px!important}.${defCon.class.dbbt}:hover{box-shadow:0 0 3px #038c5a!important}.${defCon.class.dbbn},.${defCon.class.dbbn}:hover{background:#777!important;color:#fff!important;border:1px solid #777!important;border-radius:6px;font-size:14px!important}.${defCon.class.dbbn}:hover{box-shadow:0 0 3px #777!important}.${defCon.class.dbbc}{text-align:right;padding:2.5%;background:#efefef;color:#fff}` +
        `.${defCon.class.dbm} button:hover{cursor:pointer;background:#f6f6f6!important;box-shadow:0 0 3px #a7a7a7!important}.${defCon.class.dbm} p{line-height:1.5!important;margin:5px 0!important;text-indent:0!important;font-size:16px!important;font-weight:400;text-align:left;user-select:none}.${defCon.class.dbm} ul{list-style:none;margin:5px 0 0 15px!important;padding:2px;font:italic 14px/140% "Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;color:grey}.${defCon.class.dbm} ul li{display:list-item;list-style-type:none;user-select:none}.${defCon.class.dbm} li:before{display:none}.${defCon.class.dbm} #${defCon.id.bk},.${defCon.class.dbm} #${defCon.id.pv},.${defCon.class.dbm} #${defCon.id.fs},.${defCon.class.dbm} #${defCon.id.mps},.${defCon.class.dbm} #${defCon.id.flc}{box-sizing:content-box;list-style:none;font-style:normal;display:flex;justify-content:space-between;align-items:flex-start;margin:0;padding:2px 4px!important;width:calc(95% - 10px);min-width:auto;height:40px;min-height:40px}.${defCon.class.dbm} #${defCon.id.bk} .${defCon.id.seed}_VIP,.${defCon.class.dbm} #${defCon.id.pv} .${defCon.id.seed}_VIP,.${defCon.class.dbm} #${defCon.id.fs} .${defCon.id.seed}_VIP,.${defCon.class.dbm} #${defCon.id.mps} .${defCon.id.seed}_VIP,.${defCon.class.dbm} #${defCon.id.flc} .${defCon.id.seed}_VIP{margin:2px 0 0 0;color:darkgoldenrod!important;font:normal 16px/140% "Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important}.${defCon.class.dbm} #${defCon.id.flc} button{background-color:#eee;color:#444!important;font-weight:normal;border:1px solid #999;font-size:14px!important;border-radius:4px}.${defCon.class.dbm} #${defCon.id.feedback}{padding:2px 10px;height:22px;width:max-content;min-width:auto}.${defCon.class.dbm} #${defCon.id.files}{display:none}.${defCon.class.dbm} #${defCon.id.feedback}:hover{color:crimson!important}.${defCon.class.dbm} #${defCon.id.feedback}:after{width:0;height:0;content:"";background:url('${loadingIMG}') no-repeat -400px -300px}.${defCon.class.dbm} #${defCon.id.seed}_custom_Fontlist::-moz-placeholder{font:normal 400 14px/140% monospace,Consolas!important;color:#555!important}.${defCon.class.dbm} #${defCon.id.seed}_custom_Fontlist::-webkit-input-placeholder{font:normal 400 14px/140% monospace,Consolas!important;color:#aaa!important}` +
        `.${defCon.class.dbm} #${defCon.id.seed}_update li{font-style:italic!important;font-family:Consolas,'Microsoft YaHei'!important}.${defCon.class.dbm} .${defCon.id.seed}_new:before{content:"+";display:inline;margin:0 4px 0 -10px}.${defCon.class.dbm} .${defCon.id.seed}_del:before{content:"-";display:inline;margin:0 4px 0 -10px}.${defCon.class.dbm} .${defCon.id.seed}_fix:before{content:"@";display:inline;margin:0 4px 0 -10px}.${defCon.class.dbm} .${defCon.id.seed}_wng{color:#bdb59b}.${defCon.class.dbm} .${defCon.id.seed}_wng:before{content:"!";display:inline;margin:0 4px 0 -10px}`
    );
    const fontStyle_container = String(
      `#${defCon.id.rndId}{width:100%;height:100%;background:transparent;position:fixed;top:0;left:0;z-index:1999999991}body #${defCon.id.container}{position:fixed;top:10px;right:24px;border-radius:12px;background:#f0f6ff!important;box-sizing:content-box;opacity:0;transition:opacity .5s}#${defCon.id.container}{transform:scale3d(1,1,1);width:auto;overflow-y:auto;overflow-x:hidden;min-height:10%;max-height:calc(100% - 20px);z-index:999999;padding:4px;text-align:left;color:#333;font-size:16px!important;font-weight:900;scrollbar-color:#369 rgba(0,0,0,.25);scrollbar-width:thin}#${defCon.id.container}::-webkit-scrollbar{width:10px;height:1px}#${defCon.id.container}::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 5px #67a5df;background:#369}#${defCon.id.container}::-webkit-scrollbar-track{box-shadow:inset 0 0 5px #67a5df;border-radius:10px;background:#ededed}#${defCon.id.container} *{line-height:1.5!important;font-size:16px;font-weight:700;font-family:"Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;text-shadow:initial!important;-webkit-text-stroke:initial!important}` +
        `#${defCon.id.container} fieldset{border:2px groove #67a5df!important;border-radius:10px;padding:4px 6px;margin:2px;background:#f0f6ff!important;display:block;width:auto;height:auto;min-height:475px}#${defCon.id.container} legend{line-height:20px;padding:0 8px;border:0!important;margin-bottom:0;font-size:16px!important;font-weight:700;font-family:"Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;background:#f0f6ff!important;box-sizing:content-box;width:auto!important;min-width:185px!important;display:block!important;position:initial!important;height:auto!important;visibility:unset!important}#${defCon.id.container} fieldset ul{padding:0;margin:0;background:#f0f6ff!important}#${defCon.id.container} ul li{display:inherit;list-style:none;margin:3px 0;box-sizing:content-box;border:none;float:none;background:#f0f6ff!important;cursor:default;min-width:-moz-available;min-width:-webkit-fill-available;user-select:none}#${defCon.id.container} ul li:before{display:none}#${defCon.id.container} .${defCon.class.help}{width:24px;height:24px;fill:#67a5df;overflow:hidden;}#${defCon.id.container} .${defCon.class.help}:hover{cursor:help}#${defCon.id.container} .${defCon.class.title} .${defCon.class.guide}{display:inline-block;position:fixed;cursor:pointer}@keyframes rotation{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(360deg)}}.${defCon.class.title} .${defCon.class.rotation}{padding:0;margin:0;width:24px;height:24px;top:auto;right:auto;bottom:auto;left:auto;transform-origin:center 50%;-webkit-transform:rotate(360deg);-webkit-animation:rotation 5s linear infinite;-o-animation:rotation 5s linear infinite;animation:rotation 5s linear infinite}` +
        `#${defCon.id.fontList}{padding:2px 10px 0 10px;min-height:73px}#${defCon.id.fontFace},#${defCon.id.fontSmooth}{padding:2px 10px;height:40px;width:calc(100% - 18px);min-width:auto;display:flex!important;align-items:center;justify-content:space-between}#${defCon.id.fontSize}{padding:2px 10px;height:60px}#${defCon.id.fontStroke}{padding:2px 10px;height:60px}#${defCon.id.fontShadow}{padding:2px 10px;height:60px}#${defCon.id.shadowColor}{display:flex;align-items:center;justify-content:space-between;flex-wrap:nowrap;flex-direction:row;padding:2px 10px;min-height:45px;margin:4px;width:auto}#${defCon.id.fontCSS},#${defCon.id.fontEx}{padding:2px 10px;height:110px;min-height:110px}#${defCon.id.submit}{padding:2px 10px;height:40px}` +
        `#${defCon.id.fontList} .${defCon.class.selector} a{font-weight:400;text-decoration:none}#${defCon.id.fontList} .${defCon.class.label}{display:inline-block;margin:0 4px 14px 0;padding:0;height:24px;line-height:24px!important}#${defCon.id.fontList} .${defCon.class.label} span{box-sizing:border-box;color:#fff;font-size:16px!important;font-weight:400;height:max-content;width:max-content;min-width:12px;max-width:210px;padding:5px;background:#67a5df;text-overflow:ellipsis;overflow:hidden;display:inline-block;white-space:nowrap}#${defCon.id.fontList} .${defCon.class.close}{width:12px}#${defCon.id.fontList} .${defCon.class.close}:hover{color:tomato;background-color:#2D7DCA;border-radius:2px}#${defCon.id.selector}{width:100%;max-width:100%}#${defCon.id.selector} label{display:block;cursor:initial;margin:0 0 4px 0;color:#333}#${defCon.id.selector} #${defCon.id.cleaner}{margin-left:5px;cursor:pointer}#${defCon.id.selector} #${defCon.id.cleaner}:hover{color:red}#${defCon.id.fontList} .${defCon.class.selector}{overflow-x:hidden;box-sizing:border-box;border:2px solid #67a5df!important;border-radius:6px;padding:6px 6px 0 6px;margin:0 0 6px 0;width:100%;min-width:100%;max-width:fit-content;max-width:-moz-min-content;max-height:90px;min-height:45px;scrollbar-color:#369 rgba(0,0,0,.25);scrollbar-width:thin}#${defCon.id.fontList} .${defCon.class.selector}::-webkit-scrollbar{width:10px;height:1px}#${defCon.id.fontList} .${defCon.class.selector}::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 5px #67a5df;background:#369}#${defCon.id.fontList} .${defCon.class.selector}::-webkit-scrollbar-track{box-shadow:inset 0 0 5px #67a5df;border-radius:10px;background:#ededed}#${defCon.id.fontList} .${defCon.class.selectFontId} span.${defCon.class.spanlabel},#${defCon.id.selector} span.${defCon.class.spanlabel}{margin:0!important;width:auto;display:block!important;padding:0 0 4px 0;color:#333;border:0;text-align:left!important;background-color:transparent!important}` +
        `#${defCon.id.fontList} .${defCon.class.selectFontId}{width:auto}#${defCon.id.fontList} .${defCon.class.selectFontId} input{text-overflow:ellipsis;overflow:hidden;box-sizing:border-box;border:2px solid #67a5df!important;border-radius:6px;padding:1px 32px 1px 2px;margin:0;width:100%;max-width:100%;min-width:100%;height:42px!important;font-family:"Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;font-size:16px!important;font-weight:700;text-indent:8px;background:#fafafa;outline-color:#67a5df}#${defCon.id.fontList} .${defCon.class.selectFontId} input[disabled]{pointer-events:none!important}.${defCon.class.placeholder}::-moz-placeholder{color:#369!important;font:normal 700 16px/1.5 "Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;opacity:.65!important}.${defCon.class.placeholder}::-webkit-input-placeholder{color:#369!important;font:normal 700 16px/1.5 "Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;opacity:.65!important}#${defCon.id.fontList} .${defCon.class.selectFontId} dl{overflow-x:hidden;position:fixed;z-index:1000;margin:4px 0 0 0;box-sizing:content-box;border:2px solid #67a5df!important;border-radius:6px;padding:4px 8px;width:auto;min-width:calc(60%);max-width:calc(100% - 68px);max-height:298px;font-size:18px!important;white-space:nowrap;background-color:#fff;scrollbar-color:#369 rgba(0,0,0,.25);scrollbar-width:thin}#${defCon.id.fontList} .${defCon.class.selectFontId} dl::-webkit-scrollbar{width:10px;height:1px}#${defCon.id.fontList} .${defCon.class.selectFontId} dl::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 5px #67a5df;background:#369}#${defCon.id.fontList} .${defCon.class.selectFontId} dl::-webkit-scrollbar-track{box-shadow:inset 0 0 5px #67a5df;border-radius:10px;background:#ededed}#${defCon.id.fontList} .${defCon.class.selectFontId} dl dd{box-sizing:content-box;text-overflow:ellipsis;overflow-x:hidden;margin:1px 8px;padding:5px 0;font-weight:400;font-size:21px!important;min-width:100%;max-width:100%;width:-moz-available;width:-webkit-fill-available;}#${defCon.id.fontList} .${defCon.class.selectFontId} dl dd:hover{box-sizing:content-box;text-overflow:ellipsis;overflow-x:hidden;min-width:-moz-available;min-width:-webkit-fill-available;background-color:#67a5df;color:#fff}` +
        `.${defCon.class.checkbox}{display:none!important}.${defCon.class.checkbox}+label{cursor:pointer;padding:0;margin:0 2px 0 0;border-radius:7px;display:inline-block;position:relative;background:#f7836d;width:76px;height:32px;box-shadow:inset 0 0 20px rgba(0,0,0,.1),0 0 10px rgba(245,146,146,.4);white-space:nowrap;box-sizing:content-box}.${defCon.class.checkbox}+label::before{position:absolute;top:0;left:0;z-index:99;border-radius:7px;width:24px;height:32px;color:#fff;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.6);content:" "}.${defCon.class.checkbox}+label::after{position:absolute;top:0;left:28px;border-radius:100px;padding:5px;font-size:16px;font-weight:700;font-style:normal;color:#fff;content:"OFF"}.${defCon.class.checkbox}:checked+label{cursor:pointer;margin:0 2px 0 0;background:#67a5df!important;box-shadow:inset 0 0 20px rgba(0,0,0,.1),0 0 10px rgba(146,196,245,.4)}.${defCon.class.checkbox}:checked+label::after{content:"ON";left:10px}.${defCon.class.checkbox}:checked+label::before{content:" ";position:absolute;z-index:99;left:52px}#${defCon.id.fface} label,#${defCon.id.fface}+label::after,#${defCon.id.fface}+label::before,#${defCon.id.smooth} label,#${defCon.id.smooth}+label::after,#${defCon.id.smooth}+label::before{-webkit-transition:all .3s ease-in;transition:all .3s ease-in}` +
        `#${defCon.id.fontShadow} div.${defCon.class.flex}:before,#${defCon.id.fontShadow} div.${defCon.class.flex}:after,#${defCon.id.fontStroke} div.${defCon.class.flex}:before,#${defCon.id.fontStroke} div.${defCon.class.flex}:after,#${defCon.id.fontSize} div.${defCon.class.flex}:before,#${defCon.id.fontSize} div.${defCon.class.flex}:after{display:none}#${defCon.id.fontShadow} #${defCon.id.shadowSize},#${defCon.id.fontStroke} #${defCon.id.strokeSize},#${defCon.id.fontSize} #${defCon.id.fontZoom}{color:#111!important;width:56px!important;text-indent:0;margin:0 10px 0 0!important;height:32px!important;font-size:17px!important;font-weight:400!important;font-family:Impact,Times,serif!important;border:#67a5df 2px solid!important;border-radius:4px;text-align:center;box-sizing:content-box;padding:0;background:#fafafa!important}.${defCon.class.flex}{display:flex;align-items:center;justify-content:space-between;flex-wrap:nowrap;flex-direction:row;width:auto;min-width:100%}.${defCon.class.slider} input{visibility:hidden}` +
        `#${defCon.id.shadowColor} *{box-sizing:content-box}#${defCon.id.cps}{margin:0}#${defCon.id.shadowColor} .${defCon.class.colorPicker}{width:32px;height:30px;cursor:pointer;position:relative;border:2px solid #181a25;border-radius:4px}#${defCon.id.shadowColor} .${defCon.class.colorPicker2}{width:auto;margin:0 0 0 5px}#${defCon.id.shadowColor} .${defCon.class.colorPicker2} #${defCon.id.color}{width:125px!important;min-width:125px;height:36px!important;text-indent:0;font-size:18px!important;font-weight:400!important;background:#fafafa;box-sizing:border-box;font-family:Impact,Times,serif!important;color:#333!important;border:#67a5df 2px solid!important;border-radius:4px;padding:0;margin:0;text-align:center}` +
        `#${defCon.id.fontCSS} textarea,#${defCon.id.fontEx} textarea{font:bold 14px/140% "Roboto Mono",Monaco,"Courier New",sans-serif!important;min-width:249px;max-width:calc(100% - 15px);width:calc(100% - 15px)!important;height:60px;min-height:60px;max-height:60px;resize:none;border:2px solid #67a5df!important;border-radius:6px;box-sizing:content-box;padding:5px;margin:0;color:#0b5b9c!important;scrollbar-color:#369 rgba(0,0,0,.25);scrollbar-width:thin}#${defCon.id.fontCSS} textarea::-webkit-scrollbar{width:10px;height:1px}#${defCon.id.fontCSS} textarea::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 5px #67a5df;background:#369}#${defCon.id.fontCSS} textarea::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0,0,0,.2);border-radius:10px;background:#ededed}#${defCon.id.fontEx} textarea{background:#fafafa!important}#${defCon.id.fontEx} textarea::-webkit-scrollbar{width:10px;height:1px}#${defCon.id.fontEx} textarea::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 5px #67a5df;background:#369}#${defCon.id.fontEx} textarea::-webkit-scrollbar-track{box-shadow:inset 0 0 5px #67a5df;border-radius:10px;background:#ededed}.${defCon.class.switch}{box-sizing:content-box;display:inline-block;float:right;margin-right:4px;padding:0 6px;border:2px double #67a5df;color:#0a68c1;border-radius:4px}#${defCon.id.cSwitch}:hover,#${defCon.id.eSwitch}:hover{cursor:pointer;user-select:none}.${defCon.class.readonly}{background:linear-gradient(45deg,#ffe9e9 0,#ffe9e9 25%,transparent 25%,transparent 50%,#ffe9e9 50%,#ffe9e9 75%,transparent 75%,transparent)!important;background-size:50px 50px!important;background-color:#fff7f7!important}.${defCon.class.notreadonly}{background:linear-gradient(45deg,#e9ffe9 0,#e9ffe9 25%,transparent 25%,transparent 50%,#e9ffe9 50%,#e9ffe9 75%,transparent 75%,transparent)!important;background-size:50px 50px;background-color:#f7fff7!important}` +
        `#${defCon.id.submit} button{box-sizing:border-box;background-image:initial;background-color:#67a5df;color:#fff!important;margin:0;padding:5px 10px;cursor:pointer;border:2px solid #6ba7e0;border-radius:6px;width:auto;min-width:min-content;min-height:35px;font:normal 600 14px/1.5 "Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important}#${defCon.id.submit} button:hover{box-shadow:0 0 5px rgba(0,0,0,.4)!important}#${defCon.id.submit} .${defCon.class.cancel},#${defCon.id.submit} .${defCon.class.reset}{float:left;margin-right:10px}#${defCon.id.submit} .${defCon.class.submit}{float:right}#${defCon.id.submit} #${defCon.id.backup}{margin:0 10px 0 0;display:none}.${defCon.class.anim}{-webkit-animation:jiggle 1.8s ease-in infinite;animation:jiggle 1.8s ease-in infinite;border:2px solid crimson!important;background:crimson!important}@keyframes jiggle{48%,62%{transform:scale(1,1)}50%{transform:scale(1.1,.9)}56%{transform:scale(.9,1.1) translate(0,-5px)}59%{transform:scale(1,1) translate(0,-3px)}}`
    );
    const fontStyle_cp = String(
      `#${defCon.id.cpm}{width:240px;height:216px;margin:calc(-90%) 0 0 2px;z-index:999;position:fixed;display:none;box-sizing:content-box;background-color:#d1f2fb;padding:10px;box-shadow:0 0 10px #000;border-radius:6px}.${defCon.class.cp},.${defCon.class.cp} *,.${defCon.class.cp} ::after,.${defCon.class.cp} ::before{border:0;margin:0;padding:0;display:block;box-sizing:border-box}.${defCon.class.cp}{background-color:#fff;display:block;min-width:128px;min-height:128px;position:relative}.${defCon.class.cp}>.${defCon.class.cprb}{border:solid #000 1px;background:linear-gradient(red,#f0f,#00f,#0ff,#0f0,#ff0,red);width:16px;height:calc(100% - 26px);position:absolute;right:12px;top:12px}.${defCon.class.cp} .${defCon.class.cprbp}{position:absolute;width:100%;height:1px}.${defCon.class.cp} .${defCon.class.cprbp}::after,.${defCon.class.cp} .${defCon.class.cprbp}::before{content:"";width:10px;height:7px;position:absolute;background:0 0;border:solid transparent 5px;border-width:3.5px 5px;top:-3px}.${defCon.class.cp} .${defCon.class.cprbp}::before{border-left:solid #404040 5px;left:-6px}.${defCon.class.cp} .${defCon.class.cprbp}::after{border-right:solid #404040 5px;right:-6px}.${defCon.class.cp}>.${defCon.class.cpg}{position:absolute;width:calc(100% - 50px);height:calc(100% - 26px);border:solid #000 1px;left:12px;top:12px}.${defCon.class.cp}>.${defCon.class.cpg},.${defCon.class.cp}>.${defCon.class.cpg} *{cursor:crosshair;box-sizing:content-box}.${defCon.class.cp}>.${defCon.class.cpgb}{background:linear-gradient(rgba(0,0,0,0),#000)}.${defCon.class.cp}>.${defCon.class.cp}-color-block{position:absolute;border:solid #000 1px;background:#fff;width:calc(100% - 104px);max-width:72px;height:18px;left:12px;bottom:8px}.${defCon.class.cp} .${defCon.class.cpc}{background-color:transparent;position:absolute}.${defCon.class.cp} .${defCon.class.cpc}::before{border-radius:50%;width:11px;height:11px;border:solid #000 1px;background-color:transparent;position:relative;left:-6px;top:-6px;display:block;content:""}.${defCon.class.cp} .${defCon.class.cpc}.${defCon.class.cpcb}::before{border-color:#000}.${defCon.class.cp} .${defCon.class.cpc}.${defCon.class.cpcw}::before{border-color:#fff}`
    );
    const fontStyle_tooltip = String(
      `.${defCon.class.tooltip}{position:relative;cursor:help;user-select:none}.${defCon.class.tooltip}:active .${defCon.class.tooltip}{display:block}.${defCon.class.tooltip} .${defCon.class.tooltip}{display:none;box-sizing:content-box;position:absolute;z-index:999999;border:2px solid #b8c4ce;border-radius:6px;padding:10px;width:242px;max-width:242px;font-weight:400;color:#fff;background-color:#54a2ec;opacity:.9}.${defCon.class.tooltip} .${defCon.class.tooltip} *{font-family:"Microsoft YaHei",system-ui,-apple-system,BlinkMacSystemFont,sans-serif!important;font-size:14px!important}.${defCon.class.tooltip} .${defCon.class.tooltip} em{font-style:normal!important}.${defCon.class.tooltip} .${defCon.class.tooltip} strong{color:darkorange;font-size:18px!important}.${defCon.class.tooltip} .${defCon.class.tooltip} p{color:#fff;display:block;margin:0 0 10px 0;line-height:140%;text-indent:0!important}.${defCon.class.ps1}{position:relative;top:-33px;height:0;width:24px;margin:0;padding:0;right:5px;float:right}.${defCon.class.ps2}{top:35px;right:-7px}.${defCon.class.ps3}{top:-197px;margin-left:-1px}.${defCon.class.ps4}{top:-175px;margin-left:-1px}`
    );
    const fontStyle_Progress = String(
      `.${defCon.class.range}{--primary-color:#67a5df;--value-offset-y:var(--ticks-gap);--value-active-color:white;--value-background:transparent;--value-background-hover:var(--primary-color);--value-font:italic bold 14px/14px monospace,arial;--fill-color:var(--primary-color);--progress-background:rgb(223, 223, 223);--progress-radius:20px;--show-min-max:none;--track-height:calc(var(--thumb-size) / 2);--min-max-font:12px arial;--min-max-opacity:0.5;--min-max-x-offset:10%;--thumb-size:22px;--thumb-color:white;--thumb-shadow:0 0 3px rgba(0, 0, 0, 0.4),0 0 1px rgba(0, 0, 0, 0.5) inset,0 0 0 99px var(--thumb-color) inset;--thumb-shadow-active:0 0 0 calc(var(--thumb-size) / 4) inset var(--thumb-color),0 0 0 99px var(--primary-color) inset,0 0 3px rgba(0, 0, 0, 0.4);--thumb-shadow-hover:0 0 0 calc(var(--thumb-size) / 4) inset var(--thumb-color),0 0 0 99px darkorange inset,0 0 3px rgba(0, 0, 0, 0.4);--ticks-thickness:1px;--ticks-height:5px;--ticks-gap:var(--ticks-height, 0);--ticks-color:transparent;--step:1;--ticks-count:(var(--max) - var(--min))/var(--step);--maxTicksAllowed:1000;--too-many-ticks:Min(1, Max(var(--ticks-count) - var(--maxTicksAllowed), 0));--x-step:Max(var(--step), var(--too-many-ticks) * (var(--max) - var(--min)));--tickIntervalPerc_1:Calc((var(--max) - var(--min)) / var(--x-step));--tickIntervalPerc:calc((100% - var(--thumb-size)) / var(--tickIntervalPerc_1) * var(--tickEvery, 1));--value-a:Clamp(var(--min), var(--value, 0), var(--max));--value-b:var(--value, 0);--text-value-a:var(--text-value, "");--completed-a:calc((var(--value-a) - var(--min)) / (var(--max) - var(--min)) * 100);--completed-b:calc((var(--value-b) - var(--min)) / (var(--max) - var(--min)) * 100);--ca:Min(var(--completed-a), var(--completed-b));--cb:Max(var(--completed-a), var(--completed-b));--thumbs-too-close:Clamp(-1, 1000 * (Min(1, Max(var(--cb) - var(--ca) - 5, -1)) + 0.001), 1);--thumb-close-to-min:Min(1, Max(var(--ca) - 5, 0));--thumb-close-to-max:Min(1, Max(95 - var(--cb), 0))}` +
        `.${defCon.class.range}{width:auto;min-width:105%!important;margin:-3px 0 0 -5px;box-sizing:content-box;display:inline-block;height:Max(var(--track-height),var(--thumb-size));background:linear-gradient(to right,var(--ticks-color) var(--ticks-thickness),transparent 1px) repeat-x;background-size:var(--tickIntervalPerc) var(--ticks-height);background-position-x:calc(var(--thumb-size)/ 2 - var(--ticks-thickness)/ 2);background-position-y:var(--flip-y,bottom);padding-bottom:var(--flip-y,var(--ticks-gap));padding-top:calc(var(--flip-y) * var(--ticks-gap));position:relative;z-index:1}.${defCon.class.range}[data-ticks-position=top]{--flip-y:1}.${defCon.class.range}::after,.${defCon.class.range}::before{--offset:calc(var(--thumb-size) / 2);content:counter(x);display:var(--show-min-max,block);font:var(--min-max-font);position:absolute;bottom:var(--flip-y,-2.5ch);top:calc(-2.5ch * var(--flip-y));opacity:Clamp(0,var(--at-edge),var(--min-max-opacity));transform:translateX(calc(var(--min-max-x-offset) * var(--before,-1) * -1)) scale(var(--at-edge));pointer-events:none}.${defCon.class.range}::before{--before:1;--at-edge:var(--thumb-close-to-min);counter-reset:x var(--min);left:var(--offset)}.${defCon.class.range}::after{--at-edge:var(--thumb-close-to-max);counter-reset:x var(--max);right:var(--offset)}` +
        `.${defCon.class.rangeProgress}{--start-end:calc(var(--thumb-size) / 2);--clip-end:calc(100% - (var(--cb)) * 1%);--clip-start:calc(var(--ca) * 1%);--clip:inset(-20px var(--clip-end) -20px var(--clip-start));position:absolute;left:var(--start-end);right:var(--start-end);top:calc(var(--ticks-gap) * var(--flip-y,0) + var(--thumb-size)/ 2 - var(--track-height)/ 2);height:calc(var(--track-height));background:var(--progress-background,#eee);pointer-events:none;z-index:-1;border-radius:var(--progress-radius)}.${defCon.class.rangeProgress}::before{content:"";position:absolute;left:0;right:0;clip-path:var(--clip);top:0;bottom:0;background:var(--fill-color,#000);box-shadow:var(--progress-flll-shadow);z-index:1;border-radius:inherit}.${defCon.class.rangeProgress}::after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;box-shadow:var(--progress-shadow);pointer-events:none;border-radius:inherit}.${defCon.class.range}>input:only-of-type~.${defCon.class.rangeProgress}{--clip-start:0}` +
        `.${defCon.class.range}>input{-webkit-appearance:none;width:100%;height:var(--thumb-size)!important;margin:0!important;padding:0!important;position:absolute!important;left:0;top:calc(50% - Max(var(--track-height),var(--thumb-size))/ 2 + calc(var(--ticks-gap)/ 2 * var(--flip-y,-1)))!important;border:0!important;cursor:grab;outline:0!important;background:0 0!important;--thumb-shadow:var(--thumb-shadow-active)}.${defCon.class.range}>input:not(:only-of-type){pointer-events:none}.${defCon.class.range}>input::-webkit-slider-thumb{appearance:none;border:none;height:var(--thumb-size);width:var(--thumb-size);transform:var(--thumb-transform);border-radius:var(--thumb-radius,50%);background:var(--thumb-color);box-shadow:var(--thumb-shadow);pointer-events:auto;transition:.1s}.${defCon.class.range}>input::-moz-range-thumb{appearance:none;border:none;height:var(--thumb-size);width:var(--thumb-size);transform:var(--thumb-transform);border-radius:var(--thumb-radius,50%);background:var(--thumb-color);box-shadow:var(--thumb-shadow);pointer-events:auto;transition:.1s}.${defCon.class.range}>input::-ms-thumb{appearance:none;border:none;height:var(--thumb-size);width:var(--thumb-size);transform:var(--thumb-transform);border-radius:var(--thumb-radius,50%);background:var(--thumb-color);box-shadow:var(--thumb-shadow);pointer-events:auto;transition:.1s}` +
        `.${defCon.class.range}>input:hover{--thumb-shadow:var(--thumb-shadow-active)}.${defCon.class.range}>input:hover+output{--value-background:var(--value-background-hover);--y-offset:-1px;color:var(--value-active-color);box-shadow:0 0 0 3px var(--value-background)}.${defCon.class.range}>input:active{--thumb-shadow:var(--thumb-shadow-hover);cursor:grabbing;z-index:2}.${defCon.class.range}>input:active+output{transition:0s;opacity:0.9;display:-webkit-box;-webkit-box-orient:horizontal;-webkit-box-pack:center;-webkit-box-align:center;-moz-box-orient:horizontal;-moz-box-pack:center;-moz-box-align:center}.${defCon.class.range}>input:nth-of-type(1){--is-left-most:Clamp(0, (var(--value-a) - var(--value-b)) * 99999, 1)}.${defCon.class.range}>input:nth-of-type(1)+output{--value:var(--value-a);--x-offset:calc(var(--completed-a) * -1%)}.${defCon.class.range}>input:nth-of-type(1)+output:not(:only-of-type){--flip:calc(var(--thumbs-too-close) * -1)}.${defCon.class.range}>input:nth-of-type(1)+output::after{content:var(--prefix, "") var(--text-value-a) var(--suffix, "")}.${defCon.class.range}>input:nth-of-type(2){--is-left-most:Clamp(0, (var(--value-b) - var(--value-a)) * 99999, 1)}.${defCon.class.range}>input:nth-of-type(2)+output{--value:var(--value-b)}.${defCon.class.range}>input+output{--flip:-1;--x-offset:calc(var(--completed-b) * -1%);--pos:calc(((var(--value) - var(--min)) / (var(--max) - var(--min))) * 100%);pointer-events:none;width:auto;min-width:40px;height:24px;min-height:24px;text-align:center;position:absolute;z-index:5;background:var(--value-background);border-radius:4px;padding:0 6px;left:var(--pos);transform:translate(var(--x-offset),calc(150% * var(--flip) - (var(--y-offset,0) + var(--value-offset-y)) * var(--flip)));transition:all .12s ease-out,left 0s;opacity:0;box-sizing:content-box}.${defCon.class.range}>input+output::after{content:var(--prefix, "") var(--text-value-b) var(--suffix, "");font:var(--value-font)}`
    );

    const fontStyle = fontStyle_db + fontStyle_container + fontStyle_cp + fontStyle_tooltip + fontStyle_Progress;
    const tFontSize = isFontsize
      ? String(
          `<li id="${defCon.id.fontSize}">
            <div class="${defCon.class.flex}">
              <span style="margin:0;padding:0">字体比例缩放</span>
              <input id="${defCon.id.fontZoom}" type="text" v="number" maxlength="5" />
            </div>
            <div class="${defCon.class.range}" data-ticks-position="top"
              style="--min:.8;--max:1.5;--step:.001;--value:${CONST.fontSize};--text-value:'${CONST.fontSize.toFixed(3).toString()}'">
              <input id="${defCon.id.zoomSize}" type="range" min=".8" max="1.5" step=".001" value="${Number(CONST.fontSize).toFixed(3)}">
              <output></output>
              <div class='${defCon.class.rangeProgress}'></div>
            </div>
          </li>`
        ).trim()
      : ``;
    const tHTML = String(
      `<div id="${defCon.id.container}">
        <fieldset id="${defCon.id.field}" style="display:block">
          <legend class="${defCon.class.title}">
            <span style="display:inline-block;color:#8b0000!important">${defCon.scriptName}</span>
            <span class="${defCon.class.guide}">
              <div class="${defCon.class.rotation}" title="打开帮助文件" height="24" width="24"/>
                <svg class="${defCon.class.help}" viewBox="0 0 1053 1024" version="1.1" xmlns="https://www.w3.org/2000/svg">
                <path d="M526.628571 1024C245.76 1024 14.628571 795.794286 14.628571 512S242.834286 0 526.628571 0c280.868571 0 512 228.205714 512 512S807.497143 1024 526.628571 1024z m-40.96-266.24c11.702857 8.777143 23.405714 14.628571 35.108572 14.628571 14.628571 0 26.331429-5.851429 35.108571-14.628571 11.702857-8.777143 14.628571-20.48 14.628572-38.034286 0-14.628571-5.851429-26.331429-14.628572-35.108571-8.777143-8.777143-20.48-14.628571-35.108571-14.628572s-26.331429 5.851429-38.034286 14.628572-14.628571 20.48-14.628571 35.108571c2.925714 17.554286 8.777143 29.257143 17.554285 38.034286zM675.84 321.828571c-14.628571-20.48-32.182857-38.034286-58.514286-49.737142-26.331429-11.702857-55.588571-17.554286-87.771428-17.554286-35.108571 0-67.291429 5.851429-93.622857 20.48-26.331429 14.628571-46.811429 32.182857-61.44 55.588571-14.628571 23.405714-20.48 43.885714-20.48 64.365715 0 11.702857 2.925714 20.48 11.702857 29.257142 8.777143 8.777143 20.48 14.628571 32.182857 14.628572 20.48 0 35.108571-11.702857 43.885714-38.034286 8.777143-23.405714 17.554286-43.885714 29.257143-55.588571 11.702857-11.702857 29.257143-17.554286 55.588571-17.554286 20.48 0 38.034286 5.851429 52.662858 17.554286 14.628571 11.702857 20.48 29.257143 20.48 46.811428 0 8.777143-2.925714 17.554286-5.851429 26.331429-5.851429 8.777143-8.777143 14.628571-17.554286 20.48-5.851429 5.851429-17.554286 17.554286-32.182857 29.257143-17.554286 14.628571-29.257143 26.331429-40.96 38.034285-8.777143 11.702857-17.554286 23.405714-23.405714 38.034286-5.851429 14.628571-8.777143 29.257143-8.777143 49.737143 0 14.628571 2.925714 26.331429 11.702857 35.108571 8.777143 8.777143 17.554286 11.702857 29.257143 11.702858 23.405714 0 35.108571-11.702857 40.96-35.108572 2.925714-11.702857 2.925714-17.554286 5.851429-23.405714 0-5.851429 2.925714-8.777143 5.851428-14.628572s5.851429-8.777143 11.702857-14.628571l17.554286-17.554286c29.257143-26.331429 46.811429-43.885714 58.514286-52.662857 11.702857-11.702857 20.48-23.405714 29.257143-38.034286 8.777143-14.628571 11.702857-32.182857 11.702857-49.737142 2.925714-29.257143-2.925714-52.662857-17.554286-73.142858z" fill="#67a5df" stroke="white" stroke-width="30"></path>
                </svg>
              </div>
            <span>
          </legend>
          <ul class="${defCon.class.main}">
            <li id="${defCon.id.fontList}">
              <div class="${defCon.class.fontList}"></div>
            </li>
            <li id="${defCon.id.fontFace}">
              <div style="margin:0;padding:0">字体重写（默认：开）</div>
              <div style="height:32px;margin:0;padding:0;align-self:center">
                <input type="checkbox" id="${defCon.id.fface}" class="${defCon.class.checkbox}" ${CONST.fontFace ? "checked" : ""} />
                <label for="${defCon.id.fface}"></label>
              </div>
            </li>
            <li id="${defCon.id.fontSmooth}">
              <div style="margin:0;padding:0">字体平滑（默认：开）</div>
              <div style="height:32px;margin:0;padding:0;align-self:center">
                <input type="checkbox" id="${defCon.id.smooth}" class="${defCon.class.checkbox}" ${CONST.fontSmooth ? "checked" : ""} />
                <label for="${defCon.id.smooth}"></label>
              </div>
            </li>
            ${tFontSize}
            <li id="${defCon.id.fontStroke}">
              <div class="${defCon.class.flex}">
                <span style="margin:0;padding:0">字体描边尺寸</span>
                <input id="${defCon.id.strokeSize}" type="text" v="number" maxlength="5" />
              </div>
              <div class="${defCon.class.range}" data-ticks-position="top"
                style="--step:.001;--min:0;--max:1;--value:${CONST.fontStroke};--text-value:'${CONST.fontStroke.toFixed(3).toString()}'">
                <input id="${defCon.id.stroke}" type="range" min="0" max="1" step=".001" value="${Number(CONST.fontStroke).toFixed(3)}" />
                <output></output>
                <div class="${defCon.class.rangeProgress}"></div>
              </div>
            </li>
            <li id="${defCon.id.fontShadow}">
              <div class="${defCon.class.flex}">
                <span style="margin:0;padding:0">字体阴影尺寸</span>
                <input id="${defCon.id.shadowSize}" type="text" v="number" maxlength="4" />
              </div>
              <div class="${defCon.class.range}" data-ticks-position="top"
                style="--step:.01;--min:0;--max:8;--value:${CONST.fontShadow};--text-value:'${CONST.fontShadow.toFixed(2).toString()}'">
                <input id="${defCon.id.shadow}" type="range" min="0" max="8" step=".01" value="${Number(CONST.fontShadow).toFixed(2)}" />
                <output></output>
                <div class="${defCon.class.rangeProgress}"></div>
              </div>
            </li>
            <li id="${defCon.id.shadowColor}">
              <div style="margin:0px 5px 0 0">
                <span style="margin:0;padding:0">阴影颜色</span>
                <span class="${defCon.class.tooltip}">
                  <span title="单击查看帮助">\ud83d\udd14</span>
                  <span class="${defCon.class.tooltip} ${defCon.class.ps3}">
                    <p>阴影颜色可通过点击色块激活拾色器选择，也可自定义填写，格式支持: <em style="color:#cecece">RGB, RGBA, HEX{3}, HEX{6}</em>。纯白色的所有格式表示自身颜色 <em style="color:#cecece">currentcolor</em></p>
                    <p><em style="color:darkred">注意：输入数值会自动转化为HEX，但数值保持一致性。错误格式会被替换为上次保存的数据。</em></p>
                  </span>
                </span>
              </div>
              <div title="选取颜色" class="${defCon.class.colorPicker}" id="${defCon.id.cps}"></div>
              <div class="${defCon.class.colorPicker2}"><input title="输入颜色代码" type="text" id="${defCon.id.color}" /></div>
              <div id="${defCon.id.cpm}"></div>
            </li>
            <li id="${defCon.id.fontCSS}" style="min-width:${getBrowser.type("core").Gecko ? 264 : 254}px">
              <div style="margin: 0 0 6px 0">需要渲染的网页元素：
                <span class="${defCon.class.tooltip}">
                  <span title="单击查看帮助">\ud83d\udd14</span>
                  <span class="${defCon.class.tooltip} ${defCon.class.ps4}">
                    <p>默认为排除大多数网站常用的特殊CSS样式后需要渲染的页面元素。填写格式：<em style="color:#cecece">:not(.fa)</em> 或 <em style="color:#cecece">:not([class*="fa"])</em></p>
                    <p><em style="color:darkred">该选项为重要参数，默认只读，双击解锁。请尽量不要修改，避免造成样式失效。若失效请重置。</em></p>
                  </span>
                </span>
                <div id="${defCon.id.cSwitch}" class="${defCon.class.switch}" data-switch="ON">\u2227</div>
              </div>
              <textarea placeholder="请谨慎修改默认值，避免渲染失效。" id="${defCon.id.cssfun}" class="${defCon.class.readonly}"
                title="重要参数，默认只读，双击解锁。" readonly="readonly">${CONST.fontCSS ? CONST.fontCSS : defValue.fontCSS}</textarea>
            </li>
            <li id="${defCon.id.fontEx}" style="min-width:${getBrowser.type("core").Gecko ? 264 : 254}px">
              <div style="margin: 0 0 6px 0">排除渲染的HTML标签：
                <span class="${defCon.class.tooltip}">
                  <span title="单击查看帮助">\ud83d\udd14</span>
                  <span class="${defCon.class.tooltip} ${defCon.class.ps3}">
                    <p>该选项排除渲染字体描边、字体阴影效果，请将排除渲染的HTML标签用逗号分隔。具体规则请点击顶部旋转的帮助文件图标。</p>
                    <p><em style="color:darkred">编辑该选项需要CSS知识，如需要排除复杂的样式或标签可通过这里进行添加，样式若混乱请重置。</em></p>
                  </span>
                </span>
                <div id="${defCon.id.eSwitch}" class="${defCon.class.switch}" data-switch="ON">\u2227</div>
              </div>
              <textarea placeholder="请输入要排除渲染的HTML标签，形如: input, em, div[id='test']"
                id="${defCon.id.exclude}">${CONST.fontEx ? CONST.fontEx : ""}</textarea>
            </li>
            <li id="${defCon.id.submit}">
              <button class="${defCon.class.reset}">重置</button>
              <button class="${defCon.class.cancel}">取消</button>
              <button id="${defCon.id.backup}">备份</button>
              <button class="${defCon.class.submit}">保存</button>
            </li>
          </ul>
        </fieldset>
      </div>`
    ).trim();
    const tCSS = `@charset "UTF-8";` + fontStyle;
    const tStyle = `@charset "UTF-8";` + tshadow;
    defCon.tStyle = tStyle;
    defCon.refont = refont;

    /* SYSTEM INFO */

    const defautlFont = "\u7f51\u7ad9\u9ed8\u8ba4\u5b57\u4f53";
    let reFontFace = defautlFont;
    defCon.curFont = defautlFont;

    await getCurFont(CONST.fontFace, defCon.refont, defautlFont);

    if (curWindowtop) {
      if (defCon.siteIndex === undefined) {
        console.info(
          `%c${defCon.scriptName}\n%cINTRO.URL:\u0020https://f9y4ng.likes.fans/FontRendering\n%c\u259e\u0020脚本版本：%cV%s%c\n\u259e\u0020个性化设置：%c%s%c/%s%s\n%c\u259e\u0020字体缩放：%s%s\n\u259e\u0020本地备份：%s\u3000\u259a\u0020保存预览：%s\n%c\u259e\u0020渲染字体：%s\n\u259e\u0020字体平滑：%s\u3000\u259a\u0020字体重写：%s\n\u259e\u0020字体描边：%s\u3000\u259a\u0020字体阴影：%s`,
          "font-weight:bold;font-size:14px;color:crimson",
          "line-height:200%;font-size:10px;color:#777;font-style:italic",
          "line-height:180%;font-size:12px;color:slategray",
          "color:slategrey;font:italic 18px Candara,monospace;",
          defCon.curVersion,
          "line-height:180%;font-size:12px;color:steelblue",
          defCon.domainCount > maxPersonalSites ? "color:crimson" : "color:steelblue",
          defCon.domainCount,
          "line-height:180%;font-size:12px;color:steelblue",
          maxPersonalSites,
          defCon.domainIndex !== undefined ? "\uff08\u5f53\u524d\uff1a\u4e2a\u6027\u5316\uff09" : "\uff08\u5f53\u524d\uff1a\u5168\u5c40\uff09",
          "line-height:180%;font-size:12px;color:steelblue",
          isFontsize ? "ON " : "OFF",
          isFontsize
            ? CONST.fontSize === 1
              ? "\u3000\u259a\u0020\u7f29\u653e\u6bd4\u4f8b\uff1a(WEBSITE DEFINED)"
              : `\u3000\u259a\u0020\u7f29\u653e\u6bd4\u4f8b\uff1a${Number(CONST.fontSize * 100).toFixed(2) + "%"}`
            : "\u3000\u259a\u0020\u7f29\u653e\u6bd4\u4f8b\uff1a(BROWSER DEFINED)",
          isBackupFunction ? "ON " : "OFF",
          isPreview ? "ON " : "OFF",
          "line-height:180%;font-size:12px;color:teal",
          fontface_i ? reFontFace : "\u5df2\u5173\u95ed\uff08\u91c7\u7528" + reFontFace + "\uff09",
          CONST.fontSmooth ? "ON " : "OFF",
          CONST.fontFace ? "ON " : "OFF",
          Number(CONST.fontStroke) ? "ON " : "OFF",
          Number(CONST.fontShadow) ? "ON " : "OFF"
        );
      } else {
        console.info(
          `%c${defCon.scriptName}\n%c${location.hostname.toUpperCase()} 已在排除渲染列表内，若要重新渲染，请在脚本菜单中打开重新渲染。`,
          "line-height:160%;font-weight:bold;font-size:14px;color:red",
          "line-height:180%;font-size:12px;color:darkred"
        );
      }
    }

    /* Insert CSS */

    try {
      startRAFInterval();
      const callback = mutations => {
        mutations.forEach(mutation => {
          if (!((!curWindowtop || qS(`.${defCon.class.rndClass}`)) && qS(`.${defCon.class.rndStyle}`))) {
            debug(`\u27A4 %cMutationObserver: %c%s %c%s`, "font-weight:bold;color:teal", "color:olive", mutation.type, "font-weight:bold;color:red", !startRAFInterval());
          }
          if (qS(`.${defCon.class.rndStyle}`) && document.head.lastChild.className !== defCon.class.rndStyle) {
            try {
              const lastChildEleclassName = document.head.lastChild.className || "lastChildEleclassName";
              if (lastChildEleclassName.includes("darkreader") && document.head.lastChild.previousSibling.className === defCon.class.rndStyle) {
                debug("\u27A4 %s is Ready, Caused by darkreader inserted", defCon.class.rndStyle);
              } else if (qS(`.${defCon.class.rndStyle}`).nextSibling) {
                debug("\u27A4 [:before] %c%s", "font-style:italic", document.head.lastChild.className || "<empty string>");
                reloadStyleTolastChild(true);
              }
            } catch (e) {
              error("\u27A4 lastChildStyle error", e);
            }
          }
        });
      };
      const opts = { childList: true, subtree: true };
      const observer = new MutationObserver(callback);
      observer.observe(document, opts);
    } catch (e) {
      error("\u27A4 createHTML:", e);
    }

    /* Menus Insert */

    setTimeout((Font_Set, Feed_Back, Exclude_site, Parameter_Set) => {
      if (curWindowtop) {
        loading ? GMunregisterMenuCommand(loading) : debug("\u27A4 No Loading_Menu");
        if (defCon.siteIndex === undefined) {
          Font_Set ? GMunregisterMenuCommand(Font_Set) : debug("\u27A4 No Font_Set_Menu");
          Font_Set = GMregisterMenuCommand("\ufff2\ud83c\udf13 字体渲染设置", () => {
            if (!qS(`#${defCon.id.rndId}`)) {
              insertHTML();
              operationConfigure();
              autoZoomFontSize(`#${defCon.id.rndId}`, defCon.tZoom);
              setTimeout(() => {
                qS(`#${defCon.id.container}`).style.opacity = 1;
                debug("\u27A4 errorCount:", defCon.errors.length);
                if (defCon.errors.length) {
                  reportErrortoAuthor(defCon.errors, true);
                }
              }, 100);
              qS(`.${defCon.class.title} .${defCon.class.guide}`).addEventListener("click", () => {
                GMopenInTab(guideURI, defCon.options);
              });
            } else {
              closeAllDialog(`#${defCon.id.dialogbox}`);
              closeConfigurePage(false);
            }
          });
          Exclude_site ? GMunregisterMenuCommand(Exclude_site) : debug("\u27A4 No Exclude_site_Menu");
          Exclude_site = GMregisterMenuCommand(`\ufff3\u26d4 排除渲染 ${curHostname}`, async () => {
            closeAllDialog(`#${defCon.id.dialogbox}`);
            let frDialog = new frDialogBox({
              trueButtonText: "确 定",
              neutralButtonText: "取 消",
              messageText: `<p style="font:bold italic 24px/1.4 Candara,Serif!important">${curHostname}</p><p style="color:darkred">该域名下所有页面将被禁止字体渲染！</p><p>确定后页面将自动刷新，请确认是否排除？</p>`,
              titleText: "禁止字体渲染",
            });
            if (await frDialog.respond()) {
              exSite = await GMgetValue("_Exclude_site_");
              exSite = JSON.parse(defCon.decrypt(exSite));
              exSite.push(curHostname);
              GMsetValue("_Exclude_site_", defCon.encrypt(JSON.stringify(exSite)));
              location.reload();
            }
            frDialog = null;
          });
          Parameter_Set ? GMunregisterMenuCommand(Parameter_Set) : debug("\u27A4 No Parameter_Set_Menu");
          Parameter_Set = GMregisterMenuCommand("\ufff7\ud83d\udc8e VIP 高级功能开关", async () => {
            configure = await GMgetValue("_configure_");
            _config_data_ = JSON.parse(defCon.decrypt(configure));
            isBackupFunction = Boolean(_config_data_.isBackupFunction);
            isPreview = Boolean(_config_data_.isPreview);
            isFontsize = Boolean(_config_data_.isFontsize);
            maxPersonalSites = Number(_config_data_.maxPersonalSites);
            closeAllDialog(`#${defCon.id.dialogbox}`);
            let frDialog = new frDialogBox({
              trueButtonText: "保存数据",
              falseButtonText: "帮助文件",
              neutralButtonText: "取 消",
              messageText: String(
                `<ul class="${defCon.class.main}" style="margin:0;padding:0;list-style:none">
                  <li id="${defCon.id.bk}">
                    <div class="${defCon.id.seed}_VIP">\u2460 本地备份功能（默认：开启）</div>
                    <div style="margin:0;padding:0">
                      <input type="checkbox" id="${defCon.id.isbackup}" class="${defCon.class.checkbox}" ${isBackupFunction ? "checked" : ""} />
                      <label for="${defCon.id.isbackup}"></label>
                    </div>
                  </li>
                  <li id="${defCon.id.pv}">
                    <div class="${defCon.id.seed}_VIP">\u2461 保存预览功能（默认：关闭）</div>
                    <div style="margin:0;padding:0">
                      <input type="checkbox" id="${defCon.id.ispreview}" class="${defCon.class.checkbox}" ${isPreview ? "checked" : ""} />
                      <label for="${defCon.id.ispreview}"></label>
                    </div>
                  </li>
                  <li id="${defCon.id.fs}">
                    <div class="${defCon.id.seed}_VIP">\u2462 字体缩放功能（默认：关闭）</div>
                    <div style="margin:0;padding:0">
                      <input type="checkbox" id="${defCon.id.isfontsize}" class="${defCon.class.checkbox}" ${isFontsize ? "checked" : ""} />
                      <label for="${defCon.id.isfontsize}"></label>
                    </div>
                  </li>
                  <li id="${defCon.id.mps}">
                    <div class="${defCon.id.seed}_VIP">\u2463 个性化设置总数（默认：100）</div>
                    <div style="margin:0 5px 0 0;padding:0">
                      <input maxlength="4" id="${defCon.id.maxps}" placeholder="100" value="${maxPersonalSites}"
                        style="box-sizing:border-box;font:normal 500 16px/140% Impact,Times,serif!important;border:2px solid darkgoldenrod;border-radius:4px;width:70px;min-width:70px;text-align:center;padding:4px 5px;color:#333" />
                    </div>
                  </li>
                  <li id="${defCon.id.flc}">
                    <div class="${defCon.id.seed}_VIP">\u2464 字体列表缓存（时效：24小时）</div>
                    <button id="${defCon.id.flcid}" title="重建当前网站字体列表缓存（如果你已安装新字体，但字体列表未及时更新）"
                      style="box-sizing:border-box;margin:0 5px 0 0;padding:2px 5px;width:max-content;height:max-content;min-width:70px;min-height:32px;background:#eee;letter-spacing:normal">
                      重建缓存
                    </button>
                  </li>
                </ul>
                <div id="${defCon.id.feedback}" title="遇到问题，建议先看看脚本帮助文件。"
                  style="box-sizing:content-box;height:auto;margin:0 0 0 15px;padding:2px 0 6px 0;font-size:16px;font-style:normal;color:#333;font-weight:600;cursor:help">
                    \ud83e\udde1\u0020如果您遇到问题，请向我反馈\u0020\ud83e\udde1
                </div>`
              ).trim(),
              titleText: "参数设置 - VIP 高级功能",
            });
            let _bk, _pv, _fs, _mps;
            _bk = Boolean(qS(`#${defCon.id.isbackup}`).checked);
            _pv = Boolean(qS(`#${defCon.id.ispreview}`).checked);
            _fs = Boolean(qS(`#${defCon.id.isfontsize}`).checked);
            _mps = Number(qS(`#${defCon.id.maxps}`).value);
            qS(`#${defCon.id.maxps}`).addEventListener("input", function () {
              this.value = this.value.replace(/[^0-9]/g, "");
            });
            if (getBrowser.type("core").Gecko) {
              qS(`#${defCon.id.isfontsize}`).addEventListener("click", function () {
                if (this.checked) {
                  const cF = confirm(
                    "由于 Firefox(Gecko内核) 对部分 CSS 及 Javascript 的兼容性原因，会造成某些站点样式异常、坐标漂移等问题，我们建议您在 Firefox 浏览器中谨慎使用脚本级字体缩放功能。\n\n如有必要需求，请使用 Firefox 自身的缩放功能来放大 (Ctrl+) 或缩小 (Ctrl-) 页面。注意：清除 历史记录\u2192数据\u2192网站设置 会重置缩放。\n\n请确认是否开启字体缩放功能？"
                  );
                  this.checked = !!cF;
                }
              });
            }
            qS(`#${defCon.id.flcid}`).addEventListener("click", async () => {
              closeAllDialog(`#${defCon.id.dialogbox}`);
              cache.remove("_fontlist_");
              let frDialog = new frDialogBox({
                trueButtonText: "确 定",
                messageText: `<p style="font-size:18px!important;text-align:center;padding-bottom:6px;color:darkgoldenrod">字体列表缓存已重建，页面即将刷新！</p><p style="text-align:center"><a style="display:inline-block;border:2px solid darkgoldenrod;border-radius:8px;width:302px;height:237px;background:url('${loadingIMG}') 50% 50% no-repeat;overflow:hidden"><img src='${fontlistIMG}' alt="当前网站的字体列表缓存重建"/></a></p>`,
                titleText: "当前网站字体列表缓存重建",
              });
              if (await frDialog.respond()) {
                frDialog = null;
                location.reload();
              }
            });
            qS(`#${defCon.id.feedback}`).addEventListener("click", () => {
              GMopenInTab(feedback, defCon.options);
            });
            document.querySelectorAll(`#${defCon.id.isbackup}, #${defCon.id.ispreview}, #${defCon.id.isfontsize}, #${defCon.id.maxps}`).forEach(items => {
              items.addEventListener("change", () => {
                _bk = Boolean(qS(`#${defCon.id.isbackup}`).checked);
                _pv = Boolean(qS(`#${defCon.id.ispreview}`).checked);
                _fs = Boolean(qS(`#${defCon.id.isfontsize}`).checked);
                _mps = Number(qS(`#${defCon.id.maxps}`).value);
              });
            });
            if (await frDialog.respond()) {
              _mps = !_mps ? 100 : _mps;
              _config_data_.isBackupFunction = _bk;
              _config_data_.isPreview = _pv;
              _config_data_.isFontsize = _fs;
              _config_data_.maxPersonalSites = _mps;
              GMsetValue("_configure_", defCon.encrypt(JSON.stringify(_config_data_)));
              let frDialog = new frDialogBox({
                trueButtonText: "确 定",
                messageText: `<p style="color:darkgoldenrod">VIP 高级功能参数已成功保存，页面即将刷新！</p>`,
                titleText: "VIP 高级功能设置保存",
              });
              closeConfigurePage(true);
              if (await frDialog.respond()) {
                frDialog = null;
                location.reload();
              }
            } else {
              GMopenInTab(guideURI, defCon.options);
            }
            frDialog = null;
          });
        } else {
          Exclude_site ? GMunregisterMenuCommand(Exclude_site) : debug("\u27A4 No Exclude_site_Menu");
          Exclude_site = GMregisterMenuCommand(`\ufff2\ud83c\udf40 重新渲染 ${curHostname}`, async () => {
            closeAllDialog(`#${defCon.id.dialogbox}`);
            let frDialog = new frDialogBox({
              trueButtonText: "确 定",
              neutralButtonText: "取 消",
              messageText: `<p style="font:italic bold 22px/1.4 Candara,serif!important">${curHostname}</p><p style="color:darkgreen">该域名下所有页面将重新进行字体渲染！</p><p>确定后页面将自动刷新，请确认是否恢复？</p>`,
              titleText: "恢复字体渲染",
            });
            if (await frDialog.respond()) {
              exSite = await GMgetValue("_Exclude_site_");
              exSite = JSON.parse(defCon.decrypt(exSite));
              defCon.siteIndex = real_Time_Update(exSite);
              exSite.splice(defCon.siteIndex, 1);
              GMsetValue("_Exclude_site_", defCon.encrypt(JSON.stringify(exSite)));
              location.reload();
            }
            frDialog = null;
          });
          Feed_Back ? GMunregisterMenuCommand(Feed_Back) : debug("\u27A4 No Feed_Back_Menu");
          Feed_Back = GMregisterMenuCommand("\ufff9\ud83e\udde1 向作者反馈问题或建议", () => {
            GMopenInTab(feedback, defCon.options);
          });
        }
      }
    }, 2e3);

    /* important Functions */

    function insertHTML() {
      if (document.body) {
        try {
          const section = cE("fr-configure");
          section.id = defCon.id.rndId;
          section.innerHTML = tHTML;
          qS("body").appendChild(section);
        } catch (e) {
          error("\u27A4 insertHTML:", e);
        }
      }
    }

    function insertCSS() {
      try {
        addStyle(tCSS, `${defCon.class.rndClass}`, document.head, "TC");
      } catch (e) {
        error("\u27A4 insertCSS:", e);
      }
    }

    function insertStyle(t) {
      try {
        addStyle(tStyle, `${defCon.class.rndStyle}`, document.head, "TS", t);
      } catch (e) {
        error("\u27A4 insertStyle:", e);
      }
    }

    function reloadStyleTolastChild(isMutationObserver) {
      try {
        if (isMutationObserver) {
          const cssScriptCount = document.head.querySelectorAll("style[id^='TC']").length;
          if (cssScriptCount > 1) {
            if (!defCon.scriptCount) {
              defCon.scriptCount = true;
              const info = `\u53d1\u73b0\u5197\u4f59\u5b89\u88c5\u7684\u201c${defCon.scriptName}\u201d\u811a\u672c\uff0c\u8bf7\u5220\u9664\u91cd\u590d\u811a\u672c\u4fdd\u7559\u5176\u4e00\u3002`;
              defCon.errors.push(`[Redundant Scripts]: ${info}`);
              reportErrortoAuthor(defCon.errors, true);
              console.error("\u27A4 ", info);
            }
            return false;
          } else if (document.head.querySelectorAll("style[id^='TS']").length >= 1) {
            insertStyle(true);
            debug("\u27A4 [:after]", document.head.lastChild.className);
          }
        } else {
          document.onreadystatechange = () => {
            if (document.readyState === "complete") {
              setTimeout(() => {
                if (document.head.lastChild.className !== defCon.class.rndStyle) {
                  insertStyle(true);
                }
                debug("\u27A4 [lastChild] className: %c%s", "font-weight:bold", document.head.lastChild.className);
              }, 2e3);
              debug(
                "\u27A4 Style.Position@lastChild: %c%s",
                "color:crimson;font-weight:bold",
                document.head.lastChild.className === defCon.class.rndStyle || document.head.lastChild.previousSibling.className === defCon.class.rndStyle
              );
            }
          };
        }
      } catch (e) {
        error("\u27A4 reloadStyleTolastChild:", e);
      }
    }

    function startRAFInterval() {
      RAFInterval(
        () => {
          if (!qS(`.${defCon.class.rndStyle}`)) {
            insertStyle(false);
          } else {
            reloadStyleTolastChild(false);
          }
          if (curWindowtop) {
            if (!qS(`.${defCon.class.rndClass}`)) {
              insertCSS();
            }
          }
          return Boolean(qS(`.${defCon.class.rndStyle}`) && (!curWindowtop || qS(`.${defCon.class.rndClass}`)));
        },
        10,
        true
      );
    }

    async function fontCheck_detectOnce(fontData = []) {
      const fontReady = await document.fonts.ready;
      const checkFont = new isSupportFontFamily();
      const fontAvailable = new Set();
      let ii = 1;
      if (fontReady) {
        const cfl = await GMgetValue("_Custom_fontlist_");
        const cusFontCheck = cfl ? JSON.parse(defCon.decrypt(cfl)) : defaultArray;
        fontCheck = unique([...fontCheck, ...cusFontCheck]);
        for (const font of fontCheck.values()) {
          if (checkFont.detect(font.en)) {
            if (font.en !== refont) {
              font.sort = ii;
              fontAvailable.add(font);
            }
          } else if (checkFont.detect(convert2Unicode(font.ch)) && convert2Unicode(font.ch) !== refont) {
            font.en = convert2Unicode(font.ch);
            font.sort = ii;
            fontAvailable.add(font);
          }
          ii++;
        }
      }
      fontData = [...fontAvailable.values()].sort((a, b) => {
        return a.sort - b.sort;
      });
      return fontData;
    }

    async function operationConfigure(fontData = []) {
      try {
        if (curWindowtop) {
          // fontlist with cache expires
          try {
            const fontlist_Cache = cache.get("_fontlist_");
            if (fontlist_Cache) {
              debug("\u27A4 %cLoad font_Data from Cache", "color:green;font-weight:bold");
              fontData = fontlist_Cache;
            } else {
              debug("\u27A4 %cStart real-time font detection", "color:crimson;font-weight:bold");
              fontData = await fontCheck_detectOnce();
              cache.set("_fontlist_", fontData);
            }
          } catch (e) {
            error("\u27A4 fontlist with cache expires: ", e);
            cache.remove("_fontlist_");
            fontData = await fontCheck_detectOnce();
            cache.set("_fontlist_", fontData);
          }

          /* Fonts selection */

          try {
            if (qS(`#${defCon.id.fontList} .${defCon.class.fontList}`)) {
              fontSet(`#${defCon.id.fontList} .${defCon.class.fontList}`).fsearch(fontData);
              qS(`#${defCon.id.fonttooltip}`).addEventListener("dblclick", async () => {
                let _Custom_fontlist_ = "";
                const cfl = await GMgetValue("_Custom_fontlist_");
                const cusFontCheck = cfl ? JSON.parse(defCon.decrypt(cfl)) : defaultArray;
                if (cusFontCheck.length && Array.isArray(cusFontCheck)) {
                  cusFontCheck.forEach(item => {
                    delete item.sort;
                    _Custom_fontlist_ += JSON.stringify(item) + "\n";
                  });
                }
                let frDialog = new frDialogBox({
                  trueButtonText: "保 存",
                  falseButtonText: "帮助文档",
                  neutralButtonText: "取 消",
                  messageText: `<p style="color:#666;font-size:14px!important">以下文本域可按预定格式增加您自定义的字体。请按照格式样例填写，输入格式有误将被自动过滤。重复添加字体将在字体表合并时被自动忽略。【功能小贴士：<span id="${defCon.id.seed}_addTools" style="color:crimson;cursor:pointer">字体添加辅助工具</span>】</p><p><textarea id="${defCon.id.seed}_custom_Fontlist" style="min-height:160px!important;min-width:377px!important;resize:vertical;padding:5px;border:1px solid #999;border-radius:6px;font:normal 14px monospace,Consolas!important;white-space:pre!important;cursor:text" placeholder='字体表自定义格式样例，每行一组字体名称数据，如下：\n\n{ "ch": "中文字体名一", "en": "EN Fontname 1" }\u21b2\n{ "ch": "中文字体名二", "en": "EN Fontname 2" }\u21b2\n{ "ch": "中文字体名三", "en": "EN Fontname 3" }\u21b2\n\n（注意：\u21b2为换行符号，输入(Enter)回车即可）'>${_Custom_fontlist_}</textarea></p><p style="display:block;margin:-5px 0 0 -7px!important;height:max-content;color:crimson;font-size:14px!important">（请勿添加过多自定义字体，避免造成页面加载缓慢）</p>`,
                  titleText: "自定义字体表",
                });
                let custom_Fontlist;
                let save_Fontlist = defaultArray;
                qS(`#${defCon.id.seed}_addTools`).addEventListener("click", () => {
                  let chName, enName, cusFontName;
                  chName = prompt("请输入中文字体名：(例如：鸿蒙黑体，仅支持半角输入模式，包括中文、日文、韩文、英文，数字、减号、下划线、空格、@)", "鸿蒙黑体");
                  if (chName === null) {
                    return;
                  } else if (/^@?[a-zA-Z0-9\u2E80-\uD7FF\-_ ]+$/.test(chName.trim())) {
                    enName = prompt("请输入英文字体名：(例如：HarmonyOS Sans SC，仅支持半角输入模式，包括英文、数字、减号、下划线、空格、@)", "HarmonyOS Sans SC");
                    if (enName === null) {
                      return;
                    } else if (/^@?[a-zA-Z0-9\-_ ]+$/.test(enName.trim())) {
                      cusFontName = `{"ch":"${chName.trim()}","en":"${enName.trim()}"}`;
                      const aTrim = qS(`#${defCon.id.seed}_custom_Fontlist`).value.trim() ? "\n" : "";
                      qS(`#${defCon.id.seed}_custom_Fontlist`).value = qS(`#${defCon.id.seed}_custom_Fontlist`).value.trim().concat(aTrim, cusFontName, "\n");
                      custom_Fontlist = qS(`#${defCon.id.seed}_custom_Fontlist`).value.trim();
                    } else {
                      alert("英文字体名 格式输入错误！");
                    }
                  } else {
                    alert("中文字体名 格式输入错误！");
                  }
                });
                qS(`#${defCon.id.seed}_custom_Fontlist`).addEventListener("change", function () {
                  this.value = filteToCDB(this.value)
                    .replace(/'|`|·|“|”|‘|’/g, `"`)
                    .replace(/，/g, `,`)
                    .replace(/：/g, `:`);
                  custom_Fontlist = this.value.trim();
                });
                if (await frDialog.respond()) {
                  const fontlistArray = custom_Fontlist.match(/{\s*"ch":\s*"@?[a-zA-Z0-9\u2E80-\uD7FF\-_ ]+"\s*,\s*"en":\s*"@?[a-zA-Z0-9\-_ ]+"\s*}/g);
                  if (!custom_Fontlist.length) {
                    GMsetValue("_Custom_fontlist_", defCon.encrypt(JSON.stringify(defaultArray)));
                    let frDialog = new frDialogBox({
                      trueButtonText: "确 定",
                      messageText: `<p>自定义字体表已重置成功！<p><p style="color:green">当前网站字体列表缓存已自动重建，页面即将刷新。</p>`,
                      titleText: "自定义字体重置成功",
                    });
                    closeConfigurePage(true);
                    if (await frDialog.respond()) {
                      closeAllDialog(`#${defCon.id.dialogbox}`);
                      cache.remove("_fontlist_");
                      location.reload();
                      frDialog = null;
                    }
                  } else if (fontlistArray) {
                    fontlistArray.forEach(item => {
                      save_Fontlist.push(JSON.parse(item));
                    });
                    GMsetValue("_Custom_fontlist_", defCon.encrypt(JSON.stringify(save_Fontlist)));
                    let frDialog = new frDialogBox({
                      trueButtonText: "确 定",
                      messageText: `<p>您所提交的自定义字体已保存成功！<p><p style="color:green">当前网站字体列表缓存已自动重建，页面即将刷新。</p>`,
                      titleText: "自定义字体保存成功",
                    });
                    closeConfigurePage(true);
                    if (await frDialog.respond()) {
                      closeAllDialog(`#${defCon.id.dialogbox}`);
                      cache.remove("_fontlist_");
                      location.reload();
                      frDialog = null;
                    }
                  } else {
                    let frDialog = new frDialogBox({
                      trueButtonText: "确 定",
                      messageText: `<p style="color:crimson">您所提交的自定义字体格式有误，请重新输入。<p>`,
                      titleText: "字体表格式错误",
                    });
                    if (await frDialog.respond()) {
                      let clickEvent = new Event("dblclick", { bubbles: true, cancelable: false });
                      qS(`#${defCon.id.fonttooltip}`).dispatchEvent(clickEvent);
                      clickEvent = null;
                      frDialog = null;
                    }
                  }
                } else {
                  GMopenInTab(defCon.decrypt("aHR0cHMlM0ElMkYlMkZncmVhc3lmb3JrLm9yZyUyRnNjcmlwdHMlMkY0MTY2ODglMjNjdXN0b20="), defCon.options);
                }
                frDialog = null;
              });
            }
          } catch (e) {
            defCon.errors.push(`[Fonts selection]: ${e}`);
            error("\u27A4 Fonts selection:", e);
          }

          /* selector placeholder style */

          const inputFont = qS(`#${defCon.id.fontList} .${defCon.class.selectFontId} input`);
          const ffaceT = qS(`#${defCon.id.fface}`);
          if (ffaceT && inputFont) {
            await getCurFont(CONST.fontFace, defCon.refont, defautlFont);
            ffaceT.addEventListener("change", async () => {
              await getCurFont(ffaceT.checked, defCon.refont, defautlFont);
            });
          }
          if (inputFont) {
            inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${defCon.curFont}`);
            inputFont.addEventListener("mouseover", () => {
              inputFont.setAttribute("placeholder", `\u8f93\u5165\u5173\u952e\u5b57\u53ef\u68c0\u7d22\u5b57\u4f53`);
            });
            inputFont.addEventListener("mouseout", () => {
              inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${defCon.curFont}`);
            });
          }

          /* Fonts Face */

          const submitButton = qS(`#${defCon.id.submit} .${defCon.class.submit}`);
          saveChangeStatus(ffaceT, CONST.fontFace, submitButton, defCon.vals);

          /* Font Smooth */

          const smoothT = qS(`#${defCon.id.smooth}`);
          saveChangeStatus(smoothT, CONST.fontSmooth, submitButton, defCon.vals);

          /* FontSize Zoom */

          let drawZoom;
          const zoom = qS(`#${defCon.id.fontZoom}`);
          if (isFontsize) {
            try {
              drawZoom = document.querySelector(`#${defCon.id.zoomSize}`);
              zoom.value = Number(CONST.fontSize) === 1 ? "OFF" : Number(CONST.fontSize).toFixed(3);
              rangeSliderWidget(drawZoom, zoom, 3, true);
              checkDraw(zoom, drawZoom, /[0-9](\.[0-9]{1,3})?/, 3, true);
            } catch (e) {
              defCon.errors.push(`[FontSize Zoom]: ${e}`);
              error("\u27A4 FontSize Zoom:", e);
            } finally {
              saveChangeStatus(zoom, Number(CONST.fontSize), submitButton, defCon.vals, true);
            }
          }

          /* Fonts stroke */

          let drawStrock;
          const strock = qS(`#${defCon.id.strokeSize}`);
          try {
            drawStrock = document.querySelector(`#${defCon.id.stroke}`);
            strock.value = Number(CONST.fontStroke) === 0 ? "OFF" : Number(CONST.fontStroke).toFixed(3);
            rangeSliderWidget(drawStrock, strock, 3);
            checkDraw(strock, drawStrock, /[0-9](\.[0-9]{1,3})?/, 3);
          } catch (e) {
            defCon.errors.push(`[Fonts stroke]: ${e}`);
            error("\u27A4 Fonts stroke:", e);
          } finally {
            saveChangeStatus(strock, Number(CONST.fontStroke), submitButton, defCon.vals);
          }

          /* Fonts shadow */

          let drawShadow;
          const shadows = qS(`#${defCon.id.shadowSize}`);
          try {
            drawShadow = document.querySelector(`#${defCon.id.shadow}`);
            shadows.value = Number(CONST.fontShadow) === 0 ? "OFF" : Number(CONST.fontShadow).toFixed(2);
            qS(`#${defCon.id.shadowColor}`).style.display = shadows.value === "OFF" ? "none" : "flex";
            rangeSliderWidget(drawShadow, shadows, 2);
            checkDraw(shadows, drawShadow, /[0-9](\.[0-9]{1,2})?/, 2);
          } catch (e) {
            defCon.errors.push(`[Fonts shadow]: ${e}`);
            error("\u27A4 Fonts shadow:", e);
          } finally {
            saveChangeStatus(shadows, Number(CONST.fontShadow), submitButton, defCon.vals);
          }

          /* Fonts shadow color selection */

          let picker;
          const cpshow = qS(`#${defCon.id.cps}`);
          const cp = qS(`#${defCon.id.cpm}`);
          const colorshow = qS(`#${defCon.id.color}`);
          const colorReg = /^currentcolor$|^#([A-F0-9]{6})$/;
          try {
            picker = new ColorPicker({
              dom: cp,
              value: CONST.shadowColor,
              def: CONST.shadowColor,
            });
            debug("\u27A4 ColorPicker:", picker._lastValue);
            cpshow.addEventListener("click", e => {
              if (cp.style.display === "block") {
                cp.style.display = "none";
              } else {
                e.stopPropagation();
                cp.style.display = "block";
              }
            });
            cp.addEventListener(
              "click",
              e => {
                e.stopPropagation();
              },
              false
            );
            qS("body").addEventListener("click", () => {
              cp.style.display = "none";
            });
          } catch (e) {
            defCon.errors.push(`[Fonts shadowColor]: ${e}`);
            error("\u27A4 Fonts shadowColor:", e);
          } finally {
            saveChangeStatus(colorshow, CONST.shadowColor, submitButton, defCon.vals);
          }

          /* click to selectAll */

          document.querySelectorAll(`#${defCon.id.fontZoom},#${defCon.id.strokeSize},#${defCon.id.shadowSize},#${defCon.id.color}`).forEach(item => {
            item.addEventListener("click", function () {
              this.setSelectionRange(0, this.value.length);
              this.focus();
            });
          });

          /* Double-click allows you to edit */

          const fontExT = qS(`#${defCon.id.exclude}`);
          const fontCssT = qS(`#${defCon.id.cssfun}`);
          if (fontCssT) {
            fontCssT.addEventListener("dblclick", () => {
              fontCssT.setAttribute("class", `${defCon.class.notreadonly}`);
              fontCssT.title = "\u8bf7\u8c28\u614e\u4fee\u6539\u8be5\u53c2\u6570\uff01";
              fontCssT.readOnly = false;
            });
          }

          saveChangeStatus(fontCssT, CONST.fontCSS, submitButton, defCon.vals);
          saveChangeStatus(fontExT, CONST.fontEx, submitButton, defCon.vals);

          /* Expand & Collapse */

          expandORcollapse(qS(`#${defCon.id.cSwitch}`), fontCssT, qS(`#${defCon.id.fontCSS}`));
          expandORcollapse(qS(`#${defCon.id.eSwitch}`), fontExT, qS(`#${defCon.id.fontEx}`));

          /* Buttons control */

          qS(`#${defCon.id.submit} .${defCon.class.reset}`).addEventListener("click", async () => {
            let frDialog = new frDialogBox({
              trueButtonText: "重 置",
              falseButtonText: "恢 复",
              neutralButtonText: "取 消",
              messageText: `<p>『重置/恢复』将当前设置初始化为 <span style="color:slategray">程序默认的初始数据</span> 或 <span style="color:slategrey">上次正确保存的数据</span>。一般是在您错误配置参数且造成无法挽回的情况下才进行重置参数的操作。</p><p style="color:darkgreen">重置：重置当前数据为程序初始值，手动保存生效。</p><p style="color:darkred">恢复：替换为上次正确保存的数据，自动恢复预览。</p><p style="color:gray">取消：放弃重置操作。</p>`,
              titleText: "参数重置确认",
            });
            if (await frDialog.respond()) {
              CONST.fontSelect.split(",")[0] !== defValue.fontSelect.split(",")[0] ? fontSet().fresetList(fontData) : fontSet().fdeleteList(fontData);
              smoothT.checked !== defValue.fontSmooth ? smoothT.click() : debug("\u27A4 <fontSmooth> NOT MODIFIED");
              ffaceT.checked !== defValue.fontFace ? ffaceT.click() : debug("\u27A4 <fontFace> NOT MODIFIED");
              if (isFontsize) {
                zoom.value = Number(defValue.fontSize) === 1 ? "OFF" : Number(defValue.fontSize).toFixed(3);
                zoom._value_ = Number(defValue.fontSize);
                setSliderProperty(drawZoom, defValue.fontSize, 3);
                defCon.tZoom = Number(defValue.fontSize);
              }
              strock.value = Number(defValue.fontStroke) === 0 ? "OFF" : Number(defValue.fontStroke).toFixed(3);
              strock._value_ = Number(defValue.fontStroke);
              setSliderProperty(drawStrock, defValue.fontStroke, 3);
              shadows.value = Number(defValue.fontShadow) === 0 ? "OFF" : Number(defValue.fontShadow).toFixed(2);
              shadows._value_ = Number(defValue.fontShadow);
              setSliderProperty(drawShadow, defValue.fontShadow, 2);
              qS(`#${defCon.id.shadowColor}`).style.display = shadows.value === "OFF" ? "none" : "flex";
              picker.value = defValue.shadowColor;
              picker._value_ = picker.value;
              fontCssT.value = defValue.fontCSS;
              setEffectIntoSubmit(fontCssT.value, CONST.fontCSS, defCon.vals, fontCssT, submitButton);
              fontExT.value = defValue.fontEx;
              setEffectIntoSubmit(fontExT.value, CONST.fontEx, defCon.vals, fontExT, submitButton);
              const submit = qS(`#${defCon.id.submit} .${defCon.class.submit}[v-Preview="true"]`);
              submit ? submit.click() : debug("\u27A4 v-Preview is", submit);
            } else {
              fontSet().fdeleteList(fontData);
              smoothT.checked !== CONST.fontSmooth ? smoothT.click() : debug("\u27A4 <fontSmooth> NOT MODIFIED");
              ffaceT.checked !== CONST.fontFace ? ffaceT.click() : debug("\u27A4 <fontFace> NOT MODIFIED");
              if (isFontsize) {
                zoom.value = Number(CONST.fontSize) === 1 ? "OFF" : Number(CONST.fontSize).toFixed(3);
                zoom._value_ = Number(CONST.fontSize);
                setSliderProperty(drawZoom, CONST.fontSize, 3);
                defCon.tZoom = Number(CONST.fontSize);
              }
              strock.value = Number(CONST.fontStroke) === 0 ? "OFF" : Number(CONST.fontStroke).toFixed(3);
              strock._value_ = Number(CONST.fontStroke);
              setSliderProperty(drawStrock, CONST.fontStroke, 3);
              shadows.value = Number(CONST.fontShadow) === 0 ? "OFF" : Number(CONST.fontShadow).toFixed(2);
              shadows._value_ = Number(CONST.fontShadow);
              setSliderProperty(drawShadow, CONST.fontShadow, 2);
              qS(`#${defCon.id.shadowColor}`).style.display = shadows.value === "OFF" ? "none" : "flex";
              picker.value = CONST.shadowColor;
              picker._value_ = picker.value;
              fontCssT.value = CONST.fontCSS;
              setEffectIntoSubmit(fontCssT.value, CONST.fontCSS, defCon.vals, fontCssT, submitButton);
              fontExT.value = CONST.fontEx;
              setEffectIntoSubmit(fontExT.value, CONST.fontEx, defCon.vals, fontExT, submitButton);
              __preview__(defCon.preview);
              await getCurFont(ffaceT.checked, defCon.refont, defautlFont);
              autoZoomFontSize(`#${defCon.id.rndId}`, defCon.tZoom);
            }
            frDialog = null;
          });

          qS(`#${defCon.id.submit} .${defCon.class.submit}`).addEventListener("click", async function () {
            const fontlists = fontSet().fsearchList(`${defCon.id.fontName}`);
            const fontselect =
              fontlists.length > 0
                ? fontlists.indexOf("Microsoft YaHei") === 0
                  ? defValue.fontSelect
                  : String(singleQuoteStr(fontlists) + defValue.fontSelect).trim()
                : CONST.fontSelect;
            const fontface = ffaceT.checked;
            const smooth = smoothT.checked;
            const perfzoom = isFontsize ? (/[0-9]+(?:\.[0-9]{1,3})?/.test(zoom.value) ? Number(zoom.value) : Number(defValue.fontSize)) : 1;
            const fzoom = perfzoom < 0.8 ? 0.8 : perfzoom > 1.5 ? 1.5 : perfzoom;
            const fstrock = /[0-9]+(?:\.[0-9]{1,3})?/.test(strock.value) ? Number(strock.value) : strock.value === "OFF" ? 0 : Number(defValue.fontStroke);
            const fshadow = /[0-9]+(?:\.[0-9]{1,2})?/.test(shadows.value) ? Number(shadows.value) : shadows.value === "OFF" ? 0 : Number(defValue.fontShadow);
            const pickedcolor = colorshow.value;
            const fscolor = colorReg.test(pickedcolor) ? pickedcolor : defValue.shadowColor;
            const fcss = fontCssT.value;
            const cssfun = fcss ? fcss.replace(/"|`/g, "'") : defValue.fontCSS;
            const fex = fontExT.value;
            const fontex = fex ? fex.replace(/"|`/g, "'") : "";
            if (defCon.isPreview && this.getAttribute("v-Preview")) {
              try {
                const _bodyZoom = isFontsize
                  ? fzoom >= 0.8 && fzoom <= 1.5 && fzoom !== 1
                    ? `body{` +
                      String(
                        getBrowser.type("core").Gecko
                          ? `transform:scale(${fzoom});transform-origin:left top 0px;width:${100 / fzoom}%;height:${100 / fzoom}%;overflow-x:hidden;`
                          : `zoom:${fzoom}!important;`
                      ).trim() +
                      `}`
                    : ``
                  : ``;
                const _shadow =
                  fshadow > 0 && fshadow <= 8
                    ? `text-shadow:0 0 ${fshadow * 1.25}px ${toColordepth(fscolor, 1.5)},0 0 ${fshadow}px ${fscolor},0 0 ${fshadow / 4}px ${toColordepth(fscolor, 0.975, "dark")};`
                    : ``;
                const _stroke = fstrock > 0 && fstrock <= 1.0 ? `-webkit-text-stroke:${fstrock}px currentcolor;paint-order:stroke fill;` : ``;
                const _selection = stroke ? `::selection{color:#ffffff!important;background:#338fff!important}` : ``;
                const kernel_define = getBrowser.type("core").WebKit
                  ? "-webkit-font-smoothing:antialiased!important;-webkit-text-size-adjust:none;"
                  : getBrowser.type("core").Gecko
                  ? "-moz-text-size-adjust:none;"
                  : "";
                const _smoothing = smooth
                  ? `font-feature-settings:"liga" 0;font-variant:no-common-ligatures proportional-nums;font-optical-sizing:auto;font-stretch:normal;font-kerning:auto;${kernel_define}text-rendering:optimizeLegibility!important;`
                  : ``;
                const _fontfamily = fontface ? `font-family:${fontselect};` : ``;
                const _refont = fontselect.split(",")[0] ? fontselect.split(",")[0].replace(/"|'/g, "") : "";
                const _fontfaces = fontface
                  ? _refont.length
                    ? String(
                        `@font-face{font-family:"宋体";src:local("${_refont}")}@font-face{font-family:"SimSun";src:local("${_refont}")}@font-face{font-family:"新宋体";src:local("${_refont}")}@font-face{font-family:"NSimSun";src:local("${_refont}")}@font-face{font-family:"黑体";src:local("${_refont}")}@font-face{font-family:"SimHei";src:local("${_refont}")}@font-face{font-family:"Microsoft YaHei UI";src:local("${_refont}")}@font-face{font-family:"Microsoft JhengHei UI";src:local("${_refont}")}@font-face{font-family:"MingLiU";src:local("${_refont}")}@font-face{font-family:"MingLiU-ExtB";src:local("${_refont}")}@font-face{font-family:"PMingLiU";src:local("${_refont}")}@font-face{font-family:"PMingLiU-ExtB";src:local("${_refont}")}@font-face{font-family:Arial;src:local("${_refont}")}@font-face{font-family:Helvetica;src:local("${_refont}")}@font-face{font-family:"Georgia";src:local("${_refont}")}@font-face{font-family:"sans-serif";src:local("${_refont}")}@font-face{font-family:"MS Gothic";src:local("${_refont}")}@font-face{font-family:"MS PGothic";src:local("${_refont}")}@font-face{font-family:"MS UI Gothic";src:local("${_refont}")}@font-face{font-family:"Yu Gothic";src:local("${_refont}")}@font-face{font-family:"Yu Gothic UI";src:local("${_refont}")}@font-face{font-family:"Malgun Gothic";src:local("${_refont}")}`
                      ).trim()
                    : ``
                  : ``;
                let _codeFont = "";
                const _exclude = fontex ? `${filterHtml(fontex)}{-webkit-text-stroke:initial!important;text-shadow:initial!important}` : "";
                if (fontex) {
                  if (fontex.search(/\bpre\b|\bcode\b/gi) !== -1) {
                    const pre = fontex.search(/\bpre\b/gi) > -1 ? ["pre", "pre *"] : [];
                    const code = fontex.search(/\bcode\b/gi) > -1 ? ["code", "code *"] : [];
                    const precode = pre.concat(code);
                    _codeFont = `${precode.toString()}{font:normal 400 14px/150% 'Operator Mono Lig','Fira Code','Roboto Mono',Monaco,monospace,Consolas!important;font-feature-settings:"liga" 0,"zero"!important;}`;
                  }
                }
                const tshadow = `${_bodyZoom}${_codeFont}${_selection}${filterHtml(cssfun)}{${_shadow}${_stroke}${_smoothing}${_fontfamily}}${_fontfaces}${_exclude}`;
                const _tshadow = `@charset "UTF-8";${tshadow}`;
                defCon.tZoom = fzoom;
                this.innerText = "\u4fdd\u5b58";
                this.removeAttribute("style");
                this.removeAttribute("v-Preview");
                __preview__(defCon.isPreview, _tshadow, false);
                await getCurFont(fontface, _refont, defautlFont);
                autoZoomFontSize(`#${defCon.id.rndId}`, fzoom);
              } catch (e) {
                defCon.errors.push(`[submitPreview]: ${e}`);
                reportErrortoAuthor(defCon.errors);
                error("\u27A4 submitPreview:", e);
              }
            } else {
              try {
                let frDialog = new frDialogBox({
                  trueButtonText: "保存到全局数据",
                  falseButtonText: "保存到网站数据",
                  neutralButtonText: "取 消",
                  messageText: `<p style="color:darkgreen;font-weight:900">保存到全局数据：</p><p>将当前设置保存为全局设置，默认使用全局参数。</p><p style="color:darkred;font-weight:900">保存到当前网站数据：<span id="${defCon.id.seed}_a_w_d_l_">[<span style="font-size:12px!important;font-weight:normal;padding:0 2px;margin:0;cursor:pointer;color:#3e3e3e">全部数据列表</span>]</span></p><p style="height:22px"><span title="保存到网站数据会自动覆盖之前的数据" style="cursor:help;color:indigo" id="${defCon.id.seed}_c_w_d_">为 ${curHostname} 保存独立的设置数据。</span>`,
                  titleText: "保存设置数据",
                });
                domains = await GMgetValue("_domains_fonts_set_");
                domainValue = domains ? JSON.parse(defCon.decrypt(domains)) : defaultArray;
                const _awdl = qS(`#${defCon.id.seed}_a_w_d_l_`);
                if (_awdl) {
                  if (domainValue.length > 0) {
                    _awdl.style.cssText += "display:line-block";
                  } else {
                    _awdl.style.cssText += "display:none";
                  }
                  _awdl.addEventListener("click", async () => {
                    closeAllDialog(`#${defCon.id.dialogbox}`);
                    manageDomainList();
                  });
                }
                domains = await GMgetValue("_domains_fonts_set_");
                domainValue = domains ? JSON.parse(defCon.decrypt(domains)) : defaultArray;
                domainValueIndex = update_domain_index(domainValue);
                if (domainValueIndex !== undefined && qS(`#${defCon.id.seed}_c_w_d_`)) {
                  const fontDate = dateFormat("YYYY-mm-dd HH:MM:SS", new Date(domainValue[domainValueIndex].fontDate));
                  qS(`#${defCon.id.seed}_c_w_d_`).innerHTML = String(
                    `<p style="color:indigo;height:22px">上次保存：${fontDate} <button id="${defCon.id.seed}_c_w_d_d_" style="box-sizing:border-box;padding:3px 5px;margin-left:15px;cursor:pointer;color:#333;font-size:12px!important;font-weight:normal;border:1px solid #777;border-radius:4px;height:max-contant;min-height:30px;background-color:#eee;letter-spacing:normal" title="删除数据后将刷新页面">删除当前网站数据</button></p>`
                  ).trim();
                  qS(`#${defCon.id.seed}_c_w_d_d_`).addEventListener("click", async () => {
                    domainValue.splice(domainValueIndex, 1);
                    GMsetValue("_domains_fonts_set_", defCon.encrypt(JSON.stringify(domainValue)));
                    cache.remove("_fontlist_");
                    closeAllDialog(`#${defCon.id.dialogbox}`);
                    let frDialog = new frDialogBox({
                      trueButtonText: "感谢使用",
                      messageText: `<p style="color:darkred">时间戳${fontDate}的数据已成功删除！</p><p>当前页面将在您确认后自动刷新。</p>`,
                      titleText: "个性化数据删除",
                    });
                    closeConfigurePage(true);
                    if (await frDialog.respond()) {
                      closeAllDialog(`#${defCon.id.dialogbox}`);
                      location.reload();
                    }
                    frDialog = null;
                  });
                }
                defCon.fontlistchanged = fontselect.split(",")[0] !== CONST.fontSelect.split(",")[0];
                if (await frDialog.respond()) {
                  saveDate("_fonts_set_", {
                    fontSelect: filterHtml(fontselect),
                    fontFace: Boolean(fontface),
                    fontSize: Number(fzoom),
                    fontStroke: Number(fstrock),
                    fontShadow: Number(fshadow),
                    shadowColor: filterHtml(fscolor),
                    fontSmooth: Boolean(smooth),
                    fontCSS: filterHtml(cssfun),
                    fontEx: filterHtml(fontex),
                  });
                  defCon.successId = true;
                } else {
                  const _savedata_ = {
                    domain: curHostname,
                    fontDate: Date.now(),
                    fontSelect: filterHtml(fontselect),
                    fontFace: Boolean(fontface),
                    fontSize: Number(fzoom),
                    fontStroke: Number(fstrock),
                    fontShadow: Number(fshadow),
                    shadowColor: filterHtml(fscolor),
                    fontSmooth: Boolean(smooth),
                    fontCSS: filterHtml(cssfun),
                    fontEx: filterHtml(fontex),
                  };
                  domains = await GMgetValue("_domains_fonts_set_");
                  domainValue = domains ? JSON.parse(defCon.decrypt(domains)) : defaultArray;
                  domainValueIndex = update_domain_index(domainValue);
                  if (domainValueIndex !== undefined) {
                    domainValue.splice(domainValueIndex, 1, _savedata_);
                  } else {
                    domainValue.push(_savedata_);
                  }
                  if (domainValue.length <= maxPersonalSites || domainValueIndex !== undefined) {
                    GMsetValue("_domains_fonts_set_", defCon.encrypt(JSON.stringify(domainValue)));
                    defCon.successId = true;
                  } else {
                    let frDialog = new frDialogBox({
                      trueButtonText: "依然保存",
                      falseButtonText: "管理列表",
                      neutralButtonText: "我放弃",
                      messageText: `<p style="color:darkgreen">您已经保存超过<span style="font-size:20px;font-weight:700;font-style:italic;color:crimson">${maxPersonalSites} </span>个网站的个性化数据了，过多的数据会使脚本运行速度过慢，进而会影响您浏览网页的响应速度，建议您及时删除一些平时访问较少的站点设置，然后再进行新网站设置的数据保存。</p><p style="color:crimson">您确认要继续保存吗？</p>`,
                      titleText: "数据过多的提示",
                    });
                    if (await frDialog.respond()) {
                      GMsetValue("_domains_fonts_set_", defCon.encrypt(JSON.stringify(domainValue)));
                      defCon.successId = true;
                    } else {
                      manageDomainList();
                      defCon.successId = false;
                    }
                    frDialog = null;
                  }
                }
                frDialog = null;
              } catch (e) {
                defCon.errors.push(`[saveDate]: ${e}`);
                reportErrortoAuthor(defCon.errors, true);
                error("\u27A4 saveDate:", e);
                defCon.successId = false;
              } finally {
                if (defCon.successId) {
                  closeAllDialog(`#${defCon.id.dialogbox}`);
                  let frDialog = new frDialogBox({
                    trueButtonText: "感谢使用",
                    messageText: `<p style="color:darkgreen">您设置的参数已保存！</p><p>当前页面将在您确认后自动刷新。</p>`,
                    titleText: "数据保存完毕",
                  });
                  if (defCon.fontlistchanged) {
                    cache.remove("_fontlist_");
                  }
                  closeConfigurePage(true);
                  if (await frDialog.respond()) {
                    frDialog = null;
                    location.reload();
                  }
                }
              }
            }
          });

          backupData(isBackupFunction, defaultArray);

          qS(`#${defCon.id.submit} .${defCon.class.cancel}`).addEventListener("click", () => {
            closeConfigurePage(false);
          });
        }
      } catch (e) {
        defCon.errors.push(`[operationConfigure]: ${e}`);
        error("\u27A4 operationConfigure:", e);
      }
    }

    function closeConfigurePage(isReload) {
      if (qS(`#${defCon.id.rndId}`)) {
        qS(`#${defCon.id.container}`).style.opacity = 0;
        setTimeout(() => {
          qS(`#${defCon.id.rndId}`).remove();
        }, 500);
        if (getBrowser.type("core").Gecko && defCon.configurePage) {
          document.removeEventListener("scroll", defCon.configurePage);
          delete defCon.configurePage;
        }
        if (!isReload) {
          if (defCon.preview) {
            __preview__(defCon.isPreview);
            defCon.tZoom = CONST.fontSize;
          }
          closeAllDialog(`#${defCon.id.dialogbox}`);
        }
      }
    }

    async function getCurFont(_isfontface_, refont, def) {
      const inputFont = qS(`#${defCon.id.fontList} .${defCon.class.selectFontId} input`);
      reFontFace = def;
      defCon.curFont = def;
      if (_isfontface_) {
        const cfl = await GMgetValue("_Custom_fontlist_");
        const cusFontCheck = cfl ? JSON.parse(defCon.decrypt(cfl)) : defaultArray;
        fontCheck = unique([...fontCheck, ...cusFontCheck]);
        fontCheck.forEach(item => {
          if (item.en === refont || convert2Unicode(item.ch) === refont) {
            defCon.curFont = refont.includes("\\") ? "" : " (" + item.en + ")";
            reFontFace = item.ch + defCon.curFont;
            defCon.curFont = item.ch;
          }
        });
      }
      if (inputFont) {
        inputFont.setAttribute("placeholder", `\u5f53\u524d\u5b57\u4f53\uff1a${defCon.curFont}`);
      }
    }

    function backupData(convertejsondatatosqlite, def) {
      const backupT = qS(`#${defCon.id.backup}`);
      if (convertejsondatatosqlite && backupT) {
        backupT.style.display = "inline-block";
        backupT.addEventListener("click", async () => {
          try {
            let frDialog = new frDialogBox({
              trueButtonText: "备 份",
              falseButtonText: "还 原",
              neutralButtonText: "取 消",
              messageText: `<p style="color:darkgreen;font-weight:900">备份到本地文件：</p><p>备份到本地，自动下载 backup.*.sqlitedb 文件。</p><p style="color:darkred;font-weight:900">从本地文件还原：</p><p><span style="cursor:pointer;color:indigo" id="${defCon.id.tfiles}">\ud83d\udc49\u0020[点击这里载入*.sqlitedb备份文件]</span><input accept=".sqlitedb" type="file" id="${defCon.id.files}"/></p>`,
              titleText: "备份与还原数据",
            });
            const tfs = qS(`#${defCon.id.tfiles}`);
            const fs = qS(`#${defCon.id.files}`);
            if (tfs && fs) {
              tfs.addEventListener("click", () => {
                fs.click();
              });
              fs.addEventListener("change", () => {
                tfs.innerHTML = `<em style="color:indigo;font-size:12px!important">${fs.files[0].name}</em>\u0020\ud83d\udc49<span style="color:crimson">[重新选择]</span>`;
              });
            }
            if (await frDialog.respond()) {
              const _fonts_set_ = await GMgetValue("_fonts_set_");
              const _Exclude_site_ = await GMgetValue("_Exclude_site_");
              const _domains_fonts_set_ = await GMgetValue("_domains_fonts_set_");
              const _domains_fonts_set__ = _domains_fonts_set_ ? _domains_fonts_set_ : defCon.encrypt(JSON.stringify(def));
              const _Custom_fontlist_ = await GMgetValue("_Custom_fontlist_");
              const _Custom_fontlist__ = _Custom_fontlist_ ? _Custom_fontlist_ : defCon.encrypt(JSON.stringify(def));
              const _configure_ = await GMgetValue("_configure_");
              const db_R = "QXV0aGVyJUUyJTlBJUExRjl5NG5nJUYwJTlGJTkyJTk2JTQw".concat(defCon.encrypt(defCon.scriptName));
              const db_0 = defCon.encrypt(new Date());
              const db_1 = _fonts_set_;
              const db_2 = _Exclude_site_;
              const db_3 = _domains_fonts_set__;
              const db_4 = _Custom_fontlist__;
              const db_5 = _configure_;
              const db = { db_R, db_0, db_1, db_2, db_3, db_4, db_5 };
              const timeStamp = dateFormat("YYYYmmddHHMMSS", new Date());
              const via = `.${getBrowser.type("browser").toLowerCase()}`;
              dataDownload(`backup.${timeStamp}${via}.sqlitedb`, defCon.sqliteDB(JSON.stringify(db), true, root));
              let frDialog = new frDialogBox({
                trueButtonText: "确 定",
                messageText: `<p style="color:darkgreen">备份数据已归档，备份文件导出下载中……</p><p>文件名：<span style="color:darkred;font-size:12px!important">backup.${timeStamp}${via}.sqlitedb</span></p>`,
                titleText: "数据备份",
              });
              if (await frDialog.respond()) {
                frDialog = null;
              }
            } else {
              try {
                const thatFile = fs.files[0];
                debug(`\u27A4 backupData:`, thatFile.name, thatFile.size);
                let reader = new FileReader();
                reader.readAsText(thatFile);
                reader.onload = async function () {
                  try {
                    const _file_ = defCon.decrypt(this.result);
                    const _rs = JSON.parse(defCon.sqliteDB(_file_, false, root));
                    const _data_R = defCon.decrypt(_rs.db_R);
                    const _data_0 = defCon.decrypt(_rs.db_0);
                    const _data_1 = JSON.parse(defCon.decrypt(_rs.db_1));
                    const _data_2 = JSON.parse(defCon.decrypt(_rs.db_2));
                    const _data_3 = _rs.db_3 ? JSON.parse(defCon.decrypt(_rs.db_3)) : def;
                    const _data_4 = _rs.db_4 ? JSON.parse(defCon.decrypt(_rs.db_4)) : def;
                    const _data_5 = _rs.db_5 ? JSON.parse(defCon.decrypt(_rs.db_5)) : undefined;
                    if (!isNaN(Date.parse(_data_0)) && new Date(_data_0) <= new Date() && _data_R.includes(defCon.scriptAuthor)) {
                      GMsetValue("_fonts_set_", defCon.encrypt(JSON.stringify(_data_1)));
                      GMsetValue("_Exclude_site_", defCon.encrypt(JSON.stringify(_data_2)));
                      GMsetValue("_domains_fonts_set_", defCon.encrypt(JSON.stringify(_data_3)));
                      GMsetValue("_Custom_fontlist_", defCon.encrypt(JSON.stringify(_data_4)));
                      if (_data_5) {
                        _data_5.curVersion = defCon.curVersion;
                        _data_5.rebuild = undefined;
                        GMsetValue("_configure_", defCon.encrypt(JSON.stringify(_data_5)));
                      } else {
                        debug("\u27A4 no configure data");
                      }
                      let frDialog = new frDialogBox({
                        trueButtonText: "确 定",
                        messageText: `<p style="color:darkgreen">本地备份数据还原完毕！</p><p>当前页面将在您确认后自动刷新。</p>`,
                        titleText: "数据还原成功",
                      });
                      closeConfigurePage(true);
                      if (await frDialog.respond()) {
                        frDialog = null;
                        location.reload();
                      }
                    } else {
                      throw new Error("Invalid Date Error");
                    }
                  } catch (e) {
                    error("\u27A4 FileReader.onload:", e.name);
                    let frDialog = new frDialogBox({
                      trueButtonText: "确 定",
                      messageText: `<p style="color:red">数据校验错误，请选择正确的本地备份文件！</p>`,
                      titleText: "数据文件错误",
                    });
                    if (await frDialog.respond()) {
                      frDialog = null;
                      qS(`#${defCon.id.backup}`).click();
                    }
                  }
                };
              } catch (e) {
                error("\u27A4 thatFile:", e.name);
                let frDialog = new frDialogBox({
                  trueButtonText: "确 定",
                  messageText: `<p style="color:indigo">载入文件为空，请选择要还原的备份文件！</p>`,
                  titleText: "没有文件载入",
                });
                if (await frDialog.respond()) {
                  frDialog = null;
                  qS(`#${defCon.id.backup}`).click();
                }
              }
            }
            frDialog = null;
          } catch (e) {
            defCon.errors.push(`[backupData]: ${e}`);
            reportErrortoAuthor(defCon.errors);
            error("\u27A4 backupData:", e);
          }
        });
      }
    }

    function copyToClipboard(text) {
      const handler = event => {
        event.clipboardData.setData("text/plain", text);
        event.preventDefault();
        document.removeEventListener("copy", handler, true);
      };
      document.addEventListener("copy", handler, true);
      document.execCommand("copy");
    }

    function expandORcollapse(a, b, c) {
      if (a && b && c) {
        const at = a.attributes["data-switch"];
        a.addEventListener("click", () => {
          if (at.value === "ON") {
            b.style = "display:none";
            a.textContent = "\u2228";
            c.style.cssText += `height:35px;min-height:35px`;
            at.value = "OFF";
          } else {
            b.style = "display:block";
            a.textContent = "\u2227";
            c.style.cssText += `height:110px;min-height:110px`;
            at.value = "ON";
          }
        });
      }
    }

    function rangeSliderWidget(linstener, target, m, g = false) {
      linstener.addEventListener("input", function () {
        setSliderProperty(this, this.value, m);
        target.value = g ? (Number(this.value) === 1 ? "OFF" : Number(this.value).toFixed(m)) : Number(this.value) === 0 ? "OFF" : Number(this.value).toFixed(m);
        target._value_ = Number(this.value).toFixed(m);
        if (linstener.id === defCon.id.shadow) {
          qS(`#${defCon.id.shadowColor}`).style.display = target.value === "OFF" ? "none" : "flex";
        }
      });
    }

    function saveChangeStatus(t, e, d, v, g = false) {
      try {
        if (t && d) {
          if (t.type !== "text") {
            const method = t.type === "textarea" ? "input" : "change";
            t.addEventListener(method, () => {
              const value = t.type === "checkbox" ? t.checked : t.value;
              setEffectIntoSubmit(value, e, v, t, d);
            });
          } else {
            Object.defineProperty(t, "_value_", {
              enumerable: true,
              configurable: true,
              get: function () {
                return this._value_;
              },
              set: newVal => {
                setEffectIntoSubmit(newVal, e, v, t, d, g);
              },
            });
          }
        }
      } catch (err) {
        defCon.errors.push(`[saveChangeStatus]: ${err}`);
        error("\u27A4 saveChangeStatus:", err);
      }
    }

    function setEffectIntoSubmit(value, e, v, t, d, h = false) {
      try {
        const _value = t.attributes.v !== undefined ? (value === "OFF" ? (h ? 1 : 0) : Number(value)) : value;
        if (_value !== e) {
          !v.includes(t.id) ? v.push(t.id) : debug(`\u27A4 ID["${t.id}"] already exists`);
          if (defCon.isPreview) {
            d.innerText = "\u9884\u89c8";
            d.setAttribute("style", "background-color:coral!important;border-color:coral!important");
            d.setAttribute("v-Preview", "true");
          }
        } else {
          for (let i = v.length - 1; i >= 0; i--) {
            if (v[i] === t.id) {
              v.splice(i, 1);
              break;
            }
          }
        }
        defCon.vals = v;
        debug("\u27A4 Changed Elements", defCon.vals);
        if (defCon.vals.length > 0) {
          if (!d.classList.contains(`${defCon.class.anim}`)) {
            d.classList.add(`${defCon.class.anim}`);
          }
          if (!defCon.vals.includes(t.id) && defCon.isPreview) {
            d.innerText = "\u9884\u89c8";
            d.setAttribute("style", "background-color:coral!important;border-color:coral!important");
            d.setAttribute("v-Preview", "true");
          }
        } else {
          if (d.classList.contains(`${defCon.class.anim}`)) {
            d.classList.remove(`${defCon.class.anim}`);
          }
          if (defCon.isPreview) {
            d.innerText = "\u4fdd\u5b58";
            d.removeAttribute("style");
            d.removeAttribute("v-Preview");
            __preview__(defCon.preview);
            defCon.tZoom = CONST.fontSize;
            autoZoomFontSize(`#${defCon.id.rndId}`, CONST.fontSize);
          }
        }
      } catch (err) {
        error("\u27A4 setEffectIntoSubmit:", err);
      }
    }

    async function manageDomainList(_temp_ = [], Contents = "") {
      let domains, domainValue, domainValueIndex;
      try {
        domains = await GMgetValue("_domains_fonts_set_");
        domainValue = domains ? JSON.parse(defCon.decrypt(domains)) : defaultArray;
        const _data_search_ =
          domainValue.length > 6
            ? `<p style="display:flex;justify-content:left;align-items:center"><input id="${defCon.id.seed}_d_s_" style="box-sizing:content-box;width:50%;height:22px;font:normal 16px/1.5 monospace,sans-serif!important;border:2px solid #777;border-radius:4px;margin:4px 6px;padding:2px 15px"><button id="${defCon.id.seed}_d_s_s_" style="box-sizing:border-box;background:#eee;color:#333!important;vertical-align:initial;padding:3px 10px;margin:0;cursor:pointer;font-size:12px!important;font-weight:normal;border:1px solid #777;border-radius:4px;min-width:60px;min-height:30px;letter-spacing:normal">查 询</button><button id="${defCon.id.seed}_d_s_c_" style="box-sizing:border-box;background:#eee;color:#333!important;vertical-align:initial;margin:0 0 0 4px;padding:3px 10px;cursor:pointer;font-size:12px!important;font-weight:normal;border:1px solid #777;border-radius:4px;min-width:60px;min-height:30px;letter-spacing:normal">清 除</button></p>`
            : ``;
        for (let i = 0; i < domainValue.length; i++) {
          Contents += String(
            `<li id="${defCon.id.seed}_d_d_l_${i}"
              style="margin:0;padding:5px;list-style:none;user-select:text!important;font:normal 400 14px/140% 'Microsoft YaHei',system-ui,-apple-system!important;color:#555;display:flex;justify-content:space-between;white-space:nowrap">
              <span>
                [<a id="${defCon.id.seed}_d_d_l_s_${i}" style="display:inline;padding:2px;cursor:pointer;color:crimson;font-size:14px!important">删除</a>]
                <span>${i + 1 > 9 ? i + 1 : "0".concat(i + 1)}.</span>
              </span>
              <span style="font-weight:900;margin-left:5px">${filterHtml(domainValue[i].domain)}</span>
              <span style="margin:0 5px">${dateFormat("YYYY/mm/dd HH:MM:SS", new Date(domainValue[i].fontDate))}</span>
            </li>`
          ).trim();
        }
        let frDialog = new frDialogBox({
          trueButtonText: "确认操作，保存数据",
          neutralButtonText: "取 消",
          messageText: `<p style="font-size:14px!important;color:darkred">请谨慎操作，保存后生效，已删除的数据将不可恢复！</p>${_data_search_}<ul id="${defCon.id.seed}_d_d_" style="margin:0!important;padding:0!important;list-style:none!important;max-height:190px;overflow-x:hidden">${Contents}</ul>`,
          titleText: "网站个性化设置数据列表：",
        });
        const items = document.querySelectorAll(`#${defCon.id.seed}_d_d_ li span>a[id^="${defCon.id.seed}_d_d_l_s_"]`);
        if (qS(`#${defCon.id.seed}_d_s_`) && qS(`#${defCon.id.seed}_d_s_c_`) && qS(`#${defCon.id.seed}_d_s_s_`)) {
          qS(`#${defCon.id.seed}_d_s_`).addEventListener("keydown", e => {
            const event = e || window.event;
            if (event.keyCode === 13) {
              qS(`#${defCon.id.seed}_d_s_s_`).click();
            }
          });
          qS(`#${defCon.id.seed}_d_s_`).addEventListener("input", () => {
            qS(`#${defCon.id.seed}_d_s_`).value = qS(`#${defCon.id.seed}_d_s_`).value.replace(/[^a-z0-9.-]/gi, "");
          });
          qS(`#${defCon.id.seed}_d_s_c_`).addEventListener("click", () => {
            qS(`#${defCon.id.seed}_d_s_`).value = "";
            qS(`#${defCon.id.seed}_d_s_`).style.cssText += "border-color:#777";
            qS(`#${defCon.id.seed}_d_d_`).scrollTop = 0;
            qS(`#${defCon.id.seed}_d_s_`).focus();
          });
          qS(`#${defCon.id.seed}_d_d_`).addEventListener("click", () => {
            qS(`#${defCon.id.seed}_d_s_`).focus();
          });
          qS(`#${defCon.id.seed}_d_s_s_`).addEventListener("click", () => {
            if (qS(`#${defCon.id.seed}_d_s_`).value) {
              if (window.find) {
                qS(`#${defCon.id.seed}_d_s_`).style.cssText += window.find(qS(`#${defCon.id.seed}_d_s_`).value, 0) ? "border-color:#777" : "border-color:red";
                if (window.getSelection) {
                  const _sTxt = window.getSelection();
                  const _rows = Number(_sTxt.anchorNode.parentNode.parentNode.id.replace(`${defCon.id.seed}_d_d_l_`, ""));
                  const _offsetHeight = Number(_sTxt.anchorNode.parentNode.parentNode.offsetHeight);
                  qS(`#${defCon.id.seed}_d_d_`).scrollTop = _rows * _offsetHeight;
                }
              }
            }
          });
        }
        for (let j = 0; j < items.length; j++) {
          items[j].addEventListener(
            "click",
            function (a, b) {
              if (!this.getAttribute("data-del")) {
                const _list_Id_ = Number(this.id.replace(`${defCon.id.seed}_d_d_l_s_`, ""));
                a.push(b[_list_Id_].domain);
                this.setAttribute("data-del", b[_list_Id_].domain);
                this.innerHTML = "恢复";
                this.style.cssText += "color:green";
                this.parentNode.nextElementSibling.style.cssText += "text-decoration:line-through;font-style:italic";
                this.parentNode.nextElementSibling.nextElementSibling.style.cssText += "text-decoration:line-through;font-style:italic";
              } else {
                a.splice(a.indexOf(this.getAttribute("data-del")), 1);
                this.removeAttribute("data-del");
                this.innerHTML = "删除";
                this.style.cssText += "color:crimson";
                this.parentNode.nextElementSibling.style.cssText += "text-decoration:none;font-style:normal";
                this.parentNode.nextElementSibling.nextElementSibling.style.cssText += "text-decoration:none;font-style:normal";
              }
            }.bind(items[j], _temp_, domainValue)
          );
        }
        if (await frDialog.respond()) {
          for (let l = _temp_.length - 1; l >= 0; l--) {
            domains = await GMgetValue("_domains_fonts_set_");
            domainValue = domains ? JSON.parse(defCon.decrypt(domains)) : defaultArray;
            domainValueIndex = update_domain_index(domainValue, _temp_[l]);
            domainValue.splice(domainValueIndex, 1);
            GMsetValue("_domains_fonts_set_", defCon.encrypt(JSON.stringify(domainValue)));
            if (_temp_[l] === curHostname) {
              defCon.equal = true;
              continue;
            }
          }
          let frDialog = new frDialogBox({
            trueButtonText: "感谢使用",
            messageText: String(
              `<p style="color:darkgreen">网站个性化设置数据已保存！${defCon.equal ? "</p><p>当前页面将在您确认后自动刷新。" : "</p><p>确认后您可以在当前页面继续其他操作。"}</p>`
            ).trim(),
            titleText: "数据保存完毕",
          });
          if (await frDialog.respond()) {
            closeAllDialog(`#${defCon.id.dialogbox}`);
            frDialog = null;
            if (defCon.equal) {
              cache.remove("_fontlist_");
              closeConfigurePage(true);
              location.reload();
            }
          }
        }
        frDialog = null;
      } catch (e) {
        defCon.errors.push(`[manageDomainList]: ${e}`);
        reportErrortoAuthor(defCon.errors);
        error("\u27A4 manageDomainList:", e);
      }
    }

    async function reportErrortoAuthor(e, show = isdebug, errors = "") {
      if (show) {
        closeConfigurePage(false);
        setTimeout(async () => {
          try {
            if (!document.querySelector("fr-dialogbox[error='true']")) {
              const br = e.length > 1 ? "\u3000<br/>" : "";
              for (let i in e) {
                errors += e[i] + br;
              }
              let frDialog = new frDialogBox({
                trueButtonText: "反馈问题",
                messageText: String(
                  `<p style="font-size:14px!important;color:crimson">脚本在运行过程中发生了重大异常或错误，请及时告知作者，感谢您的反馈！以下信息会自动保存至您的剪切板：</p>
                  <p><ul id="${defCon.id.seed}_copy_to_author" style="list-style-position:outside;margin:0!important;padding:0!important;max-height:300px;overflow-y:auto">
                    <li>浏览器信息：${getBrowser.type()}\u3000</li>
                    <li>脚本扩展信息：${handlerInfo} ${GMversion}\u3000</li>
                    <li>脚本版本信息：${defCon.curVersion}\u3000</li>
                    <li>当前访问域名：${curHostname}\u3000</li>
                    <li>错误信息：<span style="color:tan">${errors}</span></li>
                  </ul></p>`
                ).trim(),
                titleText: defCon.scriptName + "错误报告",
              });
              frDialog.container.setAttribute("error", true);
              const copyText = qS(`#${defCon.id.seed}_copy_to_author`).innerText.replace(/\u3000/g, "\n");
              defCon.errors.length = 0;
              if (await frDialog.respond()) {
                copyToClipboard(copyText);
                closeAllDialog(`#${defCon.id.dialogbox}`);
                GMopenInTab(feedback, defCon.options);
              }
              frDialog = null;
            }
          } catch (e) {
            error("\u27A4 reportError:", e);
          }
        }, Math.round(2e3 * Math.random()));
      }
    }

    function dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString(),
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
        }
      }
      return fmt;
    }

    function autoZoomFontSize(target, zoom, curZoom) {
      try {
        if (getBrowser.type("core").Gecko) {
          curZoom = zoom || 1;
          if (curZoom !== 1) {
            qS(target).style.transformOrigin = "left top";
            qS(target).style.transform = "scale(" + 1 / curZoom + ")";
            qS(target).style.width = document.documentElement.clientWidth + "px";
            qS(target).style.height = document.documentElement.clientHeight + "px";
            scrollInsteadFixed(qS(target), curZoom, "configurePage");
          } else {
            if (defCon.configurePage) {
              document.removeEventListener("scroll", defCon.configurePage);
              delete defCon.configurePage;
            }
            qS(target).removeAttribute("style");
          }
        } else {
          curZoom = Number(window.getComputedStyle(document.body, null).getPropertyValue("zoom")) || zoom || 1;
          if (curZoom !== 1) {
            qS(target).style.cssText += "zoom:" + Number(1 / curZoom);
          } else {
            qS(target).removeAttribute("style");
          }
        }
      } catch (e) {
        defCon.errors.push(`[autoZoomFontSize]: ${e}`);
        error("\u27A4 autoZoomFontSize:", e);
      } finally {
        if (curZoom !== 1) {
          debug(
            "\u27A4 FontSize Zoom: save[%s%] current[%c%s% %c%s%]",
            (CONST.fontSize * 100).toFixed(2),
            "color:teal",
            (curZoom * 100).toFixed(2),
            "color:indigo",
            ((1 / curZoom) * 100).toFixed(2)
          );
        }
      }
    }

    function filteToCDB(str, tmp = "") {
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) === 12288) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
          continue;
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
          tmp += String.fromCharCode(str.charCodeAt(i));
        }
      }
      return tmp;
    }

    function filterHtml(html) {
      html = html.replace(/expression|\\u|`|{|}/gi, "");
      const _tmp = document.createElement("div");
      _tmp.innerHTML = html;
      html = _tmp.textContent.trim() || _tmp.innerText.trim() || "";
      while (html.substr(html.length - 1, 1) === ",") {
        html = html.substr(0, html.length - 1).trim();
      }
      return html;
    }

    function singleQuoteStr(str) {
      let returnStr = "";
      const strs = str.toString().split(",");
      for (let s = 0; s < strs.length; s++) {
        if (strs[s] !== "Microsoft YaHei") {
          returnStr += `'${strs[s]}',`;
        }
      }
      return returnStr;
    }

    function saveDate(key, { ...Options }) {
      const obj = { ...Options };
      try {
        GMsetValue(key, defCon.encrypt(JSON.stringify(obj)));
      } catch (e) {
        error("\u27A4 saveDate:", e);
      }
    }
  })();
})();
