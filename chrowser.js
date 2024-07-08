"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t,e,i,n,r,o,s=require("chrome-launcher"),a=require("chrome-remote-interface"),u=require("@pourianof/notifier"),l=require("stream"),c=require("http");function d(t,e,i,n){return new(i||(i=Promise))((function(r,o){function s(t){try{u(n.next(t))}catch(t){o(t)}}function a(t){try{u(n.throw(t))}catch(t){o(t)}}function u(t){var e;t.done?r(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(s,a)}u((n=n.apply(t,e||[])).next())}))}function h(t,e,i,n){if("a"===i&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===i?n:"a"===i?n.call(t):n?n.value:e.get(t)}function v(t,e,i,n,r){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!r)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?r.call(t,i):r?r.value=i:e.set(t,i),i}"function"==typeof SuppressedError&&SuppressedError;class m{constructor(t,e,i,n=null,r=null,o=void 0,s=null,a=null,u="",l="",c=void 0,d=!1){this._this=t,this.typeName=e,this.func=i,this.functionName=n,this.methodName=r,this.fileName=o,this.lineNumber=s,this.columnNumber=a,this.sourceURL=u,this.scriptHash=l,this.evalOrigion=c,this.isEvalInvokation=d}getThis(){return this._this}getTypeName(){return this.typeName}getFunction(){return this.func}getFunctionName(){return this.functionName}getMethodName(){return this.methodName}getFileName(){return this.fileName}getLineNumber(){return this.lineNumber}getColumnNumber(){return this.columnNumber}getEvalOrigin(){return this.evalOrigion}isToplevel(){return this._this===global}isEval(){return this.isEvalInvokation}isNative(){return!1}isConstructor(){return!1}isAsync(){return!1}isPromiseAll(){return!1}getPromiseIndex(){return-1}getScriptNameOrSourceURL(){return this.sourceURL}getScriptHash(){return this.scriptHash}getEnclosingColumnNumber(){var t;return null!==(t=this.columnNumber)&&void 0!==t?t:-1}getEnclosingLineNumber(){var t;return null!==(t=this.lineNumber)&&void 0!==t?t:-1}getPosition(){return-1}toString(){return`at ${this.functionName} - line ${this.lineNumber} on column ${this.columnNumber}`}}class f extends Error{static mapToCallSite(t){return t.callFrames.map((t=>new m(void 0,"",void 0,t.functionName,null,void 0,t.lineNumber,t.columnNumber,t.url,t.scriptId)))}constructor(t){super(t.text),this.error=t}printEvalStackTrace(){var t;if(!this.error.stackTrace)return;const e=f.mapToCallSite(this.error.stackTrace);return null===(t=Error.prepareStackTrace)||void 0===t?void 0:t.call(Error,this,e)}}function g(t,e){const i=Math.min(t,e);return(Math.max(t,e)-i)*Math.random()+i}function p(){return Math.random()>=.5?1:-1}function w(t){return new Promise((e=>{setTimeout((()=>e()),t)}))}function y(t){return d(this,void 0,void 0,(function*(){const e=new l.PassThrough;c.get(t).on("response",(t=>{t.pipe(e)})).end();return yield function(t){const e=[];return new Promise(((i,n)=>{t.on("data",(t=>{e.push(Buffer.from(t))})).on("end",(()=>{i(Buffer.concat(e).toString("utf-8"))})).on("error",(t=>{n(t)}))}))}(e)}))}function N(t){const e=t.toString().trim();try{new Function(e)}catch(t){if(t instanceof Error&&t.message.startsWith("EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval'"))return e}return e}function T(t){return t.map((t=>{if("object"==typeof t)return JSON.stringify(t);if("function"==typeof t)throw new Error("Cannot pass unserializable argument of function type.");return"string"==typeof t?`"${e=t,i='"',n='\\"',e.replace(new RegExp(function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(i),"g"),n)}"`:t;var e,i,n})).join(",")}class E{constructor(t){this.ro=t}get id(){return this.ro.objectId}get type(){return this.ro.type}get subType(){return this.ro.subtype}get description(){return this.ro.description}}class A{constructor(t,e,i){this.context=t,this.creator=e,this.id=i}get executionContextId(){return this.id}runExpression(t){return d(this,void 0,void 0,(function*(){const e=yield this.context.send("Runtime.evaluate",{expression:t,awaitPromise:!0,returnByValue:!0});if(e.exceptionDetails)throw new f(e.exceptionDetails);return e.result}))}runFunction(t,e,...i){return d(this,void 0,void 0,(function*(){const n=N(e),r=i.length?i.map((t=>t instanceof E?{objectId:t.id}:{value:t})):[],o=yield this.context.send("Runtime.callFunctionOn",{functionDeclaration:n,awaitPromise:!0,returnByValue:!t,executionContextId:this.executionContextId,arguments:r});if(o.exceptionDetails)throw new f(o.exceptionDetails);return o.result}))}chechContext(){if(!Number.isInteger(this.executionContextId))throw new Error("No execution context created. It happen with first navigation.")}evaluate(t,e,...i){return d(this,void 0,void 0,(function*(){let n;return this.chechContext(),n="string"==typeof e?yield this.runExpression(e):yield this.runFunction(t,e,...i),t?"node"==n.subtype?this.creator.createRO(n):new E(n):n.value}))}releaseRO(t){return this.context.send("Runtime.releaseObject",{objectId:t.id})}}class x extends E{constructor(e,i,n){super(n),t.add(this),this.context=e,this.mouseHandler=i,this.released=!1}evaluate(t,...e){if(this.released)throw new Error("Cannot eval on remote node which released before.");return this.context.evaluate(!1,t,...e)}$(t){return d(this,void 0,void 0,(function*(){return yield this.context.evaluate(!0,(function(t,e){return t.querySelector(e)}),this,t)}))}click(t){return d(this,void 0,void 0,(function*(){if(!t)return void(yield this.evaluate((function(t){t.click()}),this));const e=yield this.evaluate((function(t){const{width:e,height:i,top:n,left:r}=t.getBoundingClientRect();return{width:e,height:i,top:n,left:r}}),this);if(!(isFinite(e.width)&&isFinite(e.height)&&isFinite(e.top)&&isFinite(e.left)))throw new Error("Cannot calculate nodes position.");const i=e.left+e.width/2+g(e.width/1e3,e.width/100)*p(),n=e.top+e.height/2+g(e.height/1e3,e.height/100)*p();this.mouseHandler.click({x:i,y:n})}))}$$(i){return d(this,void 0,void 0,(function*(){return yield h(this,t,"m",e).call(this,i)}))}$evaluate(t,e){return d(this,void 0,void 0,(function*(){const i=N(e),n=`(function e(){const result = document.querySelector('${t}'); return (${i})(result); })()`;return yield this.evaluate(n)}))}$$evaluate(t,e){return d(this,void 0,void 0,(function*(){const i=N(e),n=`(function e(){const results = Array.from(document.querySelectorAll('${t}')); return (${i})(results); })()`;return yield this.evaluate(n)}))}release(){return this.context.releaseRO(this)}}t=new WeakSet,e=function(t,e){return d(this,void 0,void 0,(function*(){const i=yield this.context.evaluate(!0,(function(t,e){const i=t.querySelectorAll(e);return Array.from(i)}),this,t),n=[],r=Number.parseInt(/\d+/g.exec(i.description)[0]);for(let t=0;t<r;t++)try{const r=yield this.context.evaluate(!0,(function(t,e){if(e>=t.length)throw new Error(`Out of bound - access ${e} of ${t.length}`);return t[e]}),i,t);e?n.push(e(r)):n.push(r)}catch(t){if(t instanceof f&&t.message.includes("Out of bound"))break;throw t}return n}))};class D extends Error{constructor(t,e){super(`Waiting for "${e}" selector for "${t}" miliseconds has timedout.`)}}class b{wait(){return d(this,void 0,void 0,(function*(){return new Promise(((t,e)=>{this.waiterResolver=t,this.waiterRejecter=e}))}))}}class C extends b{static start(t,e,i){return d(this,void 0,void 0,(function*(){return new C(t,e,null==i?void 0:i.pollInterval,null==i?void 0:i.waitTimeOut).start()}))}constructor(t,e,i=100,n=3e4){super(),this.evaluateContext=t,this.selector=e,this.pollInterval=i,this.timeOut=n}start(){const t=Object.create(null,{wait:{get:()=>super.wait}});return d(this,void 0,void 0,(function*(){return this.startTime=Date.now(),this.checkSelectorExistence(),t.wait.call(this)}))}checkSelectorExistence(){return d(this,void 0,void 0,(function*(){(yield this.evaluateContext.evaluate((t=>!!document.querySelectorAll(t).length),this.selector))?yield this.resolve():this.scheduleNextCheck()}))}resolve(){return d(this,void 0,void 0,(function*(){this.waiterResolver()}))}scheduleNextCheck(){const t=Date.now()-this.startTime,e=this.timeOut-t;if(e<0)return void this.waiterRejecter(new D(this.timeOut,this.selector));let i;i=e<this.pollInterval?this.pollInterval-e:this.pollInterval,setTimeout((()=>this.checkSelectorExistence()),i)}}class I extends b{constructor(t,e,i){super(),this.networkContext=t,this.idleInterval=e,this.tolerance=i,this.isResolved=!1}start(){const t=Object.create(null,{wait:{get:()=>super.wait}});return d(this,void 0,void 0,(function*(){return yield this.networkContext.enable(),this.lastIdleItem=Date.now(),this.networkContext.on("requestWillBeSent",(t=>{this.isResolved||this.resetTimer()})),this.networkContext.on("responseReceived",(t=>{this.isResolved||this.resetTimer()})),this.setTimer(),t.wait.call(this)}))}resetTimer(){const t=Date.now();t-this.lastIdleItem>=this.idleInterval-this.tolerance*this.idleInterval?this.resolve():(this.lastIdleItem=t,clearTimeout(this.timerId),this.setTimer())}setTimer(){this.timerId=setTimeout((()=>{this.resolve()}),this.idleInterval)}resolve(){return d(this,void 0,void 0,(function*(){this.isResolved=!0,yield this.networkContext.disable(),this.waiterResolver()}))}static start(t,e){var i;const n=null!==(i=e.tolerance)&&void 0!==i?i:.05;return new I(t,e.idleInterval,n).start()}}class _ extends Error{}class P extends b{constructor(t,e){super(),this.pollInterval=t,this.timeOut=e}start(){const t=Object.create(null,{wait:{get:()=>super.wait}});return d(this,void 0,void 0,(function*(){return this.startTime=Date.now(),this.poll(),t.wait.call(this)}))}poll(){return d(this,void 0,void 0,(function*(){(yield this.polling())?this.waiterResolver():this.scheduleNextPoll()}))}scheduleNextPoll(){const t=Date.now()-this.startTime,e=this.timeOut-t;if(e<0){const t=this.onTimeOut();return void this.waiterRejecter(t)}let i;i=e<this.pollInterval?this.pollInterval-e:this.pollInterval,setTimeout((()=>this.poll()),i)}}class L extends P{static start(t,e,i,n,...r){return new L(t,e,i,n,r).start()}constructor(t,e,i=100,n=3e4,r){super(i,n),this.signalFunc=t,this.evaluateContext=e,this.args=r}onTimeOut(){return new _(`Signal function doesn't return True value(even in implicit) for ${this.timeOut/1e3} seconds.(timeout)`)}polling(){return d(this,void 0,void 0,(function*(){if(this.args&&this.args.length){return!!(yield this.evaluateContext.evaluate(this.signalFunc,...this.args))}{const t=N(this.signalFunc);return yield this.evaluateContext.evaluate(`(async function(){const res = (${t})(); return !!res;})()`)}}))}}class O{constructor(t){this.inputContext=t}move(t){return d(this,void 0,void 0,(function*(){yield this.inputContext.dispatchMouseEvent(Object.assign({type:"mouseMoved"},t))}))}click(t){return d(this,void 0,void 0,(function*(){yield this.inputContext.dispatchMouseEvent(Object.assign(Object.assign({type:"mousePressed"},t),{clickCount:1,button:"left"})),t.delay&&(yield w(t.delay)),yield this.inputContext.dispatchMouseEvent(Object.assign(Object.assign({type:"mouseReleased"},t),{button:"left",clickCount:1}))}))}}!function(t){t.ALPHABET_A="KeyA",t.ALPHABET_B="KeyB",t.ALPHABET_C="KeyC",t.ALPHABET_D="KeyD",t.ALPHABET_E="KeyE",t.ALPHABET_F="KeyF",t.ALPHABET_G="KeyG",t.ALPHABET_H="KeyH",t.ALPHABET_I="KeyI",t.ALPHABET_J="KeyJ",t.ALPHABET_K="KeyK",t.ALPHABET_L="KeyL",t.ALPHABET_M="KeyM",t.ALPHABET_N="KeyN",t.ALPHABET_O="KeyO",t.ALPHABET_Q="KeyQ",t.ALPHABET_R="KeyR",t.ALPHABET_S="KeyS",t.ALPHABET_T="KeyT",t.ALPHABET_U="KeyU",t.ALPHABET_V="KeyV",t.ALPHABET_W="KeyW",t.ALPHABET_X="KeyX",t.ALPHABET_Y="KeyY",t.ALPHABET_Z="KeyZ",t.SPACE_BAR="Space",t.ENTER="Enter",t.KEY_UP="ArrowUp",t.KEY_DOWN="ArrowDOWN",t.KEY_LEFT="ArrowLeft",t.KEY_RIGHT="ArrowRight",t.CAPS_LOCK="CapsLock",t.TAB="Tab",t.SHIFT_LEFT="ShiftLeft",t.SHIFT_RIGHT="ShiftRight",t.CONTROL_LEFT="ControlLeft",t.CONTROL_RIGHT="ControlRight",t.BACKSPACE="Backspace",t.ESC="Escape",t.ALT_LEFT="AltLeft",t.ALT_RIGHT="AltRight",t.DEL="Delete",t.NUMPAD_1="Numpad1",t.NUMPAD_2="Numpad1",t.NUMPAD_3="Numpad1",t.NUMPAD_4="Numpad1",t.NUMPAD_5="Numpad1",t.NUMPAD_6="Numpad1",t.NUMPAD_7="Numpad1",t.NUMPAD_8="Numpad1",t.NUMPAD_9="Numpad1",t.NUMPAD_0="Numpad1",t.NUMPAD_SUBTRACT="NumpadSubtract",t.NUMPAD_SUM="NumpadAdd",t.NUMPAD_ENTER="NumpadEnter",t.NUMPAD_DOT="NumpadDecimal",t.NUMPAD_DIVIDE="NumpadDivide",t.NUMPAD_MULTIPLE="NumpadMultiply",t.NUMLOCK="NumLock",t.MINUS="Minus",t.DIGIT_1="Digit1",t.DIGIT_2="Digit2",t.DIGIT_3="Digit3",t.DIGIT_4="Digit4",t.DIGIT_5="Digit5",t.DIGIT_6="Digit6",t.DIGIT_7="Digit7",t.DIGIT_8="Digit8",t.DIGIT_9="Digit9",t.BACK_QOUTE="Backquote"}(i||(i={}));class H{constructor(t){this.inputContext=t}keyDown(t){return d(this,void 0,void 0,(function*(){yield this.inputContext.dispatchKeyEvent({type:"keyDown",key:t})}))}keyUp(t){return d(this,void 0,void 0,(function*(){yield this.inputContext.dispatchKeyEvent({type:"keyUp",key:t,windowsVirtualKeyCode:32})}))}press(t,e){return d(this,void 0,void 0,(function*(){yield this.keyDown(t),(null==e?void 0:e.delay)&&(null==e?void 0:e.delay)>0&&(yield w(e.delay)),yield this.keyUp(t)}))}}class R extends Error{constructor(t){super(t)}}class F{static start(){const t=new F;return t.start(),t}constructor(){}start(){this.waiterPromise=new Promise(((t,e)=>{this.waiterResolver=t,this.waiterRejecter=e}))}complete(t){void 0!==t?this.waiterRejecter(t):this.waiterResolver()}then(t){return d(this,void 0,void 0,(function*(){return yield this.waiterPromise,t()}))}}class k extends Error{constructor(t,e){super(null!=e?e:`Process timeouted after ${t} miliseconds`),this.timeout=t}}class S extends P{onTimeOut(){return new k(this.timeOut)}polling(){return d(this,void 0,void 0,(function*(){const t=this.navigatorContext.getLastActiveNavigation();return!(!t||this.lastNav==t||"DocumentInnerAction"!=t.navigationType)}))}static start(t){return new S(t.pollInterval,t.waitFor,t.navigationContext)}constructor(t,e,i){super(t,e),this.navigatorContext=i,this.lastNav=i.getLastActiveNavigation()}}class $ extends u{constructor(t,e){super(),this.context=t,this.frameId=e,this.frameNavigationWaitUntil="documentloaded",this.onDocumentEvent=()=>{var t;"documentloaded"==this.frameNavigationWaitUntil&&this.lastActiveNavigation&&(null===(t=this.lastActiveNavigation)||void 0===t||t.documentLoaded())},this.newNavigationHandler=t=>{t.frameId===this.frameId&&this.newNavigationDispatch(t.url,"DocumentInnerAction")},this.navigationDoneHandler=t=>{t.frame.id==this.frameId&&this.lastActiveNavigation&&!this.lastActiveNavigation.isFinished&&"DocumentInnerAction"==this.lastActiveNavigation.navigationType&&this.lastActiveNavigation.done()},this.init()}getLastActiveNavigation(){return this.lastActiveNavigation}waitForPossibleNavigation(){return d(this,arguments,void 0,(function*(t={waitFor:100}){var e;if(this.lastActiveNavigation)if("NavigationMethod"==this.lastActiveNavigation.navigationType){const i=S.start({pollInterval:10,waitFor:null!==(e=t.waitFor)&&void 0!==e?e:100,navigationContext:this});yield i}else yield this.lastActiveNavigation.whenDocumentLoaded()}))}init(){this.context.on("Page.frameRequestedNavigation",this.newNavigationHandler),this.context.on("Page.frameNavigated",this.navigationDoneHandler),this.context.on("Page.domContentEventFired",this.onDocumentEvent)}newNavigationDispatch(t,e){this.lastActiveNavigation&&this.lastActiveNavigation.forget(),this.lastActiveNavigation=M.run(t,e),this.trigger("NavigateRequest",this.lastActiveNavigation)}waitForNavigationComplete(){return d(this,void 0,void 0,(function*(){var t;yield null===(t=this.lastActiveNavigation)||void 0===t?void 0:t.whenDocumentLoaded()}))}navigate(t){return d(this,void 0,void 0,(function*(){var e,i,n;const r=this.context.Page;this.newNavigationDispatch(t.url,"NavigationMethod");const o=yield r.navigate(t);if(null===(e=this.lastActiveNavigation)||void 0===e||e.done(),this.frameId!==o.frameId&&(this.frameId=o.frameId),null===(i=o.errorText)||void 0===i?void 0:i.trim())throw new R(o.errorText);switch(null!==(n=t.waitUntil)&&void 0!==n?n:"documentloaded"){case"documentloaded":yield this.lastActiveNavigation.whenDocumentLoaded();break;case"load":yield r.loadEventFired()}}))}}!function(t){t[t.DONE=0]="DONE",t[t.CANCELED=1]="CANCELED",t[t.NOT_COMPLETED=2]="NOT_COMPLETED",t[t.DOCUMENT_LOADED=3]="DOCUMENT_LOADED",t[t.FORGOTTED=4]="FORGOTTED"}(n||(n={}));class M{static run(t,e){return new M(t,e)}constructor(t,e){this.url=t,this.type=e,this.state=n.NOT_COMPLETED,this.completionWaiter=F.start(),this.documentLoadingWaiter=F.start()}get isDone(){return this.state===n.DONE}get isCanceled(){return this.state===n.CANCELED}get isDocumentLoaded(){return this.state===n.DOCUMENT_LOADED}get isFinished(){return this.isDocumentLoaded||this.isDone||this.isCanceled}get navigationType(){return this.type}completeNavigation(){this.completionWaiter.complete()}whenComplete(){return d(this,void 0,void 0,(function*(){return this.isFinished||(yield this.completionWaiter),{state:this.state,url:this.url,type:this.type}}))}done(){if(this.isFinished)throw new Error("Cannot done a finished navigation.");this.state=n.DONE,this.completeNavigation()}cancel(){if(this.isFinished)throw new Error("Cannot cancel a finished navigation.");this.state=n.CANCELED,this.completeNavigation(),this.isDocumentLoaded||this.documentLoadingWaiter.complete(new Error("Navigation canceled before document get loaded."))}whenDocumentLoaded(){return d(this,void 0,void 0,(function*(){this.isDocumentLoaded||(yield this.documentLoadingWaiter)}))}documentLoaded(){this.state=n.DOCUMENT_LOADED,this.documentLoadingWaiter.complete()}forget(){this.isDocumentLoaded?this.isFinished||this.cancel():this.documentLoadingWaiter.complete()}}class U extends u{constructor(t,e){super(),this.context=t,this.tab=e,r.set(this,void 0),this.released=!1,t.on("Runtime.executionContextDestroyed",(t=>{var e;t.executionContextId===(null===(e=h(this,r,"f"))||void 0===e?void 0:e.executionContextId)&&v(this,r,void 0,"f")})),t.on("Runtime.executionContextsCleared",(()=>{v(this,r,void 0,"f")})),t.Runtime.on("executionContextCreated",this.contextCreationHandler.bind(this))}waitForPossibleNavigation(t){return this.navigationHandler.waitForPossibleNavigation(t)}get navigationHandler(){return this._navigationHandler||(this._navigationHandler=new $(this.context,this.frameId),this._navigationHandler.addListener("NavigateRequest",(t=>{t.data.whenComplete().then((()=>{this.framesDoc=void 0}))}))),this._navigationHandler}addListener(t,e){return this.navigationHandler.addListener(t,e)}reload(){return this.context.Page.reload()}contextCreationHandler(t){var e;const i=t.context.auxData;i&&i.isDefault&&i.frameId===this.frameId&&(v(this,r,new A(this.context,this,t.context.id),"f"),null===(e=this.executionContextWaiterResolver)||void 0===e||e.call(this))}get mouseHandler(){var t;return null!==(t=this._mouseHandler)&&void 0!==t?t:this._mouseHandler=new O(this.context.Input)}get keyboardHandler(){var t;return null!==(t=this._keyboardHandler)&&void 0!==t?t:this._keyboardHandler=new H(this.context.Input)}createRO(t){return new x(this.executionContext,this.mouseHandler,t)}addScriptToRunOnNewDocument(t,...e){return d(this,void 0,void 0,(function*(){const i=function(t,...e){return"string"==typeof t?`(${t})(${T(e)})`:`(${N(t)})(\n    ${T(e)})`}(t,...e);return(yield this.context.send("Page.addScriptToEvaluateOnNewDocument",{source:i})).identifier}))}waitForSelectorAppear(t,e){return d(this,void 0,void 0,(function*(){return C.start(this,t,e)}))}waitUntilNetworkIdle(){return d(this,arguments,void 0,(function*(t={idleInterval:500,idleNumber:0}){return I.start(this.context.Network,t)}))}waitUntilReturnTrue(t,e,...i){return d(this,void 0,void 0,(function*(){return L.start(t,this,null==e?void 0:e.pollInterval,null==e?void 0:e.waitTimeOut,...i)}))}get executionContext(){if(!h(this,r,"f"))throw new Error("No execution context exists. Maybe no navigation happened.");return h(this,r,"f")}waitForContext(){return new Promise((t=>{this.executionContextWaiterResolver=t}))}document(){return d(this,void 0,void 0,(function*(){var t;return yield this.navigationHandler.waitForNavigationComplete(),h(this,r,"f")||(yield this.waitForContext()),null!==(t=this.framesDoc)&&void 0!==t?t:this.framesDoc=yield this.executionContext.evaluate(!0,(function(){return document}))}))}evaluateFrameId(){return d(this,void 0,void 0,(function*(){const t=yield this.context.Page.getFrameTree();this.frameId=t.frameTree.frame.id}))}navigate(t){return d(this,void 0,void 0,(function*(){return this.frameId||(yield this.evaluateFrameId()),this.navigationHandler.navigate(t)}))}evaluate(t,...e){return d(this,void 0,void 0,(function*(){return(yield this.document()).evaluate(t,...e)}))}$(t){return d(this,void 0,void 0,(function*(){return(yield this.document()).$(t)}))}$$(t){return d(this,void 0,void 0,(function*(){return(yield this.document()).$$(t)}))}$evaluate(t,e){return d(this,void 0,void 0,(function*(){return(yield this.document()).$evaluate(t,e)}))}$$evaluate(t,e){return d(this,void 0,void 0,(function*(){return(yield this.document()).$$evaluate(t,e)}))}release(){var t;return this.released=!0,null===(t=this.framesDoc)||void 0===t?void 0:t.release()}}r=new WeakMap;class B{constructor(t,e,i,n){this._tabId=t,this.client=e,this._browser=i,this.tabsHandler=n,o.set(this,void 0)}reload(){return this.frame.reload()}addListener(t,e){return this.frame.addListener(t,e)}set handler(t){this.tabsHandler=t}evaluate(t,...e){return this.frame.evaluate(t,...e)}$(t){return this.frame.$(t)}$$(t){return this.frame.$$(t)}$evaluate(t,e){return this.frame.$evaluate(t,e)}$$evaluate(t,e){return this.frame.$$evaluate(t,e)}get frame(){var t;return v(this,o,null!==(t=h(this,o,"f"))&&void 0!==t?t:new U(this.client,this),"f"),h(this,o,"f")}readyForFrame(){return d(this,void 0,void 0,(function*(){const{Page:t,Runtime:e,Network:i}=this.client;yield t.enable(),yield e.enable(),yield i.enable()}))}navigate(t){return d(this,void 0,void 0,(function*(){yield this.readyForFrame();try{return this.frame.navigate(t)}catch(t){if(t instanceof Error&&t.message.toLocaleLowerCase().includes("net::ERR_EMPTY_RESPONSE".toLocaleLowerCase()))throw new Error("No response sent from server. Try navigation again or navigate to another url.");throw t}}))}waitForPossibleNavigation(t){return this.frame.waitForPossibleNavigation(t)}waitForSelectorAppear(t,e){return d(this,void 0,void 0,(function*(){return this.frame.waitForSelectorAppear(t,e)}))}get tabId(){return this._tabId}get browser(){return this._browser}get mouseHandler(){return this.frame.mouseHandler}get keyboardHandler(){return this.frame.keyboardHandler}getTabTitle(){return d(this,void 0,void 0,(function*(){return(yield this._session.Target.getTargetInfo()).targetInfo.title}))}close(){return this.tabsHandler.close(this)}addScriptToRunOnNewDocument(t,...e){return this.frame.addScriptToRunOnNewDocument(t,...e)}waitUntilNetworkIdle(t){return d(this,void 0,void 0,(function*(){return this.frame.waitUntilNetworkIdle(t)}))}waitUntilReturnTrue(t,e,...i){return d(this,void 0,void 0,(function*(){return this.frame.waitUntilReturnTrue(t,e,...i)}))}bringToFront(){return d(this,void 0,void 0,(function*(){yield this.client.Page.enable(),yield this.client.Page.bringToFront()}))}screenshot(t){return d(this,void 0,void 0,(function*(){yield this.client.Page.enable();const e=(yield this.client.Page.captureScreenshot({format:t.format,captureBeyondViewport:t.totalPage,quality:t.quality})).data;(yield import("fs")).writeFileSync(t.savePath,e,{encoding:"base64"})}))}get _session(){return this.client}}o=new WeakMap;class K{static create(t){return d(this,void 0,void 0,(function*(){const e=yield a({port:t.port}),i=yield e.Target.getTargetInfo();return new K(t,{id:i.targetInfo.targetId,session:e})}))}constructor(t,e){this.browser=t,this.openedTabs=new Map,this.defaultTabDelivered=!1,this.openedTabs.set(e.id,new B(e.id,e.session,t,this))}newTab(){return d(this,arguments,void 0,(function*(t={url:""}){if(!this.defaultTabDelivered)return this.defaultTabDelivered=!0,this.openedTabs.values().next().value;const e=yield a.New(Object.assign({port:this.browser.port},t)),i=yield a({port:this.browser.port,target:e.id}),n=new B(e.id,i,this.browser,this);return this.openedTabs.set(n.tabId,n),n}))}getAllTabs(){return[...this.openedTabs.values()]}close(t){return d(this,void 0,void 0,(function*(){return this.openedTabs.delete(t.tabId),a.Close({id:t.tabId,port:this.browser.port})}))}}class W{static create(t){return d(this,void 0,void 0,(function*(){const e=new W(t);return yield e.init(),e}))}constructor(t){this.browserOptions=t,this.isClosed=!1}init(){return d(this,void 0,void 0,(function*(){var t,e,i;const n=[];(null===(e=null===(t=this.browserOptions)||void 0===t?void 0:t.args)||void 0===e?void 0:e.length)&&n.push(...this.browserOptions.args),this.window=yield s.launch({chromeFlags:n,userDataDir:null===(i=this.browserOptions)||void 0===i?void 0:i.userDir});let r=JSON.parse(yield y("http://localhost:"+this.window.port+"/json/version"));this._userAgent=r["User-Agent"],this._version=r.Browser,this.tabHandler=yield K.create(this)}))}get version(){return this._version}get port(){return this.window.port}get pid(){return this.window.pid}get userAgent(){return this._userAgent}newTab(){return d(this,arguments,void 0,(function*(t={url:""}){return this.isCloseCheck(),this.tabHandler.newTab(t)}))}close(){this.isClosed=!0,this.window.kill()}isCloseCheck(){if(this.isClosed)throw new Error("Cannot operate on closed browser. Launch another instance of chrowser and try this action.")}getAllOpenTabs(){return this.isCloseCheck(),this.tabHandler.getAllTabs()}}exports.EvaluateException=f,exports.WaitUntilNetworkIdleHandler=I,exports.WaitUntilReturnTrue=L,exports.WaitforSelectorAppearTimeoutException=D,exports.default=W;
