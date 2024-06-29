"use strict";var t,e,i,r,n,o=require("chrome-remote-interface"),s=require("stream"),a=require("http");function u(t,e,i,r){return new(i||(i=Promise))((function(n,o){function s(t){try{u(r.next(t))}catch(t){o(t)}}function a(t){try{u(r.throw(t))}catch(t){o(t)}}function u(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(s,a)}u((r=r.apply(t,e||[])).next())}))}function l(t,e,i,r){if("a"===i&&!r)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!r:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===i?r:"a"===i?r.call(t):r?r.value:e.get(t)}function c(t,e,i,r,n){if("m"===r)throw new TypeError("Private method is not writable");if("a"===r&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===r?n.call(t,i):n?n.value=i:e.set(t,i),i}"function"==typeof SuppressedError&&SuppressedError;class h extends Error{constructor(t){super(t)}}class d{constructor(t,e,i,r=null,n=null,o=void 0,s=null,a=null,u="",l="",c=void 0,h=!1){this._this=t,this.typeName=e,this.func=i,this.functionName=r,this.methodName=n,this.fileName=o,this.lineNumber=s,this.columnNumber=a,this.sourceURL=u,this.scriptHash=l,this.evalOrigion=c,this.isEvalInvokation=h}getThis(){return this._this}getTypeName(){return this.typeName}getFunction(){return this.func}getFunctionName(){return this.functionName}getMethodName(){return this.methodName}getFileName(){return this.fileName}getLineNumber(){return this.lineNumber}getColumnNumber(){return this.columnNumber}getEvalOrigin(){return this.evalOrigion}isToplevel(){return this._this===global}isEval(){return this.isEvalInvokation}isNative(){return!1}isConstructor(){return!1}isAsync(){return!1}isPromiseAll(){return!1}getPromiseIndex(){return-1}getScriptNameOrSourceURL(){return this.sourceURL}getScriptHash(){return this.scriptHash}getEnclosingColumnNumber(){var t;return null!==(t=this.columnNumber)&&void 0!==t?t:-1}getEnclosingLineNumber(){var t;return null!==(t=this.lineNumber)&&void 0!==t?t:-1}getPosition(){return-1}toString(){return`at ${this.functionName} - line ${this.lineNumber} on column ${this.columnNumber}`}}class v extends Error{static mapToCallSite(t){return t.callFrames.map((t=>new d(void 0,"",void 0,t.functionName,null,void 0,t.lineNumber,t.columnNumber,t.url,t.scriptId)))}constructor(t){super(t.text),this.error=t}printEvalStackTrace(){var t;if(!this.error.stackTrace)return;const e=v.mapToCallSite(this.error.stackTrace);return null===(t=Error.prepareStackTrace)||void 0===t?void 0:t.call(Error,this,e)}}function f(t,e){const i=Math.min(t,e);return(Math.max(t,e)-i)*Math.random()+e}function m(){return Math.random()>=.5?1:-1}class w{static start(){const t=new w;return t.start(),t}constructor(){}start(){this.waiterPromise=new Promise(((t,e)=>{this.waiterResolver=t}))}complete(){this.waiterResolver()}then(t){return u(this,void 0,void 0,(function*(){return yield this.waiterPromise,t()}))}}function p(t){return u(this,void 0,void 0,(function*(){const e=new s.PassThrough;a.get(t).on("response",(t=>{t.pipe(e)})).end();return yield function(t){const e=[];return new Promise(((i,r)=>{t.on("data",(t=>{e.push(Buffer.from(t))})).on("end",(()=>{i(Buffer.concat(e).toString("utf-8"))})).on("error",(t=>{r(t)}))}))}(e)}))}function g(t){const e=t.toString().trim();try{new Function(e)}catch(t){if(t instanceof Error&&t.message.startsWith("EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval'"))return e}return e}function y(t){return t.map((t=>{if("object"==typeof t)return JSON.stringify(t);if("function"==typeof t)throw new Error("Cannot pass unserializable argument of function type.");return"string"==typeof t?`"${e=t,i='"',r='\\"',e.replace(new RegExp(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(i),"g"),r)}"`:t;var e,i,r})).join(",")}class x{constructor(t){this.ro=t}get id(){return this.ro.objectId}get type(){return this.ro.type}get subType(){return this.ro.subtype}get description(){return this.ro.description}}class b{constructor(t,e,i){this.context=t,this.creator=e,this.id=i}get executionContextId(){return this.id}runExpression(t){return u(this,void 0,void 0,(function*(){const e=yield this.context.send("Runtime.evaluate",{expression:t,awaitPromise:!0,returnByValue:!0});if(e.exceptionDetails)throw new v(e.exceptionDetails);return e.result}))}runFunction(t,e,...i){return u(this,void 0,void 0,(function*(){const r=g(e),n=i.length?i.map((t=>t instanceof x?{objectId:t.id}:{value:t})):[],o=yield this.context.send("Runtime.callFunctionOn",{functionDeclaration:r,awaitPromise:!0,returnByValue:!t,executionContextId:this.executionContextId,arguments:n});if(o.exceptionDetails)throw new v(o.exceptionDetails);return o.result}))}chechContext(){if(!Number.isInteger(this.executionContextId))throw new Error("No execution context created. It happen with first navigation.")}evaluate(t,e,...i){return u(this,void 0,void 0,(function*(){let r;return this.chechContext(),r="string"==typeof e?yield this.runExpression(e):yield this.runFunction(t,e,...i),t?"node"==r.subtype?this.creator.createRO(r):new x(r):r.value}))}releaseRO(t){return this.context.send("Runtime.releaseObject",{objectId:t.id})}}class T extends x{constructor(e,i,r){super(r),t.add(this),this.context=e,this.mouseHandler=i,this.released=!1}evaluate(t,...e){if(this.released)throw new Error("Cannot eval on remote node which released before.");return this.context.evaluate(!1,t,...e)}$(t){return u(this,void 0,void 0,(function*(){return yield this.context.evaluate(!0,(function(t,e){return t.querySelector(e)}),this,t)}))}click(t){return u(this,void 0,void 0,(function*(){if(!t)return void(yield this.evaluate((function(t){t.click()}),this));const e=yield this.evaluate((function(t){const{width:e,height:i,top:r,left:n}=t.getBoundingClientRect();return{width:e,height:i,top:r,left:n}}),this);if(!(isFinite(e.width)&&isFinite(e.height)&&isFinite(e.top)&&isFinite(e.left)))throw new Error("Cannot calculate nodes position.");const i=e.left+e.width/2+f(e.width/1e3,e.width/100)*m(),r=e.top+e.height/2+f(e.height/1e3,e.height/100)*m();this.mouseHandler.click({x:i,y:r})}))}$$(i){return u(this,void 0,void 0,(function*(){return yield l(this,t,"m",e).call(this,i)}))}$evaluate(t,e){return u(this,void 0,void 0,(function*(){const i=g(e),r=`(function e(){const result = document.querySelector('${t}'); return (${i})(result); })()`;return yield this.evaluate(r)}))}$$evaluate(t,e){return u(this,void 0,void 0,(function*(){const i=g(e),r=`(function e(){const results = Array.from(document.querySelectorAll('${t}')); return (${i})(results); })()`;return yield this.evaluate(r)}))}release(){return this.context.releaseRO(this)}}t=new WeakSet,e=function(t,e){return u(this,void 0,void 0,(function*(){const i=yield this.context.evaluate(!0,(function(t,e){const i=t.querySelectorAll(e);return Array.from(i)}),this,t),r=[],n=Number.parseInt(/\d+/g.exec(i.description)[0]);for(let t=0;t<n;t++)try{const n=yield this.context.evaluate(!0,(function(t,e){if(e>=t.length)throw new Error(`Out of bound - access ${e} of ${t.length}`);return t[e]}),i,t);e?r.push(e(n)):r.push(n)}catch(t){if(t instanceof v&&t.message.includes("Out of bound"))break;throw t}return r}))};class N extends Error{constructor(t,e){super(`Waiting for "${e}" selector for "${t}" miliseconds has timedout.`)}}class E{wait(){return u(this,void 0,void 0,(function*(){return new Promise(((t,e)=>{this.waiterResolver=t,this.waiterRejecter=e}))}))}}class I extends E{static start(t,e,i){return u(this,void 0,void 0,(function*(){return new I(t,e,null==i?void 0:i.pollInterval,null==i?void 0:i.waitTimeOut).start()}))}constructor(t,e,i=100,r=3e4){super(),this.evaluateContext=t,this.selector=e,this.pollInterval=i,this.timeOut=r}start(){const t=Object.create(null,{wait:{get:()=>super.wait}});return u(this,void 0,void 0,(function*(){return this.startTime=Date.now(),this.checkSelectorExistence(),t.wait.call(this)}))}checkSelectorExistence(){return u(this,void 0,void 0,(function*(){(yield this.evaluateContext.evaluate((t=>!!document.querySelectorAll(t).length),this.selector))?yield this.resolve():this.scheduleNextCheck()}))}resolve(){return u(this,void 0,void 0,(function*(){this.waiterResolver()}))}scheduleNextCheck(){const t=Date.now()-this.startTime,e=this.timeOut-t;if(e<0)throw new N(this.timeOut,this.selector);let i;i=e<this.pollInterval?this.pollInterval-e:this.pollInterval,setTimeout((()=>this.checkSelectorExistence()),i)}}class C extends E{constructor(t,e,i){super(),this.networkContext=t,this.idleInterval=e,this.tolerance=i,this.isResolved=!1}start(){const t=Object.create(null,{wait:{get:()=>super.wait}});return u(this,void 0,void 0,(function*(){return yield this.networkContext.enable(),this.lastIdleItem=Date.now(),this.networkContext.on("requestWillBeSent",(t=>{this.isResolved||this.resetTimer()})),this.networkContext.on("responseReceived",(t=>{this.isResolved||this.resetTimer()})),this.setTimer(),t.wait.call(this)}))}resetTimer(){const t=Date.now();t-this.lastIdleItem>=this.idleInterval-this.tolerance*this.idleInterval?this.resolve():(this.lastIdleItem=t,clearTimeout(this.timerId),this.setTimer())}setTimer(){this.timerId=setTimeout((()=>{this.resolve()}),this.idleInterval)}resolve(){return u(this,void 0,void 0,(function*(){this.isResolved=!0,yield this.networkContext.disable(),this.waiterResolver()}))}static start(t,e){var i;const r=null!==(i=e.tolerance)&&void 0!==i?i:.05;return new C(t,e.idleInterval,r).start()}}class O extends Error{}class $ extends E{constructor(t,e){super(),this.pollInterval=t,this.timeOut=e}start(){const t=Object.create(null,{wait:{get:()=>super.wait}});return u(this,void 0,void 0,(function*(){return this.startTime=Date.now(),this.poll(),t.wait.call(this)}))}poll(){return u(this,void 0,void 0,(function*(){(yield this.polling())?this.waiterResolver():this.scheduleNextPoll()}))}scheduleNextPoll(){const t=Date.now()-this.startTime,e=this.timeOut-t;if(e<0)return void this.onTimeOut();let i;i=e<this.pollInterval?this.pollInterval-e:this.pollInterval,setTimeout((()=>this.poll()),i)}}class R extends ${static start(t,e,i,r,...n){return new R(t,e,i,r,n).start()}constructor(t,e,i=100,r=3e4,n){super(i,r),this.signalFunc=t,this.evaluateContext=e,this.args=n}onTimeOut(){throw new O(`Signal function doesn't return True value(even in implicit) for ${this.timeOut/1e3} seconds.(timeout)`)}polling(){return u(this,void 0,void 0,(function*(){if(this.args&&this.args.length){return!!(yield this.evaluateContext.evaluate(this.signalFunc,...this.args))}{const t=g(this.signalFunc);return yield this.evaluateContext.evaluate(`(async function(){const res = (${t})(); return !!res;})()`)}}))}}class S{constructor(t){this.inputContext=t}move(t){return u(this,void 0,void 0,(function*(){yield this.inputContext.dispatchMouseEvent(Object.assign({type:"mouseMoved"},t))}))}click(t){return u(this,void 0,void 0,(function*(){var e;yield this.inputContext.dispatchMouseEvent(Object.assign(Object.assign({type:"mousePressed"},t),{clickCount:1,button:"left"})),t.delay&&(yield(e=t.delay,new Promise((t=>{setTimeout((()=>t()),e)})))),yield this.inputContext.dispatchMouseEvent(Object.assign(Object.assign({type:"mouseReleased"},t),{button:"left",clickCount:1}))}))}}!function(t){t[t.NONE=0]="NONE",t[t.REQUESTED_FOR_NAVIGATION=1]="REQUESTED_FOR_NAVIGATION",t[t.NAVIGATE_FIRED=2]="NAVIGATE_FIRED",t[t.NAVIGATE_DOC_EVENT=3]="NAVIGATE_DOC_EVENT",t[t.NAVIGATE_LOAD_EVENT=4]="NAVIGATE_LOAD_EVENT"}(r||(r={}));class D{constructor(t,e){this.context=t,this.tab=e,this.frameNavigationWaitUntil="documentloaded",i.set(this,void 0),this.released=!1,t.on("Page.frameNavigated",(t=>{t.frame.id===this.frameId&&"Navigation"===t.type&&c(this,i,this.framesDoc=void 0,"f")})),t.on("Page.frameRequestedNavigation",(t=>{t.frameId===this.frameId&&(this.framesDoc=c(this,i,void 0,"f"),this.navigationWaiter=w.start())})),t.on("Page.domContentEventFired",(t=>{"documentloaded"==this.frameNavigationWaitUntil&&this.navigationWaiter&&this.navigationWaiter.complete()})),t.on("Page.domContentEventFired",(t=>{"load"==this.frameNavigationWaitUntil&&this.navigationWaiter&&this.navigationWaiter.complete()})),t.on("Runtime.executionContextDestroyed",(t=>{var e;t.executionContextId===(null===(e=l(this,i,"f"))||void 0===e?void 0:e.executionContextId)&&c(this,i,void 0,"f")})),t.on("Runtime.executionContextsCleared",(()=>{c(this,i,void 0,"f")})),t.Runtime.on("executionContextCreated",this.contextCreationHandler.bind(this))}waitForNavigationComplete(){return u(this,void 0,void 0,(function*(){this.navigationWaiter&&(yield this.navigationWaiter,this.navigationWaiter=void 0)}))}contextCreationHandler(t){var e;const r=t.context.auxData;r&&r.isDefault&&r.frameId===this.frameId&&(c(this,i,new b(this.context,this,t.context.id),"f"),null===(e=this.executionContextWaiterResolver)||void 0===e||e.call(this))}get mouseHandler(){var t;return null!==(t=this._mouseHandler)&&void 0!==t?t:this._mouseHandler=new S(this.context.Input)}createRO(t){return new T(this.executionContext,this.mouseHandler,t)}addScriptToRunOnNewDocument(t,...e){return u(this,void 0,void 0,(function*(){const i=function(t,...e){return"string"==typeof t?`(${t})(${y(e)})`:`(${g(t)})(\n    ${y(e)})`}(t,...e);return(yield this.context.send("Page.addScriptToEvaluateOnNewDocument",{source:i})).identifier}))}waitForSelectorAppear(t,e){return u(this,void 0,void 0,(function*(){return I.start(this,t,e)}))}waitUntilNetworkIdle(){return u(this,arguments,void 0,(function*(t={idleInterval:500,idleNumber:0}){return C.start(this.context.Network,t)}))}waitUntilReturnTrue(t,e,...i){return u(this,void 0,void 0,(function*(){return R.start(t,this,null==e?void 0:e.pollInterval,null==e?void 0:e.waitTimeOut,...i)}))}get executionContext(){if(!l(this,i,"f"))throw new Error("No execution context exists. Maybe no navigation happened.");return l(this,i,"f")}waitForContext(){return new Promise((t=>{this.executionContextWaiterResolver=t}))}document(){return u(this,void 0,void 0,(function*(){var t;return yield this.waitForNavigationComplete(),l(this,i,"f")||(yield this.waitForContext()),null!==(t=this.framesDoc)&&void 0!==t?t:this.framesDoc=yield this.executionContext.evaluate(!0,(function(){return document}))}))}navigate(t){return u(this,void 0,void 0,(function*(){var e,r;const n=this.context.Page,o=yield n.navigate(t);if(c(this,i,this.framesDoc=void 0,"f"),this.frameId!==o.frameId&&(this.frameId=o.frameId),null===(e=o.errorText)||void 0===e?void 0:e.trim())throw new h(o.errorText);switch(null!==(r=t.waitUntil)&&void 0!==r?r:"documentloaded"){case"documentloaded":yield n.domContentEventFired();break;case"load":yield n.loadEventFired()}}))}evaluate(t,...e){return u(this,void 0,void 0,(function*(){return(yield this.document()).evaluate(t,...e)}))}$(t){return u(this,void 0,void 0,(function*(){return(yield this.document()).$(t)}))}$$(t){return u(this,void 0,void 0,(function*(){return(yield this.document()).$$(t)}))}$evaluate(t,e){return u(this,void 0,void 0,(function*(){return(yield this.document()).$evaluate(t,e)}))}$$evaluate(t,e){return u(this,void 0,void 0,(function*(){return(yield this.document()).$$evaluate(t,e)}))}release(){var t;return this.released=!0,null===(t=this.framesDoc)||void 0===t?void 0:t.release()}}i=new WeakMap;class F{constructor(t,e,i,r){this._tabId=t,this.client=e,this._browser=i,this.tabsHandler=r,n.set(this,void 0)}set handler(t){this.tabsHandler=t}evaluate(t,...e){return this.frame.evaluate(t,...e)}$(t){return this.frame.$(t)}$$(t){return this.frame.$$(t)}$evaluate(t,e){return this.frame.$evaluate(t,e)}$$evaluate(t,e){return this.frame.$$evaluate(t,e)}get frame(){var t;return c(this,n,null!==(t=l(this,n,"f"))&&void 0!==t?t:new D(this.client,this),"f"),l(this,n,"f")}readyForFrame(){return u(this,void 0,void 0,(function*(){const{Page:t,Runtime:e,Network:i}=this.client;yield t.enable(),yield e.enable(),yield i.enable()}))}navigate(t){return u(this,void 0,void 0,(function*(){yield this.readyForFrame();try{return this.frame.navigate(t)}catch(t){if(t instanceof Error&&t.message.toLocaleLowerCase().includes("net::ERR_EMPTY_RESPONSE".toLocaleLowerCase()))throw new Error("No response sent from server. Try navigation again or navigate to another url.");throw t}}))}waitForSelectorAppear(t,e){return u(this,void 0,void 0,(function*(){return this.frame.waitForSelectorAppear(t,e)}))}get tabId(){return this._tabId}get browser(){return this._browser}get mouseHandler(){return this.frame.mouseHandler}close(){return this.tabsHandler.close(this)}addScriptToRunOnNewDocument(t,...e){return this.frame.addScriptToRunOnNewDocument(t,...e)}waitUntilNetworkIdle(t){return u(this,void 0,void 0,(function*(){return this.frame.waitUntilNetworkIdle(t)}))}waitUntilReturnTrue(t,e,...i){return u(this,void 0,void 0,(function*(){return this.frame.waitUntilReturnTrue(t,e,...i)}))}bringToFront(){return u(this,void 0,void 0,(function*(){yield this.client.Page.enable(),yield this.client.Page.bringToFront()}))}screenshot(t){return u(this,void 0,void 0,(function*(){yield this.client.Page.enable();const e=(yield this.client.Page.captureScreenshot({format:t.format,captureBeyondViewport:t.totalPage,quality:t.quality})).data;(yield import("fs")).writeFileSync(t.savePath,e,{encoding:"base64"})}))}get _session(){return this.client}}n=new WeakMap;class k{static create(t){return u(this,void 0,void 0,(function*(){const e=yield o({port:t.port}),i=yield e.Target.getTargetInfo();return new k(t,{id:i.targetInfo.targetId,session:e})}))}constructor(t,e){this.browser=t,this.openedTabs=new Map,this.defaultTabDelivered=!1,this.openedTabs.set(e.id,new F(e.id,e.session,t,this))}newTab(){return u(this,arguments,void 0,(function*(t={url:""}){if(!this.defaultTabDelivered)return this.defaultTabDelivered=!0,this.openedTabs.values().next().value;const e=yield o.New(Object.assign({port:this.browser.port},t)),i=yield o({port:this.browser.port,target:e.id}),r=new F(e.id,i,this.browser,this);return this.openedTabs.set(r.tabId,r),r}))}getAllTabs(){return[...this.openedTabs.values()]}close(t){return u(this,void 0,void 0,(function*(){return this.openedTabs.delete(t.tabId),o.Close({id:t.tabId,port:this.browser.port})}))}}const{launch:A}=require("chrome-launcher/chrome-launcher");class P{static create(t){return u(this,void 0,void 0,(function*(){const e=new P(t);return yield e.init(),e}))}constructor(t){this.browserOptions=t,this.isClosed=!1}init(){return u(this,void 0,void 0,(function*(){var t,e,i;const r=[];(null===(e=null===(t=this.browserOptions)||void 0===t?void 0:t.args)||void 0===e?void 0:e.length)&&r.push(...this.browserOptions.args),this.window=yield A({chromeFlags:r,userDataDir:null===(i=this.browserOptions)||void 0===i?void 0:i.userDir});let n=JSON.parse(yield p("http://localhost:"+this.window.port+"/json/version"));this._userAgent=n["User-Agent"],this._version=n.Browser,this.tabHandler=yield k.create(this)}))}get version(){return this._version}get port(){return this.window.port}get userAgent(){return this._userAgent}newTab(){return u(this,arguments,void 0,(function*(t={url:""}){return this.isCloseCheck(),this.tabHandler.newTab(t)}))}close(){this.isClosed=!0,this.window.kill()}isCloseCheck(){if(this.isClosed)throw new Error("Cannot operate on closed browser. Launch another instance of chrowser and try this action.")}getAllOpenTabs(){return this.isCloseCheck(),this.tabHandler.getAllTabs()}}module.exports=P;
