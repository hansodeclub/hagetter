// To parse this data:
//
//   import { Convert, PostVisibility, HagetterPost, HagetterPostInfo, HagetterPostData } from "./file";
//
//   const postVisibility = Convert.toPostVisibility(json);
//   const hagetterPost = Convert.toHagetterPost(json);
//   const hagetterPostInfo = Convert.toHagetterPostInfo(json);
//   const hagetterPostData = Convert.toHagetterPostData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * はげったーのポスト情報
 * 一覧取得とかで使う
 *
 * はげったーのポストの中身
 */
export interface HagetterPost {
  avatar:      string;
  created_at:  Date;
  description: string;
  displayName: string;
  id:          string;
  image:       null | string;
  stars:       number;
  title:       string;
  updated_at?: Date;
  username:    string;
  visibility:  PostVisibility;
  data:        any[];
  user:        any;
}

export enum PostVisibility {
  Draft = "draft",
  Public = "public",
  Unlisted = "unlisted",
}

/**
 * はげったーのポスト情報
 * 一覧取得とかで使う
 */
export interface HagetterPostInfo {
  avatar:      string;
  created_at:  Date;
  description: string;
  displayName: string;
  id:          string;
  image:       null | string;
  stars:       number;
  title:       string;
  updated_at?: Date;
  username:    string;
  visibility:  PostVisibility;
}

/**
 * はげったーのポストの中身
 */
export interface HagetterPostData {
  data: any[];
  user: any;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toPostVisibility(json: string): PostVisibility {
    return cast(JSON.parse(json), r("PostVisibility"));
  }

  public static postVisibilityToJson(value: PostVisibility): string {
    return JSON.stringify(uncast(value, r("PostVisibility")), null, 2);
  }

  public static toHagetterPost(json: string): HagetterPost {
    return cast(JSON.parse(json), r("HagetterPost"));
  }

  public static hagetterPostToJson(value: HagetterPost): string {
    return JSON.stringify(uncast(value, r("HagetterPost")), null, 2);
  }

  public static toHagetterPostInfo(json: string): HagetterPostInfo {
    return cast(JSON.parse(json), r("HagetterPostInfo"));
  }

  public static hagetterPostInfoToJson(value: HagetterPostInfo): string {
    return JSON.stringify(uncast(value, r("HagetterPostInfo")), null, 2);
  }

  public static toHagetterPostData(json: string): HagetterPostData {
    return cast(JSON.parse(json), r("HagetterPostData"));
  }

  public static hagetterPostDataToJson(value: HagetterPostData): string {
    return JSON.stringify(uncast(value, r("HagetterPostData")), null, 2);
  }
}

function invalidValue(typ: any, val: any): never {
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "HagetterPost": o([
    { json: "avatar", js: "avatar", typ: "" },
    { json: "created_at", js: "created_at", typ: Date },
    { json: "description", js: "description", typ: "" },
    { json: "displayName", js: "displayName", typ: "" },
    { json: "id", js: "id", typ: "" },
    { json: "image", js: "image", typ: u(null, "") },
    { json: "stars", js: "stars", typ: 3.14 },
    { json: "title", js: "title", typ: "" },
    { json: "updated_at", js: "updated_at", typ: u(undefined, Date) },
    { json: "username", js: "username", typ: "" },
    { json: "visibility", js: "visibility", typ: r("PostVisibility") },
    { json: "data", js: "data", typ: a("any") },
    { json: "user", js: "user", typ: "any" },
  ], "any"),
  "HagetterPostInfo": o([
    { json: "avatar", js: "avatar", typ: "" },
    { json: "created_at", js: "created_at", typ: Date },
    { json: "description", js: "description", typ: "" },
    { json: "displayName", js: "displayName", typ: "" },
    { json: "id", js: "id", typ: "" },
    { json: "image", js: "image", typ: u(null, "") },
    { json: "stars", js: "stars", typ: 3.14 },
    { json: "title", js: "title", typ: "" },
    { json: "updated_at", js: "updated_at", typ: u(undefined, Date) },
    { json: "username", js: "username", typ: "" },
    { json: "visibility", js: "visibility", typ: r("PostVisibility") },
  ], "any"),
  "HagetterPostData": o([
    { json: "data", js: "data", typ: a("any") },
    { json: "user", js: "user", typ: "any" },
  ], "any"),
  "PostVisibility": [
    "draft",
    "public",
    "unlisted",
  ],
};
