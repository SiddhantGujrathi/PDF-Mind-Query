import fetch, { Headers, Request, Response } from "node-fetch-native";

globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;