import EventEmitter from "events";
import { Result } from "../surrealdbjs";

declare interface AppEvents extends EventEmitter {
    on(event: "querySuccess", listener: (result: Result<unknown>[]) => void): this;
    // on(event: "websocket_state", listener: (state: string) => void): this;
    // on(event: "packet", listener: (packet: ICorePacket) => void): this;
    // on(event: string, listener: Function): this; 
}

export const appEvents: AppEvents = new EventEmitter();

