import {
  Headers as NodeHeaders, readableStreamToString,
  Request as NodeRequest
} from "@remix-run/node";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyResult
} from "aws-lambda";
import type {
  // This has been added as a global in node 15+
  AbortController,
  Response as NodeResponse,
} from "@remix-run/node";
import { URLSearchParams } from "url";

import { isBinaryType } from "../binaryTypes";

export function createRemixRequest(
  event: APIGatewayProxyEvent,
  abortController?: AbortController
): NodeRequest {
  let host = event.headers["x-forwarded-host"] || event.headers.host;
  let scheme = process.env.ARC_SANDBOX ? "http" : "https";
  let url = new URL(event.path, `${scheme}://${host}`);

  if (
    event.queryStringParameters &&
    Object.keys(event.queryStringParameters).length
  ) {
    url.search = `?${new URLSearchParams(event.queryStringParameters as unknown as Iterable<[string, string]>).toString()}`
  }

  let isFormData = event.headers["content-type"]?.includes(
    "multipart/form-data"
  );

  return new NodeRequest(url.href, {
    method: event.requestContext.httpMethod,
    headers: createRemixHeaders(event.headers),
    body:
      event.body && event.isBase64Encoded
        ? isFormData
          ? Buffer.from(event.body, "base64")
          : Buffer.from(event.body, "base64").toString()
        : event.body || undefined,
    signal: abortController?.signal,
  });
}

export function createRemixHeaders(
  requestHeaders: APIGatewayProxyEventHeaders
): NodeHeaders {
  let headers = new NodeHeaders();

  for (let [header, value] of Object.entries(requestHeaders)) {
    if (value) {
      headers.append(header, value);
    }
  }

  return headers;
}

export async function sendRemixResponse(
  nodeResponse: NodeResponse
): Promise<APIGatewayProxyResult> {
  let contentType = nodeResponse.headers.get("Content-Type");
  let isBase64Encoded = isBinaryType(contentType);
  let body: string | undefined;

  if (nodeResponse.body) {
    if (isBase64Encoded) {
      body = await readableStreamToString(nodeResponse.body, "base64");
    } else {
      body = await nodeResponse.text();
    }
  }

  return {
    statusCode: nodeResponse.status,
    headers: Object.fromEntries(nodeResponse.headers.entries()),
    body: body || '',
    isBase64Encoded,
  };
}