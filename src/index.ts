
export type PeerPublicKey = string;

export interface Peer {
  publicKey: PeerPublicKey;
  dpHash
}

const cyrb53 = {
  /**
   * Hash a string to a 53bit hash
   * https://stackoverflow.com/a/52171480/8112809
   * @param str 
   * @param seed 
   * @returns 53 bit hash of string
   */
  string(str: string, seed: number = 0): number {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    let ch: number;
    for (let i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  },
  /**
   * Modified from https://stackoverflow.com/a/52171480/8112809 to support dataview hashing
   * @param view 
   * @param seed 
   * @returns 
   */
  dataview(view: DataView, seed: number = 0): number {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    let ch: number;
    let length = view.byteLength;
    for (let i = 0; i < length; i++) {
      ch = view.getUint8(i); //str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  },
  /**
   * Modified from https://stackoverflow.com/a/52171480/8112809 to support string array hashing
   * @param view 
   * @param seed 
   * @returns 
   */
  stringArray(sa: Array<string>, seed: number = 0, sort: boolean = true): number {

    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    let ch: number;

    for (let str of sa) {
      for (let i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  },
  objectKeys(obj: any, seed: number = 0): number {
    return cyrb53.stringArray(Object.keys(obj), seed);
  }
};

export async function test() {
  let timeStart = Date.now();

  let myPublicKey = 0xdeadbeef;
  let myObj = {
    msg: "Hello World"
  };
  myObj = window as any;

  let myObjKeyHash = cyrb53.objectKeys(myObj, myPublicKey);

  myObj["keys"] = "mutated";

  let myObjKeyHashNew = cyrb53.objectKeys(myObj, myPublicKey);

  if (myObjKeyHash === myObjKeyHashNew) {
    console.log("Nothing changed", "myObjKeyHash", myObjKeyHash);
  } else {
    console.log("Something changed", "myObjKeyHash:", myObjKeyHash, ", myObjKeyHashNew", myObjKeyHashNew);
  }
  let timeEnd = Date.now();
  let timeElapsed = timeEnd - timeStart;
  let timeElapsedSeconds = timeElapsed / 1000;

  console.log("Took", timeElapsed, "ms");
}

test();
