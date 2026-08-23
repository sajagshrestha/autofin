import { h as hc } from "../_libs/hono.mjs";
const rpc = hc("/");
class ApiError extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
function extractErrorMessage(body) {
  if (!body) return void 0;
  if (typeof body.error === "string") return body.error;
  const errObj = body.error && typeof body.error === "object" ? body.error : void 0;
  const issue = errObj?.issues?.[0];
  if (issue) {
    const prefix = issue.path?.length ? `${issue.path.join(".")}: ` : "";
    return `${prefix}${issue.message}`;
  }
  return errObj?.message ?? body.message ?? void 0;
}
async function unwrap(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      extractErrorMessage(body) ?? `${response.status} ${response.statusText}`
    );
  }
  return await response.json();
}
export {
  rpc as r,
  unwrap as u
};
