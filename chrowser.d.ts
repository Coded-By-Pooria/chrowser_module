import Protocol from 'devtools-protocol';
import CDP from 'chrome-remote-interface';
import ProtocolProxyApi from 'devtools-protocol/types/protocol-proxy-api';

type TabNavigationOptions = {
    url: string;
    waitUntil?: 'documentloaded' | 'load';
};

type WaiterSignalFunc = TabEvaluateFunction<any, boolean | Promise<boolean>>;

type Input = CDP.DoEventPromises<'Input'> & CDP.DoEventListeners<'Input'> & CDP.AddOptParams<CDP.OptIfParamNullable<ProtocolProxyApi.InputApi>>;

interface TabMouseBaseOptions {
    x: number;
    y: number;
}
declare class MouseHandler {
    private inputContext;
    constructor(inputContext: Input);
    move(options: TabMouseBaseOptions): Promise<void>;
    click(options: TabMouseBaseOptions & {
        delay?: number;
    }): Promise<void>;
}

interface NodeROCreator {
    createRO(ro: Protocol.Runtime.RemoteObject): RemoteNodeDelegator;
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
    get subType(): "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error" | "proxy" | "promise" | "typedarray" | "arraybuffer" | "dataview" | "webassemblymemory" | "wasmvalue" | undefined;
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

interface Evaluable {
    evaluate<T extends TabEvaluateFunction>(script: T | string, ...args: any[]): Promise<Awaited<ReturnType<T>>>;
    $(selector: string): Promise<RemoteNodeDelegator | null>;
    $$(selector: string): Promise<RemoteNodeDelegator[]>;
    $evaluate<T extends TabEvaluateFunction<HTMLElement>>(selector: string, handler: T): Promise<ReturnType<T>>;
    $$evaluate<T extends TabEvaluateFunction<HTMLElement[]>>(selector: string, handler: T): Promise<ReturnType<T>>;
}

type TabEvaluateFunction<T = any, P = any> = (...args: T[]) => P;
interface Tab extends Evaluable {
    tabId: string;
    mouseHandler: MouseHandler;
    navigate(options: TabNavigationOptions): Promise<void>;
    waitForSelectorAppear(selector: string, options?: PollWaitForOptions): Promise<void>;
    waitUntilReturnTrue(script: WaiterSignalFunc, options?: PollWaitForOptions, ...args: any[]): Promise<void>;
    addScriptToRunOnNewDocument(script: string | TabEvaluateFunction): Promise<void>;
    waitUntilNetworkIdle(options: WaitUntilNetworkIdleOptions): Promise<void>;
    close(): Promise<void>;
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
declare class Browser implements TabHandlerInterface {
    private browserOptions?;
    private isClosed;
    static create(options?: BrowserOptions): Promise<Browser>;
    private constructor();
    private window;
    private tabHandler;
    private init;
    newTab(options?: {
        url: string;
    }): Promise<Tab>;
    close(): void;
    private isCloseCheck;
    getAllOpenTabs(): Tab[];
}

export { type Tab, type TabEvaluateFunction, type TabNavigationOptions, Browser as default };
