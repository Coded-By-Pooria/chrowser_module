/// <reference types="node" />
import * as Notifier from '@pourianof/notifier';
import { BaseNotifier, ListenCallback } from '@pourianof/notifier';
import CDP from 'chrome-remote-interface';
import ProtocolProxyApi from 'devtools-protocol/types/protocol-proxy-api';
import Protocol from 'devtools-protocol';

interface Evaluable {
    evaluate<T extends TabEvaluateFunction>(script: T | string, ...args: any[]): Promise<Awaited<ReturnType<T>>>;
    $(selector: string): Promise<RemoteNodeDelegator | null>;
    $$(selector: string): Promise<RemoteNodeDelegator[]>;
    $evaluate<T extends TabEvaluateFunction<HTMLElement>>(selector: string, handler: T): Promise<ReturnType<T>>;
    $$evaluate<T extends TabEvaluateFunction<HTMLElement[]>>(selector: string, handler: T): Promise<ReturnType<T>>;
}

type TabNavigationOptions = {
    url: string;
    waitUntil?: 'documentloaded' | 'load';
};

declare class WaitForSelector extends Error {
}

declare class BaseWaiterMixin {
    protected waiterResolver: () => void;
    protected waiterRejecter: (reason?: any) => void;
    protected wait(): Promise<void>;
}

declare abstract class BasePollStateMixin extends BaseWaiterMixin {
    protected pollInterval: number;
    protected timeOut: number;
    constructor(pollInterval: number, timeOut: number);
    private startTime;
    protected start(): Promise<void>;
    private poll;
    private scheduleNextPoll;
    protected abstract onTimeOut(): Error;
    protected abstract polling(): Promise<boolean>;
}

type WaiterSignalFunc = TabEvaluateFunction<any, boolean | Promise<boolean>>;
declare class WaitUntilReturnTrue extends BasePollStateMixin {
    private signalFunc;
    private evaluateContext;
    private args?;
    static start(signalFunc: WaiterSignalFunc, evaluateContext: Evaluable, pollInterval?: number, timeOut?: number, ...args: any[]): Promise<void>;
    private constructor();
    protected onTimeOut(): WaitForSelector;
    protected polling(): Promise<boolean>;
}

type Input = CDP.DoEventPromises<'Input'> & CDP.DoEventListeners<'Input'> & CDP.AddOptParams<CDP.OptIfParamNullable<ProtocolProxyApi.InputApi>>;
type Network = CDP.DoEventPromises<'Network'> & CDP.DoEventListeners<'Network'> & CDP.AddOptParams<CDP.OptIfParamNullable<ProtocolProxyApi.NetworkApi>>;

interface TabMouseBaseOptions {
    x: number;
    y: number;
    tiltX?: number;
    tiltY?: number;
    mousePressure?: number;
    tangentialPressure?: number;
}
declare class MouseHandler {
    private inputContext;
    constructor(inputContext: Input);
    move(options: TabMouseBaseOptions): Promise<void>;
    click(options: TabMouseBaseOptions & {
        delay?: number;
    }): Promise<void>;
}

declare enum KeyboardKeys {
    ALPHABET_A = "KeyA",
    ALPHABET_B = "KeyB",
    ALPHABET_C = "KeyC",
    ALPHABET_D = "KeyD",
    ALPHABET_E = "KeyE",
    ALPHABET_F = "KeyF",
    ALPHABET_G = "KeyG",
    ALPHABET_H = "KeyH",
    ALPHABET_I = "KeyI",
    ALPHABET_J = "KeyJ",
    ALPHABET_K = "KeyK",
    ALPHABET_L = "KeyL",
    ALPHABET_M = "KeyM",
    ALPHABET_N = "KeyN",
    ALPHABET_O = "KeyO",
    ALPHABET_Q = "KeyQ",
    ALPHABET_R = "KeyR",
    ALPHABET_S = "KeyS",
    ALPHABET_T = "KeyT",
    ALPHABET_U = "KeyU",
    ALPHABET_V = "KeyV",
    ALPHABET_W = "KeyW",
    ALPHABET_X = "KeyX",
    ALPHABET_Y = "KeyY",
    ALPHABET_Z = "KeyZ",
    SPACE_BAR = "Space",
    ENTER = "Enter",
    KEY_UP = "ArrowUp",
    KEY_DOWN = "ArrowDOWN",
    KEY_LEFT = "ArrowLeft",
    KEY_RIGHT = "ArrowRight",
    CAPS_LOCK = "CapsLock",
    TAB = "Tab",
    SHIFT_LEFT = "ShiftLeft",
    SHIFT_RIGHT = "ShiftRight",
    CONTROL_LEFT = "ControlLeft",
    CONTROL_RIGHT = "ControlRight",
    BACKSPACE = "Backspace",
    ESC = "Escape",
    ALT_LEFT = "AltLeft",
    ALT_RIGHT = "AltRight",
    DEL = "Delete",
    NUMPAD_1 = "Numpad1",
    NUMPAD_2 = "Numpad1",
    NUMPAD_3 = "Numpad1",
    NUMPAD_4 = "Numpad1",
    NUMPAD_5 = "Numpad1",
    NUMPAD_6 = "Numpad1",
    NUMPAD_7 = "Numpad1",
    NUMPAD_8 = "Numpad1",
    NUMPAD_9 = "Numpad1",
    NUMPAD_0 = "Numpad1",
    NUMPAD_SUBTRACT = "NumpadSubtract",
    NUMPAD_SUM = "NumpadAdd",
    NUMPAD_ENTER = "NumpadEnter",
    NUMPAD_DOT = "NumpadDecimal",
    NUMPAD_DIVIDE = "NumpadDivide",
    NUMPAD_MULTIPLE = "NumpadMultiply",
    NUMLOCK = "NumLock",
    MINUS = "Minus",
    DIGIT_1 = "Digit1",
    DIGIT_2 = "Digit2",
    DIGIT_3 = "Digit3",
    DIGIT_4 = "Digit4",
    DIGIT_5 = "Digit5",
    DIGIT_6 = "Digit6",
    DIGIT_7 = "Digit7",
    DIGIT_8 = "Digit8",
    DIGIT_9 = "Digit9",
    BACK_QOUTE = "Backquote"
}
declare class KeyboardHandler {
    private inputContext;
    constructor(inputContext: Input);
    keyDown(key: KeyboardKeys): Promise<void>;
    keyUp(key: KeyboardKeys): Promise<void>;
    press(key: KeyboardKeys, options?: {
        delay?: number;
    }): Promise<void>;
}

interface WaitForPossibleNavigationOptions {
    waitFor?: number;
}
interface Navigatable {
    navigate(options: TabNavigationOptions): Promise<void>;
    waitForPossibleNavigation(options?: WaitForPossibleNavigationOptions): Promise<void>;
}
type NavigationType = 'NavigationMethod' | 'DocumentInnerAction';
interface NavigationFinishState {
    state: NavigationState;
    url: string;
    type: NavigationType;
}
interface NavigationObj {
    isDone: boolean;
    isCanceled: boolean;
    isFinished: boolean;
    navigationType: NavigationType;
    whenComplete(): Promise<NavigationFinishState>;
    whenDocumentLoaded(): Promise<void>;
}
type NavigationEvents = {
    NavigateRequest: NavigationObj;
};
declare enum NavigationState {
    DONE = 0,
    CANCELED = 1,
    NOT_COMPLETED = 2,
    DOCUMENT_LOADED = 3,
    FORGOTTED = 4
}

interface NodeROCreator {
    createRO(ro: Protocol.Runtime.RemoteObject): RemoteNodeDelegator;
}
type FrameEvents = NavigationEvents;
interface FrameBase extends Evaluable, BaseNotifier<FrameEvents>, Navigatable {
    navigate(options: TabNavigationOptions): Promise<void>;
    waitForSelectorAppear(selector: string, options?: PollWaitForOptions): Promise<void>;
    reload(): Promise<void>;
    waitUntilReturnTrue(script: WaiterSignalFunc, options?: PollWaitForOptions, ...args: any[]): Promise<void>;
    addScriptToRunOnNewDocument(script: string | TabEvaluateFunction, ...args: any[]): Promise<string>;
    waitUntilNetworkIdle(options: WaitUntilNetworkIdleOptions): Promise<void>;
}

declare class ExecutionContext {
    private context;
    private creator;
    private id;
    constructor(context: CDP.Client, creator: NodeROCreator, id: number);
    get executionContextId(): number;
    private runExpression;
    private runFunction;
    private chechContext;
    evaluate<T extends TabEvaluateFunction | string>(returnRemoteObject: boolean, script: T, ...args: any[]): Promise<EvaledType<T>>;
    releaseRO(ro: RemoteNodeDelegator): Promise<void>;
}
type EvaledType<T extends TabEvaluateFunction | string> = T extends string ? any : Awaited<ReturnType<Exclude<T, string>>> extends infer X ? X extends Node ? RemoteNodeDelegator<X> : X extends (Node | null)[] ? (RemoteNodeDelegator<NonNullable<X[number]>> | null)[] : never : never;

declare class RemoteObjectDelegator {
    private ro;
    constructor(ro: Protocol.Runtime.RemoteObject);
    get id(): string;
    get type(): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
    get subType(): "error" | "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "proxy" | "promise" | "typedarray" | "arraybuffer" | "dataview" | "webassemblymemory" | "wasmvalue" | undefined;
    get description(): string | undefined;
}

declare class RemoteNodeDelegator<T extends Node = HTMLElement> extends RemoteObjectDelegator implements Evaluable {
    #private;
    private context;
    private mouseHandler;
    constructor(context: ExecutionContext, mouseHandler: MouseHandler, ro: Protocol.Runtime.RemoteObject);
    evaluate(script: string | TabEvaluateFunction, ...args: any[]): Promise<any>;
    $(selector: string): Promise<RemoteNodeDelegator | null>;
    click(withMouse?: boolean): Promise<void>;
    $$(selector: string): Promise<RemoteNodeDelegator[]>;
    $evaluate<T extends TabEvaluateFunction<HTMLElement>>(selector: string, handler: T): Promise<ReturnType<T>>;
    $$evaluate<T extends TabEvaluateFunction<HTMLElement[]>>(selector: string, handler: T): Promise<ReturnType<T>>;
    private released;
    release(): Promise<void>;
}

type TabEvaluateFunction<T = any, P = any> = (...args: T[]) => P;
interface Tab extends FrameBase {
    tabId: string;
    mouseHandler: MouseHandler;
    keyboardHandler: KeyboardHandler;
    close(): Promise<void>;
    bringToFront(): Promise<void>;
    screenshot(options: {
        savePath: string;
        format?: 'png' | 'webp' | 'jpeg';
        quality?: number;
        totalPage?: boolean;
    }): Promise<void>;
    browser: Browser;
    getTabTitle(): Promise<string>;
}
interface WaitUntilNetworkIdleOptions {
    idleInterval: number;
    idleNumber?: number;
}
interface PollWaitForOptions {
    pollInterval?: number;
    waitTimeOut?: number;
}

interface TabHandlerInterface {
    newTab(options: {
        url: string;
    }): Promise<Tab>;
}

interface BrowserOptions {
    args?: string[];
    userDir?: string;
}
declare class Browser implements TabHandlerInterface, BaseNotifier<'closed'> {
    private browserOptions?;
    private isClosed;
    private _notifier;
    private get notifier();
    addListener<_E extends 'closed'>(eventName: _E, data: ListenCallback<_E, any>): Notifier.Listener;
    static create(options?: BrowserOptions): Promise<Browser>;
    protected constructor(browserOptions?: BrowserOptions | undefined);
    private window;
    private tabHandler;
    private _userAgent;
    private _version;
    private closeWaitor;
    protected init(): Promise<void>;
    waitForClose(): Promise<void>;
    get version(): string;
    get port(): number;
    get pid(): number;
    get userAgent(): string;
    newTab(options?: {
        url: string;
    }): Promise<Tab>;
    private closeNofiying;
    close(): void;
    private isCloseCheck;
    getAllOpenTabs(): Tab[];
}

declare class EvaluateException extends Error {
    private error;
    static mapToCallSite(stack: Protocol.Runtime.StackTrace): NodeJS.CallSite[];
    constructor(error: Protocol.Runtime.ExceptionDetails);
    printEvalStackTrace(): any;
}

declare class WaitforSelectorAppearTimeoutException extends Error {
    constructor(timeout: number, selector: string);
}

declare class WaitUntilNetworkIdleHandler extends BaseWaiterMixin {
    private networkContext;
    private idleInterval;
    private tolerance;
    private constructor();
    private lastIdleItem;
    private isResolved;
    private timerId;
    private start;
    private resetTimer;
    private setTimer;
    private resolve;
    static start(networkContext: Network, options: WaitUntilNetworkIdleOptions & {
        tolerance?: number;
    }): Promise<void>;
}

export { EvaluateException, type Tab, type TabEvaluateFunction, type TabNavigationOptions, WaitUntilNetworkIdleHandler, WaitUntilReturnTrue, WaitforSelectorAppearTimeoutException, Browser as default };
