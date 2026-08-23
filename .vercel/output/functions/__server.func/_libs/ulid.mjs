function createError(message) {
  const err = new Error(message);
  err.source = "ulid";
  return err;
}
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ENCODING_LEN = ENCODING.length;
const TIME_MAX = Math.pow(2, 48) - 1;
const TIME_LEN = 10;
const RANDOM_LEN = 16;
function randomChar(prng) {
  let rand = Math.floor(prng() * ENCODING_LEN);
  if (rand === ENCODING_LEN) {
    rand = ENCODING_LEN - 1;
  }
  return ENCODING.charAt(rand);
}
function encodeTime(now, len) {
  if (isNaN(now)) {
    throw new Error(now + " must be a number");
  }
  if (now > TIME_MAX) {
    throw createError("cannot encode time greater than " + TIME_MAX);
  }
  if (now < 0) {
    throw createError("time must be positive");
  }
  if (Number.isInteger(Number(now)) === false) {
    throw createError("time must be an integer");
  }
  let mod;
  let str = "";
  for (; len > 0; len--) {
    mod = now % ENCODING_LEN;
    str = ENCODING.charAt(mod) + str;
    now = (now - mod) / ENCODING_LEN;
  }
  return str;
}
function encodeRandom(len, prng) {
  let str = "";
  for (; len > 0; len--) {
    str = randomChar(prng) + str;
  }
  return str;
}
function detectPrng(allowInsecure = false, root) {
  if (!root) {
    root = typeof window !== "undefined" ? window : null;
  }
  const browserCrypto = root && (root.crypto || root.msCrypto);
  if (browserCrypto) {
    return () => {
      const buffer = new Uint8Array(1);
      browserCrypto.getRandomValues(buffer);
      return buffer[0] / 255;
    };
  } else {
    try {
      const nodeCrypto = require("crypto");
      return () => nodeCrypto.randomBytes(1).readUInt8() / 255;
    } catch (e) {
    }
  }
  if (allowInsecure) {
    try {
      console.error("secure crypto unusable, falling back to insecure Math.random()!");
    } catch (e) {
    }
    return () => Math.random();
  }
  throw createError("secure crypto unusable, insecure Math.random not allowed");
}
function factory(currPrng) {
  if (!currPrng) {
    currPrng = detectPrng();
  }
  return function ulid2(seedTime) {
    if (isNaN(seedTime)) {
      seedTime = Date.now();
    }
    return encodeTime(seedTime, TIME_LEN) + encodeRandom(RANDOM_LEN, currPrng);
  };
}
const ulid = factory();
export {
  detectPrng,
  encodeRandom,
  encodeTime,
  factory,
  randomChar,
  ulid
};
