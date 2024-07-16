// https://www.npmjs.com/package/@types/dom-serial
type EventHandler = (event: Event) => void;

interface SerialPortInfoBase {
    serialNumber: string;
    manufacturer: string;
    locationId: string;
    vendorId: string;
    vendor: string;
    productId: string;
    product: string;
}

interface SerialPortFilter {
    usbVendorId: number;
    usbProductId?: number | undefined;
}

interface SerialPortInfo extends SerialPortInfoBase, SerialPortFilter {} // mix spec and Chromium implementation

type ParityType = "none" | "even" | "odd" | "mark" | "space";

type FlowControlType = "none" | "hardware";

interface SerialOptions {
    baudRate: number;
    dataBits?: number | undefined;
    stopBits?: number | undefined;
    parity?: ParityType | undefined;
    bufferSize?: number | undefined;
    flowControl?: FlowControlType | undefined;
}

interface SerialPort extends EventTarget {
    onconnect: EventHandler;
    ondisconnect: EventHandler;
    readonly connected: boolean;
    readonly readable: ReadableStream; // Chromium implementation (spec: in)
    readonly writable: WritableStream; // Chromium implementation (spec: out)

    open(options: SerialOptions): Promise<void>;
    setSignals(signals: SerialOutputSignals = {}): Promise<undefined>;
    getInfo(): Partial<SerialPortInfo>;
    getSignals(): Promise<SerialInputSignals>;
    close(): Promise<undefined>;
    forget(): Promise<undefined>;
}

interface SerialPortRequestOptions {
    filters: SerialPortFilter[];
}

interface Serial extends EventTarget {
    onconnect: EventHandler;
    ondisconnect: EventHandler;
    getPorts(): Promise<SerialPort[]>;
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>; // Chromium implementation (spec: SerialOptions)
}

interface Navigator {
    readonly serial: Serial;
}

interface SerialInputSignals {
    readonly dataCarrierDetect: boolean;
    readonly clearToSend: boolean;
    readonly ringIndicator: boolean;
    readonly dataSetReady: boolean;
}

interface SerialOutputSignals {
    dataTerminalReady: boolean;
    requestToSend: boolean;
    break: boolean;
}