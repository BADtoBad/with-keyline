/*!
This build includes the following MIT-licensed parser libraries and icon assets:

@lezer/markdown 1.8.0
Copyright (C) 2020 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
https://code.haverbeke.berlin/lezer/markdown

@lezer/common 1.5.3 and @lezer/highlight 1.2.5
Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others
https://code.haverbeke.berlin/lezer/common
https://code.haverbeke.berlin/lezer/highlight

Keyline Icons — Copyright (c) 2026 Keyline Icons
Pinned commit: 14cd695f3f2bbe320bbe7a01e65b251df7ba52cf
Four SVG geometries retain the user's accepted previous icon library:
https://github.com/keyline-icons/keyline-icons/blob/14cd695f3f2bbe320bbe7a01e65b251df7ba52cf/icons/sharp/fill/folder.svg
https://github.com/keyline-icons/keyline-icons/blob/14cd695f3f2bbe320bbe7a01e65b251df7ba52cf/icons/sharp/stroke/folder-open.svg
https://github.com/keyline-icons/keyline-icons/blob/14cd695f3f2bbe320bbe7a01e65b251df7ba52cf/icons/sharp/fill/file-text.svg
https://github.com/keyline-icons/keyline-icons/blob/14cd695f3f2bbe320bbe7a01e65b251df7ba52cf/icons/sharp/fill/file-image.svg
https://github.com/keyline-icons/keyline-icons/blob/14cd695f3f2bbe320bbe7a01e65b251df7ba52cf/LICENSE
Obsidian's own Lucide inventory continues to supply action/category icons and
explicit user choices. No host registry is replaced.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => KeylineNext
});
module.exports = __toCommonJS(main_exports);
var import_obsidian30 = require("obsidian");

// src/domain/typography.ts
var typographySpecs = {
  width: { label: ["Text width", "\u680F\u5BBD"], min: 320, max: 1600, step: 20, initial: 600, unit: "px", token: "text-max-width" },
  inset: { label: ["Side padding (\u22121 = auto)", "\u7559\u767D\uFF08\u22121 \u4E3A\u81EA\u52A8\uFF09"], min: -1, max: 160, step: 1, initial: -1, unit: "px", token: "page-side-padding" },
  editorLeading: { label: ["Editor line height", "\u7F16\u8F91\u884C\u9AD8"], min: 1.2, max: 2.2, step: 0.05, initial: 1.85, unit: "", token: "editor-line-height" },
  readingLeading: { label: ["Reading line height", "\u9605\u8BFB\u884C\u9AD8"], min: 1.2, max: 2.2, step: 0.05, initial: 1.8, unit: "", token: "reading-line-height" },
  paragraphGap: { label: ["Line gap", "\u884C\u95F4\u8DDD"], min: 0, max: 1.5, step: 0.05, initial: 1, unit: "em", token: "paragraph-gap" },
  paragraphBefore: { label: ["Before paragraph", "\u6BB5\u524D"], min: 0, max: 2, step: 0.05, initial: 1, unit: "em", token: "paragraph-before" },
  paragraphAfter: { label: ["After paragraph", "\u6BB5\u540E"], min: 0, max: 2, step: 0.05, initial: 1, unit: "em", token: "paragraph-after" },
  firstIndent: { label: ["First-line indent", "\u9996\u884C\u7F29\u8FDB"], min: 0, max: 4, step: 0.25, initial: 0, unit: "em", token: "first-line-indent" },
  listLeading: { label: ["List line height", "\u5217\u8868\u884C\u9AD8"], min: 1.2, max: 2.2, step: 0.05, initial: 1.8, unit: "", token: "list-line-height" },
  listGap: { label: ["List item gap", "\u5217\u8868\u95F4\u8DDD"], min: 0, max: 0.8, step: 0.02, initial: 0, unit: "em", token: "list-item-spacing" },
  listIndent: { label: ["List indent", "\u5217\u8868\u7F29\u8FDB"], min: 0.75, max: 3.5, step: 0.05, initial: 1.8, unit: "em", token: "list-indent" },
  markerGap: { label: ["Marker gap", "\u7B26\u53F7\u95F4\u8DDD"], min: 4, max: 18, step: 1, initial: 10, unit: "px", token: "list-marker-gap" },
  bulletSize: { label: ["Bullet size", "\u5706\u70B9\u5927\u5C0F"], min: 3, max: 8, step: 0.5, initial: 7, unit: "px", token: "list-bullet-size" },
  quoteIndent: { label: ["Quote indent", "\u5F15\u7528\u7F29\u8FDB"], min: 8, max: 32, step: 1, initial: 16, unit: "px", token: "blockquote-indent" },
  headingBefore: { label: ["Before heading", "\u6807\u9898\u6BB5\u524D"], min: 0.5, max: 3, step: 0.1, initial: 1.8, unit: "em", token: "heading-before" },
  headingAfter: { label: ["After heading", "\u6807\u9898\u6BB5\u540E"], min: 0, max: 1.5, step: 0.05, initial: 0.6, unit: "em", token: "heading-after" }
};
var typographyKeys = Object.keys(typographySpecs);
function normalizeTypography(value) {
  const raw = value && typeof value === "object" ? value : {};
  const result = {};
  for (const key of typographyKeys) {
    const spec = typographySpecs[key], n = raw[key];
    const value2 = typeof n === "number" && Number.isFinite(n) ? n : spec.initial;
    const tick = Math.round((Math.min(spec.max, Math.max(spec.min, value2)) - spec.min) / spec.step);
    result[key] = Number((spec.min + tick * spec.step).toFixed(4));
  }
  return result;
}
function typographyVariables(values) {
  const result = {};
  for (const key of typographyKeys) {
    const spec = typographySpecs[key];
    const value = key === "inset" ? values[key] < 0 ? "initial" : `min(${values[key]}px, 20cqw)` : `${values[key]}${spec.unit}`;
    result[`--ncl-${spec.token}`] = value;
    result[`--keyline-next-${key}`] = value;
  }
  result["--file-line-width"] = `${values.width}px`;
  result["--list-indent"] = `${values.listIndent}em`;
  result["--list-spacing"] = `${values.listGap / 2}em`;
  result["--list-bullet-size"] = `${values.bulletSize}px`;
  result["--ncl-list-first-indent"] = `${Number(Math.max(0.5, values.listIndent * 0.4).toFixed(2))}em`;
  return result;
}

// node_modules/.pnpm/@lezer+common@1.5.3/node_modules/@lezer/common/dist/index.js
var DefaultBufferLength = 1024;
var nextPropID = 0;
var Range = class {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }
};
var NodeProp = class {
  /**
  Create a new node prop type.
  */
  constructor(config = {}) {
    this.id = nextPropID++;
    this.perNode = !!config.perNode;
    this.deserialize = config.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
    this.combine = config.combine || null;
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(match) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    if (typeof match != "function")
      match = NodeType.match(match);
    return (type) => {
      let result = match(type);
      return result === void 0 ? null : [this, result];
    };
  }
};
NodeProp.closedBy = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.openedBy = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.group = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.isolate = new NodeProp({ deserialize: (value) => {
  if (value && value != "rtl" && value != "ltr" && value != "auto")
    throw new RangeError("Invalid value for isolate: " + value);
  return value || "auto";
} });
NodeProp.contextHash = new NodeProp({ perNode: true });
NodeProp.lookAhead = new NodeProp({ perNode: true });
NodeProp.mounted = new NodeProp({ perNode: true });
var MountedTree = class {
  constructor(tree, overlay, parser2, bracketed = false) {
    this.tree = tree;
    this.overlay = overlay;
    this.parser = parser2;
    this.bracketed = bracketed;
  }
  /**
  @internal
  */
  static get(tree) {
    return tree && tree.props && tree.props[NodeProp.mounted.id];
  }
};
var noProps = /* @__PURE__ */ Object.create(null);
var NodeType = class {
  /**
  @internal
  */
  constructor(name2, props, id, flags = 0) {
    this.name = name2;
    this.props = props;
    this.id = id;
    this.flags = flags;
  }
  /**
  Define a node type.
  */
  static define(spec) {
    let props = spec.props && spec.props.length ? /* @__PURE__ */ Object.create(null) : noProps;
    let flags = (spec.top ? 1 : 0) | (spec.skipped ? 2 : 0) | (spec.error ? 4 : 0) | (spec.name == null ? 8 : 0);
    let type = new NodeType(spec.name || "", props, spec.id, flags);
    if (spec.props)
      for (let src of spec.props) {
        if (!Array.isArray(src))
          src = src(type);
        if (src) {
          if (src[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          props[src[0].id] = src[1];
        }
      }
    return type;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(prop) {
    return this.props[prop.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(name2) {
    if (typeof name2 == "string") {
      if (this.name == name2)
        return true;
      let group = this.prop(NodeProp.group);
      return group ? group.indexOf(name2) > -1 : false;
    }
    return this.id == name2;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(map) {
    let direct = /* @__PURE__ */ Object.create(null);
    for (let prop in map)
      for (let name2 of prop.split(" "))
        direct[name2] = map[prop];
    return (node) => {
      for (let groups = node.prop(NodeProp.group), i = -1; i < (groups ? groups.length : 0); i++) {
        let found = direct[i < 0 ? node.name : groups[i]];
        if (found)
          return found;
      }
    };
  }
};
NodeType.none = new NodeType(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
var NodeSet = class {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(types) {
    this.types = types;
    for (let i = 0; i < types.length; i++)
      if (types[i].id != i)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...props) {
    let newTypes = [];
    for (let type of this.types) {
      let newProps = null;
      for (let source of props) {
        let add = source(type);
        if (add) {
          if (!newProps)
            newProps = Object.assign({}, type.props);
          let value = add[1], prop = add[0];
          if (prop.combine && prop.id in newProps)
            value = prop.combine(newProps[prop.id], value);
          newProps[prop.id] = value;
        }
      }
      newTypes.push(newProps ? new NodeType(type.name, newProps, type.id, type.flags) : type);
    }
    return new NodeSet(newTypes);
  }
};
var CachedNode = /* @__PURE__ */ new WeakMap();
var CachedInnerNode = /* @__PURE__ */ new WeakMap();
var IterMode;
(function(IterMode2) {
  IterMode2[IterMode2["ExcludeBuffers"] = 1] = "ExcludeBuffers";
  IterMode2[IterMode2["IncludeAnonymous"] = 2] = "IncludeAnonymous";
  IterMode2[IterMode2["IgnoreMounts"] = 4] = "IgnoreMounts";
  IterMode2[IterMode2["IgnoreOverlays"] = 8] = "IgnoreOverlays";
  IterMode2[IterMode2["EnterBracketed"] = 16] = "EnterBracketed";
})(IterMode || (IterMode = {}));
var Tree = class {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(type, children2, positions, length, props) {
    this.type = type;
    this.children = children2;
    this.positions = positions;
    this.length = length;
    this.props = null;
    if (props && props.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [prop, value] of props)
        this.props[typeof prop == "number" ? prop : prop.id] = value;
    }
  }
  /**
  @internal
  */
  toString() {
    let mounted = MountedTree.get(this);
    if (mounted && !mounted.overlay)
      return mounted.tree.toString();
    let children2 = "";
    for (let ch of this.children) {
      let str = ch.toString();
      if (str) {
        if (children2)
          children2 += ",";
        children2 += str;
      }
    }
    return !this.type.name ? children2 : (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (children2.length ? "(" + children2 + ")" : "");
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(mode = 0) {
    return new TreeCursor(this.topNode, mode);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(pos, side = 0, mode = 0) {
    let scope = CachedNode.get(this) || this.topNode;
    let cursor = new TreeCursor(scope);
    cursor.moveTo(pos, side);
    CachedNode.set(this, cursor._tree);
    return cursor;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new TreeNode(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(pos, side = 0) {
    let node = resolveNode(CachedNode.get(this) || this.topNode, pos, side, false);
    CachedNode.set(this, node);
    return node;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(pos, side = 0) {
    let node = resolveNode(CachedInnerNode.get(this) || this.topNode, pos, side, true);
    CachedInnerNode.set(this, node);
    return node;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(pos, side = 0) {
    return stackIterator(this, pos, side);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(spec) {
    let { enter, leave, from = 0, to = this.length } = spec;
    let mode = spec.mode || 0, anon = (mode & IterMode.IncludeAnonymous) > 0;
    for (let c = this.cursor(mode | IterMode.IncludeAnonymous); ; ) {
      let entered = false;
      if (c.from <= to && c.to >= from && (!anon && c.type.isAnonymous || enter(c) !== false)) {
        if (c.firstChild())
          continue;
        entered = true;
      }
      for (; ; ) {
        if (entered && leave && (anon || !c.type.isAnonymous))
          leave(c);
        if (c.nextSibling())
          break;
        if (!c.parent())
          return;
        entered = true;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(prop) {
    return !prop.perNode ? this.type.prop(prop) : this.props ? this.props[prop.id] : void 0;
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let result = [];
    if (this.props)
      for (let id in this.props)
        result.push([+id, this.props[id]]);
    return result;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(config = {}) {
    return this.children.length <= 8 ? this : balanceRange(NodeType.none, this.children, this.positions, 0, this.children.length, 0, this.length, (children2, positions, length) => new Tree(this.type, children2, positions, length, this.propValues), config.makeTree || ((children2, positions, length) => new Tree(NodeType.none, children2, positions, length)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(data) {
    return buildTree(data);
  }
};
Tree.empty = new Tree(NodeType.none, [], [], 0);
var FlatBufferCursor = class {
  constructor(buffer, index) {
    this.buffer = buffer;
    this.index = index;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new FlatBufferCursor(this.buffer, this.index);
  }
};
var TreeBuffer = class {
  /**
  Create a tree buffer.
  */
  constructor(buffer, length, set) {
    this.buffer = buffer;
    this.length = length;
    this.set = set;
  }
  /**
  @internal
  */
  get type() {
    return NodeType.none;
  }
  /**
  @internal
  */
  toString() {
    let result = [];
    for (let index = 0; index < this.buffer.length; ) {
      result.push(this.childString(index));
      index = this.buffer[index + 3];
    }
    return result.join(",");
  }
  /**
  @internal
  */
  childString(index) {
    let id = this.buffer[index], endIndex = this.buffer[index + 3];
    let type = this.set.types[id], result = type.name;
    if (/\W/.test(result) && !type.isError)
      result = JSON.stringify(result);
    index += 4;
    if (endIndex == index)
      return result;
    let children2 = [];
    while (index < endIndex) {
      children2.push(this.childString(index));
      index = this.buffer[index + 3];
    }
    return result + "(" + children2.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(startIndex, endIndex, dir, pos, side) {
    let { buffer } = this, pick = -1;
    for (let i = startIndex; i != endIndex; i = buffer[i + 3]) {
      if (checkSide(side, pos, buffer[i + 1], buffer[i + 2])) {
        pick = i;
        if (dir > 0)
          break;
      }
    }
    return pick;
  }
  /**
  @internal
  */
  slice(startI, endI, from) {
    let b = this.buffer;
    let copy2 = new Uint16Array(endI - startI), len = 0;
    for (let i = startI, j = 0; i < endI; ) {
      copy2[j++] = b[i++];
      copy2[j++] = b[i++] - from;
      let to = copy2[j++] = b[i++] - from;
      copy2[j++] = b[i++] - startI;
      len = Math.max(len, to);
    }
    return new TreeBuffer(copy2, len, this.set);
  }
};
function checkSide(side, pos, from, to) {
  switch (side) {
    case -2:
      return from < pos;
    case -1:
      return to >= pos && from < pos;
    case 0:
      return from < pos && to > pos;
    case 1:
      return from <= pos && to > pos;
    case 2:
      return to > pos;
    case 4:
      return true;
  }
}
function resolveNode(node, pos, side, overlays) {
  var _a;
  while (node.from == node.to || (side < 1 ? node.from >= pos : node.from > pos) || (side > -1 ? node.to <= pos : node.to < pos)) {
    let parent = !overlays && node instanceof TreeNode && node.index < 0 ? null : node.parent;
    if (!parent)
      return node;
    node = parent;
  }
  let mode = overlays ? 0 : IterMode.IgnoreOverlays;
  if (overlays)
    for (let scan = node, parent = scan.parent; parent; scan = parent, parent = scan.parent) {
      if (scan instanceof TreeNode && scan.index < 0 && ((_a = parent.enter(pos, side, mode)) === null || _a === void 0 ? void 0 : _a.from) != scan.from)
        node = parent;
    }
  for (; ; ) {
    let inner = node.enter(pos, side, mode);
    if (!inner)
      return node;
    node = inner;
  }
}
var BaseNode = class {
  cursor(mode = 0) {
    return new TreeCursor(this, mode);
  }
  getChild(type, before = null, after = null) {
    let r = getChildren(this, type, before, after);
    return r.length ? r[0] : null;
  }
  getChildren(type, before = null, after = null) {
    return getChildren(this, type, before, after);
  }
  resolve(pos, side = 0) {
    return resolveNode(this, pos, side, false);
  }
  resolveInner(pos, side = 0) {
    return resolveNode(this, pos, side, true);
  }
  matchContext(context) {
    return matchNodeContext(this.parent, context);
  }
  enterUnfinishedNodesBefore(pos) {
    let scan = this.childBefore(pos), node = this;
    while (scan) {
      let last = scan.lastChild;
      if (!last || last.to != scan.to)
        break;
      if (last.type.isError && last.from == last.to) {
        node = scan;
        scan = last.prevSibling;
      } else {
        scan = last;
      }
    }
    return node;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
};
var TreeNode = class extends BaseNode {
  constructor(_tree, from, index, _parent) {
    super();
    this._tree = _tree;
    this.from = from;
    this.index = index;
    this._parent = _parent;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(i, dir, pos, side, mode = 0) {
    for (let parent = this; ; ) {
      for (let { children: children2, positions } = parent._tree, e = dir > 0 ? children2.length : -1; i != e; i += dir) {
        let next = children2[i], start = positions[i] + parent.from, mounted;
        if (!(mode & IterMode.EnterBracketed && next instanceof Tree && (mounted = MountedTree.get(next)) && !mounted.overlay && mounted.bracketed && pos >= start && pos <= start + next.length) && !checkSide(side, pos, start, start + next.length))
          continue;
        if (next instanceof TreeBuffer) {
          if (mode & IterMode.ExcludeBuffers)
            continue;
          let index = next.findChild(0, next.buffer.length, dir, pos - start, side);
          if (index > -1)
            return new BufferNode(new BufferContext(parent, next, i, start), null, index);
        } else if (mode & IterMode.IncludeAnonymous || (!next.type.isAnonymous || hasChild(next))) {
          let mounted2;
          if (!(mode & IterMode.IgnoreMounts) && (mounted2 = MountedTree.get(next)) && !mounted2.overlay)
            return new TreeNode(mounted2.tree, start, i, parent);
          let inner = new TreeNode(next, start, i, parent);
          return mode & IterMode.IncludeAnonymous || !inner.type.isAnonymous ? inner : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, pos, side, mode);
        }
      }
      if (mode & IterMode.IncludeAnonymous || !parent.type.isAnonymous)
        return null;
      if (parent.index >= 0)
        i = parent.index + dir;
      else
        i = dir < 0 ? -1 : parent._parent._tree.children.length;
      parent = parent._parent;
      if (!parent)
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(pos) {
    return this.nextChild(
      0,
      1,
      pos,
      2
      /* Side.After */
    );
  }
  childBefore(pos) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      pos,
      -2
      /* Side.Before */
    );
  }
  prop(prop) {
    return this._tree.prop(prop);
  }
  enter(pos, side, mode = 0) {
    let mounted;
    if (!(mode & IterMode.IgnoreOverlays) && (mounted = MountedTree.get(this._tree)) && mounted.overlay) {
      let rPos = pos - this.from, enterBracketed = mode & IterMode.EnterBracketed && mounted.bracketed;
      for (let { from, to } of mounted.overlay) {
        if ((side > 0 || enterBracketed ? from <= rPos : from < rPos) && (side < 0 || enterBracketed ? to >= rPos : to > rPos))
          return new TreeNode(mounted.tree, mounted.overlay[0].from + this.from, -1, this);
      }
    }
    return this.nextChild(0, 1, pos, side, mode);
  }
  nextSignificantParent() {
    let val = this;
    while (val.type.isAnonymous && val._parent)
      val = val._parent;
    return val;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
};
function getChildren(node, type, before, after) {
  let cur = node.cursor(), result = [];
  if (!cur.firstChild())
    return result;
  if (before != null)
    for (let found = false; !found; ) {
      found = cur.type.is(before);
      if (!cur.nextSibling())
        return result;
    }
  for (; ; ) {
    if (after != null && cur.type.is(after))
      return result;
    if (cur.type.is(type))
      result.push(cur.node);
    if (!cur.nextSibling())
      return after == null ? result : [];
  }
}
function matchNodeContext(node, context, i = context.length - 1) {
  for (let p = node; i >= 0; p = p.parent) {
    if (!p)
      return false;
    if (!p.type.isAnonymous) {
      if (context[i] && context[i] != p.name)
        return false;
      i--;
    }
  }
  return true;
}
var BufferContext = class {
  constructor(parent, buffer, index, start) {
    this.parent = parent;
    this.buffer = buffer;
    this.index = index;
    this.start = start;
  }
};
var BufferNode = class extends BaseNode {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(context, _parent, index) {
    super();
    this.context = context;
    this._parent = _parent;
    this.index = index;
    this.type = context.buffer.set.types[context.buffer.buffer[index]];
  }
  child(dir, pos, side) {
    let { buffer } = this.context;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.context.start, side);
    return index < 0 ? null : new BufferNode(this.context, this, index);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(pos) {
    return this.child(
      1,
      pos,
      2
      /* Side.After */
    );
  }
  childBefore(pos) {
    return this.child(
      -1,
      pos,
      -2
      /* Side.Before */
    );
  }
  prop(prop) {
    return this.type.prop(prop);
  }
  enter(pos, side, mode = 0) {
    if (mode & IterMode.ExcludeBuffers)
      return null;
    let { buffer } = this.context;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], side > 0 ? 1 : -1, pos - this.context.start, side);
    return index < 0 ? null : new BufferNode(this.context, this, index);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(dir) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + dir,
      dir,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer } = this.context;
    let after = buffer.buffer[this.index + 3];
    if (after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length))
      return new BufferNode(this.context, this._parent, after);
    return this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer } = this.context;
    let parentStart = this._parent ? this._parent.index + 4 : 0;
    if (this.index == parentStart)
      return this.externalSibling(-1);
    return new BufferNode(this.context, this._parent, buffer.findChild(
      parentStart,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let children2 = [], positions = [];
    let { buffer } = this.context;
    let startI = this.index + 4, endI = buffer.buffer[this.index + 3];
    if (endI > startI) {
      let from = buffer.buffer[this.index + 1];
      children2.push(buffer.slice(startI, endI, from));
      positions.push(0);
    }
    return new Tree(this.type, children2, positions, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
};
function iterStack(heads) {
  if (!heads.length)
    return null;
  let pick = 0, picked = heads[0];
  for (let i = 1; i < heads.length; i++) {
    let node = heads[i];
    if (node.from > picked.from || node.to < picked.to) {
      picked = node;
      pick = i;
    }
  }
  let next = picked instanceof TreeNode && picked.index < 0 ? null : picked.parent;
  let newHeads = heads.slice();
  if (next)
    newHeads[pick] = next;
  else
    newHeads.splice(pick, 1);
  return new StackIterator(newHeads, picked);
}
var StackIterator = class {
  constructor(heads, node) {
    this.heads = heads;
    this.node = node;
  }
  get next() {
    return iterStack(this.heads);
  }
};
function stackIterator(tree, pos, side) {
  let inner = tree.resolveInner(pos, side), layers = null;
  for (let scan = inner instanceof TreeNode ? inner : inner.context.parent; scan; scan = scan.parent) {
    if (scan.index < 0) {
      let parent = scan.parent;
      (layers || (layers = [inner])).push(parent.resolve(pos, side));
      scan = parent;
    } else {
      let mount = MountedTree.get(scan.tree);
      if (mount && mount.overlay && mount.overlay[0].from <= pos && mount.overlay[mount.overlay.length - 1].to >= pos) {
        let root = new TreeNode(mount.tree, mount.overlay[0].from + scan.from, -1, scan);
        (layers || (layers = [inner])).push(resolveNode(root, pos, side, false));
      }
    }
  }
  return layers ? iterStack(layers) : inner;
}
var TreeCursor = class {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(node, mode = 0) {
    this.buffer = null;
    this.stack = [];
    this.index = 0;
    this.bufferNode = null;
    this.mode = mode & ~IterMode.EnterBracketed;
    if (node instanceof TreeNode) {
      this.yieldNode(node);
    } else {
      this._tree = node.context.parent;
      this.buffer = node.context;
      for (let n = node._parent; n; n = n._parent)
        this.stack.unshift(n.index);
      this.bufferNode = node;
      this.yieldBuf(node.index);
    }
  }
  yieldNode(node) {
    if (!node)
      return false;
    this._tree = node;
    this.type = node.type;
    this.from = node.from;
    this.to = node.to;
    return true;
  }
  yieldBuf(index, type) {
    this.index = index;
    let { start, buffer } = this.buffer;
    this.type = type || buffer.set.types[buffer.buffer[index]];
    this.from = start + buffer.buffer[index + 1];
    this.to = start + buffer.buffer[index + 2];
    return true;
  }
  /**
  @internal
  */
  yield(node) {
    if (!node)
      return false;
    if (node instanceof TreeNode) {
      this.buffer = null;
      return this.yieldNode(node);
    }
    this.buffer = node.context;
    return this.yieldBuf(node.index, node.type);
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(dir, pos, side) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(dir < 0 ? this._tree._tree.children.length - 1 : 0, dir, pos, side, this.mode));
    let { buffer } = this.buffer;
    let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.buffer.start, side);
    if (index < 0)
      return false;
    this.stack.push(this.index);
    return this.yieldBuf(index);
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(pos) {
    return this.enterChild(
      1,
      pos,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(pos) {
    return this.enterChild(
      -1,
      pos,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(pos, side, mode = this.mode) {
    if (!this.buffer)
      return this.yield(this._tree.enter(pos, side, mode));
    return mode & IterMode.ExcludeBuffers ? false : this.enterChild(1, pos, side);
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & IterMode.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let parent = this.mode & IterMode.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    this.buffer = null;
    return this.yieldNode(parent);
  }
  /**
  @internal
  */
  sibling(dir) {
    if (!this.buffer)
      return !this._tree._parent ? false : this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + dir, dir, 0, 4, this.mode));
    let { buffer } = this.buffer, d = this.stack.length - 1;
    if (dir < 0) {
      let parentStart = d < 0 ? 0 : this.stack[d] + 4;
      if (this.index != parentStart)
        return this.yieldBuf(buffer.findChild(
          parentStart,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let after = buffer.buffer[this.index + 3];
      if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3]))
        return this.yieldBuf(after);
    }
    return d < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, 0, 4, this.mode)) : false;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(dir) {
    let index, parent, { buffer } = this;
    if (buffer) {
      if (dir > 0) {
        if (this.index < buffer.buffer.buffer.length)
          return false;
      } else {
        for (let i = 0; i < this.index; i++)
          if (buffer.buffer.buffer[i + 3] < this.index)
            return false;
      }
      ({ index, parent } = buffer);
    } else {
      ({ index, _parent: parent } = this._tree);
    }
    for (; parent; { index, _parent: parent } = parent) {
      if (index > -1)
        for (let i = index + dir, e = dir < 0 ? -1 : parent._tree.children.length; i != e; i += dir) {
          let child = parent._tree.children[i];
          if (this.mode & IterMode.IncludeAnonymous || child instanceof TreeBuffer || !child.type.isAnonymous || hasChild(child))
            return false;
        }
    }
    return true;
  }
  move(dir, enter) {
    if (enter && this.enterChild(
      dir,
      0,
      4
      /* Side.DontCare */
    ))
      return true;
    for (; ; ) {
      if (this.sibling(dir))
        return true;
      if (this.atLastNode(dir) || !this.parent())
        return false;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(enter = true) {
    return this.move(1, enter);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(enter = true) {
    return this.move(-1, enter);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(pos, side = 0) {
    while (this.from == this.to || (side < 1 ? this.from >= pos : this.from > pos) || (side > -1 ? this.to <= pos : this.to < pos))
      if (!this.parent())
        break;
    while (this.enterChild(1, pos, side)) {
    }
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let cache3 = this.bufferNode, result = null, depth = 0;
    if (cache3 && cache3.context == this.buffer) {
      scan:
        for (let index = this.index, d = this.stack.length; d >= 0; ) {
          for (let c = cache3; c; c = c._parent)
            if (c.index == index) {
              if (index == this.index)
                return c;
              result = c;
              depth = d + 1;
              break scan;
            }
          index = this.stack[--d];
        }
    }
    for (let i = depth; i < this.stack.length; i++)
      result = new BufferNode(this.buffer, result, this.stack[i]);
    return this.bufferNode = new BufferNode(this.buffer, result, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(enter, leave) {
    for (let depth = 0; ; ) {
      let mustLeave = false;
      if (this.type.isAnonymous || enter(this) !== false) {
        if (this.firstChild()) {
          depth++;
          continue;
        }
        if (!this.type.isAnonymous)
          mustLeave = true;
      }
      for (; ; ) {
        if (mustLeave && leave)
          leave(this);
        mustLeave = this.type.isAnonymous;
        if (!depth)
          return;
        if (this.nextSibling())
          break;
        this.parent();
        depth--;
        mustLeave = true;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(context) {
    if (!this.buffer)
      return matchNodeContext(this.node.parent, context);
    let { buffer } = this.buffer, { types } = buffer.set;
    for (let i = context.length - 1, d = this.stack.length - 1; i >= 0; d--) {
      if (d < 0)
        return matchNodeContext(this._tree, context, i);
      let type = types[buffer.buffer[this.stack[d]]];
      if (!type.isAnonymous) {
        if (context[i] && context[i] != type.name)
          return false;
        i--;
      }
    }
    return true;
  }
};
function hasChild(tree) {
  return tree.children.some((ch) => ch instanceof TreeBuffer || !ch.type.isAnonymous || hasChild(ch));
}
function buildTree(data) {
  var _a;
  let { buffer, nodeSet, maxBufferLength = DefaultBufferLength, reused = [], minRepeatType = nodeSet.types.length } = data;
  let cursor = Array.isArray(buffer) ? new FlatBufferCursor(buffer, buffer.length) : buffer;
  let types = nodeSet.types;
  let contextHash = 0, lookAhead = 0;
  function takeNode(parentStart, minPos, children3, positions2, inRepeat, depth) {
    let { id, start, end, size } = cursor;
    let lookAheadAtStart = lookAhead, contextAtStart = contextHash;
    if (size < 0) {
      cursor.next();
      if (size == -1) {
        let node2 = reused[id];
        children3.push(node2);
        positions2.push(start - parentStart);
        return;
      } else if (size == -3) {
        contextHash = id;
        return;
      } else if (size == -4) {
        lookAhead = id;
        return;
      } else {
        throw new RangeError(`Unrecognized record size: ${size}`);
      }
    }
    let type = types[id], node, buffer2;
    let startPos = start - parentStart;
    if (end - start <= maxBufferLength && (buffer2 = findBufferSize(cursor.pos - minPos, inRepeat))) {
      let data2 = new Uint16Array(buffer2.size - buffer2.skip);
      let endPos = cursor.pos - buffer2.size, index = data2.length;
      while (cursor.pos > endPos)
        index = copyToBuffer(buffer2.start, data2, index);
      node = new TreeBuffer(data2, end - buffer2.start, nodeSet);
      startPos = buffer2.start - parentStart;
    } else {
      let endPos = cursor.pos - size;
      cursor.next();
      let localChildren = [], localPositions = [];
      let localInRepeat = id >= minRepeatType ? id : -1;
      let lastGroup = 0, lastEnd = end;
      while (cursor.pos > endPos) {
        if (localInRepeat >= 0 && cursor.id == localInRepeat && cursor.size >= 0) {
          if (cursor.end <= lastEnd - maxBufferLength) {
            makeRepeatLeaf(localChildren, localPositions, start, lastGroup, cursor.end, lastEnd, localInRepeat, lookAheadAtStart, contextAtStart);
            lastGroup = localChildren.length;
            lastEnd = cursor.end;
          }
          cursor.next();
        } else if (depth > 2500) {
          takeFlatNode(start, endPos, localChildren, localPositions);
        } else {
          takeNode(start, endPos, localChildren, localPositions, localInRepeat, depth + 1);
        }
      }
      if (localInRepeat >= 0 && lastGroup > 0 && lastGroup < localChildren.length)
        makeRepeatLeaf(localChildren, localPositions, start, lastGroup, start, lastEnd, localInRepeat, lookAheadAtStart, contextAtStart);
      localChildren.reverse();
      localPositions.reverse();
      if (localInRepeat > -1 && lastGroup > 0) {
        let make = makeBalanced(type, contextAtStart);
        node = balanceRange(type, localChildren, localPositions, 0, localChildren.length, 0, end - start, make, make);
      } else {
        node = makeTree(type, localChildren, localPositions, end - start, lookAheadAtStart - end, contextAtStart);
      }
    }
    children3.push(node);
    positions2.push(startPos);
  }
  function takeFlatNode(parentStart, minPos, children3, positions2) {
    let nodes = [];
    let nodeCount = 0, stopAt = -1;
    while (cursor.pos > minPos) {
      let { id, start, end, size } = cursor;
      if (size > 4) {
        cursor.next();
      } else if (stopAt > -1 && start < stopAt) {
        break;
      } else {
        if (stopAt < 0)
          stopAt = end - maxBufferLength;
        nodes.push(id, start, end);
        nodeCount++;
        cursor.next();
      }
    }
    if (nodeCount) {
      let buffer2 = new Uint16Array(nodeCount * 4);
      let start = nodes[nodes.length - 2];
      for (let i = nodes.length - 3, j = 0; i >= 0; i -= 3) {
        buffer2[j++] = nodes[i];
        buffer2[j++] = nodes[i + 1] - start;
        buffer2[j++] = nodes[i + 2] - start;
        buffer2[j++] = j;
      }
      children3.push(new TreeBuffer(buffer2, nodes[2] - start, nodeSet));
      positions2.push(start - parentStart);
    }
  }
  function makeBalanced(type, contextHash2) {
    return (children3, positions2, length2) => {
      let lookAhead2 = 0, lastI = children3.length - 1, last, lookAheadProp;
      if (lastI >= 0 && (last = children3[lastI]) instanceof Tree) {
        if (!lastI && last.type == type && last.length == length2)
          return last;
        if (lookAheadProp = last.prop(NodeProp.lookAhead))
          lookAhead2 = positions2[lastI] + last.length + lookAheadProp;
      }
      return makeTree(type, children3, positions2, length2, lookAhead2, contextHash2);
    };
  }
  function makeRepeatLeaf(children3, positions2, base, i, from, to, type, lookAhead2, contextHash2) {
    let localChildren = [], localPositions = [];
    while (children3.length > i) {
      localChildren.push(children3.pop());
      localPositions.push(positions2.pop() + base - from);
    }
    children3.push(makeTree(nodeSet.types[type], localChildren, localPositions, to - from, lookAhead2 - to, contextHash2));
    positions2.push(from - base);
  }
  function makeTree(type, children3, positions2, length2, lookAhead2, contextHash2, props) {
    if (contextHash2) {
      let pair = [NodeProp.contextHash, contextHash2];
      props = props ? [pair].concat(props) : [pair];
    }
    if (lookAhead2 > 25) {
      let pair = [NodeProp.lookAhead, lookAhead2];
      props = props ? [pair].concat(props) : [pair];
    }
    return new Tree(type, children3, positions2, length2, props);
  }
  function findBufferSize(maxSize, inRepeat) {
    let fork = cursor.fork();
    let size = 0, start = 0, skip = 0, minStart = fork.end - maxBufferLength;
    let result = { size: 0, start: 0, skip: 0 };
    scan:
      for (let minPos = fork.pos - maxSize; fork.pos > minPos; ) {
        let nodeSize2 = fork.size;
        if (fork.id == inRepeat && nodeSize2 >= 0) {
          result.size = size;
          result.start = start;
          result.skip = skip;
          skip += 4;
          size += 4;
          fork.next();
          continue;
        }
        let startPos = fork.pos - nodeSize2;
        if (nodeSize2 < 0 || startPos < minPos || fork.start < minStart)
          break;
        let localSkipped = fork.id >= minRepeatType ? 4 : 0;
        let nodeStart = fork.start;
        fork.next();
        while (fork.pos > startPos) {
          if (fork.size < 0) {
            if (fork.size == -3 || fork.size == -4)
              localSkipped += 4;
            else
              break scan;
          } else if (fork.id >= minRepeatType) {
            localSkipped += 4;
          }
          fork.next();
        }
        start = nodeStart;
        size += nodeSize2;
        skip += localSkipped;
      }
    if (inRepeat < 0 || size == maxSize) {
      result.size = size;
      result.start = start;
      result.skip = skip;
    }
    return result.size > 4 ? result : void 0;
  }
  function copyToBuffer(bufferStart, buffer2, index) {
    let { id, start, end, size } = cursor;
    cursor.next();
    if (size >= 0 && id < minRepeatType) {
      let startIndex = index;
      if (size > 4) {
        let endPos = cursor.pos - (size - 4);
        while (cursor.pos > endPos)
          index = copyToBuffer(bufferStart, buffer2, index);
      }
      buffer2[--index] = startIndex;
      buffer2[--index] = end - bufferStart;
      buffer2[--index] = start - bufferStart;
      buffer2[--index] = id;
    } else if (size == -3) {
      contextHash = id;
    } else if (size == -4) {
      lookAhead = id;
    }
    return index;
  }
  let children2 = [], positions = [];
  while (cursor.pos > 0)
    takeNode(data.start || 0, data.bufferStart || 0, children2, positions, -1, 0);
  let length = (_a = data.length) !== null && _a !== void 0 ? _a : children2.length ? positions[0] + children2[0].length : 0;
  return new Tree(types[data.topID], children2.reverse(), positions.reverse(), length);
}
var nodeSizeCache = /* @__PURE__ */ new WeakMap();
function nodeSize(balanceType, node) {
  if (!balanceType.isAnonymous || node instanceof TreeBuffer || node.type != balanceType)
    return 1;
  let size = nodeSizeCache.get(node);
  if (size == null) {
    size = 1;
    for (let child of node.children) {
      if (child.type != balanceType || !(child instanceof Tree)) {
        size = 1;
        break;
      }
      size += nodeSize(balanceType, child);
    }
    nodeSizeCache.set(node, size);
  }
  return size;
}
function balanceRange(balanceType, children2, positions, from, to, start, length, mkTop, mkTree) {
  let total = 0;
  for (let i = from; i < to; i++)
    total += nodeSize(balanceType, children2[i]);
  let maxChild = Math.ceil(
    total * 1.5 / 8
    /* Balance.BranchFactor */
  );
  let localChildren = [], localPositions = [];
  function divide(children3, positions2, from2, to2, offset) {
    for (let i = from2; i < to2; ) {
      let groupFrom = i, groupStart = positions2[i], groupSize = nodeSize(balanceType, children3[i]);
      i++;
      for (; i < to2; i++) {
        let nextSize = nodeSize(balanceType, children3[i]);
        if (groupSize + nextSize >= maxChild)
          break;
        groupSize += nextSize;
      }
      if (i == groupFrom + 1) {
        if (groupSize > maxChild) {
          let only = children3[groupFrom];
          divide(only.children, only.positions, 0, only.children.length, positions2[groupFrom] + offset);
          continue;
        }
        localChildren.push(children3[groupFrom]);
      } else {
        let length2 = positions2[i - 1] + children3[i - 1].length - groupStart;
        localChildren.push(balanceRange(balanceType, children3, positions2, groupFrom, i, groupStart, length2, null, mkTree));
      }
      localPositions.push(groupStart + offset - start);
    }
  }
  divide(children2, positions, from, to, 0);
  return (mkTop || mkTree)(localChildren, localPositions, length);
}
var Parser = class {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(input, fragments, ranges) {
    if (typeof input == "string")
      input = new StringInput(input);
    ranges = !ranges ? [new Range(0, input.length)] : ranges.length ? ranges.map((r) => new Range(r.from, r.to)) : [new Range(0, 0)];
    return this.createParse(input, fragments || [], ranges);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(input, fragments, ranges) {
    let parse = this.startParse(input, fragments, ranges);
    for (; ; ) {
      let done = parse.advance();
      if (done)
        return done;
    }
  }
};
var StringInput = class {
  constructor(string2) {
    this.string = string2;
  }
  get length() {
    return this.string.length;
  }
  chunk(from) {
    return this.string.slice(from);
  }
  get lineChunks() {
    return false;
  }
  read(from, to) {
    return this.string.slice(from, to);
  }
};
var stoppedInner = new NodeProp({ perNode: true });

// node_modules/.pnpm/@lezer+highlight@1.2.5/node_modules/@lezer/highlight/dist/index.js
var nextTagID = 0;
var Tag = class {
  /**
  @internal
  */
  constructor(name2, set, base, modified) {
    this.name = name2;
    this.set = set;
    this.base = base;
    this.modified = modified;
    this.id = nextTagID++;
  }
  toString() {
    let { name: name2 } = this;
    for (let mod of this.modified)
      if (mod.name)
        name2 = `${mod.name}(${name2})`;
    return name2;
  }
  static define(nameOrParent, parent) {
    let name2 = typeof nameOrParent == "string" ? nameOrParent : "?";
    if (nameOrParent instanceof Tag)
      parent = nameOrParent;
    if (parent === null || parent === void 0 ? void 0 : parent.base)
      throw new Error("Can not derive from a modified tag");
    let tag = new Tag(name2, [], null, []);
    tag.set.push(tag);
    if (parent)
      for (let t2 of parent.set)
        tag.set.push(t2);
    return tag;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(name2) {
    let mod = new Modifier(name2);
    return (tag) => {
      if (tag.modified.indexOf(mod) > -1)
        return tag;
      return Modifier.get(tag.base || tag, tag.modified.concat(mod).sort((a, b) => a.id - b.id));
    };
  }
};
var nextModifierID = 0;
var Modifier = class {
  constructor(name2) {
    this.name = name2;
    this.instances = [];
    this.id = nextModifierID++;
  }
  static get(base, mods) {
    if (!mods.length)
      return base;
    let exists = mods[0].instances.find((t2) => t2.base == base && sameArray(mods, t2.modified));
    if (exists)
      return exists;
    let set = [], tag = new Tag(base.name, set, base, mods);
    for (let m of mods)
      m.instances.push(tag);
    let configs = powerSet(mods);
    for (let parent of base.set)
      if (!parent.modified.length)
        for (let config of configs)
          set.push(Modifier.get(parent, config));
    return tag;
  }
};
function sameArray(a, b) {
  return a.length == b.length && a.every((x, i) => x == b[i]);
}
function powerSet(array) {
  let sets = [[]];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0, e = sets.length; j < e; j++) {
      sets.push(sets[j].concat(array[i]));
    }
  }
  return sets.sort((a, b) => b.length - a.length);
}
function styleTags(spec) {
  let byName = /* @__PURE__ */ Object.create(null);
  for (let prop in spec) {
    let tags2 = spec[prop];
    if (!Array.isArray(tags2))
      tags2 = [tags2];
    for (let part of prop.split(" "))
      if (part) {
        let pieces = [], mode = 2, rest = part;
        for (let pos = 0; ; ) {
          if (rest == "..." && pos > 0 && pos + 3 == part.length) {
            mode = 1;
            break;
          }
          let m = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(rest);
          if (!m)
            throw new RangeError("Invalid path: " + part);
          pieces.push(m[0] == "*" ? "" : m[0][0] == '"' ? JSON.parse(m[0]) : m[0]);
          pos += m[0].length;
          if (pos == part.length)
            break;
          let next = part[pos++];
          if (pos == part.length && next == "!") {
            mode = 0;
            break;
          }
          if (next != "/")
            throw new RangeError("Invalid path: " + part);
          rest = part.slice(pos);
        }
        let last = pieces.length - 1, inner = pieces[last];
        if (!inner)
          throw new RangeError("Invalid path: " + part);
        let rule = new Rule(tags2, mode, last > 0 ? pieces.slice(0, last) : null);
        byName[inner] = rule.sort(byName[inner]);
      }
  }
  return ruleNodeProp.add(byName);
}
var ruleNodeProp = new NodeProp({
  combine(a, b) {
    let cur, root, take;
    while (a || b) {
      if (!a || b && a.depth <= b.depth) {
        take = b;
        b = b.next;
      } else {
        take = a;
        a = a.next;
      }
      if (cur && cur.mode == take.mode && !take.context && !cur.context)
        continue;
      let copy2 = new Rule(take.tags, take.mode, take.context);
      if (cur)
        cur.next = copy2;
      else
        root = copy2;
      cur = copy2;
    }
    return root;
  }
});
var Rule = class {
  constructor(tags2, mode, context, next) {
    this.tags = tags2;
    this.mode = mode;
    this.context = context;
    this.next = next;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(other) {
    if (!other || other.depth < this.depth) {
      this.next = other;
      return this;
    }
    other.next = this.sort(other.next);
    return other;
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
};
Rule.empty = new Rule([], 2, null);
function tagHighlighter(tags2, options) {
  let map = /* @__PURE__ */ Object.create(null);
  for (let style of tags2) {
    if (!Array.isArray(style.tag))
      map[style.tag.id] = style.class;
    else
      for (let tag of style.tag)
        map[tag.id] = style.class;
  }
  let { scope, all = null } = options || {};
  return {
    style: (tags3) => {
      let cls = all;
      for (let tag of tags3) {
        for (let sub of tag.set) {
          let tagClass = map[sub.id];
          if (tagClass) {
            cls = cls ? cls + " " + tagClass : tagClass;
            break;
          }
        }
      }
      return cls;
    },
    scope
  };
}
var t = Tag.define;
var comment = t();
var name = t();
var typeName = t(name);
var propertyName = t(name);
var literal = t();
var string = t(literal);
var number = t(literal);
var content = t();
var heading = t(content);
var keyword = t();
var operator = t();
var punctuation = t();
var bracket = t(punctuation);
var meta = t();
var tags = {
  /**
  A comment.
  */
  comment,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: t(comment),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: t(comment),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: t(comment),
  /**
  Any kind of identifier.
  */
  name,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: t(name),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: t(typeName),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: t(propertyName),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: t(name),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: t(name),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: t(name),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: t(name),
  /**
  A literal value.
  */
  literal,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: t(string),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: t(string),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: t(string),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: t(number),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: t(number),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: t(literal),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: t(literal),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: t(literal),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: t(literal),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: t(literal),
  /**
  A language keyword.
  */
  keyword,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: t(keyword),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: t(keyword),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: t(keyword),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: t(keyword),
  /**
  An operator.
  */
  operator,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: t(operator),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: t(operator),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: t(operator),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: t(operator),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: t(operator),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: t(operator),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: t(operator),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: t(operator),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: t(operator),
  /**
  Program or markup punctuation.
  */
  punctuation,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: t(punctuation),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: t(bracket),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: t(bracket),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: t(bracket),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: t(bracket),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: t(heading),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: t(heading),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: t(heading),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: t(heading),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: t(heading),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: t(heading),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: t(content),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: t(content),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: t(content),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: t(content),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: t(content),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: t(content),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: t(content),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: t(content),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: t(),
  /**
  Deleted text.
  */
  deleted: t(),
  /**
  Changed text.
  */
  changed: t(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: t(),
  /**
  Metadata or meta-instruction.
  */
  meta,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: t(meta),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: t(meta),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: t(meta),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Tag.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Tag.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Tag.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Tag.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Tag.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Tag.defineModifier("special")
};
for (let name2 in tags) {
  let val = tags[name2];
  if (val instanceof Tag)
    val.name = name2;
}
var classHighlighter = tagHighlighter([
  { tag: tags.link, class: "tok-link" },
  { tag: tags.heading, class: "tok-heading" },
  { tag: tags.emphasis, class: "tok-emphasis" },
  { tag: tags.strong, class: "tok-strong" },
  { tag: tags.keyword, class: "tok-keyword" },
  { tag: tags.atom, class: "tok-atom" },
  { tag: tags.bool, class: "tok-bool" },
  { tag: tags.url, class: "tok-url" },
  { tag: tags.labelName, class: "tok-labelName" },
  { tag: tags.inserted, class: "tok-inserted" },
  { tag: tags.deleted, class: "tok-deleted" },
  { tag: tags.literal, class: "tok-literal" },
  { tag: tags.string, class: "tok-string" },
  { tag: tags.number, class: "tok-number" },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], class: "tok-string2" },
  { tag: tags.variableName, class: "tok-variableName" },
  { tag: tags.local(tags.variableName), class: "tok-variableName tok-local" },
  { tag: tags.definition(tags.variableName), class: "tok-variableName tok-definition" },
  { tag: tags.special(tags.variableName), class: "tok-variableName2" },
  { tag: tags.definition(tags.propertyName), class: "tok-propertyName tok-definition" },
  { tag: tags.typeName, class: "tok-typeName" },
  { tag: tags.namespace, class: "tok-namespace" },
  { tag: tags.className, class: "tok-className" },
  { tag: tags.macroName, class: "tok-macroName" },
  { tag: tags.propertyName, class: "tok-propertyName" },
  { tag: tags.operator, class: "tok-operator" },
  { tag: tags.comment, class: "tok-comment" },
  { tag: tags.meta, class: "tok-meta" },
  { tag: tags.invalid, class: "tok-invalid" },
  { tag: tags.punctuation, class: "tok-punctuation" }
]);

// node_modules/.pnpm/@lezer+markdown@1.8.0/node_modules/@lezer/markdown/dist/index.js
var CompositeBlock = class {
  static create(type, value, from, parentHash, end) {
    let hash = parentHash + (parentHash << 8) + type + (value << 4) | 0;
    return new CompositeBlock(type, value, from, hash, end, [], []);
  }
  constructor(type, value, from, hash, end, children2, positions) {
    this.type = type;
    this.value = value;
    this.from = from;
    this.hash = hash;
    this.end = end;
    this.children = children2;
    this.positions = positions;
    this.hashProp = [[NodeProp.contextHash, hash]];
  }
  addChild(child, pos) {
    if (child.prop(NodeProp.contextHash) != this.hash)
      child = new Tree(child.type, child.children, child.positions, child.length, this.hashProp);
    this.children.push(child);
    this.positions.push(pos);
  }
  toTree(nodeSet, end = this.end) {
    let last = this.children.length - 1;
    if (last >= 0)
      end = Math.max(end, this.positions[last] + this.children[last].length + this.from);
    return new Tree(nodeSet.types[this.type], this.children, this.positions, end - this.from).balance({
      makeTree: (children2, positions, length) => new Tree(NodeType.none, children2, positions, length, this.hashProp)
    });
  }
};
var Type;
(function(Type2) {
  Type2[Type2["Document"] = 1] = "Document";
  Type2[Type2["CodeBlock"] = 2] = "CodeBlock";
  Type2[Type2["FencedCode"] = 3] = "FencedCode";
  Type2[Type2["Blockquote"] = 4] = "Blockquote";
  Type2[Type2["HorizontalRule"] = 5] = "HorizontalRule";
  Type2[Type2["BulletList"] = 6] = "BulletList";
  Type2[Type2["OrderedList"] = 7] = "OrderedList";
  Type2[Type2["ListItem"] = 8] = "ListItem";
  Type2[Type2["ATXHeading1"] = 9] = "ATXHeading1";
  Type2[Type2["ATXHeading2"] = 10] = "ATXHeading2";
  Type2[Type2["ATXHeading3"] = 11] = "ATXHeading3";
  Type2[Type2["ATXHeading4"] = 12] = "ATXHeading4";
  Type2[Type2["ATXHeading5"] = 13] = "ATXHeading5";
  Type2[Type2["ATXHeading6"] = 14] = "ATXHeading6";
  Type2[Type2["SetextHeading1"] = 15] = "SetextHeading1";
  Type2[Type2["SetextHeading2"] = 16] = "SetextHeading2";
  Type2[Type2["HTMLBlock"] = 17] = "HTMLBlock";
  Type2[Type2["LinkReference"] = 18] = "LinkReference";
  Type2[Type2["Paragraph"] = 19] = "Paragraph";
  Type2[Type2["CommentBlock"] = 20] = "CommentBlock";
  Type2[Type2["ProcessingInstructionBlock"] = 21] = "ProcessingInstructionBlock";
  Type2[Type2["Escape"] = 22] = "Escape";
  Type2[Type2["Entity"] = 23] = "Entity";
  Type2[Type2["HardBreak"] = 24] = "HardBreak";
  Type2[Type2["Emphasis"] = 25] = "Emphasis";
  Type2[Type2["StrongEmphasis"] = 26] = "StrongEmphasis";
  Type2[Type2["Link"] = 27] = "Link";
  Type2[Type2["Image"] = 28] = "Image";
  Type2[Type2["InlineCode"] = 29] = "InlineCode";
  Type2[Type2["HTMLTag"] = 30] = "HTMLTag";
  Type2[Type2["Comment"] = 31] = "Comment";
  Type2[Type2["ProcessingInstruction"] = 32] = "ProcessingInstruction";
  Type2[Type2["Autolink"] = 33] = "Autolink";
  Type2[Type2["HeaderMark"] = 34] = "HeaderMark";
  Type2[Type2["QuoteMark"] = 35] = "QuoteMark";
  Type2[Type2["ListMark"] = 36] = "ListMark";
  Type2[Type2["LinkMark"] = 37] = "LinkMark";
  Type2[Type2["EmphasisMark"] = 38] = "EmphasisMark";
  Type2[Type2["CodeMark"] = 39] = "CodeMark";
  Type2[Type2["CodeText"] = 40] = "CodeText";
  Type2[Type2["CodeInfo"] = 41] = "CodeInfo";
  Type2[Type2["LinkTitle"] = 42] = "LinkTitle";
  Type2[Type2["LinkLabel"] = 43] = "LinkLabel";
  Type2[Type2["URL"] = 44] = "URL";
})(Type || (Type = {}));
var LeafBlock = class {
  /**
  @internal
  */
  constructor(start, content2) {
    this.start = start;
    this.content = content2;
    this.marks = [];
    this.parsers = [];
  }
};
var Line = class {
  constructor() {
    this.text = "";
    this.baseIndent = 0;
    this.basePos = 0;
    this.depth = 0;
    this.markers = [];
    this.pos = 0;
    this.indent = 0;
    this.next = -1;
  }
  /**
  @internal
  */
  forward() {
    if (this.basePos > this.pos)
      this.forwardInner();
  }
  /**
  @internal
  */
  forwardInner() {
    let newPos = this.skipSpace(this.basePos);
    this.indent = this.countIndent(newPos, this.pos, this.indent);
    this.pos = newPos;
    this.next = newPos == this.text.length ? -1 : this.text.charCodeAt(newPos);
  }
  /**
  Skip whitespace after the given position, return the position of
  the next non-space character or the end of the line if there's
  only space after `from`.
  */
  skipSpace(from) {
    return skipSpace(this.text, from);
  }
  /**
  @internal
  */
  reset(text2) {
    this.text = text2;
    this.baseIndent = this.basePos = this.pos = this.indent = 0;
    this.forwardInner();
    this.depth = 1;
    while (this.markers.length)
      this.markers.pop();
  }
  /**
  Move the line's base position forward to the given position.
  This should only be called by composite [block
  parsers](#BlockParser.parse) or [markup skipping
  functions](#NodeSpec.composite).
  */
  moveBase(to) {
    this.basePos = to;
    this.baseIndent = this.countIndent(to, this.pos, this.indent);
  }
  /**
  Move the line's base position forward to the given _column_.
  */
  moveBaseColumn(indent) {
    this.baseIndent = indent;
    this.basePos = this.findColumn(indent);
  }
  /**
  Store a composite-block-level marker. Should be called from
  [markup skipping functions](#NodeSpec.composite) when they
  consume any non-whitespace characters.
  */
  addMarker(elt2) {
    this.markers.push(elt2);
  }
  /**
  Find the column position at `to`, optionally starting at a given
  position and column.
  */
  countIndent(to, from = 0, indent = 0) {
    for (let i = from; i < to; i++)
      indent += this.text.charCodeAt(i) == 9 ? 4 - indent % 4 : 1;
    return indent;
  }
  /**
  Find the position corresponding to the given column.
  */
  findColumn(goal) {
    let i = 0;
    for (let indent = 0; i < this.text.length && indent < goal; i++)
      indent += this.text.charCodeAt(i) == 9 ? 4 - indent % 4 : 1;
    return i;
  }
  /**
  @internal
  */
  scrub() {
    if (!this.baseIndent)
      return this.text;
    let result = "";
    for (let i = 0; i < this.basePos; i++)
      result += " ";
    return result + this.text.slice(this.basePos);
  }
};
function skipForList(bl, cx, line) {
  if (line.pos == line.text.length || bl != cx.block && line.indent >= cx.stack[line.depth + 1].value + line.baseIndent)
    return true;
  if (line.indent >= line.baseIndent + 4)
    return false;
  let size = (bl.type == Type.OrderedList ? isOrderedList : isBulletList)(line, cx, false);
  return size > 0 && (bl.type != Type.BulletList || isHorizontalRule(line, cx, false) < 0) && line.text.charCodeAt(line.pos + size - 1) == bl.value;
}
var DefaultSkipMarkup = {
  [Type.Blockquote](bl, cx, line) {
    if (line.next != 62)
      return false;
    line.markers.push(elt(Type.QuoteMark, cx.lineStart + line.pos, cx.lineStart + line.pos + 1));
    line.moveBase(line.pos + (space(line.text.charCodeAt(line.pos + 1)) ? 2 : 1));
    bl.end = cx.lineStart + line.text.length;
    return true;
  },
  [Type.ListItem](bl, _cx, line) {
    if (line.indent < line.baseIndent + bl.value && line.next > -1)
      return false;
    line.moveBaseColumn(line.baseIndent + bl.value);
    return true;
  },
  [Type.OrderedList]: skipForList,
  [Type.BulletList]: skipForList,
  [Type.Document]() {
    return true;
  }
};
function space(ch) {
  return ch == 32 || ch == 9 || ch == 10 || ch == 13;
}
function skipSpace(line, i = 0) {
  while (i < line.length && space(line.charCodeAt(i)))
    i++;
  return i;
}
function skipSpaceBack(line, i, to) {
  while (i > to && space(line.charCodeAt(i - 1)))
    i--;
  return i;
}
function isFencedCode(line) {
  if (line.next != 96 && line.next != 126)
    return -1;
  let pos = line.pos + 1;
  while (pos < line.text.length && line.text.charCodeAt(pos) == line.next)
    pos++;
  if (pos < line.pos + 3)
    return -1;
  if (line.next == 96) {
    for (let i = pos; i < line.text.length; i++)
      if (line.text.charCodeAt(i) == 96)
        return -1;
  }
  return pos;
}
function isBlockquote(line) {
  return line.next != 62 ? -1 : line.text.charCodeAt(line.pos + 1) == 32 ? 2 : 1;
}
function isHorizontalRule(line, cx, breaking) {
  if (line.next != 42 && line.next != 45 && line.next != 95)
    return -1;
  let count2 = 1;
  for (let pos = line.pos + 1; pos < line.text.length; pos++) {
    let ch = line.text.charCodeAt(pos);
    if (ch == line.next)
      count2++;
    else if (!space(ch))
      return -1;
  }
  if (breaking && line.next == 45 && isSetextUnderline(line) > -1 && line.depth == cx.stack.length && cx.parser.leafBlockParsers.indexOf(DefaultLeafBlocks.SetextHeading) > -1)
    return -1;
  return count2 < 3 ? -1 : 1;
}
function inList(cx, type) {
  for (let i = cx.stack.length - 1; i >= 0; i--)
    if (cx.stack[i].type == type)
      return true;
  return false;
}
function isBulletList(line, cx, breaking) {
  return (line.next == 45 || line.next == 43 || line.next == 42) && (line.pos == line.text.length - 1 || space(line.text.charCodeAt(line.pos + 1))) && (!breaking || inList(cx, Type.BulletList) || line.skipSpace(line.pos + 2) < line.text.length) ? 1 : -1;
}
function isOrderedList(line, cx, breaking) {
  let pos = line.pos, next = line.next;
  for (; ; ) {
    if (next >= 48 && next <= 57)
      pos++;
    else
      break;
    if (pos == line.text.length)
      return -1;
    next = line.text.charCodeAt(pos);
  }
  if (pos == line.pos || pos > line.pos + 9 || next != 46 && next != 41 || pos < line.text.length - 1 && !space(line.text.charCodeAt(pos + 1)) || breaking && !inList(cx, Type.OrderedList) && (line.skipSpace(pos + 1) == line.text.length || pos > line.pos + 1 || line.next != 49))
    return -1;
  return pos + 1 - line.pos;
}
function isAtxHeading(line) {
  if (line.next != 35)
    return -1;
  let pos = line.pos + 1;
  while (pos < line.text.length && line.text.charCodeAt(pos) == 35)
    pos++;
  if (pos < line.text.length && line.text.charCodeAt(pos) != 32)
    return -1;
  let size = pos - line.pos;
  return size > 6 ? -1 : size;
}
function isSetextUnderline(line) {
  if (line.next != 45 && line.next != 61 || line.indent >= line.baseIndent + 4)
    return -1;
  let pos = line.pos + 1;
  while (pos < line.text.length && line.text.charCodeAt(pos) == line.next)
    pos++;
  let end = pos;
  while (pos < line.text.length && space(line.text.charCodeAt(pos)))
    pos++;
  return pos == line.text.length ? end : -1;
}
var EmptyLine = /^[ \t]*$/;
var CommentEnd = /-->/;
var ProcessingEnd = /\?>/;
var HTMLBlockStyle = [
  [/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
  [/^\s*<!--/, CommentEnd],
  [/^\s*<\?/, ProcessingEnd],
  [/^\s*<![A-Z]/, />/],
  [/^\s*<!\[CDATA\[/, /\]\]>/],
  [/^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i, EmptyLine],
  [/^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i, EmptyLine]
];
function isHTMLBlock(line, _cx, breaking) {
  if (line.next != 60)
    return -1;
  let rest = line.text.slice(line.pos);
  for (let i = 0, e = HTMLBlockStyle.length - (breaking ? 1 : 0); i < e; i++)
    if (HTMLBlockStyle[i][0].test(rest))
      return i;
  return -1;
}
function getListIndent(line, pos) {
  let indentAfter = line.countIndent(pos, line.pos, line.indent);
  let skipped = line.skipSpace(pos);
  let indented = line.countIndent(skipped, pos, indentAfter);
  return indented >= indentAfter + 5 || skipped == line.text.length ? indentAfter + 1 : indented;
}
function addCodeText(marks, from, to) {
  let last = marks.length - 1;
  if (last >= 0 && marks[last].to == from && marks[last].type == Type.CodeText)
    marks[last].to = to;
  else
    marks.push(elt(Type.CodeText, from, to));
}
var DefaultBlockParsers = {
  LinkReference: void 0,
  IndentedCode(cx, line) {
    let base = line.baseIndent + 4;
    if (line.indent < base)
      return false;
    let start = line.findColumn(base);
    let from = cx.lineStart + start, to = cx.lineStart + line.text.length;
    let marks = [], pendingMarks = [];
    addCodeText(marks, from, to);
    while (cx.nextLine() && line.depth >= cx.stack.length) {
      if (line.pos == line.text.length) {
        addCodeText(pendingMarks, cx.lineStart - 1, cx.lineStart);
        for (let m of line.markers)
          pendingMarks.push(m);
      } else if (line.indent < base) {
        break;
      } else {
        if (pendingMarks.length) {
          for (let m of pendingMarks) {
            if (m.type == Type.CodeText)
              addCodeText(marks, m.from, m.to);
            else
              marks.push(m);
          }
          pendingMarks = [];
        }
        addCodeText(marks, cx.lineStart - 1, cx.lineStart);
        for (let m of line.markers)
          marks.push(m);
        to = cx.lineStart + line.text.length;
        let codeStart = cx.lineStart + line.findColumn(line.baseIndent + 4);
        if (codeStart < to)
          addCodeText(marks, codeStart, to);
      }
    }
    if (pendingMarks.length) {
      pendingMarks = pendingMarks.filter((m) => m.type != Type.CodeText);
      if (pendingMarks.length)
        line.markers = pendingMarks.concat(line.markers);
    }
    cx.addNode(cx.buffer.writeElements(marks, -from).finish(Type.CodeBlock, to - from), from);
    return true;
  },
  FencedCode(cx, line) {
    let fenceEnd = isFencedCode(line);
    if (fenceEnd < 0)
      return false;
    let from = cx.lineStart + line.pos, ch = line.next, len = fenceEnd - line.pos;
    let infoFrom = line.skipSpace(fenceEnd), infoTo = skipSpaceBack(line.text, line.text.length, infoFrom);
    let marks = [elt(Type.CodeMark, from, from + len)];
    if (infoFrom < infoTo)
      marks.push(elt(Type.CodeInfo, cx.lineStart + infoFrom, cx.lineStart + infoTo));
    for (let first = true, empty = true, hasLine = false; cx.nextLine() && line.depth >= cx.stack.length; first = false) {
      let i = line.pos;
      if (line.indent - line.baseIndent < 4)
        while (i < line.text.length && line.text.charCodeAt(i) == ch)
          i++;
      if (i - line.pos >= len && line.skipSpace(i) == line.text.length) {
        for (let m of line.markers)
          marks.push(m);
        if (empty && hasLine)
          addCodeText(marks, cx.lineStart - 1, cx.lineStart);
        marks.push(elt(Type.CodeMark, cx.lineStart + line.pos, cx.lineStart + i));
        cx.nextLine();
        break;
      } else {
        hasLine = true;
        if (!first) {
          addCodeText(marks, cx.lineStart - 1, cx.lineStart);
          empty = false;
        }
        for (let m of line.markers)
          marks.push(m);
        let textStart = cx.lineStart + line.basePos, textEnd = cx.lineStart + line.text.length;
        if (textStart < textEnd) {
          addCodeText(marks, textStart, textEnd);
          empty = false;
        }
      }
    }
    cx.addNode(cx.buffer.writeElements(marks, -from).finish(Type.FencedCode, cx.prevLineEnd() - from), from);
    return true;
  },
  Blockquote(cx, line) {
    let size = isBlockquote(line);
    if (size < 0)
      return false;
    cx.startContext(Type.Blockquote, line.pos);
    cx.addNode(Type.QuoteMark, cx.lineStart + line.pos, cx.lineStart + line.pos + 1);
    line.moveBase(line.pos + size);
    return null;
  },
  HorizontalRule(cx, line) {
    if (isHorizontalRule(line, cx, false) < 0)
      return false;
    let from = cx.lineStart + line.pos;
    cx.nextLine();
    cx.addNode(Type.HorizontalRule, from);
    return true;
  },
  BulletList(cx, line) {
    let size = isBulletList(line, cx, false);
    if (size < 0)
      return false;
    if (cx.block.type != Type.BulletList)
      cx.startContext(Type.BulletList, line.basePos, line.next);
    let newBase = getListIndent(line, line.pos + 1);
    cx.startContext(Type.ListItem, line.basePos, newBase - line.baseIndent);
    cx.addNode(Type.ListMark, cx.lineStart + line.pos, cx.lineStart + line.pos + size);
    line.moveBaseColumn(newBase);
    return null;
  },
  OrderedList(cx, line) {
    let size = isOrderedList(line, cx, false);
    if (size < 0)
      return false;
    if (cx.block.type != Type.OrderedList)
      cx.startContext(Type.OrderedList, line.basePos, line.text.charCodeAt(line.pos + size - 1));
    let newBase = getListIndent(line, line.pos + size);
    cx.startContext(Type.ListItem, line.basePos, newBase - line.baseIndent);
    cx.addNode(Type.ListMark, cx.lineStart + line.pos, cx.lineStart + line.pos + size);
    line.moveBaseColumn(newBase);
    return null;
  },
  ATXHeading(cx, line) {
    let size = isAtxHeading(line);
    if (size < 0)
      return false;
    let off = line.pos, from = cx.lineStart + off;
    let endOfSpace = skipSpaceBack(line.text, line.text.length, off), after = endOfSpace;
    while (after > off && line.text.charCodeAt(after - 1) == line.next)
      after--;
    if (after == endOfSpace || after == off || !space(line.text.charCodeAt(after - 1)))
      after = line.text.length;
    let buf = cx.buffer.write(Type.HeaderMark, 0, size).writeElements(cx.parser.parseInline(line.text.slice(off + size + 1, after), from + size + 1), -from);
    if (after < line.text.length)
      buf.write(Type.HeaderMark, after - off, endOfSpace - off);
    let node = buf.finish(Type.ATXHeading1 - 1 + size, line.text.length - off);
    cx.nextLine();
    cx.addNode(node, from);
    return true;
  },
  HTMLBlock(cx, line) {
    let type = isHTMLBlock(line, cx, false);
    if (type < 0)
      return false;
    let from = cx.lineStart + line.pos, end = HTMLBlockStyle[type][1];
    let marks = [], trailing = end != EmptyLine;
    while (!end.test(line.text) && cx.nextLine()) {
      if (line.depth < cx.stack.length) {
        trailing = false;
        break;
      }
      for (let m of line.markers)
        marks.push(m);
    }
    if (trailing)
      cx.nextLine();
    let nodeType = end == CommentEnd ? Type.CommentBlock : end == ProcessingEnd ? Type.ProcessingInstructionBlock : Type.HTMLBlock;
    let to = cx.prevLineEnd();
    cx.addNode(cx.buffer.writeElements(marks, -from).finish(nodeType, to - from), from);
    return true;
  },
  SetextHeading: void 0
  // Specifies relative precedence for block-continue function
};
var LinkReferenceParser = class {
  constructor(leaf) {
    this.stage = 0;
    this.elts = [];
    this.pos = 0;
    this.start = leaf.start;
    this.advance(leaf.content);
  }
  nextLine(cx, line, leaf) {
    if (this.stage == -1)
      return false;
    let content2 = leaf.content + "\n" + line.scrub();
    let finish = this.advance(content2);
    if (finish > -1 && finish < content2.length)
      return this.complete(cx, leaf, finish);
    return false;
  }
  finish(cx, leaf) {
    if ((this.stage == 2 || this.stage == 3) && skipSpace(leaf.content, this.pos) == leaf.content.length)
      return this.complete(cx, leaf, leaf.content.length);
    return false;
  }
  complete(cx, leaf, len) {
    cx.addLeafElement(leaf, elt(Type.LinkReference, this.start, this.start + len, this.elts));
    return true;
  }
  nextStage(elt2) {
    if (elt2) {
      this.pos = elt2.to - this.start;
      this.elts.push(elt2);
      this.stage++;
      return true;
    }
    if (elt2 === false)
      this.stage = -1;
    return false;
  }
  advance(content2) {
    for (; ; ) {
      if (this.stage == -1) {
        return -1;
      } else if (this.stage == 0) {
        if (!this.nextStage(parseLinkLabel(content2, this.pos, this.start, true)))
          return -1;
        if (content2.charCodeAt(this.pos) != 58)
          return this.stage = -1;
        this.elts.push(elt(Type.LinkMark, this.pos + this.start, this.pos + this.start + 1));
        this.pos++;
      } else if (this.stage == 1) {
        if (!this.nextStage(parseURL(content2, skipSpace(content2, this.pos), this.start)))
          return -1;
      } else if (this.stage == 2) {
        let skip = skipSpace(content2, this.pos), end = 0;
        if (skip > this.pos) {
          let title = parseLinkTitle(content2, skip, this.start);
          if (title) {
            let titleEnd = lineEnd(content2, title.to - this.start);
            if (titleEnd > 0) {
              this.nextStage(title);
              end = titleEnd;
            }
          }
        }
        if (!end)
          end = lineEnd(content2, this.pos);
        return end > 0 && end < content2.length ? end : -1;
      } else {
        return lineEnd(content2, this.pos);
      }
    }
  }
};
function lineEnd(text2, pos) {
  for (; pos < text2.length; pos++) {
    let next = text2.charCodeAt(pos);
    if (next == 10)
      break;
    if (!space(next))
      return -1;
  }
  return pos;
}
var SetextHeadingParser = class {
  nextLine(cx, line, leaf) {
    let underline = line.depth < cx.stack.length ? -1 : isSetextUnderline(line);
    let next = line.next;
    if (underline < 0)
      return false;
    let underlineMark = elt(Type.HeaderMark, cx.lineStart + line.pos, cx.lineStart + underline);
    cx.nextLine();
    cx.addLeafElement(leaf, elt(next == 61 ? Type.SetextHeading1 : Type.SetextHeading2, leaf.start, cx.prevLineEnd(), [
      ...cx.parser.parseInline(leaf.content, leaf.start),
      underlineMark
    ]));
    return true;
  }
  finish() {
    return false;
  }
};
var DefaultLeafBlocks = {
  LinkReference(_, leaf) {
    return leaf.content.charCodeAt(0) == 91 ? new LinkReferenceParser(leaf) : null;
  },
  SetextHeading() {
    return new SetextHeadingParser();
  }
};
var DefaultEndLeaf = [
  (_, line) => isAtxHeading(line) >= 0,
  (_, line) => isFencedCode(line) >= 0,
  (_, line) => isBlockquote(line) >= 0,
  (p, line) => isBulletList(line, p, true) >= 0,
  (p, line) => isOrderedList(line, p, true) >= 0,
  (p, line) => isHorizontalRule(line, p, true) >= 0,
  (p, line) => isHTMLBlock(line, p, true) >= 0
];
var scanLineResult = { text: "", end: 0 };
var BlockContext = class {
  /**
  @internal
  */
  constructor(parser2, input, fragments, ranges) {
    this.parser = parser2;
    this.input = input;
    this.ranges = ranges;
    this.line = new Line();
    this.atEnd = false;
    this.reusePlaceholders = /* @__PURE__ */ new Map();
    this.stoppedAt = null;
    this.rangeI = 0;
    this.to = ranges[ranges.length - 1].to;
    this.lineStart = this.absoluteLineStart = this.absoluteLineEnd = ranges[0].from;
    this.block = CompositeBlock.create(Type.Document, 0, this.lineStart, 0, 0);
    this.stack = [this.block];
    this.fragments = fragments.length ? new FragmentCursor(fragments, input) : null;
    this.readLine();
  }
  get parsedPos() {
    return this.absoluteLineStart;
  }
  advance() {
    if (this.stoppedAt != null && this.absoluteLineStart > this.stoppedAt)
      return this.finish();
    let { line } = this;
    for (; ; ) {
      for (let markI = 0; ; ) {
        let next = line.depth < this.stack.length ? this.stack[this.stack.length - 1] : null;
        while (markI < line.markers.length && (!next || line.markers[markI].from < next.end)) {
          let mark = line.markers[markI++];
          this.addNode(mark.type, mark.from, mark.to);
        }
        if (!next)
          break;
        this.finishContext();
      }
      if (line.pos < line.text.length)
        break;
      if (!this.nextLine())
        return this.finish();
    }
    if (this.fragments && this.reuseFragment(line.basePos))
      return null;
    start:
      for (; ; ) {
        for (let type of this.parser.blockParsers)
          if (type) {
            let result = type(this, line);
            if (result != false) {
              if (result == true)
                return null;
              line.forward();
              continue start;
            }
          }
        break;
      }
    if (line.pos == line.text.length)
      return this.nextLine() ? null : this.finish();
    let leaf = new LeafBlock(this.lineStart + line.pos, line.text.slice(line.pos));
    for (let parse of this.parser.leafBlockParsers)
      if (parse) {
        let parser2 = parse(this, leaf);
        if (parser2)
          leaf.parsers.push(parser2);
      }
    lines:
      while (this.nextLine()) {
        if (line.pos == line.text.length)
          break;
        if (line.indent < line.baseIndent + 4) {
          for (let stop of this.parser.endLeafBlock)
            if (stop(this, line, leaf))
              break lines;
        }
        for (let parser2 of leaf.parsers)
          if (parser2.nextLine(this, line, leaf))
            return null;
        leaf.content += "\n" + line.scrub();
        for (let m of line.markers)
          leaf.marks.push(m);
      }
    this.finishLeaf(leaf);
    return null;
  }
  stopAt(pos) {
    if (this.stoppedAt != null && this.stoppedAt < pos)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = pos;
  }
  reuseFragment(start) {
    if (!this.fragments.moveTo(this.absoluteLineStart + start, this.absoluteLineStart) || !this.fragments.matches(this.block.hash))
      return false;
    let taken = this.fragments.takeNodes(this);
    if (!taken)
      return false;
    this.absoluteLineStart += taken;
    this.lineStart = toRelative(this.absoluteLineStart, this.ranges);
    this.moveRangeI();
    if (this.absoluteLineStart < this.to) {
      this.lineStart++;
      this.absoluteLineStart++;
      this.readLine();
    } else {
      this.atEnd = true;
      this.readLine();
    }
    return true;
  }
  /**
  The number of parent blocks surrounding the current block.
  */
  get depth() {
    return this.stack.length;
  }
  /**
  Get the type of the parent block at the given depth. When no
  depth is passed, return the type of the innermost parent.
  */
  parentType(depth = this.depth - 1) {
    return this.parser.nodeSet.types[this.stack[depth].type];
  }
  /**
  Move to the next input line. This should only be called by
  (non-composite) [block parsers](#BlockParser.parse) that consume
  the line directly, or leaf block parser
  [`nextLine`](#LeafBlockParser.nextLine) methods when they
  consume the current line (and return true).
  */
  nextLine() {
    this.lineStart += this.line.text.length;
    if (this.absoluteLineEnd >= this.to) {
      this.absoluteLineStart = this.absoluteLineEnd;
      this.atEnd = true;
      this.readLine();
      return false;
    } else {
      this.lineStart++;
      this.absoluteLineStart = this.absoluteLineEnd + 1;
      this.moveRangeI();
      this.readLine();
      return true;
    }
  }
  /**
  Retrieve the text of the line after the current one, without
  actually moving the context's current line forward.
  */
  peekLine() {
    return this.scanLine(this.absoluteLineEnd + 1).text;
  }
  moveRangeI() {
    while (this.rangeI < this.ranges.length - 1 && this.absoluteLineStart >= this.ranges[this.rangeI].to) {
      this.rangeI++;
      this.absoluteLineStart = Math.max(this.absoluteLineStart, this.ranges[this.rangeI].from);
    }
  }
  /**
  @internal
  Collect the text for the next line.
  */
  scanLine(start) {
    let r = scanLineResult;
    r.end = start;
    if (start >= this.to) {
      r.text = "";
    } else {
      r.text = this.lineChunkAt(start);
      r.end += r.text.length;
      if (this.ranges.length > 1) {
        let textOffset = this.absoluteLineStart, rangeI = this.rangeI;
        while (this.ranges[rangeI].to < r.end) {
          rangeI++;
          let nextFrom = this.ranges[rangeI].from;
          let after = this.lineChunkAt(nextFrom);
          r.end = nextFrom + after.length;
          r.text = r.text.slice(0, this.ranges[rangeI - 1].to - textOffset) + after;
          textOffset = r.end - r.text.length;
        }
      }
    }
    return r;
  }
  /**
  @internal
  Populate this.line with the content of the next line. Skip
  leading characters covered by composite blocks.
  */
  readLine() {
    let { line } = this, { text: text2, end } = this.scanLine(this.absoluteLineStart);
    this.absoluteLineEnd = end;
    line.reset(text2);
    for (; line.depth < this.stack.length; line.depth++) {
      let cx = this.stack[line.depth], handler = this.parser.skipContextMarkup[cx.type];
      if (!handler)
        throw new Error("Unhandled block context " + Type[cx.type]);
      let marks = this.line.markers.length;
      if (!handler(cx, this, line)) {
        if (this.line.markers.length > marks)
          cx.end = this.line.markers[this.line.markers.length - 1].to;
        line.forward();
        break;
      }
      line.forward();
    }
  }
  lineChunkAt(pos) {
    let next = this.input.chunk(pos), text2;
    if (!this.input.lineChunks) {
      let eol = next.indexOf("\n");
      text2 = eol < 0 ? next : next.slice(0, eol);
    } else {
      text2 = next == "\n" ? "" : next;
    }
    return pos + text2.length > this.to ? text2.slice(0, this.to - pos) : text2;
  }
  /**
  The end position of the previous line.
  */
  prevLineEnd() {
    return this.atEnd ? this.lineStart : this.lineStart - 1;
  }
  /**
  @internal
  */
  startContext(type, start, value = 0) {
    this.block = CompositeBlock.create(type, value, this.lineStart + start, this.block.hash, this.lineStart + this.line.text.length);
    this.stack.push(this.block);
  }
  /**
  Start a composite block. Should only be called from [block
  parser functions](#BlockParser.parse) that return null.
  */
  startComposite(type, start, value = 0) {
    this.startContext(this.parser.getNodeType(type), start, value);
  }
  /**
  @internal
  */
  addNode(block, from, to) {
    if (typeof block == "number")
      block = new Tree(this.parser.nodeSet.types[block], none, none, (to !== null && to !== void 0 ? to : this.prevLineEnd()) - from);
    this.block.addChild(block, from - this.block.from);
  }
  /**
  Add a block element. Can be called by [block
  parsers](#BlockParser.parse).
  */
  addElement(elt2) {
    this.block.addChild(elt2.toTree(this.parser.nodeSet), elt2.from - this.block.from);
  }
  /**
  Add a block element from a [leaf parser](#LeafBlockParser). This
  makes sure any extra composite block markup (such as blockquote
  markers) inside the block are also added to the syntax tree.
  */
  addLeafElement(leaf, elt2) {
    this.addNode(this.buffer.writeElements(injectMarks(elt2.children, leaf.marks), -elt2.from).finish(elt2.type, elt2.to - elt2.from), elt2.from);
  }
  /**
  @internal
  */
  finishContext() {
    let cx = this.stack.pop();
    let top = this.stack[this.stack.length - 1];
    top.addChild(cx.toTree(this.parser.nodeSet), cx.from - top.from);
    this.block = top;
  }
  finish() {
    while (this.stack.length > 1)
      this.finishContext();
    return this.addGaps(this.block.toTree(this.parser.nodeSet, this.lineStart));
  }
  addGaps(tree) {
    return this.ranges.length > 1 ? injectGaps(this.ranges, 0, tree.topNode, this.ranges[0].from, this.reusePlaceholders) : tree;
  }
  /**
  @internal
  */
  finishLeaf(leaf) {
    for (let parser2 of leaf.parsers)
      if (parser2.finish(this, leaf))
        return;
    let inline = injectMarks(this.parser.parseInline(leaf.content, leaf.start), leaf.marks);
    this.addNode(this.buffer.writeElements(inline, -leaf.start).finish(Type.Paragraph, leaf.content.length), leaf.start);
  }
  elt(type, from, to, children2) {
    if (typeof type == "string")
      return elt(this.parser.getNodeType(type), from, to, children2);
    return new TreeElement(type, from);
  }
  /**
  @internal
  */
  get buffer() {
    return new Buffer2(this.parser.nodeSet);
  }
};
function injectGaps(ranges, rangeI, tree, offset, dummies) {
  let rangeEnd = ranges[rangeI].to;
  let children2 = [], positions = [], start = tree.from + offset;
  function movePastNext(upto, inclusive) {
    while (inclusive ? upto >= rangeEnd : upto > rangeEnd) {
      let size = ranges[rangeI + 1].from - rangeEnd;
      offset += size;
      upto += size;
      rangeI++;
      rangeEnd = ranges[rangeI].to;
    }
  }
  for (let ch = tree.firstChild; ch; ch = ch.nextSibling) {
    movePastNext(ch.from + offset, true);
    let from = ch.from + offset, node, reuse = dummies.get(ch.tree);
    if (reuse) {
      node = reuse;
    } else if (ch.to + offset > rangeEnd) {
      node = injectGaps(ranges, rangeI, ch, offset, dummies);
      movePastNext(ch.to + offset, false);
    } else {
      node = ch.toTree();
    }
    children2.push(node);
    positions.push(from - start);
  }
  movePastNext(tree.to + offset, false);
  return new Tree(tree.type, children2, positions, tree.to + offset - start, tree.tree ? tree.tree.propValues : void 0);
}
var MarkdownParser = class extends Parser {
  /**
  @internal
  */
  constructor(nodeSet, blockParsers, leafBlockParsers, blockNames, endLeafBlock, skipContextMarkup, inlineParsers, inlineNames, wrappers) {
    super();
    this.nodeSet = nodeSet;
    this.blockParsers = blockParsers;
    this.leafBlockParsers = leafBlockParsers;
    this.blockNames = blockNames;
    this.endLeafBlock = endLeafBlock;
    this.skipContextMarkup = skipContextMarkup;
    this.inlineParsers = inlineParsers;
    this.inlineNames = inlineNames;
    this.wrappers = wrappers;
    this.nodeTypes = /* @__PURE__ */ Object.create(null);
    for (let t2 of nodeSet.types)
      this.nodeTypes[t2.name] = t2.id;
  }
  createParse(input, fragments, ranges) {
    let parse = new BlockContext(this, input, fragments, ranges);
    for (let w of this.wrappers)
      parse = w(parse, input, fragments, ranges);
    return parse;
  }
  /**
  Reconfigure the parser.
  */
  configure(spec) {
    let config = resolveConfig(spec);
    if (!config)
      return this;
    let { nodeSet, skipContextMarkup } = this;
    let blockParsers = this.blockParsers.slice(), leafBlockParsers = this.leafBlockParsers.slice(), blockNames = this.blockNames.slice(), inlineParsers = this.inlineParsers.slice(), inlineNames = this.inlineNames.slice(), endLeafBlock = this.endLeafBlock.slice(), wrappers = this.wrappers;
    if (nonEmpty(config.defineNodes)) {
      skipContextMarkup = Object.assign({}, skipContextMarkup);
      let nodeTypes2 = nodeSet.types.slice(), styles;
      for (let s of config.defineNodes) {
        let { name: name2, block, composite, style } = typeof s == "string" ? { name: s } : s;
        if (nodeTypes2.some((t2) => t2.name == name2))
          continue;
        if (composite)
          skipContextMarkup[nodeTypes2.length] = (bl, cx, line) => composite(cx, line, bl.value);
        let id = nodeTypes2.length;
        let group = composite ? ["Block", "BlockContext"] : !block ? void 0 : id >= Type.ATXHeading1 && id <= Type.SetextHeading2 ? ["Block", "LeafBlock", "Heading"] : ["Block", "LeafBlock"];
        nodeTypes2.push(NodeType.define({
          id,
          name: name2,
          props: group && [[NodeProp.group, group]]
        }));
        if (style) {
          if (!styles)
            styles = {};
          if (Array.isArray(style) || style instanceof Tag)
            styles[name2] = style;
          else
            Object.assign(styles, style);
        }
      }
      nodeSet = new NodeSet(nodeTypes2);
      if (styles)
        nodeSet = nodeSet.extend(styleTags(styles));
    }
    if (nonEmpty(config.props))
      nodeSet = nodeSet.extend(...config.props);
    if (nonEmpty(config.remove)) {
      for (let rm of config.remove) {
        let block = this.blockNames.indexOf(rm), inline = this.inlineNames.indexOf(rm);
        if (block > -1)
          blockParsers[block] = leafBlockParsers[block] = void 0;
        if (inline > -1)
          inlineParsers[inline] = void 0;
      }
    }
    if (nonEmpty(config.parseBlock)) {
      for (let spec2 of config.parseBlock) {
        let found = blockNames.indexOf(spec2.name);
        if (found > -1) {
          blockParsers[found] = spec2.parse;
          leafBlockParsers[found] = spec2.leaf;
        } else {
          let pos = spec2.before ? findName(blockNames, spec2.before) : spec2.after ? findName(blockNames, spec2.after) + 1 : blockNames.length - 1;
          blockParsers.splice(pos, 0, spec2.parse);
          leafBlockParsers.splice(pos, 0, spec2.leaf);
          blockNames.splice(pos, 0, spec2.name);
        }
        if (spec2.endLeaf)
          endLeafBlock.push(spec2.endLeaf);
      }
    }
    if (nonEmpty(config.parseInline)) {
      for (let spec2 of config.parseInline) {
        let found = inlineNames.indexOf(spec2.name);
        if (found > -1) {
          inlineParsers[found] = spec2.parse;
        } else {
          let pos = spec2.before ? findName(inlineNames, spec2.before) : spec2.after ? findName(inlineNames, spec2.after) + 1 : inlineNames.length - 1;
          inlineParsers.splice(pos, 0, spec2.parse);
          inlineNames.splice(pos, 0, spec2.name);
        }
      }
    }
    if (config.wrap)
      wrappers = wrappers.concat(config.wrap);
    return new MarkdownParser(nodeSet, blockParsers, leafBlockParsers, blockNames, endLeafBlock, skipContextMarkup, inlineParsers, inlineNames, wrappers);
  }
  /**
  @internal
  */
  getNodeType(name2) {
    let found = this.nodeTypes[name2];
    if (found == null)
      throw new RangeError(`Unknown node type '${name2}'`);
    return found;
  }
  /**
  Parse the given piece of inline text at the given offset,
  returning an array of [`Element`](#Element) objects representing
  the inline content.
  */
  parseInline(text2, offset) {
    let cx = new InlineContext(this, text2, offset);
    outer:
      for (let pos = offset; pos < cx.end; ) {
        let next = cx.char(pos);
        for (let token of this.inlineParsers)
          if (token) {
            let result = token(cx, next, pos);
            if (result >= 0) {
              pos = result;
              continue outer;
            }
          }
        pos++;
      }
    return cx.resolveMarkers(0);
  }
};
function nonEmpty(a) {
  return a != null && a.length > 0;
}
function resolveConfig(spec) {
  if (!Array.isArray(spec))
    return spec;
  if (spec.length == 0)
    return null;
  let conf = resolveConfig(spec[0]);
  if (spec.length == 1)
    return conf;
  let rest = resolveConfig(spec.slice(1));
  if (!rest || !conf)
    return conf || rest;
  let conc = (a, b) => (a || none).concat(b || none);
  let wrapA = conf.wrap, wrapB = rest.wrap;
  return {
    props: conc(conf.props, rest.props),
    defineNodes: conc(conf.defineNodes, rest.defineNodes),
    parseBlock: conc(conf.parseBlock, rest.parseBlock),
    parseInline: conc(conf.parseInline, rest.parseInline),
    remove: conc(conf.remove, rest.remove),
    wrap: !wrapA ? wrapB : !wrapB ? wrapA : (inner, input, fragments, ranges) => wrapA(wrapB(inner, input, fragments, ranges), input, fragments, ranges)
  };
}
function findName(names2, name2) {
  let found = names2.indexOf(name2);
  if (found < 0)
    throw new RangeError(`Position specified relative to unknown parser ${name2}`);
  return found;
}
var nodeTypes = [NodeType.none];
for (let i = 1, name2; name2 = Type[i]; i++) {
  nodeTypes[i] = NodeType.define({
    id: i,
    name: name2,
    props: i >= Type.Escape ? [] : [[NodeProp.group, i in DefaultSkipMarkup ? ["Block", "BlockContext"] : ["Block", "LeafBlock"]]],
    top: name2 == "Document"
  });
}
var none = [];
var Buffer2 = class {
  constructor(nodeSet) {
    this.nodeSet = nodeSet;
    this.content = [];
    this.nodes = [];
  }
  write(type, from, to, children2 = 0) {
    this.content.push(type, from, to, 4 + children2 * 4);
    return this;
  }
  writeElements(elts, offset = 0) {
    for (let e of elts)
      e.writeTo(this, offset);
    return this;
  }
  finish(type, length) {
    return Tree.build({
      buffer: this.content,
      nodeSet: this.nodeSet,
      reused: this.nodes,
      topID: type,
      length
    });
  }
};
var Element = class {
  /**
  @internal
  */
  constructor(type, from, to, children2 = none) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.children = children2;
  }
  /**
  @internal
  */
  writeTo(buf, offset) {
    let startOff = buf.content.length;
    buf.writeElements(this.children, offset);
    buf.content.push(this.type, this.from + offset, this.to + offset, buf.content.length + 4 - startOff);
  }
  /**
  @internal
  */
  toTree(nodeSet) {
    return new Buffer2(nodeSet).writeElements(this.children, -this.from).finish(this.type, this.to - this.from);
  }
};
var TreeElement = class {
  constructor(tree, from) {
    this.tree = tree;
    this.from = from;
  }
  get to() {
    return this.from + this.tree.length;
  }
  get type() {
    return this.tree.type.id;
  }
  get children() {
    return none;
  }
  writeTo(buf, offset) {
    buf.nodes.push(this.tree);
    buf.content.push(buf.nodes.length - 1, this.from + offset, this.to + offset, -1);
  }
  toTree() {
    return this.tree;
  }
};
function elt(type, from, to, children2) {
  return new Element(type, from, to, children2);
}
var EmphasisUnderscore = { resolve: "Emphasis", mark: "EmphasisMark" };
var EmphasisAsterisk = { resolve: "Emphasis", mark: "EmphasisMark" };
var LinkStart = {};
var ImageStart = {};
var InlineDelimiter = class {
  constructor(type, from, to, side, size = to - from) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.side = side;
    this.size = size;
  }
};
var Escapable = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
var Punctuation = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;
try {
  Punctuation = new RegExp("[\\p{S}|\\p{P}]", "u");
} catch (_) {
}
var DefaultInline = {
  Escape(cx, next, start) {
    if (next != 92 || start == cx.end - 1)
      return -1;
    let escaped = cx.char(start + 1);
    for (let i = 0; i < Escapable.length; i++)
      if (Escapable.charCodeAt(i) == escaped)
        return cx.append(elt(Type.Escape, start, start + 2));
    return -1;
  },
  Entity(cx, next, start) {
    if (next != 38)
      return -1;
    let m = /^(?:#\d+|#x[a-f\d]+|\w+);/i.exec(cx.slice(start + 1, start + 31));
    return m ? cx.append(elt(Type.Entity, start, start + 1 + m[0].length)) : -1;
  },
  InlineCode(cx, next, start) {
    if (next != 96 || start && cx.char(start - 1) == 96)
      return -1;
    let pos = start + 1;
    while (pos < cx.end && cx.char(pos) == 96)
      pos++;
    let size = pos - start, curSize = 0;
    for (; pos < cx.end; pos++) {
      if (cx.char(pos) == 96) {
        curSize++;
        if (curSize == size && cx.char(pos + 1) != 96)
          return cx.append(elt(Type.InlineCode, start, pos + 1, [
            elt(Type.CodeMark, start, start + size),
            elt(Type.CodeMark, pos + 1 - size, pos + 1)
          ]));
      } else {
        curSize = 0;
      }
    }
    return -1;
  },
  HTMLTag(cx, next, start) {
    if (next != 60 || start == cx.end - 1)
      return -1;
    let after = cx.slice(start + 1, cx.end);
    let url = /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(after);
    if (url) {
      return cx.append(elt(Type.Autolink, start, start + 1 + url[0].length, [
        elt(Type.LinkMark, start, start + 1),
        // url[0] includes the closing bracket, so exclude it from this slice
        elt(Type.URL, start + 1, start + url[0].length),
        elt(Type.LinkMark, start + url[0].length, start + 1 + url[0].length)
      ]));
    }
    let comment2 = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(after);
    if (comment2)
      return cx.append(elt(Type.Comment, start, start + 1 + comment2[0].length));
    let procInst = /^\?[^]*?\?>/.exec(after);
    if (procInst)
      return cx.append(elt(Type.ProcessingInstruction, start, start + 1 + procInst[0].length));
    let m = /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(after);
    if (!m)
      return -1;
    return cx.append(elt(Type.HTMLTag, start, start + 1 + m[0].length));
  },
  Emphasis(cx, next, start) {
    if (next != 95 && next != 42)
      return -1;
    let pos = start + 1;
    while (cx.char(pos) == next)
      pos++;
    let before = cx.slice(start - 1, start), after = cx.slice(pos, pos + 1);
    let pBefore = Punctuation.test(before), pAfter = Punctuation.test(after);
    let sBefore = /\s|^$/.test(before), sAfter = /\s|^$/.test(after);
    let leftFlanking = !sAfter && (!pAfter || sBefore || pBefore);
    let rightFlanking = !sBefore && (!pBefore || sAfter || pAfter);
    let canOpen = leftFlanking && (next == 42 || !rightFlanking || pBefore);
    let canClose = rightFlanking && (next == 42 || !leftFlanking || pAfter);
    return cx.append(new InlineDelimiter(next == 95 ? EmphasisUnderscore : EmphasisAsterisk, start, pos, (canOpen ? 1 : 0) | (canClose ? 2 : 0)));
  },
  HardBreak(cx, next, start) {
    if (next == 92 && cx.char(start + 1) == 10)
      return cx.append(elt(Type.HardBreak, start, start + 2));
    if (next == 32) {
      let pos = start + 1;
      while (cx.char(pos) == 32)
        pos++;
      if (cx.char(pos) == 10 && pos >= start + 2)
        return cx.append(elt(Type.HardBreak, start, pos + 1));
    }
    return -1;
  },
  Link(cx, next, start) {
    return next == 91 ? cx.append(new InlineDelimiter(
      LinkStart,
      start,
      start + 1,
      1
      /* Mark.Open */
    )) : -1;
  },
  Image(cx, next, start) {
    return next == 33 && cx.char(start + 1) == 91 ? cx.append(new InlineDelimiter(
      ImageStart,
      start,
      start + 2,
      1
      /* Mark.Open */
    )) : -1;
  },
  LinkEnd(cx, next, start) {
    if (next != 93)
      return -1;
    for (let i = cx.parts.length - 1; i >= 0; i--) {
      let part = cx.parts[i];
      if (part instanceof InlineDelimiter && (part.type == LinkStart || part.type == ImageStart)) {
        if (!part.side || cx.skipSpace(part.to) == start && !/[(\[]/.test(cx.slice(start + 1, start + 2))) {
          cx.parts[i] = null;
          return -1;
        }
        let content2 = cx.takeContent(i);
        let link = cx.parts[i] = finishLink(cx, content2, part.type == LinkStart ? Type.Link : Type.Image, part.from, start + 1);
        if (part.type == LinkStart)
          for (let j = 0; j < i; j++) {
            let p = cx.parts[j];
            if (p instanceof InlineDelimiter && p.type == LinkStart)
              p.side = 0;
          }
        return link.to;
      }
    }
    return -1;
  }
};
function finishLink(cx, content2, type, start, startPos) {
  let { text: text2 } = cx, next = cx.char(startPos), endPos = startPos;
  content2.unshift(elt(Type.LinkMark, start, start + (type == Type.Image ? 2 : 1)));
  content2.push(elt(Type.LinkMark, startPos - 1, startPos));
  if (next == 40) {
    let pos = cx.skipSpace(startPos + 1);
    let dest = parseURL(text2, pos - cx.offset, cx.offset), title;
    if (dest) {
      pos = cx.skipSpace(dest.to);
      if (pos != dest.to) {
        title = parseLinkTitle(text2, pos - cx.offset, cx.offset);
        if (title)
          pos = cx.skipSpace(title.to);
      }
    }
    if (cx.char(pos) == 41) {
      content2.push(elt(Type.LinkMark, startPos, startPos + 1));
      endPos = pos + 1;
      if (dest)
        content2.push(dest);
      if (title)
        content2.push(title);
      content2.push(elt(Type.LinkMark, pos, endPos));
    }
  } else if (next == 91) {
    let label2 = parseLinkLabel(text2, startPos - cx.offset, cx.offset, false);
    if (label2) {
      content2.push(label2);
      endPos = label2.to;
    }
  }
  return elt(type, start, endPos, content2);
}
function parseURL(text2, start, offset) {
  let next = text2.charCodeAt(start);
  if (next == 60) {
    for (let pos = start + 1; pos < text2.length; pos++) {
      let ch = text2.charCodeAt(pos);
      if (ch == 62)
        return elt(Type.URL, start + offset, pos + 1 + offset);
      if (ch == 60 || ch == 10)
        return false;
    }
    return null;
  } else {
    let depth = 0, pos = start;
    for (let escaped = false; pos < text2.length; pos++) {
      let ch = text2.charCodeAt(pos);
      if (space(ch)) {
        break;
      } else if (escaped) {
        escaped = false;
      } else if (ch == 40) {
        depth++;
      } else if (ch == 41) {
        if (!depth)
          break;
        depth--;
      } else if (ch == 92) {
        escaped = true;
      }
    }
    return pos > start ? elt(Type.URL, start + offset, pos + offset) : pos == text2.length ? null : false;
  }
}
function parseLinkTitle(text2, start, offset) {
  let next = text2.charCodeAt(start);
  if (next != 39 && next != 34 && next != 40)
    return false;
  let end = next == 40 ? 41 : next;
  for (let pos = start + 1, escaped = false; pos < text2.length; pos++) {
    let ch = text2.charCodeAt(pos);
    if (escaped)
      escaped = false;
    else if (ch == end)
      return elt(Type.LinkTitle, start + offset, pos + 1 + offset);
    else if (ch == 92)
      escaped = true;
  }
  return null;
}
function parseLinkLabel(text2, start, offset, requireNonWS) {
  for (let escaped = false, pos = start + 1, end = Math.min(text2.length, pos + 999); pos < end; pos++) {
    let ch = text2.charCodeAt(pos);
    if (escaped)
      escaped = false;
    else if (ch == 93)
      return requireNonWS ? false : elt(Type.LinkLabel, start + offset, pos + 1 + offset);
    else {
      if (requireNonWS && !space(ch))
        requireNonWS = false;
      if (ch == 91)
        return false;
      else if (ch == 92)
        escaped = true;
    }
  }
  return null;
}
var InlineContext = class {
  /**
  @internal
  */
  constructor(parser2, text2, offset) {
    this.parser = parser2;
    this.text = text2;
    this.offset = offset;
    this.parts = [];
  }
  /**
  Get the character code at the given (document-relative)
  position.
  */
  char(pos) {
    return pos >= this.end ? -1 : this.text.charCodeAt(pos - this.offset);
  }
  /**
  The position of the end of this inline section.
  */
  get end() {
    return this.offset + this.text.length;
  }
  /**
  Get a substring of this inline section. Again uses
  document-relative positions.
  */
  slice(from, to) {
    return this.text.slice(from - this.offset, to - this.offset);
  }
  /**
  @internal
  */
  append(elt2) {
    this.parts.push(elt2);
    return elt2.to;
  }
  /**
  Add a [delimiter](#DelimiterType) at this given position. `open`
  and `close` indicate whether this delimiter is opening, closing,
  or both. Returns the end of the delimiter, for convenient
  returning from [parse functions](#InlineParser.parse).
  */
  addDelimiter(type, from, to, open, close) {
    return this.append(new InlineDelimiter(type, from, to, (open ? 1 : 0) | (close ? 2 : 0)));
  }
  /**
  Returns true when there is an unmatched link or image opening
  token before the current position.
  */
  get hasOpenLink() {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      let part = this.parts[i];
      if (part instanceof InlineDelimiter && (part.type == LinkStart || part.type == ImageStart))
        return true;
    }
    return false;
  }
  /**
  Add an inline element. Returns the end of the element.
  */
  addElement(elt2) {
    return this.append(elt2);
  }
  /**
  Resolve markers between this.parts.length and from, wrapping matched markers in the
  appropriate node and updating the content of this.parts. @internal
  */
  resolveMarkers(from) {
    for (let i = from; i < this.parts.length; i++) {
      let close = this.parts[i];
      if (!(close instanceof InlineDelimiter && close.type.resolve && close.side & 2))
        continue;
      let emp = close.type == EmphasisUnderscore || close.type == EmphasisAsterisk;
      let closeSize = close.to - close.from;
      let open, j = i - 1;
      for (; j >= from; j--) {
        let part = this.parts[j];
        if (part instanceof InlineDelimiter && part.side & 1 && part.type == close.type && // Ignore emphasis delimiters where the character count doesn't match
        !(emp && (close.side & 1 || part.side & 2) && (part.size + close.size) % 3 == 0 && (part.size % 3 || close.size % 3))) {
          open = part;
          break;
        }
      }
      if (!open)
        continue;
      let type = close.type.resolve, content2 = [];
      let start = open.from, end = close.to;
      if (emp) {
        let size = Math.min(2, open.to - open.from, closeSize);
        start = open.to - size;
        end = close.from + size;
        type = size == 1 ? "Emphasis" : "StrongEmphasis";
      }
      if (open.type.mark)
        content2.push(this.elt(open.type.mark, start, open.to));
      for (let k = j + 1; k < i; k++) {
        if (this.parts[k] instanceof Element)
          content2.push(this.parts[k]);
        this.parts[k] = null;
      }
      if (close.type.mark)
        content2.push(this.elt(close.type.mark, close.from, end));
      let element = this.elt(type, start, end, content2);
      this.parts[j] = emp && open.from != start ? new InlineDelimiter(open.type, open.from, start, open.side, open.size) : null;
      let keep = this.parts[i] = emp && close.to != end ? new InlineDelimiter(close.type, end, close.to, close.side, close.size) : null;
      if (keep)
        this.parts.splice(i, 0, element);
      else
        this.parts[i] = element;
    }
    let result = [];
    for (let i = from; i < this.parts.length; i++) {
      let part = this.parts[i];
      if (part instanceof Element)
        result.push(part);
    }
    return result;
  }
  /**
  Find an opening delimiter of the given type. Returns `null` if
  no delimiter is found, or an index that can be passed to
  [`takeContent`](#InlineContext.takeContent) otherwise.
  */
  findOpeningDelimiter(type) {
    for (let i = this.parts.length - 1; i >= 0; i--) {
      let part = this.parts[i];
      if (part instanceof InlineDelimiter && part.type == type && part.side & 1)
        return i;
    }
    return null;
  }
  /**
  Remove all inline elements and delimiters starting from the
  given index (which you should get from
  [`findOpeningDelimiter`](#InlineContext.findOpeningDelimiter),
  resolve delimiters inside of them, and return them as an array
  of elements.
  */
  takeContent(startIndex) {
    let content2 = this.resolveMarkers(startIndex);
    this.parts.length = startIndex;
    return content2;
  }
  /**
  Return the delimiter at the given index. Mostly useful to get
  additional info out of a delimiter index returned by
  [`findOpeningDelimiter`](#InlineContext.findOpeningDelimiter).
  Returns null if there is no delimiter at this index.
  */
  getDelimiterAt(index) {
    let part = this.parts[index];
    return part instanceof InlineDelimiter ? part : null;
  }
  /**
  Skip space after the given (document) position, returning either
  the position of the next non-space character or the end of the
  section.
  */
  skipSpace(from) {
    return skipSpace(this.text, from - this.offset) + this.offset;
  }
  elt(type, from, to, children2) {
    if (typeof type == "string")
      return elt(this.parser.getNodeType(type), from, to, children2);
    return new TreeElement(type, from);
  }
};
InlineContext.linkStart = LinkStart;
InlineContext.imageStart = ImageStart;
InlineContext.emphasisAsterisk = EmphasisAsterisk;
InlineContext.emphasisUnderscore = EmphasisUnderscore;
function injectMarks(elements, marks) {
  if (!marks.length)
    return elements;
  if (!elements.length)
    return marks;
  let elts = elements.slice(), eI = 0;
  for (let mark of marks) {
    while (eI < elts.length && elts[eI].to < mark.to)
      eI++;
    if (eI < elts.length && elts[eI].from < mark.from) {
      let e = elts[eI];
      if (e instanceof Element)
        elts[eI] = new Element(e.type, e.from, e.to, injectMarks(e.children, [mark]));
    } else {
      elts.splice(eI++, 0, mark);
    }
  }
  return elts;
}
var NotLast = [Type.CodeBlock, Type.ListItem, Type.OrderedList, Type.BulletList];
var FragmentCursor = class {
  constructor(fragments, input) {
    this.fragments = fragments;
    this.input = input;
    this.i = 0;
    this.fragment = null;
    this.fragmentEnd = -1;
    this.cursor = null;
    if (fragments.length)
      this.fragment = fragments[this.i++];
  }
  nextFragment() {
    this.fragment = this.i < this.fragments.length ? this.fragments[this.i++] : null;
    this.cursor = null;
    this.fragmentEnd = -1;
  }
  moveTo(pos, lineStart2) {
    while (this.fragment && this.fragment.to <= pos)
      this.nextFragment();
    if (!this.fragment || this.fragment.from > (pos ? pos - 1 : 0))
      return false;
    if (this.fragmentEnd < 0) {
      let end = this.fragment.to;
      while (end > 0 && this.input.read(end - 1, end) != "\n")
        end--;
      this.fragmentEnd = end ? end - 1 : 0;
    }
    let c = this.cursor;
    if (!c) {
      c = this.cursor = this.fragment.tree.cursor();
      c.firstChild();
    }
    let rPos = pos + this.fragment.offset;
    while (c.to <= rPos)
      if (!c.parent())
        return false;
    for (; ; ) {
      if (c.from >= rPos)
        return this.fragment.from <= lineStart2;
      if (!c.childAfter(rPos))
        return false;
    }
  }
  matches(hash) {
    let tree = this.cursor.tree;
    return tree && tree.prop(NodeProp.contextHash) == hash;
  }
  takeNodes(cx) {
    let cur = this.cursor, off = this.fragment.offset, fragEnd = this.fragmentEnd - (this.fragment.openEnd ? 1 : 0);
    let start = cx.absoluteLineStart, end = start, blockI = cx.block.children.length;
    let prevEnd = end, prevI = blockI;
    for (; ; ) {
      if (cur.to - off > fragEnd || cur.to - off > cx.to) {
        if (cur.type.isAnonymous && cur.firstChild())
          continue;
        break;
      }
      let pos = toRelative(cur.from - off, cx.ranges);
      if (cur.to - off <= cx.ranges[cx.rangeI].to) {
        cx.addNode(cur.tree, pos);
      } else {
        let dummy = new Tree(cx.parser.nodeSet.types[Type.Paragraph], [], [], 0, cx.block.hashProp);
        cx.reusePlaceholders.set(dummy, cur.tree);
        cx.addNode(dummy, pos);
      }
      if (cur.type.is("Block")) {
        if (NotLast.indexOf(cur.type.id) < 0) {
          end = cur.to - off;
          blockI = cx.block.children.length;
        } else {
          end = prevEnd;
          blockI = prevI;
        }
        prevEnd = cur.to - off;
        prevI = cx.block.children.length;
      }
      if (!cur.nextSibling())
        break;
    }
    while (cx.block.children.length > blockI) {
      cx.block.children.pop();
      cx.block.positions.pop();
    }
    return end - start;
  }
};
function toRelative(abs, ranges) {
  let pos = abs;
  for (let i = 1; i < ranges.length; i++) {
    let gapFrom = ranges[i - 1].to, gapTo = ranges[i].from;
    if (gapFrom < abs)
      pos -= gapTo - gapFrom;
  }
  return pos;
}
var markdownHighlighting = styleTags({
  "Blockquote/...": tags.quote,
  HorizontalRule: tags.contentSeparator,
  "ATXHeading1/... SetextHeading1/...": tags.heading1,
  "ATXHeading2/... SetextHeading2/...": tags.heading2,
  "ATXHeading3/...": tags.heading3,
  "ATXHeading4/...": tags.heading4,
  "ATXHeading5/...": tags.heading5,
  "ATXHeading6/...": tags.heading6,
  "Comment CommentBlock": tags.comment,
  Escape: tags.escape,
  Entity: tags.character,
  "Emphasis/...": tags.emphasis,
  "StrongEmphasis/...": tags.strong,
  "Link/... Image/...": tags.link,
  "OrderedList/... BulletList/...": tags.list,
  "BlockQuote/...": tags.quote,
  "InlineCode CodeText": tags.monospace,
  "URL Autolink": tags.url,
  "HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark": tags.processingInstruction,
  "CodeInfo LinkLabel": tags.labelName,
  LinkTitle: tags.string,
  Paragraph: tags.content
});
var parser = new MarkdownParser(new NodeSet(nodeTypes).extend(markdownHighlighting), Object.keys(DefaultBlockParsers).map((n) => DefaultBlockParsers[n]), Object.keys(DefaultBlockParsers).map((n) => DefaultLeafBlocks[n]), Object.keys(DefaultBlockParsers), DefaultEndLeaf, DefaultSkipMarkup, Object.keys(DefaultInline).map((n) => DefaultInline[n]), Object.keys(DefaultInline), []);
var StrikethroughDelim = { resolve: "Strikethrough", mark: "StrikethroughMark" };
var Strikethrough = {
  defineNodes: [{
    name: "Strikethrough",
    style: { "Strikethrough/...": tags.strikethrough }
  }, {
    name: "StrikethroughMark",
    style: tags.processingInstruction
  }],
  parseInline: [{
    name: "Strikethrough",
    parse(cx, next, pos) {
      if (next != 126 || cx.char(pos + 1) != 126 || cx.char(pos + 2) == 126)
        return -1;
      let before = cx.slice(pos - 1, pos), after = cx.slice(pos + 2, pos + 3);
      let sBefore = /\s|^$/.test(before), sAfter = /\s|^$/.test(after);
      let pBefore = Punctuation.test(before), pAfter = Punctuation.test(after);
      return cx.addDelimiter(StrikethroughDelim, pos, pos + 2, !sAfter && (!pAfter || sBefore || pBefore), !sBefore && (!pBefore || sAfter || pAfter));
    },
    after: "Emphasis"
  }]
};
function parseRow(cx, line, startI = 0, elts, offset = 0) {
  let count2 = 0, first = true, cellStart = -1, cellEnd = -1, esc = false;
  let parseCell = () => {
    elts.push(cx.elt("TableCell", offset + cellStart, offset + cellEnd, cx.parser.parseInline(line.slice(cellStart, cellEnd), offset + cellStart)));
  };
  for (let i = startI; i < line.length; i++) {
    let next = line.charCodeAt(i);
    if (next == 124 && !esc) {
      if (!first || cellStart > -1)
        count2++;
      first = false;
      if (elts) {
        if (cellStart > -1)
          parseCell();
        elts.push(cx.elt("TableDelimiter", i + offset, i + offset + 1));
      }
      cellStart = cellEnd = -1;
    } else if (esc || next != 32 && next != 9) {
      if (cellStart < 0)
        cellStart = i;
      cellEnd = i + 1;
    }
    esc = !esc && next == 92;
  }
  if (cellStart > -1) {
    count2++;
    if (elts)
      parseCell();
  }
  return count2;
}
function hasPipe(str, start) {
  for (let i = start; i < str.length; i++) {
    let next = str.charCodeAt(i);
    if (next == 124)
      return true;
    if (next == 92)
      i++;
  }
  return false;
}
var delimiterLine = /^[>\s]*\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)?$/;
var TableParser = class {
  constructor() {
    this.rows = null;
  }
  nextLine(cx, line, leaf) {
    if (this.rows == null) {
      this.rows = false;
      let lineText;
      if ((line.next == 45 || line.next == 58 || line.next == 124) && delimiterLine.test(lineText = line.text.slice(line.pos))) {
        let firstRow = [], firstCount = parseRow(cx, leaf.content, 0, firstRow, leaf.start);
        if (firstCount == parseRow(cx, lineText, 0))
          this.rows = [
            cx.elt("TableHeader", leaf.start, leaf.start + leaf.content.length, firstRow),
            cx.elt("TableDelimiter", cx.lineStart + line.pos, cx.lineStart + line.text.length)
          ];
      }
    } else if (this.rows) {
      let content2 = [];
      parseRow(cx, line.text, line.pos, content2, cx.lineStart);
      this.rows.push(cx.elt("TableRow", cx.lineStart + line.pos, cx.lineStart + line.text.length, content2));
    }
    return false;
  }
  finish(cx, leaf) {
    if (!this.rows)
      return false;
    cx.addLeafElement(leaf, cx.elt("Table", leaf.start, leaf.start + leaf.content.length, this.rows));
    return true;
  }
};
var Table = {
  defineNodes: [
    { name: "Table", block: true },
    { name: "TableHeader", style: { "TableHeader/...": tags.heading } },
    "TableRow",
    { name: "TableCell", style: tags.content },
    { name: "TableDelimiter", style: tags.processingInstruction }
  ],
  parseBlock: [{
    name: "Table",
    leaf(_, leaf) {
      return hasPipe(leaf.content, 0) ? new TableParser() : null;
    },
    endLeaf(cx, line, leaf) {
      if (leaf.parsers.some((p) => p instanceof TableParser) || !hasPipe(line.text, line.basePos))
        return false;
      let next = cx.peekLine();
      return delimiterLine.test(next) && parseRow(cx, line.text, line.basePos) == parseRow(cx, next, line.basePos);
    },
    before: "SetextHeading"
  }]
};
var TaskParser = class {
  nextLine() {
    return false;
  }
  finish(cx, leaf) {
    cx.addLeafElement(leaf, cx.elt("Task", leaf.start, leaf.start + leaf.content.length, [
      cx.elt("TaskMarker", leaf.start, leaf.start + 3),
      ...cx.parser.parseInline(leaf.content.slice(3), leaf.start + 3)
    ]));
    return true;
  }
};
var TaskList = {
  defineNodes: [
    { name: "Task", block: true, style: tags.list },
    { name: "TaskMarker", style: tags.atom }
  ],
  parseBlock: [{
    name: "TaskList",
    leaf(cx, leaf) {
      return /^\[[ xX]\][ \t]/.test(leaf.content) && cx.parentType().name == "ListItem" ? new TaskParser() : null;
    },
    after: "SetextHeading"
  }]
};
var autolinkRE = /(www\.)|(https?:\/\/)|([\w.+-]{1,100}@)|(mailto:|xmpp:)/gy;
var urlRE = /[\w-]+(\.[\w-]+)+(:\d+)?(\/[^\s<]*)?/gy;
var lastTwoDomainWords = /[\w-]+\.[\w-]+($|[/:])/;
var emailRE = /[\w.+-]+@[\w-]+(\.[\w.-]+)+/gy;
var xmppResourceRE = /\/[a-zA-Z\d@.]+/gy;
function count(str, from, to, ch) {
  let result = 0;
  for (let i = from; i < to; i++)
    if (str[i] == ch)
      result++;
  return result;
}
function autolinkURLEnd(text2, from) {
  urlRE.lastIndex = from;
  let m = urlRE.exec(text2);
  if (!m || lastTwoDomainWords.exec(m[0])[0].indexOf("_") > -1)
    return -1;
  let end = from + m[0].length;
  for (; ; ) {
    let last = text2[end - 1], m2;
    if (/[?!.,:*_~]/.test(last) || last == ")" && count(text2, from, end, ")") > count(text2, from, end, "("))
      end--;
    else if (last == ";" && (m2 = /&(?:#\d+|#x[a-f\d]+|\w+);$/.exec(text2.slice(from, end))))
      end = from + m2.index;
    else
      break;
  }
  return end;
}
function autolinkEmailEnd(text2, from) {
  emailRE.lastIndex = from;
  let m = emailRE.exec(text2);
  if (!m)
    return -1;
  let last = m[0][m[0].length - 1];
  return last == "_" || last == "-" ? -1 : from + m[0].length - (last == "." ? 1 : 0);
}
var Autolink = {
  parseInline: [{
    name: "Autolink",
    parse(cx, next, absPos) {
      let pos = absPos - cx.offset;
      if (pos && /\w/.test(cx.text[pos - 1]))
        return -1;
      autolinkRE.lastIndex = pos;
      let m = autolinkRE.exec(cx.text), end = -1;
      if (!m)
        return -1;
      if (m[1] || m[2]) {
        end = autolinkURLEnd(cx.text, pos + m[0].length);
        if (end > -1 && cx.hasOpenLink) {
          let noBracket = /([^\[\]]|\[[^\]]*\])*/.exec(cx.text.slice(pos, end));
          end = pos + noBracket[0].length;
        }
      } else if (m[3]) {
        end = autolinkEmailEnd(cx.text, pos);
      } else {
        end = autolinkEmailEnd(cx.text, pos + m[0].length);
        if (end > -1 && m[0] == "xmpp:") {
          xmppResourceRE.lastIndex = end;
          m = xmppResourceRE.exec(cx.text);
          if (m)
            end = m.index + m[0].length;
        }
      }
      if (end < 0)
        return -1;
      cx.addElement(cx.elt("URL", absPos, end + cx.offset));
      return end + cx.offset;
    }
  }]
};
var GFM = [Table, TaskList, Strikethrough, Autolink];
function parseSubSuper(ch, node, mark) {
  return (cx, next, pos) => {
    if (next != ch || cx.char(pos + 1) == ch)
      return -1;
    let elts = [cx.elt(mark, pos, pos + 1)];
    for (let i = pos + 1; i < cx.end; i++) {
      let next2 = cx.char(i);
      if (next2 == ch)
        return cx.addElement(cx.elt(node, pos, i + 1, elts.concat(cx.elt(mark, i, i + 1))));
      if (next2 == 92)
        elts.push(cx.elt("Escape", i, i++ + 2));
      if (space(next2))
        break;
    }
    return -1;
  };
}
var Superscript = {
  defineNodes: [
    { name: "Superscript", style: tags.special(tags.content) },
    { name: "SuperscriptMark", style: tags.processingInstruction }
  ],
  parseInline: [{
    name: "Superscript",
    parse: parseSubSuper(94, "Superscript", "SuperscriptMark")
  }]
};
var Subscript = {
  defineNodes: [
    { name: "Subscript", style: tags.special(tags.content) },
    { name: "SubscriptMark", style: tags.processingInstruction }
  ],
  parseInline: [{
    name: "Subscript",
    parse: parseSubSuper(126, "Subscript", "SubscriptMark")
  }]
};
var Emoji = {
  defineNodes: [{ name: "Emoji", style: tags.character }],
  parseInline: [{
    name: "Emoji",
    parse(cx, next, pos) {
      let match;
      if (next != 58 || !(match = /^[a-zA-Z_0-9]+:/.exec(cx.slice(pos + 1, cx.end))))
        return -1;
      return cx.addElement(cx.elt("Emoji", pos, pos + 1 + match[0].length));
    }
  }]
};

// src/domain/conversion.ts
var listName = /^(?:BulletList|OrderedList)$/u;
var headingName = /^(?:ATX|Setext)Heading[1-6]$/u;
var listTarget = (target) => ["bullet", "number", "task"].includes(target);
var names = {
  paragraph: /^Paragraph$/u,
  heading: headingName,
  item: /^ListItem$/u,
  quote: /^Blockquote$/u,
  callout: /^Blockquote$/u,
  list: listName,
  code: /^(?:FencedCode|CodeBlock)$/u,
  table: /^Table$/u,
  rule: /^HorizontalRule$/u
};
function children(node) {
  const result = [];
  for (let child = node.firstChild; child; child = child.nextSibling)
    result.push(child);
  return result;
}
function visit(node, run) {
  run(node);
  for (let child = node.firstChild; child; child = child.nextSibling)
    visit(child, run);
}
function columns(value) {
  let col = 0;
  for (const ch of value)
    col += ch === "	" ? 4 - col % 4 : 1;
  return col;
}
function project(text2, cuts, from = 0, to = text2.length) {
  let at = from, result = "";
  for (const cut of cuts) {
    if (cut.to <= at || cut.from >= to)
      continue;
    result += text2.slice(at, Math.max(at, cut.from));
    at = Math.min(to, cut.to);
  }
  return result + text2.slice(at, to);
}
function ordered(cuts) {
  const result = [];
  for (const cut of cuts.sort((a, b) => a.from - b.from)) {
    const last = result[result.length - 1];
    if (last && cut.from <= last.to)
      last.to = Math.max(last.to, cut.to);
    else if (cut.to > cut.from)
      result.push({ ...cut });
  }
  return result;
}
function indentCuts(text2, base, first = true) {
  const result = [];
  let from = 0;
  for (const line of text2.split("\n")) {
    if (first || from > 0) {
      let width = 0, end = 0;
      while (end < line.length && width < base && /[ \t]/u.test(line[end])) {
        width += line[end++] === "	" ? 4 - width % 4 : 1;
      }
      if (width > base)
        return null;
      result.push({ from, to: from + end });
    }
    from += line.length + 1;
  }
  return result;
}
function shape(node, text2, cuts, rename) {
  if (cuts.some((cut) => cut.from <= node.from && cut.to >= node.to))
    return null;
  const content2 = project(text2, cuts, node.from, node.to).replace(/\r$/u, "");
  const nested = node.name === "FencedCode" || node.name === "CodeBlock" ? [] : children(node).map((child) => shape(child, text2, cuts)).filter((child) => child !== null);
  return [rename != null ? rename : node.name, content2, nested];
}
function shapes(nodes, text2, cuts = [], rename) {
  return JSON.stringify(nodes.map((node) => shape(node, text2, cuts, node === rename ? "Paragraph" : void 0)).filter((node) => node !== null));
}
function prefixColumns(text2, from) {
  return columns(text2.slice(text2.lastIndexOf("\n", from - 1) + 1, from));
}
function localSource(model, block) {
  const value = model.text.slice(block.from, block.to);
  const white = block.kind === "item" ? value.match(/^[ \t]*/u)[0] : "";
  const base = block.kind === "item" ? prefixColumns(model.text, block.from) + columns(white) : 0;
  const cuts = indentCuts(value, base, false);
  return cuts && project(value, ordered([{ from: 0, to: white.length }, ...cuts]));
}
function payload(value, category) {
  var _a, _b;
  const tree = markdownTree(value).topNode;
  let roots2 = children(tree), node = roots2[0], cuts = [], renamed, checked = null;
  if (!node || roots2.length !== 1 || !closedBlockSyntax(node, value))
    return null;
  if (category === "item") {
    if (!listName.test(node.name) || children(node).length !== 1)
      return null;
    node = node.firstChild;
    const mark = /^([ \t]*)([-+*]|\d+[.)])([ \t]+)/u.exec(value);
    if (!mark)
      return null;
    const base = columns(mark[0]), indents = indentCuts(value, base, false);
    if (!indents)
      return null;
    cuts.push(...indents, { from: 0, to: mark[0].length });
    roots2 = children(node).filter((child) => child.name !== "ListMark");
    if (((_a = roots2[0]) == null ? void 0 : _a.name) === "Task") {
      renamed = roots2[0];
      const task = renamed.getChild("TaskMarker");
      if (!task)
        return null;
      checked = value.slice(task.from + 1, task.to - 1);
      const space2 = value.slice(task.to).match(/^[ \t]*/u)[0].length;
      cuts.push({ from: task.from, to: task.to + space2 });
    }
  } else if (category === "heading") {
    if (!headingName.test(node.name))
      return null;
    renamed = node;
    const marks = node.getChildren("HeaderMark");
    if (node.name.startsWith("Setext")) {
      const underline = marks[marks.length - 1];
      const start = value.lastIndexOf("\n", underline.from);
      if (start < 0)
        return null;
      cuts.push({ from: value[start - 1] === "\r" ? start - 1 : start, to: value.length });
    } else {
      const open = marks[0], close = marks[1];
      if (!open)
        return null;
      cuts.push({ from: 0, to: open.to + value.slice(open.to).match(/^[ \t]*/u)[0].length });
      if (close) {
        const before = value.slice(0, close.from).match(/[ \t]*$/u)[0].length;
        cuts.push({ from: close.from - before, to: value.length });
      }
    }
  } else if (category === "quote") {
    if (node.name !== "Blockquote")
      return null;
    let from = 0;
    for (const line of value.split("\n")) {
      const mark = /^ {0,3}>[ \t]?/u.exec(line);
      if (mark)
        cuts.push({ from, to: from + mark[0].length });
      from += line.length + 1;
    }
    roots2 = children(node);
  } else if (category === "callout") {
    if (node.name !== "Blockquote")
      return null;
  } else if (!((_b = names[category]) == null ? void 0 : _b.test(node.name)))
    return null;
  cuts = ordered(cuts);
  const body = project(value, cuts);
  if (!body.trim())
    return null;
  const expected = shapes(roots2, value, cuts, renamed), actual = shapes(children(markdownTree(body).topNode), body);
  if (actual !== expected)
    return null;
  return { text: body, shape: actual, checked };
}
function decorate(body, target, ordinal) {
  var _a;
  const text2 = body.text;
  if (target === "paragraph")
    return text2;
  if (target.startsWith("h")) {
    const roots2 = children(markdownTree(text2).topNode);
    if (/[\r\n]/u.test(text2) || roots2.length !== 1 || roots2[0].name !== "Paragraph")
      return null;
    return "#".repeat(Number(target.slice(1))) + " " + text2;
  }
  if (target === "quote")
    return text2.replace(/(^|\n)/gu, "$1> ");
  const mark = target === "number" ? `${ordinal}. ` : "- ";
  const task = target === "task" ? `[${(_a = body.checked) != null ? _a : " "}] ` : "";
  return mark + task + text2.replace(/\n/gu, "\n" + " ".repeat(mark.length));
}
function flattenLists(nodes) {
  return nodes.reduce((all, node) => all.concat(listName.test(node.name) ? children(node) : [node]), []);
}
function fragment(model, source, target, ordinal) {
  const local = localSource(model, source);
  if (local === null)
    return null;
  const body = payload(local, source.kind);
  if (!body)
    return null;
  const value = decorate(body, target, ordinal);
  if (value === null)
    return null;
  const resultKind = listTarget(target) ? "item" : target === "quote" ? "quote" : target.startsWith("h") ? "heading" : null;
  const unwrapped = resultKind ? payload(value, resultKind) : { shape: shapes(children(markdownTree(value).topNode), value) };
  if (!unwrapped || unwrapped.shape !== body.shape)
    return null;
  const list = source.parent ? model.blocks.find((b) => b.id === source.parent) : void 0;
  const parent = (list == null ? void 0 : list.parent) ? model.blocks.find((b) => b.id === list.parent) : void 0;
  const sourceIndent = prefixColumns(model.text, source.from) + columns(model.text.slice(source.from, source.to).match(/^[ \t]*/u)[0]);
  let base = source.kind === "item" && listTarget(target) ? sourceIndent : 0;
  if (source.kind === "item" && !listTarget(target) && parent) {
    const mark = /^([ \t]*)([-+*]|\d+[.)])[ \t]+/u.exec(model.text.slice(parent.from, parent.to));
    if (!mark)
      return null;
    base = prefixColumns(model.text, parent.from) + columns(mark[0]);
  }
  const prefix = target.startsWith("h") ? Number(target.slice(1)) + 1 : target === "quote" ? 2 : target === "number" ? `${ordinal}. `.length : target === "task" ? 6 : target === "bullet" ? 2 : 0;
  return { source, value, base, anchor: prefix };
}
function padBefore(text2, eol) {
  var _a, _b;
  return eol.repeat(Math.max(0, 2 - ((_b = (_a = text2.match(/(?:\r?\n[ \t]*)*$/u)[0].match(/\n/gu)) == null ? void 0 : _a.length) != null ? _b : 0)));
}
function padAfter(text2, eol) {
  var _a, _b;
  return eol.repeat(Math.max(0, 2 - ((_b = (_a = text2.match(/^(?:[ \t]*\r?\n)*/u)[0].match(/\n/gu)) == null ? void 0 : _a.length) != null ? _b : 0)));
}
function convertStructured(model, selected, target) {
  var _a, _b, _c, _d;
  if (model.text.length > 2 * 1024 * 1024 || !selected.length || !/^(?:paragraph|bullet|number|task|quote|h[1-6])$/u.test(target))
    return null;
  if (selected.some((b) => !model.blocks.includes(b) || b.locked || b.parent !== selected[0].parent))
    return null;
  const group = model.blocks.filter((b) => b.parent === selected[0].parent);
  const chosen = [...selected].sort((a, b) => a.from - b.from), firstIndex = group.indexOf(chosen[0]);
  if (chosen.some((b, i) => group[firstIndex + i] !== b))
    return null;
  const sources = chosen.reduce((all, b) => all.concat(b.kind === "list" ? model.blocks.filter((child) => child.parent === b.id) : [b]), []);
  if (!sources.length)
    return null;
  if (!/^\s*$/u.test(model.text.slice(chosen[0].from, sources[0].from)) || !/^\s*$/u.test(model.text.slice(sources[sources.length - 1].to, chosen[chosen.length - 1].to)))
    return null;
  const fragments = [];
  for (const source of sources) {
    const planned = fragment(model, source, target, fragments.length + 1);
    if (!planned)
      return null;
    fragments.push(planned);
  }
  const first = chosen[0], last = chosen[chosen.length - 1], text2 = model.text;
  const eol = (_b = (_a = text2.match(/\r?\n/u)) == null ? void 0 : _a[0]) != null ? _b : "\n";
  let value = "", anchor = 0;
  const spans = [];
  for (let i = 0; i < fragments.length; i++) {
    const part = fragments[i], before = fragments[i - 1];
    if (before) {
      const originalGap = text2.slice(before.source.to, part.source.from);
      const minimum = listTarget(target) ? 1 : 2;
      if (!/^\s*$/u.test(originalGap))
        return null;
      value += originalGap + eol.repeat(Math.max(0, minimum - ((_d = (_c = originalGap.match(/\n/gu)) == null ? void 0 : _c.length) != null ? _d : 0)));
    }
    const firstIndent = part.base - prefixColumns(text2, part.source.from);
    if (firstIndent < 0)
      return null;
    const decorated = " ".repeat(firstIndent) + part.value.replace(/\n/gu, "\n" + " ".repeat(part.base));
    if (!i)
      anchor = value.length + firstIndent + part.anchor;
    spans.push({ from: value.length, to: value.length + decorated.length, value: part.value, base: part.base });
    value += decorated;
  }
  const padding = !listTarget(target) && sources.some((b) => b.kind === "item");
  const lastSource = sources[sources.length - 1];
  const peers = model.blocks.filter((b) => b.parent === lastSource.parent);
  const following = peers[peers.indexOf(lastSource) + 1];
  const separateNumber = listTarget(target) && target !== "number" && lastSource.kind === "item" && (following == null ? void 0 : following.kind) === "item" && /^[ \t]*\d+[.)][ \t]/u.test(text2.slice(following.from, following.to));
  const prefix = padding && first.from && !prefixColumns(text2, first.from) ? padBefore(text2.slice(0, first.from), eol) : "";
  const suffix = (padding || separateNumber) && last.to < text2.length ? padAfter(text2.slice(last.to), eol) : "";
  const insert = prefix + value + suffix;
  if (insert === text2.slice(first.from, last.to))
    return null;
  const candidate = text2.slice(0, first.from) + insert + text2.slice(last.to);
  const tree = markdownTree(candidate).topNode, original = markdownTree(text2).topNode;
  const delta = insert.length - (last.to - first.from);
  const map = (n) => n < first.from ? n : n >= last.to ? n + delta : first.from;
  const indexed = /* @__PURE__ */ new Map();
  visit(tree, (n) => indexed.set(`${n.from}:${n.to}:${n.name}`, n));
  const anchored = model.blocks.filter((b) => /(?:^|\n)[ \t]*\^[\w-]+[ \t]*$/u.test(text2.slice(b.from, b.to)));
  if (anchored.length) {
    const nextBlocks = parseBlocks(candidate).blocks;
    for (const b of anchored) {
      if (!nextBlocks.some((next) => next.kind === b.kind && next.depth === b.depth && next.from === map(b.from) && next.to === map(b.to)))
        return null;
    }
  }
  let valid = true;
  const ownership = (node, changed) => {
    const result = [];
    for (let p = node.parent; p; p = p.parent)
      if (p.name === "ListItem" || p.name === "Blockquote")
        result.push(`${p.name}:${changed ? map(p.from) : p.from}`);
    return result.join("/");
  };
  visit(original, (node) => {
    if (!valid || node.name === "Document" || listName.test(node.name))
      return;
    if (node.to <= first.from || node.from >= last.to) {
      const next = indexed.get(`${node.from >= last.to ? map(node.from) : node.from}:${node.to <= first.from ? node.to : map(node.to)}:${node.name}`);
      if (!next || ownership(node, true) !== ownership(next, false))
        valid = false;
    } else if (node.from < first.from && node.to >= last.to && (node.name === "ListItem" || node.name === "Blockquote")) {
      const sharedEnd = node.to === last.to + Number(text2[last.to] === "\r");
      const contentEnd = first.from + prefix.length + value.length;
      const end = contentEnd + Number(candidate[contentEnd] === "\r");
      if (!indexed.has(`${node.from}:${map(node.to)}:${node.name}`) && !(sharedEnd && indexed.has(`${node.from}:${end}:${node.name}`)))
        valid = false;
    }
  });
  if (!valid)
    return null;
  for (const span of spans) {
    const start = first.from + prefix.length + span.from, end = first.from + prefix.length + span.to;
    const syntaxEnd = end + Number(candidate[end] === "\r");
    const roots2 = [];
    const collect = (node) => {
      if (node.to < start || node.from > syntaxEnd)
        return;
      if (node.name !== "Document" && !listName.test(node.name) && node.from >= start && node.to <= syntaxEnd) {
        roots2.push(node);
        return;
      }
      for (const child of children(node))
        collect(child);
    };
    collect(tree);
    const actualText = candidate.slice(start, end), cuts = indentCuts(actualText, span.base);
    if (!cuts)
      return null;
    const globalCuts = cuts.map((cut) => ({ from: start + cut.from, to: start + cut.to }));
    const expected = shapes(flattenLists(children(markdownTree(span.value).topNode)), span.value);
    if (shapes(roots2, candidate, globalCuts) !== expected)
      return null;
  }
  return {
    from: first.from,
    to: last.to,
    before: text2.slice(first.from, last.to),
    insert,
    anchor: first.from + prefix.length + anchor,
    head: first.from + prefix.length + value.length
  };
}

// src/domain/blocks.ts
var opaque = {
  name: "KeylineOpaque",
  before: "HorizontalRule",
  parse(cx, line) {
    const root = cx.parentType().name === "Document";
    const text2 = line.text.slice(line.basePos).replace(/^\uFEFF/u, "").replace(/\s+$/u, "");
    let type, close;
    if (root && cx.lineStart === 0 && text2 === "---") {
      type = "KeylineFrontmatter";
      close = /^(?:---|\.\.\.)[ \t]*$/u;
    } else if (/^ {0,3}\$\$/u.test(text2)) {
      type = "KeylineMath";
      close = /\$\$[ \t]*$/u;
    } else if (/^ {0,3}%%/u.test(text2)) {
      type = "KeylineComment";
      close = /%%[ \t]*$/u;
    } else
      return false;
    const from = cx.lineStart + (root ? 0 : line.pos), containerIndent = line.baseIndent;
    let to = cx.lineStart + line.text.length;
    const first = type === "KeylineFrontmatter" ? "" : text2.replace(/^\s+/u, "").slice(2);
    if (first && close.test(first))
      cx.nextLine();
    else
      while (cx.nextLine()) {
        if (line.baseIndent < containerIndent)
          break;
        to = cx.lineStart + line.text.length;
        if (close.test(line.text.slice(line.basePos).replace(/\r$/u, ""))) {
          cx.nextLine();
          break;
        }
      }
    cx.addElement(cx.elt(type, from, to));
    return true;
  },
  endLeaf(_cx, line) {
    return /^ {0,3}(?:\$\$|%%)/u.test(line.text.slice(line.basePos));
  }
};
var inlineOpaque = {
  name: "KeylineInlineOpaque",
  after: "InlineCode",
  parse(cx, next, pos) {
    const comment2 = next === 37 && cx.char(pos + 1) === 37;
    if (!comment2 && next !== 36)
      return -1;
    const width = comment2 || cx.char(pos + 1) === 36 ? 2 : 1;
    const marker2 = comment2 ? "%%" : "$".repeat(width);
    let stop = -1;
    for (let at = pos + width; at + width <= cx.end; at++) {
      if (cx.slice(at, at + width) !== marker2)
        continue;
      let escapes = 0;
      for (let p = at - 1; p >= pos && cx.char(p) === 92; p--)
        escapes++;
      if (escapes % 2 === 0) {
        stop = at + width;
        break;
      }
    }
    if (stop < 0 && !comment2)
      return -1;
    return cx.addElement(cx.elt(comment2 ? "KeylineInlineComment" : "KeylineInlineMath", pos, stop < 0 ? cx.end : stop));
  }
};
var markdown = parser.configure([GFM, {
  defineNodes: [
    ...["KeylineFrontmatter", "KeylineMath", "KeylineComment"].map((name2) => ({ name: name2, block: true })),
    { name: "KeylineInlineComment" },
    { name: "KeylineInlineMath" }
  ],
  parseBlock: [opaque],
  parseInline: [inlineOpaque]
}]);
function markdownTree(text2) {
  return markdown.parse(text2);
}
function inProtectedSyntax(text2, offset, end = offset, allowInlineCode = false) {
  if (!Number.isInteger(offset) || !Number.isInteger(end) || offset < 0 || end < offset || end > text2.length || text2.length > 2 * 1024 * 1024)
    return true;
  const tree = markdown.parse(text2);
  const protectedName = /^(?:FencedCode|CodeBlock|InlineCode|HTMLBlock|HTMLTag|KeylineFrontmatter|Keyline(?:Inline)?Math|Keyline(?:Inline)?Comment)$/u;
  const protectedNode = (name2) => protectedName.test(name2) && !(allowInlineCode && name2 === "InlineCode");
  let node = tree.resolveInner(offset, offset < text2.length ? 1 : -1);
  while (node) {
    if (protectedNode(node.name))
      return true;
    node = node.parent;
  }
  let found = false;
  if (end > offset)
    tree.iterate({ from: offset, to: end, enter(node2) {
      if (protectedNode(node2.name) && node2.from < end && node2.to > offset) {
        found = true;
        return false;
      }
    } });
  return found;
}
function lineStart(text2, at) {
  return text2.lastIndexOf("\n", Math.max(0, at - 1)) + 1;
}
function endWithoutCR(text2, at) {
  return text2[at - 1] === "\r" ? at - 1 : at;
}
function kind(node, text2) {
  var _a;
  if (/^(ATXHeading|SetextHeading)/u.test(node.name))
    return "heading";
  if (node.name === "BulletList" || node.name === "OrderedList")
    return "list";
  if (node.name === "ListItem")
    return "item";
  if (node.name === "Blockquote")
    return /^ {0,3}>\s*\[![^\]]+\]/u.test(text2.slice(lineStart(text2, node.from), node.to)) ? "callout" : "quote";
  const names2 = {
    Paragraph: "paragraph",
    FencedCode: "code",
    CodeBlock: "code",
    Table: "table",
    HorizontalRule: "rule",
    HTMLBlock: "html",
    LinkReference: "reference",
    KeylineFrontmatter: "frontmatter",
    KeylineMath: "math",
    KeylineComment: "comment"
  };
  return (_a = names2[node.name]) != null ? _a : null;
}
function unclosed(node, source) {
  if (node.name === "FencedCode")
    return node.getChildren("CodeMark").length < 2;
  const lines = source.split(/\r?\n/u);
  if (node.name === "KeylineFrontmatter")
    return lines.length < 2 || !/^(---|\.\.\.)[ \t]*$/u.test(lines[lines.length - 1]);
  if (node.name === "KeylineMath" || node.name === "KeylineComment") {
    const marker2 = node.name === "KeylineMath" ? "$$" : "%%";
    return !source.replace(/\s+$/u, "").slice(source.indexOf(marker2) + 2).endsWith(marker2);
  }
  return false;
}
function closedBlockSyntax(node, text2) {
  if (unclosed(node, text2.slice(node.from, node.to)))
    return false;
  for (let child = node.firstChild; child; child = child.nextSibling)
    if (!closedBlockSyntax(child, text2))
      return false;
  return true;
}
function parseBlocks(text2) {
  const blocks2 = [], tree = markdown.parse(text2);
  const visit2 = (node, parent) => {
    var _a;
    const category = kind(node, text2);
    if (!category)
      return;
    const start = lineStart(text2, node.from);
    const from = /\S/u.test(text2.slice(start, node.from)) ? node.from : start;
    const to = endWithoutCR(text2, node.to);
    const item = {
      id: `${from}:${to}:${category}`,
      kind: category,
      from,
      to,
      parent: (_a = parent == null ? void 0 : parent.id) != null ? _a : null,
      children: [],
      depth: parent ? parent.depth + 1 : 0,
      locked: category === "frontmatter" || unclosed(node, text2.slice(from, to))
    };
    blocks2.push(item);
    parent == null ? void 0 : parent.children.push(item.id);
    if (category === "list" || category === "item")
      for (let child = node.firstChild; child; child = child.nextSibling) {
        if (category === "list" && child.name === "ListItem" || category === "item" && /^(BulletList|OrderedList)$/u.test(child.name))
          visit2(child, item);
      }
  };
  let previousRoot;
  for (let node = tree.topNode.firstChild; node; node = node.nextSibling) {
    if (node.name === "Paragraph" && /^ {0,3}\^[\w-]+[ \t\r]*$/u.test(text2.slice(node.from, node.to)) && previousRoot && !previousRoot.locked) {
      const oldId = previousRoot.id;
      previousRoot.to = endWithoutCR(text2, node.to);
      previousRoot.id = `${previousRoot.from}:${previousRoot.to}:${previousRoot.kind}`;
      for (const block of blocks2)
        if (block.parent === oldId)
          block.parent = previousRoot.id;
      continue;
    }
    const count2 = blocks2.length;
    visit2(node, null);
    previousRoot = blocks2[count2];
  }
  return { text: text2, blocks: blocks2 };
}
function blockAt(model, position) {
  var _a;
  if (!Number.isInteger(position) || position < 0 || position > model.text.length)
    return null;
  return (_a = model.blocks.filter((b) => b.from <= position && position <= b.to).sort((a, b) => b.depth - a.depth)[0]) != null ? _a : null;
}
function siblings(model, block) {
  return model.blocks.filter((b) => b.parent === block.parent);
}
function siblingDropTarget(model, position, parent) {
  var _a;
  if (!Number.isInteger(position) || position < 0 || position > model.text.length)
    return null;
  let block = blockAt(model, position);
  while (block && block.parent !== parent)
    block = (_a = model.blocks.find((b) => b.id === block.parent)) != null ? _a : null;
  if (block)
    return block;
  const group = model.blocks.filter((b) => b.parent === parent);
  if (!group.length)
    return null;
  const before = [...group].reverse().find((b) => b.to <= position), after = group.find((b) => b.from >= position);
  if (before && after && /^\s*$/u.test(model.text.slice(before.to, after.from)))
    return position - before.to <= after.from - position ? before : after;
  if (parent === null && !blockAt(model, position)) {
    if (!before && after && /^\s*$/u.test(model.text.slice(position, after.from)))
      return after;
    if (before && !after && /^\s*$/u.test(model.text.slice(before.to, position)))
      return before;
  }
  return null;
}
function parentOf(model, block) {
  var _a;
  return (_a = model.blocks.find((b) => b.id === block.parent)) != null ? _a : null;
}
function blockSelection(model, from, to = from) {
  if (from > to)
    [from, to] = [to, from];
  let first = blockAt(model, from), last = blockAt(model, Math.max(from, to - 1));
  if (!first || !last)
    return [];
  while (first.parent !== last.parent) {
    if (first.depth >= last.depth)
      first = parentOf(model, first);
    else
      last = parentOf(model, last);
    if (!first || !last)
      return [];
  }
  const items = siblings(model, first);
  return items.slice(items.indexOf(first), items.indexOf(last) + 1);
}
var edit = (model, from, to, insert, anchor = from, head = anchor) => ({ from, to, before: model.text.slice(from, to), insert, anchor, head });
function blockPrefixColumns(text2, from) {
  let width = 0;
  for (const char of text2.slice(lineStart(text2, from), from))
    width += char === "	" ? 4 - width % 4 : 1;
  return width;
}
function blockTextInSlot(model, block, prefix) {
  var _a;
  const text2 = " ".repeat(blockPrefixColumns(model.text, block.from)) + model.text.slice(block.from, block.to);
  let width = 0, start = 0;
  while (width < prefix && /[ \t]/u.test((_a = text2[start]) != null ? _a : "")) {
    width += text2[start++] === "	" ? 4 - width % 4 : 1;
  }
  return width === prefix ? text2.slice(start) : null;
}
function consecutive(model, selected) {
  const known = new Set(model.blocks);
  if (!selected.length || selected.some((b) => b.locked || !known.has(b) || b.parent !== selected[0].parent))
    return null;
  const group = siblings(model, selected[0]), positions = new Map(group.map((b, i) => [b, i]));
  const indices = selected.map((b) => positions.get(b)).sort((a, b) => a - b);
  if (indices.some((n, i) => n !== indices[0] + i))
    return null;
  return indices.map((i) => group[i]);
}
function moveBlocks(model, selected, target, after) {
  const sources = consecutive(model, selected), source = sources == null ? void 0 : sources[0];
  if (!sources || !source || target.locked || sources.includes(target) || source.parent !== target.parent)
    return null;
  const group = siblings(model, source);
  if (!group.includes(target))
    return null;
  const moving = new Set(sources), ordered2 = group.filter((b) => !moving.has(b));
  ordered2.splice(ordered2.indexOf(target) + (after ? 1 : 0), 0, ...sources);
  if (ordered2.every((b, i) => b === group[i]))
    return null;
  const begin = group[0].from, end = group[group.length - 1].to;
  let insert = "", anchor = begin, head = begin;
  const rendered = [];
  for (let i = 0; i < ordered2.length; i++) {
    const value = blockTextInSlot(model, ordered2[i], blockPrefixColumns(model.text, group[i].from));
    if (value === null)
      return null;
    rendered.push(value);
    if (ordered2[i] === source)
      anchor = begin + insert.length;
    insert += value;
    if (ordered2[i] === sources[sources.length - 1])
      head = begin + insert.length;
    if (i < group.length - 1)
      insert += model.text.slice(group[i].to, group[i + 1].from);
  }
  const candidate = parseBlocks(model.text.slice(0, begin) + insert + model.text.slice(end));
  const moved = candidate.blocks.find((b) => b.from === anchor && b.kind === source.kind && b.depth === source.depth);
  if (!moved || candidate.text.slice(moved.from, moved.to) !== rendered[ordered2.indexOf(source)])
    return null;
  const nextGroup = siblings(candidate, moved);
  if (nextGroup.length !== group.length || nextGroup.some((b, i) => b.kind !== ordered2[i].kind || blockTextInSlot(candidate, b, 0) !== blockTextInSlot(model, ordered2[i], 0)))
    return null;
  const parent = parentOf(model, source), nextParent = parentOf(candidate, moved);
  if (parent ? (nextParent == null ? void 0 : nextParent.from) !== parent.from || nextParent.kind !== parent.kind : nextParent)
    return null;
  return edit(model, begin, end, insert, anchor, head);
}
function shiftBlocks(model, selected, direction) {
  const sources = consecutive(model, selected);
  if (!sources)
    return null;
  const group = siblings(model, sources[0]), edge = direction < 0 ? sources[0] : sources[sources.length - 1];
  const next = group[group.indexOf(edge) + direction];
  return next ? moveBlocks(model, sources, next, direction === 1) : null;
}
function deleteBlocks(model, selected) {
  const sources = consecutive(model, selected);
  return sources ? edit(model, sources[0].from, sources[sources.length - 1].to, "") : null;
}
function duplicateBlocks(model, selected) {
  const sources = consecutive(model, selected);
  if (!sources)
    return null;
  const first = sources[0], last = sources[sources.length - 1], source = model.text.slice(first.from, last.to);
  if (/(?:^|\s)\^[\w-]+[ \t]*(?:\r?$)/mu.test(source) || /^\s*\[\^[^\]]+\]:/mu.test(source))
    return null;
  const eol = model.text.includes("\r\n") ? "\r\n" : "\n", gap = first.kind === "item" ? eol : eol + eol;
  const copiedSource = " ".repeat(blockPrefixColumns(model.text, first.from)) + source;
  const insert = gap + copiedSource, anchor = last.to + gap.length;
  const candidate = parseBlocks(model.text.slice(0, last.to) + insert + model.text.slice(last.to));
  const copied = candidate.blocks.find((b) => b.from === anchor && b.kind === first.kind && b.depth === first.depth);
  if (!copied)
    return null;
  const before = siblings(model, first), split = before.indexOf(last) + 1;
  const expected = [...before.slice(0, split), ...sources, ...before.slice(split)];
  const group = siblings(candidate, copied), parent = parentOf(model, first), nextParent = parentOf(candidate, copied);
  if (parent ? (nextParent == null ? void 0 : nextParent.from) !== parent.from || nextParent.kind !== parent.kind : nextParent)
    return null;
  if (group.length !== expected.length || group.some((b, i) => b.kind !== expected[i].kind || blockTextInSlot(candidate, b, 0) !== blockTextInSlot(model, expected[i], 0)))
    return null;
  return edit(model, last.to, last.to, insert, anchor, anchor + copiedSource.length);
}
function convertBlock(model, block, target) {
  return convertStructured(model, [block], target);
}
function convertBlocks(model, selected, target) {
  return convertStructured(model, selected, target);
}
function applyBlockEdit(text2, plan) {
  if (plan.from < 0 || plan.to < plan.from || plan.to > text2.length || text2.slice(plan.from, plan.to) !== plan.before)
    return null;
  return text2.slice(0, plan.from) + plan.insert + text2.slice(plan.to);
}

// src/domain/selection-blocks.ts
var calloutTypes = ["note", "info", "todo", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"];
function selectionBlockPlan(model, blocks2, target) {
  var _a, _b, _c, _d;
  if (blocks2.length !== 1 || model.text.length > 2 * 1024 * 1024)
    return null;
  const b = blocks2[0], before = model.text.slice(b.from, b.to), eol = (_b = (_a = model.text.match(/\r?\n/u)) == null ? void 0 : _a[0]) != null ? _b : "\n";
  if (!model.blocks.includes(b) || b.locked || b.parent !== null || !["paragraph", "heading", "quote"].includes(b.kind) || /(?:^|\s)\^[\w-]+[ \t]*(?:\r?$)/mu.test(before))
    return null;
  if (target === "divider") {
    const followingBreaks = model.text.slice(b.to).match(/^(?:\r?\n){0,2}/u)[0].split("\n").length - 1;
    const insert2 = `${eol}${eol}---${eol.repeat(2 - followingBreaks)}`;
    return { from: b.to, to: b.to, before: "", insert: insert2, anchor: b.to + insert2.length, head: b.to + insert2.length };
  }
  const local = parseBlocks(before);
  const plain2 = b.kind === "paragraph" ? before : (_c = convertBlocks(local, local.blocks.filter((n) => n.parent === null), "paragraph")) == null ? void 0 : _c.insert;
  if (!(plain2 == null ? void 0 : plain2.trim()))
    return null;
  let insert, prefix;
  if (target === "code") {
    const fence = "`".repeat(Math.max(2, ...((_d = plain2.match(/`+/gu)) != null ? _d : []).map((s) => s.length)) + 1);
    insert = `${fence}${eol}${plain2}${eol}${fence}`;
    prefix = fence.length + eol.length;
  } else if (target === "math") {
    if (plain2.includes("$$"))
      return null;
    insert = `$$${eol}${plain2}${eol}$$`;
    prefix = 2 + eol.length;
  } else {
    const type = target.slice(8);
    if (!calloutTypes.includes(type))
      return null;
    const header = `> [!${type}]${eol}`;
    insert = header + plain2.replace(/(^|\n)/gu, "$1> ");
    prefix = header.length + 2;
  }
  const next = parseBlocks(model.text.slice(0, b.from) + insert + model.text.slice(b.to));
  const expected = target === "code" ? "code" : target === "math" ? "math" : "callout";
  if (!next.blocks.some((n) => n.from === b.from && n.to === b.from + insert.length && n.kind === expected && !n.locked))
    return null;
  return {
    from: b.from,
    to: b.to,
    before,
    insert,
    anchor: b.from + prefix,
    head: b.from + (target.startsWith("callout-") ? insert.length : prefix + plain2.length)
  };
}
function blockLinkPlan(model, blocks2, filePath, newId) {
  var _a;
  if (blocks2.length !== 1 || !/\.md$/iu.test(filePath) || /[\r\n[\]|#^\\]/u.test(filePath) || !/^[a-zA-Z0-9-]+$/u.test(newId) || newId.length > 64)
    return null;
  const b = blocks2[0], before = model.text.slice(b.from, b.to);
  if (!model.blocks.includes(b) || b.locked || b.parent !== null || !["paragraph", "heading"].includes(b.kind))
    return null;
  const existing = (_a = /(?:^|\s)\^([\w-]+)[ \t]*$/u.exec(before)) == null ? void 0 : _a[1];
  const id = existing != null ? existing : newId, pattern = /(?:^|\s)\^([\w-]+)[ \t]*(?=\r?$)/gmu;
  let match, occurrences = 0;
  while (match = pattern.exec(model.text))
    if (match[1] === id)
      occurrences++;
  if (occurrences !== (existing ? 1 : 0))
    return null;
  const link = `[[${filePath.slice(0, -3)}#^${id}]]`;
  return { link, edit: existing ? null : {
    from: b.to,
    to: b.to,
    before: "",
    insert: ` ^${id}`,
    anchor: b.from,
    head: b.to
  } };
}

// src/domain/insertion.ts
var insertItems = [
  ["h1", "Heading 1", "\u6807\u9898 1", "heading-1", "block"],
  ["h2", "Heading 2", "\u6807\u9898 2", "heading-2", "block"],
  ["h3", "Heading 3", "\u6807\u9898 3", "heading-3", "block"],
  ["h4", "Heading 4", "\u6807\u9898 4", "heading-4", "block"],
  ["h5", "Heading 5", "\u6807\u9898 5", "heading-5", "block"],
  ["task", "To-do list", "\u5F85\u529E\u5217\u8868", "check-square", "block"],
  ["codeblock", "Code block", "\u4EE3\u7801\u5757", "code", "block"],
  ["math", "Math block", "\u6570\u5B66\u5757", "sigma", "block"],
  ["table", "Table", "\u8868\u683C", "table", "block"],
  ["rule", "Divider", "\u5206\u5272\u7EBF", "minus", "block"],
  ["toc", "Table of contents", "\u76EE\u5F55", "list-ordered", "block"],
  ["callout", "Callout", "Callout", "edit-3", "block"],
  ["newpage", "Page", "\u9875\u9762", "file-plus", "action"],
  ["wiki", "Internal link", "\u5185\u90E8\u94FE\u63A5", "link", "action"],
  ["link", "External link", "\u5916\u90E8\u94FE\u63A5", "link-2", "inline"],
  ["image", "Insert image", "\u63D2\u5165\u56FE\u7247", "image", "action"],
  ["attachment", "Insert attachment", "\u63D2\u5165\u9644\u4EF6", "paperclip", "action"],
  ["today", "Today", "\u4ECA\u5929", "calendar", "inline"],
  ["yesterday", "Yesterday", "\u6628\u5929", "calendar-minus", "inline"],
  ["tomorrow", "Tomorrow", "\u660E\u5929", "calendar-plus", "inline"],
  ["time", "Current time", "\u5F53\u524D\u65F6\u95F4", "clock", "inline"],
  ["footnote", "Footnote", "\u811A\u6CE8", "hash", "inline"],
  ["comment", "Comment", "\u6CE8\u91CA", "message-square", "inline"],
  ["text", "Text", "\u6B63\u6587", "type", "block"],
  ["h6", "Heading 6", "\u6807\u9898 6", "heading-6", "block"],
  ["bullet", "Bullet list", "\u5217\u8868", "list", "block"],
  ["number", "Numbered list", "\u5E8F\u53F7", "list-ordered", "block"],
  ["quote", "Quote", "\u5F15\u7528", "quote", "block"]
];
var customInsertId = (item) => {
  var _a;
  return (_a = item.id) != null ? _a : `command:${item.command}`;
};
var insertDefaults = {
  slash: true,
  slashTrigger: "/",
  inlineSlash: true,
  embedAttachments: false,
  insertOrder: [],
  hiddenInsert: [],
  customInsert: [],
  dateFormat: "YYYY-MM-DD",
  timeFormat: "HH:mm"
};
var boundedString = (v, fallback, limit2) => typeof v === "string" && v.trim() && v.length <= limit2 && !/[\x00-\x1f]/u.test(v) ? v.trim() : fallback;
function validSlashTrigger(value) {
  return typeof value === "string" && /^[\/;:!?~+%＝／；：！～＋]$/u.test(value);
}
function normalizeInsert(raw) {
  const customInsert = [];
  if (Array.isArray(raw.customInsert))
    for (const item of raw.customInsert.slice(0, 32)) {
      if (!item || typeof item !== "object")
        continue;
      const command = boundedString(item.command, "", 160), label2 = boundedString(item.label, command, 80);
      const id = typeof item.id === "string" && /^custom:[a-zA-Z0-9._-]{1,100}$/u.test(item.id) ? item.id : void 0;
      const icon = typeof item.icon === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(item.icon) && item.icon.length <= 100 ? item.icon : void 0;
      const entry = { command, label: label2, ...id ? { id } : {}, ...icon ? { icon } : {} };
      if (!/^[a-zA-Z0-9][a-zA-Z0-9:._-]*$/u.test(command) || customInsert.some((c) => customInsertId(c) === customInsertId(entry)))
        continue;
      customInsert.push(entry);
    }
  const allowed = /* @__PURE__ */ new Set([...insertItems.map((i) => i[0]), ...customInsert.map(customInsertId)]);
  const ids = (v) => Array.isArray(v) ? [...new Set(v.filter((id) => typeof id === "string" && allowed.has(id)))] : [];
  return {
    slash: typeof raw.slash === "boolean" ? raw.slash : true,
    slashTrigger: validSlashTrigger(raw.slashTrigger) ? raw.slashTrigger : "/",
    inlineSlash: typeof raw.inlineSlash === "boolean" ? raw.inlineSlash : true,
    embedAttachments: typeof raw.embedAttachments === "boolean" ? raw.embedAttachments : false,
    insertOrder: ids(raw.insertOrder),
    hiddenInsert: ids(raw.hiddenInsert),
    customInsert,
    dateFormat: boundedString(raw.dateFormat, "YYYY-MM-DD", 80),
    timeFormat: boundedString(raw.timeFormat, "HH:mm", 80)
  };
}
function insertionEntries(prefs, zh, query = "", includeHidden = false) {
  const entries = insertItems.map(([id, en, cn, icon, mode]) => ({ id, label: zh ? cn : en, search: `${id} ${en} ${cn}`, icon, mode }));
  entries.push(...prefs.customInsert.map((c) => {
    var _a;
    return { id: customInsertId(c), label: c.label, search: `${c.label} ${c.command}`, icon: (_a = c.icon) != null ? _a : "terminal", mode: "command", command: c.command };
  }));
  const original = new Map(entries.map((entry, index) => [entry.id, index]));
  const rank = (entry) => {
    const i = prefs.insertOrder.indexOf(entry.id);
    return i < 0 ? prefs.insertOrder.length + original.get(entry.id) : i;
  };
  return entries.filter((e) => (includeHidden || !prefs.hiddenInsert.includes(e.id)) && e.search.toLowerCase().includes(query.toLowerCase().trim())).sort((a, b) => rank(a) - rank(b));
}
function slashAt(text2, cursor, prefs) {
  var _a;
  if (!prefs.slash || cursor < 0 || cursor > text2.length || !Number.isInteger(cursor))
    return null;
  const begin = cursor === 0 ? 0 : text2.lastIndexOf("\n", cursor - 1) + 1, line = text2.slice(begin, cursor);
  const index = line.lastIndexOf(prefs.slashTrigger);
  if (index < 0 || index > 0 && !/[\s（(]/u.test(line[index - 1]))
    return null;
  const before = line.slice(0, index), query = line.slice(index + prefs.slashTrigger.length);
  if (query.length > 64 || /[\/\\\r\n\t:[\]<>`]/u.test(query) || /^\s/u.test(query))
    return null;
  if (!prefs.inlineSlash && !/^(?:[ \t]*>[ \t]*)*[ \t]*(?:(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]*)?)?$/u.test(before))
    return null;
  if (((_a = before.match(/(?<!\\)`+/gu)) != null ? _a : []).length % 2 || before.lastIndexOf("[[") > before.lastIndexOf("]]") || before.lastIndexOf("](") > before.lastIndexOf(")"))
    return null;
  if (inProtectedSyntax(text2, begin + index))
    return null;
  return { from: begin + index, to: cursor, query };
}
var snippet = (text2, selected, block = true) => {
  const from = selected ? text2.indexOf(selected) : text2.length;
  return { text: text2, from: Math.max(0, from), to: Math.max(0, from) + selected.length, block };
};
function makeSnippet(id, document2, selected, zh, dates) {
  var _a, _b;
  const body = selected, heading2 = selected;
  if (/^h[1-6]$/u.test(id))
    return snippet("#".repeat(Number(id.slice(1))) + " " + heading2, heading2);
  if (id === "callout" || id.startsWith("callout-")) {
    const type = id === "callout" ? "note" : id.slice(8);
    if (!calloutTypes.includes(type))
      return null;
    const text2 = `> [!${type}]
> ${body.replace(/\n/gu, "\n> ")}`;
    return body ? snippet(text2, body.includes("\n") ? "" : body) : { text: text2, from: text2.length, to: text2.length, block: true };
  }
  switch (id) {
    case "text":
      return snippet(body, body);
    case "bullet":
      return snippet(`- ${body}`, body);
    case "number":
      return snippet(`1. ${body}`, body);
    case "task":
      return snippet(`- [ ] ${body}`, body);
    case "quote":
      return snippet(body.split("\n").map((line) => `> ${line}`).join("\n"), body.includes("\n") ? "" : body);
    case "codeblock": {
      const code = selected;
      const longest = Math.max(2, ...((_a = code.match(/`+/gu)) != null ? _a : []).map((m) => m.length));
      const fence = "`".repeat(longest + 1);
      const text2 = `${fence}
${code}
${fence}`;
      return { text: text2, from: fence.length + 1, to: fence.length + 1 + code.length, block: true };
    }
    case "math": {
      const formula = selected;
      return formula.includes("$$") ? null : { text: `$$
${formula}
$$`, from: 3, to: 3 + formula.length, block: true };
    }
    case "table": {
      if (!selected)
        return { text: "|  |  |  |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |", from: 2, to: 2, block: true };
      const a = selected || (zh ? "\u9879\u76EE" : "Item"), b = zh ? "\u8BF4\u660E" : "Details";
      const cell = a.replace(/\\/gu, "\\\\").replace(/\|/gu, "\\|").replace(/\r?\n/gu, "<br>");
      return snippet(`| ${cell} | ${b} |
| --- | --- |
|  |  |`, "");
    }
    case "rule":
      return snippet("---\n", "");
    case "toc": {
      const model = parseBlocks(document2), headings = model.blocks.filter((b) => b.kind === "heading");
      const rows2 = headings.map((b) => {
        const raw = document2.slice(b.from, b.to), atx = /^(#{1,6})\s+(.+?)(?:\s+#+)?$/u.exec(raw);
        const label2 = atx ? atx[2] : raw.split(/\r?\n/u)[0], level = atx ? atx[1].length : /=+\s*$/u.test(raw) ? 1 : 2;
        if (!label2 || /[\[\]|#^]/u.test(label2))
          return null;
        return `${"  ".repeat(level - 1)}- [[#${label2}|${label2}]]`;
      }).filter((s) => !!s);
      return rows2.length ? snippet(`**${zh ? "\u76EE\u5F55" : "Table of contents"}**
${rows2.join("\n")}`, "") : null;
    }
    case "wiki":
      return /[\[\]|\r\n]/u.test(selected) ? null : { text: `[[${selected}]]`, from: 2, to: 2 + selected.length, block: false };
    case "link": {
      const label2 = selected.replace(/[\\[\]]/gu, "\\$&");
      const text2 = `[${label2}]()`;
      const at = selected ? text2.length - 1 : 1;
      return { text: text2, from: at, to: at, block: false };
    }
    case "today":
    case "tomorrow":
    case "yesterday":
    case "time":
      return snippet((_b = dates[id]) != null ? _b : "", "", false);
    case "footnote": {
      let n = 1;
      while (document2.includes(`[^${n}]`))
        n++;
      const content2 = selected;
      return { ...snippet(`[^${n}]`, "", false), append: `

[^${n}]: ${content2.replace(/\n/gu, "\n    ")}` };
    }
    case "comment":
      return body.includes("%%") ? null : { text: `%% ${body} %%`, from: 3, to: 3 + body.length, block: false };
    default:
      return null;
  }
}
function planAfterBlock(text2, id, value) {
  var _a, _b;
  if (text2.length > 2 * 1024 * 1024)
    return null;
  const model = parseBlocks(text2), block = model.blocks.find((b) => b.id === id);
  if (!block || block.locked)
    return null;
  if (![value.from, value.to].every(Number.isInteger) || value.from < 0 || value.to < value.from || value.to > value.text.length)
    return null;
  const eol = (_b = (_a = text2.match(/\r?\n/u)) == null ? void 0 : _a[0]) != null ? _b : "\n";
  let prefix = "", continuation = "", gap = eol + eol;
  if (block.kind === "item") {
    const lead = /^([ \t]*)([-+*]|\d+[.)])([ \t]+)/u.exec(text2.slice(block.from, block.to));
    if (!lead)
      return null;
    gap = eol;
    if (/^(?:[-+*]|\d+[.)])[ \t]+/u.test(value.text))
      prefix = continuation = lead[1];
    else {
      prefix = lead[1] + (/^\d/u.test(lead[2]) ? "1. " : lead[2] + " ");
      continuation = " ".repeat(prefix.length);
    }
  }
  const content2 = prefix + value.text.replace(/\n/gu, "\n" + continuation);
  const mapped = (at) => {
    var _a2, _b2;
    return prefix.length + at + ((_b2 = (_a2 = value.text.slice(0, at).match(/\n/gu)) == null ? void 0 : _a2.length) != null ? _b2 : 0) * continuation.length;
  };
  const endings = (s) => s.replace(/\r?\n/gu, eol);
  const insert = gap + endings(content2);
  const candidate = parseBlocks(text2.slice(0, block.to) + insert + text2.slice(block.to));
  const boundaries = new Set(candidate.blocks.map((b) => `${b.from}:${b.to}:${b.kind}:${b.depth}`));
  if (model.blocks.some((b) => {
    if (b.from <= block.from && b.to >= block.to && b.depth < block.depth)
      return !boundaries.has(`${b.from}:${b.to + insert.length}:${b.kind}:${b.depth}`);
    const delta = b.from > block.to ? insert.length : 0;
    return !boundaries.has(`${b.from + delta}:${b.to + delta}:${b.kind}:${b.depth}`);
  }))
    return null;
  return {
    from: block.to,
    to: block.to,
    before: "",
    insert,
    anchor: block.to + gap.length + endings(content2.slice(0, mapped(value.from))).length,
    head: block.to + gap.length + endings(content2.slice(0, mapped(value.to))).length,
    append: value.append && endings(value.append)
  };
}
function planInsertion(text2, from, to, value) {
  var _a, _b, _c, _d;
  if (inProtectedSyntax(text2, from, to))
    return null;
  const begin = from === 0 ? 0 : text2.lastIndexOf("\n", from - 1) + 1;
  const stop = text2.indexOf("\n", to), end = stop < 0 ? text2.length : stop;
  const prefix = text2.slice(begin, from), suffix = text2.slice(to, end);
  let insert = value.text, fromIn = value.from, toIn = value.to;
  if (value.block) {
    const match = /^((?:[ \t]*>[ \t]*)*)([ \t]*)(?:(?:[-+*]|\d+[.)])([ \t]+)(?:\[[ xX]\]([ \t]*))?)?$/u.exec(prefix);
    if (match) {
      const continuation = match[1] + match[2] + " ".repeat(prefix.length - match[1].length - match[2].length);
      const beforeCount = ((_a = insert.slice(0, fromIn).match(/\n/gu)) != null ? _a : []).length;
      const toCount = ((_b = insert.slice(0, toIn).match(/\n/gu)) != null ? _b : []).length;
      insert = insert.replace(/\n/gu, "\n" + continuation);
      fromIn += beforeCount * continuation.length;
      toIn += toCount * continuation.length;
      if (suffix.trim())
        insert += "\n" + continuation;
    } else {
      insert = "\n" + insert + (suffix.trim() ? "\n" : "");
      fromIn += 1;
      toIn += 1;
    }
    if (from === 0 && /^---\n?$/u.test(value.text)) {
      insert = "***" + insert.slice(3);
    }
  }
  const eol = (_d = (_c = text2.match(/\r?\n/u)) == null ? void 0 : _c[0]) != null ? _d : "\n";
  const endings = (s) => s.replace(/\r?\n/gu, eol);
  fromIn = endings(insert.slice(0, fromIn)).length;
  toIn = endings(insert.slice(0, toIn)).length;
  return { from, to, before: text2.slice(from, to), insert: endings(insert), anchor: from + fromIn, head: from + toIn, append: value.append && endings(value.append) };
}

// src/domain/icons.ts
var iconKinds = ["note", "document", "book", "canvas", "audio", "image", "video", "code", "archive", "other", "folder"];
var iconRuleLimit = 1e4;
var iconTints = ["gray", "blue", "red", "green", "purple", "amber", "cyan", "orange", "pink"];
var kindLabels = {
  note: ["Markdown notes", "Markdown \u7B14\u8BB0"],
  document: ["PDF documents", "PDF \u6587\u6863"],
  book: ["EPUB books", "EPUB \u7535\u5B50\u4E66"],
  canvas: ["Canvas", "\u767D\u677F"],
  audio: ["Audio", "\u97F3\u9891"],
  image: ["Images", "\u56FE\u7247"],
  video: ["Video", "\u89C6\u9891"],
  code: ["Code and configuration", "\u4EE3\u7801\u4E0E\u914D\u7F6E"],
  archive: ["Archives", "\u538B\u7F29\u6587\u4EF6"],
  other: ["Other files", "\u5176\u4ED6\u6587\u4EF6"],
  folder: ["Folders", "\u6587\u4EF6\u5939"]
};
var builtins = {
  note: ["keyline-file-text", "blue"],
  document: ["keyline-file-text", "red"],
  book: ["keyline-file-text", "amber"],
  canvas: ["layout-dashboard", "cyan"],
  audio: ["file-audio", "purple"],
  image: ["keyline-file-image", "green"],
  video: ["file-video", "pink"],
  code: ["file-code", "blue"],
  archive: ["file-archive", "orange"],
  other: ["keyline-file-text", "gray"],
  folder: ["keyline-folder", "gray"]
};
function kindIdentity(category, expanded = false) {
  const [icon, color] = builtins[category];
  return { category, icon: category === "folder" && expanded ? "keyline-folder-open" : icon, color };
}
function identifyFile(filename, folder = false, expanded = false) {
  const name2 = filename.slice(filename.lastIndexOf("/") + 1), dot = name2.lastIndexOf(".");
  const extension = dot <= 0 ? "" : name2.slice(dot + 1).toLowerCase();
  const kind2 = folder ? "folder" : extension === "md" ? "note" : extension === "pdf" ? "document" : extension === "epub" ? "book" : extension === "canvas" ? "canvas" : ["wav", "mp3", "m4a", "ogg", "flac", "aac", "aiff", "aif", "opus"].includes(extension) ? "audio" : ["svg", "png", "jpg", "jpeg", "webp", "gif", "avif", "bmp", "heic", "heif", "ico", "tif", "tiff"].includes(extension) ? "image" : ["mp4", "mov", "webm", "mkv", "avi", "m4v", "ogv"].includes(extension) ? "video" : ["js", "ts", "tsx", "jsx", "json", "yaml", "yml", "toml", "css", "html", "xml", "py", "sh", "sql", "c", "cpp", "rs", "go", "swift"].includes(extension) ? "code" : ["zip", "7z", "rar", "gz", "tar", "bz2", "xz"].includes(extension) ? "archive" : "other";
  return kindIdentity(kind2, expanded);
}
function validIconPath(value) {
  return typeof value === "string" && value.length > 0 && value.length <= 4096 && !/[\\\x00-\x1f\x7f]/u.test(value) && value.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}
function cleanIconChoice(value) {
  const result = {};
  if (!value || typeof value !== "object" || Array.isArray(value))
    return result;
  const { glyph, tint } = value;
  if (typeof glyph === "string" && glyph.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(glyph))
    result.glyph = glyph;
  if (typeof tint === "string") {
    const color = tint.toLowerCase();
    if (iconTints.includes(color) || color === "yellow" || /^#[0-9a-f]{6}$/u.test(color))
      result.tint = color;
  }
  return result;
}
function cleanIconRules(value) {
  if (!Array.isArray(value))
    return [];
  const rules = /* @__PURE__ */ new Map();
  for (const raw of value.slice(0, iconRuleLimit)) {
    if (!raw || typeof raw !== "object")
      continue;
    const { scope, key } = raw;
    if (scope === "type" ? !iconKinds.includes(key) : scope !== "path" || !validIconPath(key))
      continue;
    const choice = cleanIconChoice(raw);
    if (choice.glyph || choice.tint)
      rules.set(`${scope}:${key}`, { scope, key, ...choice });
  }
  return [...rules.values()];
}
function iconChoice(rules, scope, key) {
  const rule = rules.find((r) => r.scope === scope && r.key === key);
  return rule ? { ...rule.glyph ? { glyph: rule.glyph } : {}, ...rule.tint ? { tint: rule.tint } : {} } : {};
}
function setIconChoice(rules, scope, key, choice) {
  return cleanIconRules([...rules.filter((r) => r.scope !== scope || r.key !== key), { scope, key, ...choice }]);
}
function resolveIdentity(filename, rules, monochrome = false, folder = false, expanded = false) {
  return identityResolver(rules, monochrome)(filename, folder, expanded);
}
function identityResolver(rules, monochrome = false) {
  const types = /* @__PURE__ */ new Map(), paths = /* @__PURE__ */ new Map();
  for (const rule of rules)
    (rule.scope === "type" ? types : paths).set(rule.key, rule);
  return (filename, folder = false, expanded = false) => {
    var _a, _b, _c, _d;
    const base = identifyFile(filename, folder, expanded), type = types.get(base.category), file = paths.get(filename);
    return { category: base.category, icon: (_b = (_a = file == null ? void 0 : file.glyph) != null ? _a : type == null ? void 0 : type.glyph) != null ? _b : base.icon, color: monochrome ? "gray" : (_d = (_c = file == null ? void 0 : file.tint) != null ? _c : type == null ? void 0 : type.tint) != null ? _d : base.color };
  };
}
function iconTintCss(tint) {
  var _a;
  const safe = (_a = cleanIconChoice({ tint }).tint) != null ? _a : "gray";
  return safe.startsWith("#") ? safe : safe === "gray" ? "var(--text-muted)" : safe === "yellow" ? "var(--color-yellow)" : `var(--keyline-next-identity-${safe})`;
}
function renameIconRules(rules, before, after) {
  if (!validIconPath(before) || !validIconPath(after) || before === after)
    return { rules: [...rules], conflict: false };
  const affected = (r) => r.scope === "path" && (r.key === before || r.key.startsWith(before + "/"));
  const occupied = new Set(rules.filter((r) => r.scope === "path" && !affected(r)).map((r) => r.key));
  if (rules.some((r) => affected(r) && occupied.has(after + r.key.slice(before.length))))
    return { rules: [...rules], conflict: true };
  return { rules: rules.map((r) => affected(r) ? { ...r, key: after + r.key.slice(before.length) } : { ...r }), conflict: false };
}

// src/domain/preferences.ts
var defaults = Object.freeze({
  schema: 1,
  language: "auto",
  editingEnabled: true,
  mentions: true,
  fileIcons: true,
  monochrome: false,
  iconRules: [],
  toolbar: true,
  hints: false,
  fileNavigation: true,
  workspaces: true,
  typographyEnabled: true,
  typography: normalizeTypography(null),
  ...insertDefaults,
  fullwidthLinks: true,
  hideMarkers: true,
  markSuspicious: true,
  optionReveal: true,
  pasteHints: true,
  blockHandles: true,
  dragGranularity: "block",
  handleSide: "left",
  handlePinned: false,
  handleFold: false,
  handlePlus: true,
  handleHoverDelay: 90,
  handleHideDelay: 260,
  snapSelection: true,
  blockKeys: true
});
function decodePreferences(value) {
  const raw = value && typeof value === "object" ? value : {};
  const delay = (key, max) => {
    const value2 = raw[key];
    return typeof value2 === "number" && Number.isFinite(value2) ? Math.round(Math.max(0, Math.min(max, value2))) : defaults[key];
  };
  return {
    ...normalizeInsert(raw),
    schema: 1,
    language: raw.language === "en" || raw.language === "zh" ? raw.language : "auto",
    editingEnabled: typeof raw.editingEnabled === "boolean" ? raw.editingEnabled : defaults.editingEnabled,
    mentions: typeof raw.mentions === "boolean" ? raw.mentions : defaults.mentions,
    fileIcons: typeof raw.fileIcons === "boolean" ? raw.fileIcons : defaults.fileIcons,
    monochrome: typeof raw.monochrome === "boolean" ? raw.monochrome : defaults.monochrome,
    iconRules: cleanIconRules(raw.iconRules),
    toolbar: typeof raw.toolbar === "boolean" ? raw.toolbar : defaults.toolbar,
    hints: typeof raw.hints === "boolean" ? raw.hints : defaults.hints,
    fileNavigation: typeof raw.fileNavigation === "boolean" ? raw.fileNavigation : defaults.fileNavigation,
    workspaces: typeof raw.workspaces === "boolean" ? raw.workspaces : defaults.workspaces,
    typographyEnabled: typeof raw.typographyEnabled === "boolean" ? raw.typographyEnabled : defaults.typographyEnabled,
    typography: normalizeTypography(raw.typography),
    fullwidthLinks: typeof raw.fullwidthLinks === "boolean" ? raw.fullwidthLinks : defaults.fullwidthLinks,
    hideMarkers: typeof raw.hideMarkers === "boolean" ? raw.hideMarkers : defaults.hideMarkers,
    markSuspicious: typeof raw.markSuspicious === "boolean" ? raw.markSuspicious : defaults.markSuspicious,
    optionReveal: typeof raw.optionReveal === "boolean" ? raw.optionReveal : defaults.optionReveal,
    pasteHints: typeof raw.pasteHints === "boolean" ? raw.pasteHints : defaults.pasteHints,
    blockHandles: typeof raw.blockHandles === "boolean" ? raw.blockHandles : defaults.blockHandles,
    dragGranularity: raw.dragGranularity === "line" ? "line" : "block",
    handleSide: raw.handleSide === "right" ? "right" : "left",
    handlePinned: typeof raw.handlePinned === "boolean" ? raw.handlePinned : defaults.handlePinned,
    handleFold: typeof raw.handleFold === "boolean" ? raw.handleFold : defaults.handleFold,
    handlePlus: typeof raw.handlePlus === "boolean" ? raw.handlePlus : defaults.handlePlus,
    snapSelection: typeof raw.snapSelection === "boolean" ? raw.snapSelection : defaults.snapSelection,
    blockKeys: typeof raw.blockKeys === "boolean" ? raw.blockKeys : defaults.blockKeys,
    handleHoverDelay: delay("handleHoverDelay", 1e3),
    handleHideDelay: delay("handleHideDelay", 1500)
  };
}
function editingPreferences(prefs) {
  return prefs.editingEnabled ? prefs : {
    ...prefs,
    mentions: false,
    toolbar: false,
    slash: false,
    fullwidthLinks: false,
    hideMarkers: false,
    markSuspicious: false,
    optionReveal: false,
    pasteHints: false,
    blockHandles: false,
    snapSelection: false,
    blockKeys: false,
    typographyEnabled: false
  };
}
function writablePreferences(value) {
  if (value == null)
    return true;
  if (typeof value !== "object" || Array.isArray(value))
    return false;
  const rules = value.iconRules;
  if (Array.isArray(rules) && rules.length > iconRuleLimit)
    return false;
  const schema = value.schema;
  return schema == null || schema === 1;
}

// src/domain/format.ts
function inlineEdit(text2, style) {
  var _a;
  if (!text2 || /[\r\n]/u.test(text2))
    return null;
  const leading = /^\s*/u.exec(text2)[0].length;
  const trailing = /\s*$/u.exec(text2)[0].length;
  const content2 = text2.slice(leading, text2.length - trailing);
  if (!content2)
    return null;
  const marks = { bold: "**", italic: "*", strike: "~~", highlight: "==", code: "`" };
  const token = marks[style];
  let replacement;
  if (style === "code") {
    const runs = (_a = content2.match(/`+/gu)) != null ? _a : [];
    const fence = "`".repeat(Math.max(0, ...runs.map((r) => r.length)) + 1);
    const padded = content2.startsWith("`") || content2.endsWith("`");
    replacement = fence + (padded ? " " : "") + content2 + (padded ? " " : "") + fence;
  } else if (content2.startsWith(token) && content2.endsWith(token) && content2.length > 2 * token.length && !(style === "italic" && (content2.startsWith("**") || content2.endsWith("**")))) {
    replacement = content2.slice(token.length, -token.length);
  } else
    replacement = token + content2 + token;
  const result = text2.slice(0, leading) + replacement + (trailing ? text2.slice(-trailing) : "");
  return { text: result, selectionStart: leading, selectionEnd: leading + replacement.length };
}

// src/platform/file-identities.ts
var import_obsidian2 = require("obsidian");

// src/platform/identity-artwork.ts
var import_obsidian = require("obsidian");

// src/assets/identity-icons.ts
var identityArtwork = {
  "keyline-folder": { filled: true, path: "M3 3L9.5 3C9.7652 3 10.0196 3.1054 10.2071 3.2929L12.4142 5.5L21 5.5C21.5523 5.5 22 5.9477 22 6.5L22 20C22 20.5523 21.5523 21 21 21L3 21C2.4477 21 2 20.5523 2 20L2 4C2 3.4477 2.4477 3 3 3Z" },
  "keyline-folder-open": { filled: false, path: "M5.5528 15.8944L8 11L22 11L19.0753 20L2 20L2 4L8 4L10 6L19 6L19 12" },
  "keyline-file-text": { filled: true, path: "M14 1C14.2652 1 14.5196 1.1054 14.7071 1.2929L20.7071 7.2929C20.8946 7.4804 21 7.7348 21 8L21 22C21 22.5523 20.5523 23 20 23L4 23C3.4477 23 3 22.5523 3 22L3 2C3 1.4477 3.4477 1 4 1L14 1ZM7 18L17 18L17 16L7 16L7 18ZM7 14L13 14L13 12L7 12L7 14ZM15 8L20 8L14 2L14 7C14 7.5523 14.4477 8 15 8Z" },
  "keyline-file-image": { filled: true, path: "M14 1C14.2652 1 14.5196 1.1054 14.7071 1.2929L20.7071 7.2929C20.8946 7.4804 21 7.7348 21 8L21 22C21 22.5523 20.5523 23 20 23L4 23C3.4477 23 3 22.5523 3 22L3 2C3 1.4477 3.4477 1 4 1L14 1ZM15 8L20 8L14 2L14 7C14 7.5523 14.4477 8 15 8ZM5 17L9.4903 12.5097C9.7947 12.2053 10.2596 12.1299 10.6446 12.3224L19 16.5L19 20C19 20.5523 18.5523 21 18 21L6 21C5.4477 21 5 20.5523 5 20L5 17ZM10.5 7C10.5 6.1716 9.8284 5.5 9 5.5C8.1716 5.5 7.5 6.1716 7.5 7C7.5 7.8284 8.1716 8.5 9 8.5C9.8284 8.5 10.5 7.8284 10.5 7Z" }
};

// src/platform/identity-artwork.ts
function identityGlyphs() {
  const host = (0, import_obsidian.getIconIds)().map((id) => id.replace(/^lucide-/u, "")).filter((id) => cleanIconChoice({ glyph: id }).glyph).sort();
  return [.../* @__PURE__ */ new Set([...Object.keys(identityArtwork), ...host])];
}
function paintIdentityGlyph(slot, requested) {
  const id = requested.replace(/^lucide-/u, "");
  const art = Object.prototype.hasOwnProperty.call(identityArtwork, id) ? identityArtwork[id] : void 0;
  const doc = slot.ownerDocument, ns = "http://www.w3.org/2000/svg";
  let svg;
  if (art) {
    svg = doc.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    const path = doc.createElementNS(ns, "path");
    path.setAttribute("d", art.path);
    svg.appendChild(path);
    if (id === "keyline-file-image") {
      path.setAttribute("fill-rule", "evenodd");
      path.setAttribute("clip-rule", "evenodd");
    }
    svg.setAttribute("fill", art.filled ? "currentColor" : "none");
    svg.setAttribute("stroke", art.filled ? "none" : "currentColor");
    svg.setAttribute("stroke-width", art.filled ? "0" : "2");
    svg.setAttribute("stroke-linecap", "butt");
    svg.setAttribute("stroke-linejoin", "round");
    svg.dataset.paint = art.filled ? "fill" : "sharp-stroke";
  } else {
    const host = (0, import_obsidian.getIcon)(id);
    if (!host) {
      paintIdentityGlyph(slot, "keyline-file-text");
      return;
    }
    svg = doc.importNode(host, true);
    svg.dataset.paint = "stroke";
  }
  svg.classList.add("keyline-next-identity-artwork");
  svg.dataset.identity = id;
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  slot.replaceChildren(svg);
}

// src/platform/native-views.ts
function attachedViews(app, type) {
  const views = /* @__PURE__ */ new Map();
  app.workspace.iterateAllLeaves((leaf) => {
    var _a, _b;
    const view = leaf.view;
    if (((_a = view.getViewType) == null ? void 0 : _a.call(view)) === type && ((_b = view.containerEl) == null ? void 0 : _b.isConnected))
      views.set(view.containerEl, view);
  });
  return [...views.values()];
}

// src/platform/file-identities.ts
var owned = ".keyline-next-file-icon,.keyline-next-tab-icon,.keyline-next-bucket-icon";
var selectionColor = "--ncl-file-selection-color";
var FileIdentities = class {
  constructor(app, prefs, yielded = () => iconOwnerPresent(app)) {
    this.app = app;
    this.prefs = prefs;
    this.yielded = yielded;
    this.roots = /* @__PURE__ */ new Map();
    this.documents = /* @__PURE__ */ new Set();
    this.spans = /* @__PURE__ */ new Set();
    this.bucketSlots = /* @__PURE__ */ new Set();
    this.selectionRows = /* @__PURE__ */ new Map();
    this.live = true;
    this.lastYield = false;
    this.lastYield = yielded();
    this.poll = setInterval(() => {
      const next = yielded();
      if (next !== this.lastYield) {
        this.lastYield = next;
        this.schedule();
      }
    }, 1500);
  }
  observe(root) {
    var _a;
    if (this.roots.has(root))
      return;
    const Observer = (_a = root.ownerDocument.defaultView) == null ? void 0 : _a.MutationObserver;
    if (!Observer)
      return;
    const observer = new Observer((records) => {
      const relevant = records.some((record) => {
        var _a2, _b, _c, _d, _e;
        if ((_b = (_a2 = record.target).closest) == null ? void 0 : _b.call(_a2, owned))
          return false;
        if (record.type === "attributes")
          return ["data-path", "class", "data-bucket-path", "data-bucket-kind", "aria-expanded"].includes((_c = record.attributeName) != null ? _c : "") || !!((_e = (_d = record.target).closest) == null ? void 0 : _e.call(_d, ".workspace-tab-header-inner-icon,.bucket-entry-icon"));
        const changed = [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)];
        return changed.some((node) => !(node.nodeType === 1 && node.matches(owned)));
      });
      if (relevant)
        this.schedule();
    });
    observer.observe(root, { childList: true, subtree: true, attributes: true });
    this.roots.set(root, observer);
    this.documents.add(root.ownerDocument);
  }
  add(parent, identity, category, before, icons, treeSlot = false) {
    let span = Array.from(parent.children).find((e) => e.matches(owned));
    if (!span) {
      span = parent.ownerDocument.createElement("span");
      span.className = `keyline-next-${category}-icon${treeSlot ? " tree-item-icon" : ""}`;
      span.setAttribute("aria-hidden", "true");
    }
    const glyph = icons.has(identity.icon) ? identity.icon : kindIdentity(identity.category).icon;
    if (span.dataset.glyph !== glyph) {
      paintIdentityGlyph(span, glyph);
      span.dataset.glyph = glyph;
    }
    if (span.dataset.category !== identity.category)
      span.dataset.category = identity.category;
    const color = iconTintCss(identity.color);
    if (span.style.color !== color)
      span.style.color = color;
    if (!span.parentElement)
      parent.insertBefore(span, before);
    this.spans.add(span);
  }
  paintSelection(row, color) {
    const current = row.style.getPropertyValue(selectionColor), written = this.selectionRows.get(row);
    if (row.style.getPropertyPriority(selectionColor) || (written === void 0 ? current !== "" : current !== written))
      return;
    if (current !== color)
      row.style.setProperty(selectionColor, color);
    this.selectionRows.set(row, row.style.getPropertyValue(selectionColor));
  }
  releaseSelection(row) {
    if (row.style.getPropertyValue(selectionColor) === this.selectionRows.get(row) && !row.style.getPropertyPriority(selectionColor))
      row.style.removeProperty(selectionColor);
    this.selectionRows.delete(row);
  }
  refresh() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (!this.live)
      return;
    const prefs = this.prefs();
    if (!prefs.fileIcons) {
      this.clear();
      return;
    }
    const explorer = attachedViews(this.app, "file-explorer").map((view) => view.containerEl);
    const buckets = attachedViews(this.app, "bucket-sidebar-view").map((view) => view.containerEl);
    const tabs = [];
    this.app.workspace.iterateAllLeaves((leaf) => {
      var _a2;
      const header = leaf.tabHeaderEl;
      const file = (_a2 = leaf.getViewState().state) == null ? void 0 : _a2.file;
      if (!(header == null ? void 0 : header.isConnected) || !header.closest(".mod-root") || typeof file !== "string" || !this.app.vault.getAbstractFileByPath(file))
        return;
      tabs.push({ root: header, path: file, native: leaf.view.getIcon().replace(/^lucide-/u, "") });
    });
    const current = /* @__PURE__ */ new Set([...explorer, ...buckets, ...tabs.map((tab) => tab.root)]);
    for (const [root, observer] of this.roots)
      if (!current.has(root)) {
        observer.disconnect();
        this.roots.delete(root);
        root.querySelectorAll(owned).forEach((e) => e.remove());
      }
    for (const root of current)
      this.observe(root);
    for (const doc of this.documents)
      if ((_a = doc.defaultView) == null ? void 0 : _a.closed)
        this.documents.delete(doc);
    if (this.yielded()) {
      this.removeIcons();
      return;
    }
    const icons = new Set(identityGlyphs());
    const resolve = identityResolver(prefs.iconRules, prefs.monochrome);
    const currentRows = /* @__PURE__ */ new Set();
    for (const root of explorer) {
      for (const row of Array.from(root.querySelectorAll(".nav-file-title[data-path],.nav-folder-title[data-path]"))) {
        const filename = (_b = row.getAttribute("data-path")) != null ? _b : "", folder = row.classList.contains("nav-folder-title");
        const label2 = row.querySelector(folder ? ".nav-folder-title-content" : ".nav-file-title-content");
        if (!label2 || !filename || !this.app.vault.getAbstractFileByPath(filename))
          continue;
        if (row.querySelector(".nav-file-title-icon,.nav-folder-title-icon,.iconic-icon,.iconic-sidekick")) {
          (_c = row.querySelector(owned)) == null ? void 0 : _c.remove();
          continue;
        }
        const identity = resolve(filename, folder, !((_d = row.parentElement) == null ? void 0 : _d.classList.contains("is-collapsed")));
        if (folder) {
          const indicator = row.querySelector(":scope > .tree-item-icon.collapse-icon,:scope > .nav-folder-collapse-indicator");
          if (!indicator || indicator.style.color || !nativeGlyphMatches(indicator, (0, import_obsidian2.getIcon)("right-triangle"))) {
            (_e = row.querySelector(owned)) == null ? void 0 : _e.remove();
            continue;
          }
          this.add(indicator, identity, "file", null, icons);
        } else {
          this.add(row, identity, "file", label2, icons, true);
          this.paintSelection(row, iconTintCss(identity.color));
          currentRows.add(row);
        }
      }
    }
    const bucketSlots = /* @__PURE__ */ new Set();
    for (const root of buckets) {
      for (const row of Array.from(root.querySelectorAll(".bucket-entry-row[data-bucket-path][data-bucket-kind]"))) {
        const path = row.dataset.bucketPath, kind2 = row.dataset.bucketKind;
        const slot = row.querySelector(":scope > .bucket-entry-icon");
        if (!slot || !validIconPath(path) || kind2 !== "file" && kind2 !== "folder" || row.matches(".iconic-icon,.iconic-sidekick") || row.querySelector(".iconic-icon,.iconic-sidekick") || slot.style.color || !nativeGlyphMatches(slot, (0, import_obsidian2.getIcon)(kind2 === "folder" ? "folder" : "file-text")))
          continue;
        const expanded = ((_f = row.querySelector(":scope > .bucket-disclosure")) == null ? void 0 : _f.getAttribute("aria-expanded")) === "true";
        const identity = resolve(path, kind2 === "folder", expanded);
        this.add(slot, identity, "bucket", null, icons);
        bucketSlots.add(slot);
        if (kind2 === "file") {
          this.paintSelection(row, iconTintCss(identity.color));
          currentRows.add(row);
        }
      }
    }
    for (const slot of this.bucketSlots)
      if (!bucketSlots.has(slot))
        (_g = slot.querySelector(":scope > .keyline-next-bucket-icon")) == null ? void 0 : _g.remove();
    this.bucketSlots = bucketSlots;
    for (const row of this.selectionRows.keys())
      if (!currentRows.has(row))
        this.releaseSelection(row);
    for (const tab of tabs) {
      const container = tab.root.querySelector(".workspace-tab-header-inner-icon");
      if (!(container == null ? void 0 : container.parentElement))
        continue;
      const expected = (0, import_obsidian2.getIcon)(tab.native);
      const safe = !tab.root.querySelector(".iconic-icon") && !container.style.color && nativeGlyphMatches(container, expected, true);
      if (!safe) {
        (_h = container.parentElement.querySelector(":scope > .keyline-next-tab-icon")) == null ? void 0 : _h.remove();
        continue;
      }
      this.add(container.parentElement, resolve(tab.path), "tab", container.nextElementSibling, icons);
    }
    for (const span of this.spans)
      if (!span.isConnected)
        this.spans.delete(span);
  }
  schedule() {
    if (!this.live || this.scheduled !== void 0)
      return;
    this.scheduled = setTimeout(() => {
      this.scheduled = void 0;
      this.refresh();
    }, 60);
  }
  removeIcons() {
    for (const row of this.selectionRows.keys())
      this.releaseSelection(row);
    for (const span of this.spans)
      span.remove();
    for (const doc of this.documents)
      doc.querySelectorAll(owned).forEach((e) => e.remove());
    this.spans.clear();
    this.bucketSlots.clear();
  }
  clear() {
    for (const observer of this.roots.values())
      observer.disconnect();
    this.roots.clear();
    this.removeIcons();
    this.documents.clear();
  }
  dispose() {
    this.live = false;
    clearInterval(this.poll);
    if (this.scheduled !== void 0)
      clearTimeout(this.scheduled);
    this.clear();
  }
};
function nativeGlyphMatches(container, expected, repeated = false) {
  const native = Array.from(container.children).filter((e) => !e.matches(owned));
  return Boolean(expected && (repeated ? native.length > 0 : native.length === 1) && native.every((element) => sameGlyph(element, expected)));
}
function sameGlyph(element, expected) {
  return element.tagName.toLowerCase() === "svg" && ["viewBox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "style"].every((name2) => element.getAttribute(name2) === expected.getAttribute(name2)) && element.childNodes.length === expected.childNodes.length && Array.from(element.childNodes).every((node, i) => node.isEqualNode(expected.childNodes[i]));
}
function iconOwnerPresent(app) {
  var _a, _b, _c;
  const plugins = app.plugins;
  return Boolean((_c = (_a = plugins == null ? void 0 : plugins.getPlugin) == null ? void 0 : _a.call(plugins, "iconic")) != null ? _c : (_b = plugins == null ? void 0 : plugins.plugins) == null ? void 0 : _b.iconic);
}

// src/platform/mention-menu.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");
var import_obsidian5 = require("obsidian");

// src/domain/mentions.ts
function safeWikiTarget(path) {
  return !/[\[\]|#^\r\n]/u.test(path);
}
function mentionAt(line, cursor) {
  var _a;
  if (!Number.isInteger(cursor) || cursor < 0 || cursor > line.length)
    return null;
  const prefix = line.slice(0, cursor);
  const start = prefix.lastIndexOf("@");
  if (start < 0)
    return null;
  const previous = Array.from(prefix.slice(0, start)).pop();
  if (previous && !/[\s([{"'“‘（【\p{Script=Han}，。！？：；、）》」』】”’]/u.test(previous))
    return null;
  const query = prefix.slice(start + 1);
  if (query.length > 80 || /[@\r\n\t<>[\]`\\]/u.test(query))
    return null;
  if (/^\s/u.test(query))
    return null;
  if (query.includes("."))
    return null;
  if (prefix.slice(0, start).includes("[[")) {
    const before2 = prefix.slice(0, start);
    if (before2.lastIndexOf("[[") > before2.lastIndexOf("]]"))
      return null;
  }
  if (/^(?: {4}|\t)/u.test(line))
    return null;
  const before = prefix.slice(0, start);
  if (((_a = before.match(/(?<!\\)`+/gu)) != null ? _a : []).length % 2 !== 0)
    return null;
  if (before.lastIndexOf("](") > before.lastIndexOf(")"))
    return null;
  return { start, end: cursor, query };
}
function mentionSessionAt(line, cursor, start) {
  if (!Number.isInteger(cursor) || !Number.isInteger(start) || start < 0 || cursor <= start || cursor > line.length || line[start] !== "@")
    return null;
  const query = line.slice(start + 1, cursor);
  if (query.length > 120 || /[\r\n@[\]]/u.test(query))
    return null;
  return { start, end: cursor, query };
}
function dateText(date) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}
function dateChoices(now, zh) {
  const names2 = zh ? ["\u4ECA\u5929", "\u660E\u5929", "\u6628\u5929", "\u5F53\u524D\u65F6\u95F4"] : ["Today", "Tomorrow", "Yesterday", "Current time"];
  return ["today", "tomorrow", "yesterday", "now"].map((key, index) => {
    const d = new Date(now.getTime());
    if (key === "tomorrow")
      d.setDate(d.getDate() + 1);
    if (key === "yesterday")
      d.setDate(d.getDate() - 1);
    return { kind: "date", key, label: names2[index], insert: key === "now" ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : dateText(d) };
  });
}
function suggestions(query, pages, now, zh, choices = dateChoices(now, zh)) {
  const q = query.trim().toLocaleLowerCase();
  const terms = q.split(/\s+/u).filter(Boolean);
  const aliases3 = { today: "today \u4ECA\u65E5 \u4ECA\u5929 \u65E5\u671F date", tomorrow: "tomorrow \u660E\u65E5 \u660E\u5929 \u65E5\u671F date", yesterday: "yesterday \u6628\u65E5 \u6628\u5929 \u65E5\u671F date", now: "now time \u73B0\u5728 \u6B64\u523B \u65F6\u95F4" };
  const matchesQuery = (text2) => terms.every((term) => text2.toLocaleLowerCase().includes(term));
  const dates = choices.filter((d) => matchesQuery(`${d.label} ${aliases3[d.key]} ${d.insert}`));
  const matches2 = pages.filter((p) => safeWikiTarget(p.path) && matchesQuery(`${p.name} ${p.path}`));
  const rank = (p) => p.name.toLocaleLowerCase() === q ? 0 : p.name.toLocaleLowerCase().startsWith(q) ? 1 : 2;
  matches2.sort((a, b) => {
    var _a, _b;
    return rank(a) - rank(b) || ((_a = b.modified) != null ? _a : 0) - ((_b = a.modified) != null ? _b : 0) || a.path.localeCompare(b.path);
  });
  return [...dates, ...matches2.slice(0, 12).map((p) => ({ kind: "page", path: p.path, label: p.name }))];
}
function mentionNavigation(active, count2, key) {
  if (!count2)
    return -1;
  if (key === "ArrowDown")
    return (active + 1) % count2;
  if (key === "ArrowUp")
    return active <= 0 ? count2 - 1 : active - 1;
  return active;
}
function protectedOffset(offset, ranges) {
  return ranges.some((r) => offset >= r.start && offset <= r.end);
}
function insideFence(linesThroughCursor) {
  let marker2 = "", count2 = 0;
  for (const line of linesThroughCursor) {
    const match = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
    if (!match)
      continue;
    if (!marker2) {
      marker2 = match[1][0];
      count2 = match[1].length;
    } else if (match[1][0] === marker2 && match[1].length >= count2 && match[2].trim() === "") {
      marker2 = "";
      count2 = 0;
    }
  }
  return marker2 !== "";
}

// src/platform/mention-suggest.ts
var import_obsidian4 = require("obsidian");

// src/strings.ts
var Host = __toESM(require("obsidian"));
var strings = {
  switchVault: ["Switch vault", "\u5207\u6362 Vault"],
  shellSettings: ["Settings", "\u8BBE\u7F6E"],
  shellHelp: ["Help", "\u5E2E\u52A9"],
  fileNavigation: ["File navigation", "\u6587\u4EF6\u5BFC\u822A"],
  fileNavigationHint: ["Folder + creates a note here; more actions open the native menu. The native tree and file operations stay intact.", "\u6587\u4EF6\u5939\u7684\uFF0B\u5728\u5F53\u524D\u76EE\u5F55\u65B0\u5EFA\u7B14\u8BB0\uFF0C\u66F4\u591A\u6309\u94AE\u6253\u5F00\u539F\u751F\u83DC\u5355\uFF1B\u4FDD\u7559\u539F\u751F\u6587\u4EF6\u6811\u548C\u6587\u4EF6\u64CD\u4F5C\u3002"],
  quickActions: ["Quick actions", "\u5FEB\u6377\u64CD\u4F5C"],
  noteHere: ["Create a note here", "\u5728\u6B64\u65B0\u5EFA\u7B14\u8BB0"],
  moreActions: ["More actions", "\u66F4\u591A\u64CD\u4F5C"],
  explorerChanged: ["This file or folder is no longer available. Refresh the file list.", "\u6B64\u6587\u4EF6\u6216\u6587\u4EF6\u5939\u5DF2\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u6587\u4EF6\u5217\u8868\u3002"],
  createdNotOpened: ["The note was created but could not be opened:", "\u7B14\u8BB0\u5DF2\u521B\u5EFA\uFF0C\u4F46\u672A\u80FD\u6253\u5F00\uFF1A"],
  menuStyle: ["Menus", "\u83DC\u5355"],
  menuNative: ["System", "\u7CFB\u7EDF"],
  menuThemed: ["Themed", "\u4E3B\u9898"],
  menuStyleHint: ["Uses Obsidian's native menu preference. Changed only when you choose an option.", "\u590D\u7528 Obsidian \u7684\u83DC\u5355\u504F\u597D\uFF0C\u4EC5\u5728\u4F60\u9009\u62E9\u65F6\u66F4\u6539\u3002"],
  menuUnavailable: ["Menu switching is unavailable in this host.", "\u5F53\u524D\u5BBF\u4E3B\u4E0D\u652F\u6301\u5207\u6362\u83DC\u5355\u6837\u5F0F\u3002"],
  menuFailed: ["Could not apply the menu preference. Check the native setting before trying again.", "\u65E0\u6CD5\u5E94\u7528\u83DC\u5355\u504F\u597D\uFF0C\u8BF7\u68C0\u67E5\u539F\u751F\u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002"],
  changeIcon: ["Change icon\u2026", "\u66F4\u6539\u56FE\u6807\u2026"],
  currentFileIcon: ["Change current file icon", "\u66F4\u6539\u5F53\u524D\u6587\u4EF6\u56FE\u6807"],
  iconSearch: ["Search icons", "\u641C\u7D22\u56FE\u6807"],
  iconSearchHint: ["file, calendar, star\u2026", "\u6587\u4EF6\u3001\u65E5\u5386\u3001star\u2026"],
  iconColor: ["Icon colour", "\u56FE\u6807\u989C\u8272"],
  customIconColor: ["Custom hex colour", "\u81EA\u5B9A\u4E49\u5341\u516D\u8FDB\u5236\u989C\u8272"],
  iconAutomatic: ["Reset to automatic", "\u6062\u590D\u81EA\u52A8"],
  iconNarrowSearch: ["Search to narrow the results", "\u8F93\u5165\u5173\u952E\u8BCD\u7F29\u5C0F\u8303\u56F4"],
  iconChanged: ["The file or its icon settings changed. Reopen the picker. No new settings were saved.", "\u6587\u4EF6\u6216\u56FE\u6807\u8BBE\u7F6E\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u9009\u62E9\u5668\uFF1B\u6CA1\u6709\u4FDD\u5B58\u65B0\u8BBE\u7F6E\u3002"],
  invalidIconColor: ["Use a six-digit hex colour such as #336699.", "\u8BF7\u8F93\u5165\u516D\u4F4D\u5341\u516D\u8FDB\u5236\u989C\u8272\uFF0C\u4F8B\u5982 #336699\u3002"],
  iconManaged: ["Iconic is managing icons. Your Keyline choices are retained.", "\u56FE\u6807\u5DF2\u4EA4\u7531 Iconic \u7BA1\u7406\uFF0CKeyline \u81EA\u5B9A\u4E49\u8BBE\u7F6E\u4ECD\u4FDD\u7559\u3002"],
  iconRenameConflict: ["An icon rule already exists at the new path. Existing rules were kept; review them before changing the icon.", "\u65B0\u8DEF\u5F84\u5DF2\u6709\u56FE\u6807\u8BBE\u7F6E\uFF0C\u539F\u89C4\u5219\u5747\u4FDD\u7559\uFF1B\u8BF7\u6838\u5BF9\u540E\u518D\u66F4\u6539\u56FE\u6807\u3002"],
  iconRulesHint: ["Right-click a file, folder or tab. File choices override type defaults. Disabled or monochrome modes retain custom settings; missing-file rules remain for restore.", "\u53F3\u952E\u6587\u4EF6\u3001\u6587\u4EF6\u5939\u6216\u6807\u7B7E\u9875\u53EF\u66F4\u6539\u56FE\u6807\uFF1B\u6587\u4EF6\u8BBE\u7F6E\u4F18\u5148\u4E8E\u7C7B\u578B\u9ED8\u8BA4\u3002\u5173\u95ED\u6216\u5355\u8272\u6A21\u5F0F\u5747\u4FDD\u7559\u81EA\u5B9A\u4E49\u8BBE\u7F6E\uFF1B\u5DF2\u5220\u9664\u6587\u4EF6\u7684\u89C4\u5219\u4FDD\u7559\u4F9B\u6062\u590D\u3002"],
  toneCyan: ["Cyan", "\u9752"],
  colors: ["Text and background colours", "\u6587\u5B57\u4E0E\u80CC\u666F\u989C\u8272"],
  textColor: ["Text", "\u6587\u5B57"],
  backgroundColor: ["Background", "\u80CC\u666F"],
  toneDefault: ["Default", "\u9ED8\u8BA4"],
  toneGray: ["Gray", "\u7070"],
  toneBrown: ["Brown", "\u68D5"],
  toneOrange: ["Orange", "\u6A59"],
  toneYellow: ["Yellow", "\u9EC4"],
  toneAmber: ["Amber", "\u7425\u73C0"],
  toneGreen: ["Green", "\u7EFF"],
  toneBlue: ["Blue", "\u84DD"],
  tonePurple: ["Purple", "\u7D2B"],
  tonePink: ["Pink", "\u7C89"],
  toneRed: ["Red", "\u7EA2"],
  link: ["Link", "\u94FE\u63A5"],
  linkPage: ["Link to page\u2026", "\u94FE\u63A5\u5230\u9875\u9762\u2026"],
  linkUrl: ["Web or email link\u2026", "\u7F51\u9875\u6216\u90AE\u7BB1\u94FE\u63A5\u2026"],
  unlink: ["Remove link", "\u79FB\u9664\u94FE\u63A5"],
  url: ["URL", "\u7F51\u5740"],
  apply: ["Apply", "\u5E94\u7528"],
  invalidUrl: ["Enter a complete https, http or mailto URL without credentials.", "\u8BF7\u8F93\u5165\u5B8C\u6574\u7684 https\u3001http \u6216 mailto \u5730\u5740\uFF0C\u4E0D\u542B\u8D26\u6237\u5BC6\u7801\u3002"],
  formatUnavailable: ["This selection cannot be changed safely in this way.", "\u65E0\u6CD5\u4EE5\u8FD9\u79CD\u65B9\u5F0F\u5B89\u5168\u4FEE\u6539\u6B64\u9009\u533A\u3002"],
  blockType: ["Paragraph and block type", "\u6BB5\u843D\u4E0E\u5757\u7C7B\u578B"],
  moreBlocks: ["More block actions", "\u66F4\u591A\u5757\u64CD\u4F5C"],
  sidenote: ["Insert numbered sidenote", "\u63D2\u5165\u65C1\u6CE8\uFF08\u7F16\u53F7\uFF09"],
  marginnote: ["Insert unnumbered marginnote", "\u63D2\u5165\u8FB9\u6CE8\uFF08\u65E0\u7F16\u53F7\uFF09"],
  annotationUnavailable: ["Enable the separate Keyline Marginalia plugin.", "\u8BF7\u542F\u7528\u72EC\u7ACB\u63D2\u4EF6 Keyline Marginalia\u3002"],
  annotationFailed: ["Annotation action failed. Check the note before retrying.", "\u6CE8\u91CA\u64CD\u4F5C\u672A\u80FD\u5B8C\u6210\uFF0C\u8BF7\u5148\u68C0\u67E5\u7B14\u8BB0\u5185\u5BB9\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u91CD\u8BD5\u3002"],
  indentBlock: ["Nest under previous block", "\u7F29\u8FDB\u4E3A\u4E0A\u4E00\u5757\u7684\u5B50\u9879"],
  outdentBlock: ["Move out one level", "\u51CF\u5C11\u4E00\u7EA7\u7F29\u8FDB"],
  dropInside: ["Nest under block", "\u653E\u4E3A\u5B50\u9879"],
  dropBefore: ["Place before block", "\u653E\u5728\u5757\u524D"],
  dropAfter: ["Place after block", "\u653E\u5728\u5757\u540E"],
  dropRoot: ["Place at root level", "\u653E\u5728\u9876\u5C42"],
  blockHandles: ["Block handles", "\u5757\u624B\u67C4"],
  blockHandlesHint: ["Hover beside a block to insert, open its menu or move whole blocks. Inset drops can nest items.", "\u60AC\u505C\u4E8E\u5757\u65C1\uFF0C\u53EF\u63D2\u5165\u3001\u6253\u5F00\u83DC\u5355\u6216\u79FB\u52A8\u6574\u5757\uFF1B\u5411\u5185\u62D6\u653E\u53EF\u5F62\u6210\u5B50\u9879\u3002"],
  blockKeys: ["Block keyboard behaviour", "\u5757\u5FEB\u6377\u952E"],
  blockKeysHint: ["Ctrl / Cmd+A expands from block to document. Backspace at a content start removes a safe format or indent layer; other cases stay native.", "Ctrl / Cmd+A \u4ECE\u5F53\u524D\u5757\u9010\u7EA7\u6269\u5C55\u5230\u5168\u6587\uFF1B\u5185\u5BB9\u5F00\u5934\u9000\u683C\u53EF\u5B89\u5168\u53D6\u6D88\u4E00\u5C42\u683C\u5F0F\u6216\u7F29\u8FDB\uFF0C\u5176\u4ED6\u60C5\u51B5\u4FDD\u6301\u539F\u751F\u884C\u4E3A\u3002"],
  handleSide: ["Handle side", "\u624B\u67C4\u4F4D\u7F6E"],
  dragGranularity: ["Drag range", "\u62D6\u62FD\u8303\u56F4"],
  dragGranularityHint: ["Whole blocks by default; line mode moves logical lines or selected lines. Horizontal nesting requires a complete block. Menu commands still act on whole blocks; unsafe splits are refused.", "\u9ED8\u8BA4\u62D6\u52A8\u6574\u5757\uFF1B\u884C\u6A21\u5F0F\u62D6\u52A8\u6587\u672C\u884C\u6216\u9009\u4E2D\u7684\u591A\u884C\uFF0C\u5B8C\u6574\u5757\u8FD8\u53EF\u6A2A\u5411\u62D6\u653E\u8C03\u6574\u5C42\u7EA7\u3002\u83DC\u5355\u547D\u4EE4\u4ECD\u4F5C\u7528\u4E8E\u6574\u5757\uFF0C\u4E0D\u6267\u884C\u7834\u574F\u7ED3\u6784\u7684\u62C6\u5206\u3002"],
  dragBlock: ["Whole block", "\u6574\u5757"],
  dragLine: ["Line", "\u5355\u884C"],
  dragUseBlock: ["Drag whole blocks", "\u6539\u4E3A\u62D6\u52A8\u6574\u5757"],
  dragUseLine: ["Drag lines", "\u6539\u4E3A\u6309\u884C\u62D6\u52A8"],
  lineMenu: ["Block menu; drag logical lines", "\u5757\u83DC\u5355\uFF1B\u6309\u884C\u62D6\u52A8"],
  dropLineBefore: ["Place before line", "\u653E\u5728\u884C\u524D"],
  dropLineAfter: ["Place after line", "\u653E\u5728\u884C\u540E"],
  left: ["Left", "\u5DE6"],
  right: ["Right", "\u53F3"],
  handlePinned: ["Keep the current handle visible", "\u56FA\u5B9A\u663E\u793A\u624B\u67C4"],
  handleFold: ["Show fold control", "\u663E\u793A\u6298\u53E0"],
  handlePlus: ["Show insert control", "\u663E\u793A\u63D2\u5165"],
  snapSelection: ["Whole-block selection", "\u6574\u5757\u9009\u62E9"],
  snapSelectionHint: ["Mouse selection across lines expands to complete lines; drag selected blocks together. Shift + arrow keeps precise selection.", "\u9F20\u6807\u8DE8\u884C\u9009\u62E9\u6269\u5C55\u4E3A\u6574\u884C\uFF0C\u9009\u4E2D\u7684\u5757\u53EF\u4E00\u8D77\u62D6\u52A8\uFF1BShift\uFF0B\u65B9\u5411\u952E\u4FDD\u7559\u7CBE\u786E\u9009\u62E9\u3002"],
  handleHoverDelay: ["Hover delay", "\u663E\u793A\u5EF6\u8FDF"],
  handleHideDelay: ["Hide delay", "\u9690\u85CF\u5EF6\u8FDF"],
  blockControls: ["Block controls", "\u5757\u64CD\u4F5C"],
  blockHandleAdd: ["Add block below", "\u5728\u4E0B\u65B9\u6DFB\u52A0\u533A\u5757"],
  blockHandleDrag: ["Drag to reorder", "\u62D6\u62FD\u4EE5\u91CD\u6392"],
  focusBlockHandle: ["Focus block handle", "\u805A\u7126\u5757\u624B\u67C4"],
  blockMenu: ["Block menu; drag to reorder", "\u5757\u83DC\u5355\uFF1B\u62D6\u52A8\u6392\u5E8F"],
  insertAfter: ["Insert after block\u2026", "\u5728\u5757\u540E\u63D2\u5165\u2026"],
  foldBlock: ["Fold block", "\u6298\u53E0\u5757"],
  unfoldBlock: ["Unfold block", "\u5C55\u5F00\u5757"],
  hideMarkers: ["Hide valid Markdown markers", "\u9690\u85CF\u6709\u6548\u7B26\u53F7"],
  hideMarkersHint: ["Live Preview only: paired emphasis, strike, inline code, heading and escape markers. Notes are unchanged.", "\u4EC5\u5B9E\u65F6\u9884\u89C8\uFF1A\u9690\u85CF\u5DF2\u914D\u5BF9\u7684\u5F3A\u8C03\u3001\u5220\u9664\u7EBF\u3001\u884C\u5185\u4EE3\u7801\u3001\u6807\u9898\u548C\u8F6C\u4E49\u7B26\u53F7\uFF0C\u4E0D\u6539\u7B14\u8BB0\u3002"],
  markSuspicious: ["Mark suspicious delimiters", "\u6807\u8BB0\u53EF\u7591\u7B26\u53F7"],
  markSuspiciousHint: ["Underline near unpaired double-emphasis, strike and backticks. Nothing is corrected automatically.", "\u5728\u672A\u914D\u5BF9\u7684\u53CC\u5F3A\u8C03\u3001\u5220\u9664\u7EBF\u548C\u53CD\u5F15\u53F7\u9644\u8FD1\u52A0\u6CE2\u6D6A\u7EBF\uFF0C\u4E0D\u81EA\u52A8\u4FEE\u6B63\u6587\u3002"],
  optionReveal: ["Hold Alt / Option to reveal markers", "\u6309\u4F4F Option \u663E\u793A\u7B26\u53F7"],
  pasteHints: ["Warn after suspicious paste", "\u7C98\u8D34\u5F02\u5E38\u63D0\u793A"],
  fullwidthLinks: ["Fullwidth link brackets", "\u5168\u89D2\u94FE\u63A5\u62EC\u53F7"],
  fullwidthHint: ["Typed \u3010\u3010 and \u3011\u3011 form wiki links. Paste, code and selected-text replacement keep native behaviour, which may also convert brackets.", "\u8F93\u5165\u7684\u3010\u3010\u548C\u3011\u3011\u7EC4\u6210\u94FE\u63A5\uFF1B\u7C98\u8D34\u3001\u4EE3\u7801\u548C\u9009\u533A\u66FF\u6362\u4FDD\u6301\u539F\u751F\u884C\u4E3A\uFF0C\u5BBF\u4E3B\u81EA\u8EAB\u4ECD\u53EF\u80FD\u8F6C\u6362\u62EC\u53F7\u3002"],
  toggleMarkers: ["Toggle Markdown source markers", "\u5207\u6362 Markdown \u6E90\u7801\u7B26\u53F7"],
  nextSuspicious: ["Go to next suspicious delimiter", "\u8DF3\u8F6C\u5230\u4E0B\u4E00\u4E2A\u53EF\u7591\u7B26\u53F7"],
  noSuspicious: ["No suspicious delimiters found.", "\u672A\u53D1\u73B0\u53EF\u7591\u7684\u6210\u5BF9\u7B26\u53F7\u3002"],
  parsePending: ["The editor is still parsing. Please try again shortly.", "\u7F16\u8F91\u5668\u8FD8\u5728\u89E3\u6790\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002"],
  writingTooLarge: ["This note exceeds the writing-analysis size limit. Native editing is unaffected.", "\u8FD9\u7BC7\u7B14\u8BB0\u8D85\u8FC7\u4E66\u5199\u5206\u6790\u7684\u5927\u5C0F\u9650\u5236\uFF0C\u539F\u751F\u7F16\u8F91\u4E0D\u53D7\u5F71\u54CD\u3002"],
  pasteWarning: ["Pasted text contains {n} suspicious delimiter(s). Keyline made no corrections.", "\u7C98\u8D34\u5185\u5BB9\u4E2D\u6709 {n} \u5904\u53EF\u7591\u7B26\u53F7\uFF0CKeyline \u672A\u81EA\u52A8\u4FEE\u6B63\u3002"],
  suspiciousEmphasis: ["This emphasis delimiter does not have a confirmed matching pair.", "\u8FD9\u4E2A\u5F3A\u8C03\u7B26\u53F7\u5C1A\u65E0\u5DF2\u786E\u8BA4\u7684\u914D\u5BF9\u3002"],
  suspiciousStrike: ["This strikethrough delimiter does not have a confirmed matching pair.", "\u8FD9\u4E2A\u5220\u9664\u7EBF\u7B26\u53F7\u5C1A\u65E0\u5DF2\u786E\u8BA4\u7684\u914D\u5BF9\u3002"],
  suspiciousCode: ["This backtick is not part of a confirmed code span or fence.", "\u8FD9\u4E2A\u53CD\u5F15\u53F7\u4E0D\u5C5E\u4E8E\u5DF2\u786E\u8BA4\u7684\u4EE3\u7801\u6216\u4EE3\u7801\u56F4\u680F\u3002"],
  insertMenu: ["Insert menu", "\u63D2\u5165\u83DC\u5355"],
  openInsert: ["Insert block or content\u2026", "\u63D2\u5165\u5757\u6216\u5185\u5BB9\u2026"],
  slash: ["Slash menu", "\u659C\u6760\u83DC\u5355"],
  slashHint: ["Choose an item to insert. Escape leaves the literal query unchanged.", "\u9009\u4E2D\u9879\u76EE\u624D\u63D2\u5165\uFF1B\u6309 Esc \u4FDD\u7559\u539F\u8F93\u5165\u3002"],
  trigger: ["Trigger", "\u89E6\u53D1\u7B26"],
  invalidTrigger: ["Use a single supported punctuation mark, for example / ; : ! ~ +.", "\u4F7F\u7528\u4E00\u4E2A\u652F\u6301\u7684\u6807\u70B9\uFF0C\u4F8B\u5982 / ; : ! ~ +\u3002"],
  inlineSlash: ["Inline slash menu", "\u884C\u5185\u83DC\u5355"],
  embedAttachments: ["Embed attachments", "\u5D4C\u5165\u9644\u4EF6"],
  dateFormat: ["Date format", "\u65E5\u671F\u683C\u5F0F"],
  timeFormat: ["Time format", "\u65F6\u95F4\u683C\u5F0F"],
  customCommand: ["Custom command", "\u81EA\u5B9A\u4E49\u547D\u4EE4"],
  commandMissing: ["This command is no longer available. No command was run.", "\u8BE5\u547D\u4EE4\u5DF2\u4E0D\u5B58\u5728\uFF0C\u6CA1\u6709\u6267\u884C\u547D\u4EE4\u3002"],
  commandUnavailable: ["The host command could not run in this context.", "\u6B64\u73AF\u5883\u4E0B\u5BBF\u4E3B\u547D\u4EE4\u65E0\u6CD5\u6267\u884C\u3002"],
  selectFile: ["Choose a file\u2026", "\u9009\u62E9\u6587\u4EF6\u2026"],
  selectImage: ["Choose a supported image file.", "\u8BF7\u9009\u62E9\u652F\u6301\u7684\u56FE\u7247\u6587\u4EF6\u3002"],
  attachmentFailed: ["The import did not finish. The note was not changed; existing files were not overwritten.", "\u5BFC\u5165\u672A\u5B8C\u6210\u3002\u7B14\u8BB0\u672A\u6539\u52A8\uFF0C\u6CA1\u6709\u8986\u76D6\u5DF2\u6709\u6587\u4EF6\u3002"],
  attachmentsKept: ["Import stopped before linking. Files already saved were kept:", "\u5BFC\u5165\u672A\u80FD\u5B8C\u6210\u94FE\u63A5\uFF0C\u5DF2\u4FDD\u5B58\u7684\u6587\u4EF6\u5DF2\u4FDD\u7559\uFF1A"],
  noHeadings: ["No linkable headings in this note yet.", "\u6B64\u7B14\u8BB0\u8FD8\u6CA1\u6709\u53EF\u94FE\u63A5\u7684\u6807\u9898\u3002"],
  newPage: ["New page", "\u65B0\u9875\u9762"],
  newPageHint: ["Creates and opens an untitled note beside this note. Undo removes the inserted link, not the new file.", "\u5728\u5F53\u524D\u7B14\u8BB0\u65C1\u521B\u5EFA\u5E76\u6253\u5F00\u672A\u547D\u540D\u7B14\u8BB0\u3002\u64A4\u9500\u53EA\u79FB\u9664\u63D2\u5165\u7684\u94FE\u63A5\uFF0C\u4E0D\u5220\u9664\u65B0\u6587\u4EF6\u3002"],
  create: ["Create", "\u521B\u5EFA"],
  createFailed: ["Could not create the page. Existing files were not overwritten.", "\u65E0\u6CD5\u521B\u5EFA\u9875\u9762\uFF0C\u6CA1\u6709\u8986\u76D6\u5DF2\u6709\u6587\u4EF6\u3002"],
  createdUnlinked: ["Page created, but its link could not be inserted safely. The file was kept:", "\u9875\u9762\u5DF2\u521B\u5EFA\uFF0C\u4F46\u672A\u80FD\u5B89\u5168\u63D2\u5165\u94FE\u63A5\uFF0C\u6587\u4EF6\u5DF2\u4FDD\u7559\uFF1A"],
  invalidName: ["Use a page name without paths or link delimiters.", "\u8BF7\u4F7F\u7528\u4E0D\u542B\u8DEF\u5F84\u6216\u94FE\u63A5\u5206\u9694\u7B26\u7684\u9875\u9762\u540D\u3002"],
  exists: ["A file with this name already exists. Choose another name.", "\u540C\u540D\u6587\u4EF6\u5DF2\u5B58\u5728\uFF0C\u8BF7\u6362\u4E00\u4E2A\u540D\u79F0\u3002"],
  add: ["Add", "\u6DFB\u52A0"],
  remove: ["Remove", "\u79FB\u9664"],
  up: ["Move up", "\u4E0A\u79FB"],
  down: ["Move down", "\u4E0B\u79FB"],
  visible: ["Show", "\u663E\u793A"],
  selectBlock: ["Select whole block", "\u9009\u4E2D\u6574\u5757"],
  moveBlockUp: ["Move block up", "\u4E0A\u79FB\u5757"],
  moveBlockDown: ["Move block down", "\u4E0B\u79FB\u5757"],
  duplicateBlock: ["Duplicate block", "\u590D\u5236\u5757"],
  deleteBlock: ["Delete block", "\u5220\u9664\u5757"],
  convertBlock: ["Turn block into\u2026", "\u8F6C\u6362\u4E3A\u2026"],
  blockUnavailable: ["This block changed or cannot be safely edited this way.", "\u5185\u5BB9\u5DF2\u53D8\u5316\uFF0C\u6216\u6B64\u64CD\u4F5C\u4E0D\u80FD\u5B89\u5168\u4FDD\u7559\u5757\u7ED3\u6784\u3002"],
  title: ["With Keyline", "With Keyline"],
  development: ["Development build. The existing Keyline plugin and its settings are untouched.", "\u5F00\u53D1\u7248\u3002\u4E0D\u4F1A\u4FEE\u6539\u73B0\u6709 Keyline \u63D2\u4EF6\u53CA\u5176\u8BBE\u7F6E\u3002"],
  language: ["Language", "\u8BED\u8A00"],
  languageHint: ["Auto follows Obsidian; choose explicitly on older hosts.", "\u81EA\u52A8\u8DDF\u968F Obsidian\uFF1B\u65E7\u7248\u5BBF\u4E3B\u53EF\u624B\u52A8\u9009\u62E9\u3002"],
  auto: ["Auto", "\u81EA\u52A8"],
  insert: ["Insert", "\u63D2\u5165"],
  mentions: ["Date and page suggestions", "\u65E5\u671F\u4E0E\u9875\u9762\u5EFA\u8BAE"],
  mentionsHint: ["Type @ to find dates or pages, including directly after Chinese text. Keep typing to filter; only choosing an item changes the text.", "\u8F93\u5165 @ \u67E5\u627E\u65E5\u671F\u6216\u9875\u9762\uFF0C\u4E2D\u6587\u6B63\u6587\u540E\u4E5F\u53EF\u76F4\u63A5\u89E6\u53D1\u3002\u7EE7\u7EED\u8F93\u5165\u5373\u53EF\u7B5B\u9009\uFF0C\u53EA\u6709\u9009\u62E9\u9879\u76EE\u624D\u66FF\u6362\u6587\u672C\u3002"],
  icons: ["Icons", "\u56FE\u6807"],
  interface: ["Interface", "\u754C\u9762"],
  typography: ["Typography", "\u6392\u7248"],
  editing: ["Editing", "\u7F16\u8F91"],
  advanced: ["Advanced", "\u9AD8\u7EA7"],
  search: ["Search settings", "\u641C\u7D22\u8BBE\u7F6E"],
  noResults: ["No matching settings.", "\u6CA1\u6709\u5339\u914D\u7684\u8BBE\u7F6E\u3002"],
  hints: ["Hover hints", "\u60AC\u505C\u8BF4\u660E"],
  hintsHint: ["Show standard hover descriptions. Link previews, notices and confirmation dialogs remain available.", "\u663E\u793A\u5E38\u89C4\u60AC\u505C\u8BF4\u660E\uFF1B\u4E0D\u9690\u85CF\u94FE\u63A5\u9884\u89C8\u3001\u901A\u77E5\u548C\u786E\u8BA4\u5F39\u7A97\u3002"],
  monochrome: ["Monochrome icons", "\u5355\u8272\u56FE\u6807"],
  toolbar: ["Selection toolbar", "\u9009\u533A\u5DE5\u5177\u680F"],
  toolbarHint: ["Show formatting after selecting text. Programmatic placeholders do not open it.", "\u9009\u62E9\u6587\u5B57\u540E\u663E\u793A\u683C\u5F0F\u5DE5\u5177\u680F\uFF1B\u81EA\u52A8\u9009\u4E2D\u7684\u5360\u4F4D\u6587\u5B57\u4E0D\u89E6\u53D1\u3002"],
  focusToolbar: ["Focus selection toolbar", "\u805A\u7126\u9009\u533A\u5DE5\u5177\u680F"],
  typographyEnabled: ["Custom typography", "\u81EA\u5B9A\u4E49\u6392\u7248"],
  typographyHint: ["Applies to Markdown panes only. Disabling restores the previous styles.", "\u4EC5\u5F71\u54CD Markdown \u7A97\u683C\uFF1B\u5173\u95ED\u540E\u6062\u590D\u5148\u524D\u6837\u5F0F\u3002"],
  reset: ["Reset", "\u91CD\u7F6E"],
  preview: ["Preview", "\u9884\u89C8"],
  previewText: ["A calmer page for the next idea. Adjust spacing while keeping your notes unchanged.", "\u7ED9\u4E0B\u4E00\u4E2A\u60F3\u6CD5\u7559\u4E00\u70B9\u7A7A\u95F4\u3002\u8C03\u6574\u6392\u7248\uFF0C\u4E0D\u6539\u52A8\u7B14\u8BB0\u5185\u5BB9\u3002"],
  workspace: ["Workspace", "\u5DE5\u4F5C\u533A"],
  switchWorkspace: ["Switch workspace", "\u5207\u6362\u5DE5\u4F5C\u533A"],
  workspaceHint: ["Use the core Workspaces layouts. A verified snapshot is kept before each switch.", "\u4F7F\u7528\u6838\u5FC3\u5DE5\u4F5C\u533A\u5E03\u5C40\uFF1B\u6BCF\u6B21\u5207\u6362\u524D\u9A8C\u8BC1\u4FDD\u5B58\u6062\u590D\u5FEB\u7167\u3002"],
  workspaceEnable: ["Enable Obsidian's Workspaces core plugin first.", "\u8BF7\u5148\u542F\u7528 Obsidian\u300C\u5DE5\u4F5C\u533A\u300D\u6838\u5FC3\u63D2\u4EF6\u3002"],
  saveWorkspace: ["Save current layout", "\u4FDD\u5B58\u5F53\u524D\u5E03\u5C40"],
  saveWorkspaceAs: ["Save as new layout\u2026", "\u53E6\u5B58\u4E3A\u65B0\u5E03\u5C40\u2026"],
  restoreWorkspace: ["Restore previous layout", "\u6062\u590D\u5207\u6362\u524D\u5E03\u5C40"],
  workspaceFailed: ["Workspace action could not be confirmed. Check the current layout before retrying; recovery remains available.", "\u65E0\u6CD5\u786E\u8BA4\u5DE5\u4F5C\u533A\u64CD\u4F5C\u7ED3\u679C\u3002\u8BF7\u5148\u68C0\u67E5\u5F53\u524D\u5E03\u5C40\u518D\u91CD\u8BD5\uFF1B\u6062\u590D\u5FEB\u7167\u4ECD\u4FDD\u7559\u3002"],
  noRecovery: ["No saved pre-switch layout yet.", "\u5C1A\u65E0\u5207\u6362\u524D\u7684\u5E03\u5C40\u5FEB\u7167\u3002"],
  replaceLayout: ["Replace the saved layout?", "\u66FF\u6362\u5DF2\u4FDD\u5B58\u7684\u5E03\u5C40\uFF1F"],
  save: ["Save", "\u4FDD\u5B58"],
  name: ["Name", "\u540D\u79F0"],
  cancel: ["Cancel", "\u53D6\u6D88"],
  compatibility: ["Desktop only. Disable the previous Keyline companion before enabling With Keyline. Settings are separate; importing is optional.", "\u4EC5\u652F\u6301\u684C\u9762\u7AEF\u3002\u542F\u7528 With Keyline \u524D\u8BF7\u505C\u7528\u65E7\u7248 Keyline \u4EA4\u4E92\u63D2\u4EF6\u3002\u4E24\u8005\u8BBE\u7F6E\u72EC\u7ACB\uFF0C\u5BFC\u5165\u4E3A\u53EF\u9009\u64CD\u4F5C\u3002"],
  fileIcons: ["File-type icons", "\u6587\u4EF6\u56FE\u6807"],
  iconsHint: ["Identify formats in native sidebars and tabs. Yield to Iconic. Icons do not add file readers.", "\u5728\u539F\u751F\u4FA7\u680F\u4E0E\u6807\u7B7E\u9875\u533A\u5206\u6587\u4EF6\u683C\u5F0F\uFF0CIconic \u542F\u7528\u65F6\u8BA9\u4F4D\uFF1B\u56FE\u6807\u4E0D\u63D0\u4F9B\u6587\u4EF6\u9605\u8BFB\u5668\u3002"],
  failed: ["Changes are not saved. Retry before closing the vault or disabling the plugin.", "\u4FEE\u6539\u5C1A\u672A\u4FDD\u5B58\uFF0C\u8BF7\u5728\u5173\u95ED\u5E93\u6216\u505C\u7528\u63D2\u4EF6\u524D\u91CD\u8BD5\u3002"],
  retry: ["Retry saving", "\u91CD\u8BD5\u4FDD\u5B58"],
  saved: ["Changes saved.", "\u4FEE\u6539\u5DF2\u4FDD\u5B58\u3002"],
  incompatible: ["Unknown settings version or unreadable data. Settings are read-only; the file was not overwritten.", "\u914D\u7F6E\u7248\u672C\u672A\u77E5\u6216\u8BFB\u53D6\u5931\u8D25\u3002\u8BBE\u7F6E\u5DF2\u8BBE\u4E3A\u53EA\u8BFB\uFF0C\u6CA1\u6709\u8986\u76D6\u6587\u4EF6\u3002"],
  mobile: ["With Keyline currently supports desktop Obsidian only.", "With Keyline \u76EE\u524D\u4EC5\u652F\u6301\u684C\u9762\u7AEF Obsidian\u3002"],
  dates: ["Date", "\u65E5\u671F"],
  pages: ["Page", "\u9875\u9762"],
  stale: ["The selection changed. Open the menu again.", "\u9009\u533A\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u83DC\u5355\u3002"],
  missing: ["This page no longer exists. Open the menu again.", "\u8BE5\u9875\u9762\u5DF2\u4E0D\u5B58\u5728\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u83DC\u5355\u3002"],
  unsafeLink: ["This filename needs native link handling. Use Obsidian's link command.", "\u6B64\u6587\u4EF6\u540D\u9700\u8981\u539F\u751F\u94FE\u63A5\u5904\u7406\uFF0C\u8BF7\u4F7F\u7528 Obsidian \u7684\u63D2\u5165\u94FE\u63A5\u547D\u4EE4\u3002"],
  format: ["Format selection\u2026", "\u683C\u5F0F\u2026"],
  selectedText: ["Select a single line of text first.", "\u8BF7\u5148\u9009\u62E9\u5355\u884C\u6587\u5B57\u3002"],
  bold: ["Bold", "\u7C97\u4F53"],
  italic: ["Italic", "\u659C\u4F53"],
  strike: ["Strikethrough", "\u5220\u9664\u7EBF"],
  highlight: ["Highlight", "\u9AD8\u4EAE"],
  code: ["Inline code", "\u884C\u5185\u4EE3\u7801"],
  choose: ["Choose", "\u9009\u62E9"],
  close: ["Close", "\u5173\u95ED"],
  editingEnabled: ["Editor enhancements", "\u7F16\u8F91\u589E\u5F3A"],
  editingEnabledHint: ["Pause editor enhancements without discarding their individual settings. Explicit commands remain available.", "\u6682\u505C\u7F16\u8F91\u589E\u5F3A\uFF0C\u4F46\u4FDD\u7559\u5404\u5B50\u9879\u8BBE\u7F6E\u3002\u663E\u5F0F\u547D\u4EE4\u4ECD\u53EF\u4F7F\u7528\u3002"],
  settingsTransfer: ["Import / restore settings", "\u5BFC\u5165 / \u56DE\u9000\u8BBE\u7F6E"],
  settingsTransferHint: ["Review copies from integrated Keyline 0.7.4. Back up before applying; never rewrite notes or the old plugin.", "\u9884\u89C8\u6574\u5408\u7248 Keyline 0.7.4 \u7684\u8BBE\u7F6E\u526F\u672C\u3002\u5E94\u7528\u524D\u5907\u4EFD\uFF0C\u4E0D\u4FEE\u6539\u7B14\u8BB0\u6216\u65E7\u63D2\u4EF6\u3002"]
};
function isChinese(preferences) {
  if (preferences.language !== "auto")
    return preferences.language === "zh";
  return typeof Host.getLanguage === "function" && /^zh/i.test(Host.getLanguage());
}
function message(key, zh) {
  return strings[key][zh ? 1 : 0];
}

// src/platform/dates.ts
var import_obsidian3 = require("obsidian");
function formattedDates(preferences, zh, now = new Date()) {
  const format = (date, pattern) => (0, import_obsidian3.moment)(date).locale(zh ? "zh-cn" : "en").format(pattern);
  const result = {};
  for (const [key, delta] of [["today", 0], ["tomorrow", 1], ["yesterday", -1]]) {
    const d = new Date(now.getTime());
    d.setDate(d.getDate() + delta);
    result[key] = format(d, preferences.dateFormat);
  }
  result.time = format(now, preferences.timeFormat);
  result.now = `${result.today} ${result.time}`;
  return result;
}

// src/platform/mention-suggest.ts
var DatePageSuggest = class {
  constructor(app, enabled, zh, composing, preferences) {
    this.app = app;
    this.enabled = enabled;
    this.zh = zh;
    this.composing = composing;
    this.preferences = preferences;
    this.context = null;
  }
  close() {
    this.context = null;
  }
  onTrigger(cursor, editor, file, previewComposition = false) {
    var _a;
    if (!this.enabled() || !previewComposition && this.composing() || editor.somethingSelected() || editor.listSelections().length !== 1)
      return null;
    const hit = mentionAt(editor.getLine(cursor.line), cursor.ch);
    if (!hit)
      return null;
    if (file) {
      const cache3 = this.app.metadataCache.getFileCache(file);
      const protectedRanges = ((_a = cache3 == null ? void 0 : cache3.sections) != null ? _a : []).filter((s) => ["code", "yaml"].includes(s.type)).map((s) => ({ start: s.position.start.offset, end: s.position.end.offset }));
      if (cache3 == null ? void 0 : cache3.frontmatterPosition)
        protectedRanges.push({ start: cache3.frontmatterPosition.start.offset, end: cache3.frontmatterPosition.end.offset });
      if (protectedOffset(editor.posToOffset(cursor), protectedRanges))
        return null;
    }
    const lines = Array.from({ length: cursor.line + 1 }, (_, n) => editor.getLine(n));
    if (lines[0] === "---" && !lines.slice(1).some((line) => /^(---|\.\.\.)\s*$/u.test(line)))
      return null;
    if (insideFence(lines))
      return null;
    return { start: { line: cursor.line, ch: hit.start }, end: cursor, query: hit.query };
  }
  getSuggestions(context) {
    const now = new Date(), choices = dateChoices(now, this.zh());
    if (this.preferences) {
      const values = formattedDates(this.preferences(), this.zh(), now);
      for (const choice of choices)
        choice.insert = values[choice.key === "now" ? "time" : choice.key];
    }
    return suggestions(context.query, this.app.vault.getMarkdownFiles().map((f) => {
      var _a;
      return { path: f.path, name: f.basename, modified: (_a = f.stat) == null ? void 0 : _a.mtime };
    }), now, this.zh(), choices);
  }
  onSession(cursor, editor, start, previewComposition = false) {
    if (!this.enabled() || !previewComposition && this.composing() || editor.somethingSelected() || editor.listSelections().length !== 1 || cursor.line !== start.line)
      return null;
    const hit = mentionSessionAt(editor.getLine(cursor.line), cursor.ch, start.ch);
    return hit ? { start, end: cursor, query: hit.query } : null;
  }
  selectSuggestion(choice) {
    var _a, _b;
    const context = this.context;
    if (!context || !this.enabled() || this.composing())
      return;
    const { editor, start, end } = context;
    const cursor = editor.getCursor();
    const origin = this.onTrigger({ line: start.line, ch: start.ch + 1 }, editor, context.file);
    if (!origin || !this.onSession(cursor, editor, start) || cursor.line !== end.line || cursor.ch !== end.ch || editor.getRange(start, end) !== "@" + context.query) {
      new import_obsidian4.Notice(message("stale", this.zh()));
      this.close();
      return;
    }
    let replacement = choice.kind === "date" ? choice.insert : "";
    if (choice.kind === "page") {
      const file = this.app.vault.getAbstractFileByPath(choice.path);
      if (!(file instanceof import_obsidian4.TFile)) {
        new import_obsidian4.Notice(message("missing", this.zh()));
        this.close();
        return;
      }
      const link = this.app.metadataCache.fileToLinktext(file, (_b = (_a = context.file) == null ? void 0 : _a.path) != null ? _b : "", true);
      if (!safeWikiTarget(link)) {
        new import_obsidian4.Notice(message("unsafeLink", this.zh()));
        this.close();
        return;
      }
      replacement = `[[${link}]]`;
    }
    editor.replaceRange(replacement, start, end, "keyline-next-mention");
    editor.setCursor({ line: start.line, ch: start.ch + replacement.length });
    this.close();
  }
};

// src/platform/mention-menu.ts
var MentionController = class {
  constructor(app, preferences, zh) {
    this.app = app;
    this.preferences = preferences;
    this.zh = zh;
    this.views = /* @__PURE__ */ new Map();
  }
  extension() {
    const owner = this;
    return [import_view.ViewPlugin.define((view) => {
      const menu = new MentionMenu(view, owner);
      owner.views.set(view, menu);
      return menu;
    }), import_state.Prec.highest(import_view.keymap.of(["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].map((key) => ({
      key,
      run: (view) => {
        var _a, _b;
        return (_b = (_a = owner.views.get(view)) == null ? void 0 : _a.key(key)) != null ? _b : false;
      }
    }))))];
  }
  claim(menu) {
    for (const other of this.views.values())
      if (other !== menu)
        other.close();
  }
  refresh() {
    for (const menu of this.views.values())
      menu.close();
  }
  remove(view) {
    this.views.delete(view);
  }
  dispose() {
    for (const menu of [...this.views.values()])
      menu.destroy();
  }
};
var serial = 0;
var MentionMenu = class {
  constructor(view, owner) {
    this.view = view;
    this.owner = owner;
    this.choices = [];
    this.active = -1;
    this.anchor = -1;
    this.disposed = false;
    this.generation = 0;
    this.priorAria = /* @__PURE__ */ new Map();
    this.ownedAria = /* @__PURE__ */ new Map();
    this.composing = false;
    this.compose = () => {
      var _a;
      this.composing = true;
      this.deactivate();
      if (this.pending !== void 0)
        (_a = this.boundDocument.defaultView) == null ? void 0 : _a.clearTimeout(this.pending);
      this.pending = void 0;
    };
    this.composed = () => {
      this.composing = false;
      if (this.anchor >= 0)
        this.schedule();
    };
    this.source = new DatePageSuggest(owner.app, () => owner.preferences().mentions, owner.zh, () => view.composing, owner.preferences);
    const doc = view.dom.ownerDocument;
    this.boundDocument = doc;
    this.outside = (e) => {
      var _a;
      if (!((_a = this.root) == null ? void 0 : _a.contains(e.target)))
        this.close();
    };
    this.viewport = (e) => {
      var _a;
      if (e.type === "resize" || !((_a = this.root) == null ? void 0 : _a.contains(e.target)))
        this.close();
    };
    this.bindDocument(doc);
    view.contentDOM.addEventListener("compositionstart", this.compose);
    view.contentDOM.addEventListener("compositionend", this.composed);
  }
  bindDocument(doc) {
    var _a;
    doc.addEventListener("pointerdown", this.outside, true);
    doc.addEventListener("focusin", this.outside, true);
    doc.addEventListener("scroll", this.viewport, true);
    (_a = doc.defaultView) == null ? void 0 : _a.addEventListener("resize", this.viewport);
  }
  unbindDocument(doc) {
    var _a;
    doc.removeEventListener("pointerdown", this.outside, true);
    doc.removeEventListener("focusin", this.outside, true);
    doc.removeEventListener("scroll", this.viewport, true);
    (_a = doc.defaultView) == null ? void 0 : _a.removeEventListener("resize", this.viewport);
  }
  syncDocument() {
    const doc = this.view.dom.ownerDocument;
    if (doc === this.boundDocument)
      return;
    this.close();
    this.unbindDocument(this.boundDocument);
    this.boundDocument = doc;
    this.bindDocument(doc);
  }
  update(update) {
    var _a;
    if (this.disposed)
      return;
    this.syncDocument();
    if (update.focusChanged && !this.view.hasFocus) {
      this.close();
      return;
    }
    if (!update.docChanged && !update.selectionSet)
      return;
    const typed = update.transactions.some((t2) => t2.isUserEvent("input.type"));
    const deletion = update.transactions.some((t2) => t2.isUserEvent("delete"));
    if (this.anchor >= 0) {
      if (this.context && ((_a = update.state.field(import_obsidian5.editorInfoField, false)) == null ? void 0 : _a.file) !== this.context.file) {
        this.close();
        return;
      }
      if (update.docChanged && (typed || deletion)) {
        let intact = true;
        update.changes.iterChanges((from) => {
          if (from <= this.anchor)
            intact = false;
        });
        if (!intact) {
          this.close();
          return;
        }
        this.deactivate();
        this.schedule();
      } else if (update.docChanged || !this.composing && !this.view.composing)
        this.close();
      return;
    }
    if (!typed || this.composing || this.view.composing || update.transactions.some((t2) => t2.isUserEvent("input.type.compose")))
      return;
    let trigger = false;
    update.changes.iterChanges((_a2, _b, _c, end, inserted) => {
      if (inserted.toString() === "@" && end === update.state.selection.main.head)
        trigger = true;
    });
    if (!trigger || !this.current())
      return;
    this.anchor = this.view.state.selection.main.head - 1;
    this.owner.claim(this);
    this.schedule();
  }
  current(previewComposition = false) {
    const state = this.view.state, info = state.field(import_obsidian5.editorInfoField, false);
    if (this.disposed || !this.view.hasFocus || !previewComposition && this.view.composing || state.readOnly || !(info == null ? void 0 : info.file) || !info.editor || state.doc.length > 2 * 1024 * 1024 || state.selection.ranges.length !== 1 || !state.selection.main.empty || this.view.dom.ownerDocument.activeElement !== this.view.contentDOM)
      return;
    const hit = this.anchor >= 0 ? this.source.onSession(info.editor.getCursor(), info.editor, info.editor.offsetToPos(this.anchor), previewComposition) : this.source.onTrigger(info.editor.getCursor(), info.editor, info.file, previewComposition);
    if (!hit || this.anchor >= 0 && info.editor.posToOffset(hit.start) !== this.anchor)
      return;
    return { ...hit, editor: info.editor, file: info.file };
  }
  schedule(attempt = 0) {
    const win = this.view.dom.ownerDocument.defaultView;
    if (!win)
      return;
    if (this.pending !== void 0)
      win.clearTimeout(this.pending);
    const generation = this.generation;
    this.pending = win.setTimeout(() => {
      this.pending = void 0;
      if (generation !== this.generation || this.disposed)
        return;
      if (this.composing) {
        const preview = this.context && this.current(true);
        if (preview) {
          this.context = preview;
          this.choices = this.source.getSuggestions(preview);
          this.active = -1;
          this.render();
          this.position();
        }
        return;
      }
      if (this.view.composing) {
        if (attempt < 10)
          this.schedule(attempt + 1);
        return;
      }
      const context = this.current();
      if (!context) {
        this.close();
        return;
      }
      this.context = context;
      this.choices = this.source.getSuggestions(context);
      this.active = -1;
      this.render();
      this.position();
    }, attempt ? 20 : 0);
  }
  render() {
    const doc = this.view.dom.ownerDocument, zh = this.owner.zh();
    if (!this.root) {
      this.root = doc.createElement("div");
      this.root.className = "keyline-next-input-menu keyline-next-mention-menu";
      this.root.addEventListener("mousedown", (e) => e.preventDefault());
      doc.body.append(this.root);
    }
    this.root.replaceChildren();
    const list = this.root.createDiv({ cls: "keyline-next-mention-list" });
    list.id = `keyline-next-mention-${++serial}`;
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", zh ? "\u63D2\u5165\u65E5\u671F\u6216\u94FE\u63A5\u5230\u9875\u9762" : "Insert a date or link to a page");
    for (const kind2 of ["date", "page"]) {
      const rows2 = this.choices.map((choice, index) => ({ choice, index })).filter((row) => row.choice.kind === kind2);
      if (!rows2.length)
        continue;
      const label2 = kind2 === "date" ? zh ? "\u65E5\u671F" : "Date" : zh ? "\u94FE\u63A5\u5230\u9875\u9762" : "Link to a page";
      const group = list.createDiv();
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", label2);
      group.createDiv({ cls: "keyline-next-mention-heading", text: label2 }).setAttribute("aria-hidden", "true");
      for (const { choice, index } of rows2) {
        const row = group.createDiv({ cls: `keyline-next-suggestion keyline-next-mention-row is-${kind2}` });
        row.id = `${list.id}-${index}`;
        row.setAttribute("role", "option");
        row.setAttribute("aria-selected", "false");
        const icon = row.createSpan({ cls: "keyline-next-mention-icon" });
        icon.setAttribute("aria-hidden", "true");
        (0, import_obsidian5.setIcon)(icon, kind2 === "page" ? "file-text" : choice.kind === "date" && choice.key === "now" ? "clock" : "calendar");
        row.createDiv({ cls: "keyline-next-mention-label", text: choice.label });
        const detail = choice.kind === "date" ? choice.insert : choice.path.split("/").slice(0, -1).join("/") || (zh ? "\u6839\u76EE\u5F55" : "Vault root");
        row.createDiv({ cls: "keyline-next-mention-detail", text: detail });
        row.addEventListener("pointermove", () => this.select(index));
        row.addEventListener("click", () => this.commit(index));
      }
    }
    if (!this.choices.length)
      list.createDiv({ cls: "keyline-next-mention-empty", text: zh ? "\u6CA1\u6709\u5339\u914D\u9879\uFF0C\u7EE7\u7EED\u8F93\u5165\u4F1A\u4FDD\u7559\u539F\u6587" : "No results. Keep typing to retain your text." }).setAttribute("role", "status");
    this.root.createDiv({ cls: "keyline-next-mention-hint", text: zh ? "\u2191\u2193 \u9009\u62E9 \xB7 Enter \u63D2\u5165 \xB7 Esc \u4FDD\u7559\u539F\u6587" : "\u2191\u2193 Select \xB7 Enter Insert \xB7 Esc Keep text" });
    this.aria("aria-controls", list.id);
    this.aria("aria-expanded", "true");
    this.aria("aria-autocomplete", "list");
    this.restoreAria("aria-activedescendant");
  }
  position() {
    if (!this.root)
      return;
    const rect = this.view.coordsAtPos(this.view.state.selection.main.head), win = this.view.dom.ownerDocument.defaultView;
    if (!rect) {
      this.close();
      return;
    }
    this.root.style.maxHeight = `${Math.max(32, Math.min(400, win.innerHeight - 16))}px`;
    this.root.style.left = `${Math.max(8, Math.min(rect.left, win.innerWidth - this.root.offsetWidth - 8))}px`;
    this.root.style.top = `${Math.max(8, Math.min(rect.bottom + 6, win.innerHeight - this.root.offsetHeight - 8))}px`;
  }
  key(key) {
    this.syncDocument();
    if (this.anchor < 0)
      return false;
    if (this.composing || this.view.composing)
      return false;
    if (!this.context || !this.current()) {
      this.close();
      return false;
    }
    if (key === "Escape") {
      this.close();
      return true;
    }
    if (key === "ArrowDown" || key === "ArrowUp") {
      this.select(mentionNavigation(this.active, this.choices.length, key));
      return true;
    }
    if (key === "Enter" || key === "Tab") {
      if (this.active >= 0) {
        this.commit(this.active);
        return true;
      }
      this.close();
      return false;
    }
    return false;
  }
  select(index) {
    if (this.composing || this.view.composing)
      return;
    if (!this.root || index < 0 || !this.choices[index])
      return;
    this.active = index;
    this.root.querySelectorAll("[role=option]").forEach((row, i) => {
      row.classList.toggle("is-active", i === index);
      row.setAttribute("aria-selected", String(i === index));
      if (i === index) {
        this.aria("aria-activedescendant", row.id);
        row.scrollIntoView({ block: "nearest" });
      }
    });
  }
  commit(index) {
    if (this.composing || this.view.composing)
      return;
    const choice = this.choices[index], context = this.current();
    const valid = context && this.context && context.editor === this.context.editor && context.file === this.context.file && context.query === this.context.query;
    this.close();
    if (!valid || !choice || !context)
      return;
    this.source.context = context;
    this.source.selectSuggestion(choice);
  }
  deactivate() {
    var _a;
    this.active = -1;
    (_a = this.root) == null ? void 0 : _a.querySelectorAll("[role=option]").forEach((row) => {
      row.classList.remove("is-active");
      row.setAttribute("aria-selected", "false");
    });
    this.restoreAria("aria-activedescendant");
  }
  aria(name2, value) {
    if (!this.priorAria.has(name2))
      this.priorAria.set(name2, this.view.contentDOM.getAttribute(name2));
    this.view.contentDOM.setAttribute(name2, value);
    this.ownedAria.set(name2, value);
  }
  restoreAria(name2) {
    if (this.ownedAria.has(name2) && this.view.contentDOM.getAttribute(name2) === this.ownedAria.get(name2)) {
      const prior = this.priorAria.get(name2);
      if (prior == null)
        this.view.contentDOM.removeAttribute(name2);
      else
        this.view.contentDOM.setAttribute(name2, prior);
    }
    this.priorAria.delete(name2);
    this.ownedAria.delete(name2);
  }
  close() {
    var _a, _b;
    this.generation++;
    if (this.pending !== void 0)
      (_a = this.boundDocument.defaultView) == null ? void 0 : _a.clearTimeout(this.pending);
    this.pending = void 0;
    this.anchor = -1;
    this.active = -1;
    this.context = void 0;
    this.choices = [];
    (_b = this.root) == null ? void 0 : _b.remove();
    this.root = void 0;
    this.source.close();
    for (const key of [...this.ownedAria.keys()])
      this.restoreAria(key);
  }
  destroy() {
    if (this.disposed)
      return;
    this.disposed = true;
    this.close();
    this.unbindDocument(this.boundDocument);
    this.view.contentDOM.removeEventListener("compositionstart", this.compose);
    this.owner.remove(this.view);
    this.view.contentDOM.removeEventListener("compositionend", this.composed);
  }
};

// src/platform/format-command.ts
var import_obsidian6 = require("obsidian");
var inlineStyles = ["bold", "italic", "strike", "highlight", "code"];
function formatSelection(editor, style) {
  if (editor.listSelections().length !== 1)
    return false;
  const start = editor.getCursor("from"), end = editor.getCursor("to");
  const edit2 = inlineEdit(editor.getRange(start, end), style);
  if (!edit2 || start.line !== end.line)
    return false;
  editor.replaceRange(edit2.text, start, end, "keyline-next-format");
  editor.setSelection({ line: start.line, ch: start.ch + edit2.selectionStart }, { line: start.line, ch: start.ch + edit2.selectionEnd });
  return true;
}
var FormatPicker = class extends import_obsidian6.SuggestModal {
  constructor(app, editor, zh) {
    super(app);
    this.editor = editor;
    this.zh = zh;
    this.start = editor.getCursor("from");
    this.end = editor.getCursor("to");
    this.selected = editor.getRange(this.start, this.end);
    this.setPlaceholder(message("format", zh));
  }
  getSuggestions(query) {
    return inlineStyles.filter((s) => message(s, this.zh).toLowerCase().includes(query.toLowerCase()) || s.includes(query.toLowerCase()));
  }
  renderSuggestion(style, el) {
    el.setText(message(style, this.zh));
  }
  onChooseSuggestion(style) {
    const start = this.editor.getCursor("from"), end = this.editor.getCursor("to");
    if (start.line !== this.start.line || start.ch !== this.start.ch || end.line !== this.end.line || end.ch !== this.end.ch || this.editor.getRange(start, end) !== this.selected) {
      new import_obsidian6.Notice(message("stale", this.zh));
      return;
    }
    if (!formatSelection(this.editor, style))
      new import_obsidian6.Notice(message("selectedText", this.zh));
  }
};

// src/platform/persistence.ts
var VerifiedStore = class {
  constructor(write, read, notify) {
    this.write = write;
    this.read = read;
    this.notify = notify;
    this.tail = Promise.resolve();
    this.revision = 0;
    this.saved = 0;
    this.live = true;
    this.listeners = /* @__PURE__ */ new Set();
  }
  get dirty() {
    return this.saved < this.revision;
  }
  subscribe(listener) {
    if (this.live)
      this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  save(value) {
    if (!this.live)
      return Promise.resolve();
    this.latest = JSON.parse(JSON.stringify(value));
    const snapshot = this.latest;
    const revision = ++this.revision;
    this.tail = this.tail.catch(() => {
    }).then(async () => {
      if (!this.live)
        return;
      try {
        await this.write(snapshot);
        const actual = await this.read();
        if (!equalJson(snapshot, actual))
          throw new Error("Read-back mismatch");
        if (!this.live)
          return;
        this.saved = revision;
        if (revision === this.revision)
          this.notify("saved");
      } catch (e) {
        if (this.live)
          this.notify("failed");
      } finally {
        if (this.live)
          for (const listener of this.listeners)
            listener();
      }
    });
    return this.tail;
  }
  retry() {
    return this.dirty && this.latest !== void 0 ? this.save(this.latest) : this.tail;
  }
  close() {
    this.live = false;
    this.listeners.clear();
  }
};
function equalJson(a, b) {
  if (a === b)
    return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object")
    return false;
  if (Array.isArray(a))
    return Array.isArray(b) && a.length === b.length && a.every((v, i) => equalJson(v, b[i]));
  if (Array.isArray(b))
    return false;
  const left = a, right = b;
  const keys2 = Object.keys(left);
  return keys2.length === Object.keys(right).length && keys2.every((k) => Object.prototype.hasOwnProperty.call(right, k) && equalJson(left[k], right[k]));
}

// src/settings.ts
var import_obsidian11 = require("obsidian");

// src/platform/insert-settings.ts
var import_obsidian9 = require("obsidian");

// src/platform/insertion.ts
var import_obsidian8 = require("obsidian");

// src/domain/explorer.ts
function availableNotePath(parent, chinese, occupied) {
  if (parent !== "/" && parent !== "" && !validIconPath(parent))
    return null;
  const prefix = parent === "/" || parent === "" ? "" : parent + "/";
  const name2 = chinese ? "\u672A\u547D\u540D" : "Untitled";
  for (let index = 0; index < 1e4; index++) {
    const path = `${prefix}${name2}${index ? ` ${index}` : ""}.md`;
    if (!occupied(path))
      return path;
  }
  return null;
}

// src/platform/attachment-imports.ts
var import_obsidian7 = require("obsidian");

// src/domain/attachments.ts
var imageExtensions = ["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"];
var imageAccept = imageExtensions.map((e) => "." + e).join(",") + ",image/avif,image/bmp,image/gif,image/jpeg,image/png,image/svg+xml,image/webp";
function isImageName(name2) {
  const dot = name2.lastIndexOf(".");
  return dot >= 0 && imageExtensions.includes(name2.slice(dot + 1).toLowerCase());
}
function attachmentName(name2) {
  let result = "";
  for (const ch of name2.trim())
    result += ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127 || '\\/:*?"<>|'.includes(ch) ? "-" : ch;
  return result.replace(/^\.+/u, "").replace(/[. ]+$/u, "") || "attachment";
}
var label = (text2) => text2.replace(/[\\[\]]/gu, "\\$&");
function attachmentLink(generated, basename, image, embed) {
  const source = generated.trim().replace(/^!/u, "");
  if (image)
    return source.startsWith("[[") && source.endsWith("]]") || source.startsWith("[") && source.endsWith(")") ? "!" + source : null;
  let result;
  if (source.startsWith("[[") && source.endsWith("]]")) {
    const body = source.slice(2, -2), split = body.indexOf("|"), target = split < 0 ? body : body.slice(0, split);
    if (!target || /[\[\]\r\n]/u.test(target))
      return null;
    const title = split < 0 ? basename : body.slice(split + 1).trim() || basename;
    const destination = target.split("/").map((part) => encodeURIComponent(part).replace(/[!'()*]/gu, (ch) => "%" + ch.charCodeAt(0).toString(16).toUpperCase())).join("/");
    result = `[${label(title)}](${destination})`;
  } else if (source.startsWith("[") && source.endsWith(")") && source.includes("](")) {
    result = source.startsWith("[](") ? `[${label(basename)}]${source.slice(2)}` : source;
  } else
    return null;
  return (embed ? "!" : "") + result;
}
function planAttachmentInsertion(text2, from, to, links2) {
  var _a, _b;
  if (!links2 || inProtectedSyntax(text2, from, to) || /[\r\n]/u.test(text2.slice(from, to)))
    return null;
  const start = from === 0 ? 0 : text2.lastIndexOf("\n", from - 1) + 1;
  const newline = text2.indexOf("\n", to);
  const end = newline < 0 ? text2.length : newline > 0 && text2[newline - 1] === "\r" ? newline - 1 : newline;
  if (to > end)
    return null;
  const suffix = text2.slice(to, end), line = text2.slice(start, from) + suffix;
  const eol = (_b = (_a = text2.match(/\r?\n/u)) == null ? void 0 : _a[0]) != null ? _b : "\n";
  const insert = suffix + (line.trim() ? eol : "") + links2.replace(/\r?\n/gu, eol);
  const caret = from + insert.length;
  return { from, to: end, before: text2.slice(from, end), insert, anchor: caret, head: caret };
}

// src/platform/attachment-imports.ts
var AttachmentImports = class {
  constructor(owner) {
    this.owner = owner;
    this.inputs = /* @__PURE__ */ new Map();
  }
  open(context, kind2) {
    var _a;
    if (!context.valid())
      return;
    const leaf = this.owner.app.workspace.getLeavesOfType("markdown").find((l) => l.view.editor === context.editor);
    const doc = leaf == null ? void 0 : leaf.view.containerEl.ownerDocument;
    if (!leaf || !doc || this.owner.app.workspace.activeLeaf !== leaf)
      return;
    (_a = this.inputs.get(context.editor)) == null ? void 0 : _a.cancel();
    const input = doc.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.hidden = true;
    input.className = "keyline-next-attachment-input";
    if (kind2 === "image")
      input.accept = imageAccept;
    let cancelled = false, started = false;
    const cancel = () => {
      var _a2;
      cancelled = true;
      input.remove();
      if (((_a2 = this.inputs.get(context.editor)) == null ? void 0 : _a2.input) === input)
        this.inputs.delete(context.editor);
    };
    const sourcePath = context.file.path;
    const valid = () => !cancelled && this.owner.live && context.valid() && context.file.path === sourcePath && this.owner.app.workspace.activeLeaf === leaf;
    input.addEventListener("cancel", cancel, { once: true });
    input.addEventListener("change", () => {
      var _a2;
      if (started || !valid()) {
        cancel();
        return;
      }
      started = true;
      void this.import(context, Array.from((_a2 = input.files) != null ? _a2 : []), kind2, valid).finally(cancel);
    }, { once: true });
    this.inputs.set(context.editor, { input, cancel });
    doc.body.append(input);
    try {
      input.click();
    } catch (e) {
      cancel();
      if (this.owner.live)
        new import_obsidian7.Notice(message("attachmentFailed", this.owner.zh()));
    }
  }
  async import(context, chosen, kind2, valid = context.valid) {
    const files = kind2 === "image" ? chosen.filter((f) => isImageName(f.name)) : chosen;
    if (!files.length) {
      if (chosen.length && this.owner.live)
        new import_obsidian7.Notice(message("selectImage", this.owner.zh()));
      return;
    }
    const saved = [], links2 = [], sourcePath = context.file.path;
    const embed = this.owner.preferences().embedAttachments;
    const current = () => this.owner.live && valid() && context.valid() && context.file.path === sourcePath;
    try {
      for (const file of files) {
        if (!current())
          throw Error("Stale import");
        const bytes = await file.arrayBuffer();
        if (!current())
          throw Error("Stale import");
        const path = await this.owner.app.fileManager.getAvailablePathForAttachment(attachmentName(file.name), sourcePath);
        if (!current())
          throw Error("Stale import");
        const created = await this.owner.app.vault.createBinary(path, bytes);
        saved.push(created);
        if (!current() || this.owner.app.vault.getAbstractFileByPath(created.path) !== created)
          throw Error("Stale import");
        const link = attachmentLink(this.owner.app.fileManager.generateMarkdownLink(created, sourcePath), created.basename, kind2 === "image", embed);
        if (!link)
          throw Error("Invalid host link");
        links2.push(link);
      }
      const text2 = links2.join("\n");
      if (!current() || !this.owner.commitAttachment(context, text2))
        throw Error("Stale insertion");
    } catch (e) {
      if (this.owner.live)
        new import_obsidian7.Notice(message(saved.length ? "attachmentsKept" : "attachmentFailed", this.owner.zh()) + (saved.length ? "\n" + saved.map((f) => f.path).join("\n") : ""));
    }
  }
  dispose() {
    for (const { cancel } of [...this.inputs.values()])
      cancel();
    this.inputs.clear();
  }
};

// src/platform/insertion.ts
function hostCommands(app) {
  const api = app.commands;
  return typeof (api == null ? void 0 : api.listCommands) === "function" && typeof api.executeCommandById === "function" ? api : null;
}
var InsertionController = class {
  constructor(app, preferences, zh, composing) {
    this.app = app;
    this.preferences = preferences;
    this.zh = zh;
    this.composing = composing;
    this.live = true;
    this.dialogs = /* @__PURE__ */ new Set();
    this.creating = /* @__PURE__ */ new WeakSet();
    this.suggest = new SlashSuggest(app, this);
    this.attachments = new AttachmentImports(this);
  }
  capture(editor, file, range, after) {
    var _a, _b;
    if (!this.live || this.composing(editor) || editor.listSelections().length !== 1)
      return null;
    const text2 = editor.getValue(), start = editor.posToOffset(editor.getCursor("from")), end = editor.posToOffset(editor.getCursor("to")), head = editor.posToOffset(editor.getCursor());
    const from = (_a = range == null ? void 0 : range.from) != null ? _a : start, to = (_b = range == null ? void 0 : range.to) != null ? _b : end;
    if (after) {
      if (text2.length > 2 * 1024 * 1024 || !parseBlocks(text2).blocks.some((b) => b.id === after && !b.locked && b.to === from && from === to))
        return null;
    } else if (inProtectedSyntax(text2, from, to))
      return null;
    const valid = () => this.live && !this.composing(editor) && this.app.vault.getAbstractFileByPath(file.path) === file && this.app.workspace.getLeavesOfType("markdown").some((leaf) => {
      const view = leaf.view;
      return view.editor === editor && view.file === file;
    }) && editor.getValue() === text2 && editor.listSelections().length === 1 && editor.posToOffset(editor.getCursor("from")) === start && editor.posToOffset(editor.getCursor("to")) === end && editor.posToOffset(editor.getCursor()) === head;
    return { editor, file, text: text2, from, to, selected: range ? "" : text2.slice(from, to), after, valid };
  }
  open(context, point) {
    var _a;
    if (context.valid())
      (_a = this.presenter) == null ? void 0 : _a.open(context, point);
  }
  pickFile(context, kind2) {
    if (context.valid())
      this.show(new FileInsertPicker(this.app, this, context, kind2));
  }
  show(dialog) {
    if (!this.live)
      return;
    this.dialogs.add(dialog);
    dialog.open();
  }
  release(dialog) {
    this.dialogs.delete(dialog);
  }
  dispose() {
    var _a;
    this.live = false;
    this.attachments.dispose();
    (_a = this.presenter) == null ? void 0 : _a.close();
    this.suggest.close();
    for (const dialog of this.dialogs)
      dialog.close();
    this.dialogs.clear();
  }
  commit(context, value) {
    if (!context.valid()) {
      if (this.live)
        new import_obsidian8.Notice(message("stale", this.zh()));
      return false;
    }
    const plan = context.after ? planAfterBlock(context.text, context.after, value) : planInsertion(context.text, context.from, context.to, value);
    if (!plan) {
      new import_obsidian8.Notice(message("blockUnavailable", this.zh()));
      return false;
    }
    commitInsertion(context.editor, context.text, plan);
    return true;
  }
  commitAttachment(context, text2) {
    if (!context.valid()) {
      if (this.live)
        new import_obsidian8.Notice(message("stale", this.zh()));
      return false;
    }
    const caret = context.editor.posToOffset(context.editor.getCursor());
    const plan = context.after ? planAfterBlock(context.text, context.after, { text: text2, from: text2.length, to: text2.length, block: true }) : planAttachmentInsertion(context.text, context.selected ? caret : context.from, context.selected ? caret : context.to, text2);
    if (!plan) {
      new import_obsidian8.Notice(message("blockUnavailable", this.zh()));
      return false;
    }
    commitInsertion(context.editor, context.text, plan);
    return true;
  }
  async choose(context, entry) {
    if (!context.valid()) {
      if (this.live)
        new import_obsidian8.Notice(message("stale", this.zh()));
      return;
    }
    if (entry.mode === "command") {
      const api = hostCommands(this.app);
      if (!entry.command || !(api == null ? void 0 : api.listCommands().some((c) => c.id === entry.command))) {
        new import_obsidian8.Notice(message("commandMissing", this.zh()));
        return;
      }
      if (context.after) {
        const originalSelection = { from: context.editor.getCursor("from"), to: context.editor.getCursor("to") };
        const plan = planAfterBlock(context.text, context.after, { text: "", from: 0, to: 0, block: true });
        if (!plan || !this.commit(context, { text: "", from: 0, to: 0, block: true }))
          return;
        let succeeded2 = false;
        try {
          succeeded2 = api.executeCommandById(entry.command);
        } catch (e) {
        }
        if (!succeeded2) {
          const expected = context.text.slice(0, plan.from) + plan.insert + context.text.slice(plan.to);
          const current = this.capture(context.editor, context.file);
          if ((current == null ? void 0 : current.valid()) && current.text === expected && current.from === plan.anchor && current.to === plan.anchor) {
            context.editor.replaceRange("", context.editor.offsetToPos(plan.from), context.editor.offsetToPos(plan.from + plan.insert.length), "keyline-next-insert");
            context.editor.setSelection(originalSelection.from, originalSelection.to);
          }
          new import_obsidian8.Notice(message("commandUnavailable", this.zh()));
        }
        return;
      }
      const trigger = context.selected ? "" : context.text.slice(context.from, context.to);
      if (trigger && !this.commit(context, { text: "", from: 0, to: 0, block: false }))
        return;
      let succeeded = false;
      try {
        succeeded = api.executeCommandById(entry.command);
      } catch (e) {
      }
      if (!succeeded) {
        const expected = context.text.slice(0, context.from) + context.text.slice(context.to);
        const current = this.capture(context.editor, context.file);
        if (trigger && (current == null ? void 0 : current.valid()) && current.text === expected && current.from === context.from && current.to === context.from)
          this.commit(current, { text: trigger, from: trigger.length, to: trigger.length, block: false });
        new import_obsidian8.Notice(message("commandUnavailable", this.zh()));
      }
      return;
    }
    if (entry.id === "image" || entry.id === "attachment") {
      this.attachments.open(context, entry.id);
      return;
    }
    if (entry.id === "newpage") {
      await this.createPage(context);
      return;
    }
    const value = makeSnippet(entry.id, context.text, context.selected, this.zh(), formattedDates(this.preferences(), this.zh()));
    if (!value) {
      new import_obsidian8.Notice(message(entry.id === "toc" ? "noHeadings" : "blockUnavailable", this.zh()));
      return;
    }
    this.commit(context, value);
  }
  async createPage(context) {
    if (this.creating.has(context.editor))
      return;
    const sourcePath = context.file.path, folder = context.file.parent, folderPath = folder == null ? void 0 : folder.path;
    const leaf = this.app.workspace.getLeavesOfType("markdown").find((l) => {
      const view = l.view;
      return view.editor === context.editor && view.file === context.file;
    });
    const valid = () => context.valid() && context.file.path === sourcePath && !!folder && folder.path === folderPath && context.file.parent === folder && this.app.vault.getAbstractFileByPath(folder.path) === folder && this.app.workspace.activeLeaf === leaf;
    if (!leaf || !valid())
      return;
    const target = availableNotePath(folder.path, this.zh(), (p) => this.app.vault.getAbstractFileByPath(p) !== null);
    if (!target) {
      new import_obsidian8.Notice(message("createFailed", this.zh()));
      return;
    }
    this.creating.add(context.editor);
    let created;
    try {
      created = await this.app.vault.create(target, "");
      if (!valid() || this.app.vault.getAbstractFileByPath(created.path) !== created) {
        if (this.live)
          new import_obsidian8.Notice(`${message("createdUnlinked", this.zh())} ${created.path}`);
        return;
      }
      const text2 = this.app.fileManager.generateMarkdownLink(created, sourcePath);
      if (!this.commit(context, { text: text2, from: text2.length, to: text2.length, block: false })) {
        if (this.live)
          new import_obsidian8.Notice(`${message("createdUnlinked", this.zh())} ${created.path}`);
        return;
      }
      try {
        await leaf.openFile(created);
      } catch (e) {
        if (this.live)
          new import_obsidian8.Notice(`${message("createdNotOpened", this.zh())} ${created.path}`);
      }
    } catch (e) {
      if (this.live)
        new import_obsidian8.Notice(created ? `${message("createdUnlinked", this.zh())} ${created.path}` : message("createFailed", this.zh()));
    } finally {
      this.creating.delete(context.editor);
    }
  }
  link(context, file, kind2) {
    if (this.app.vault.getAbstractFileByPath(file.path) !== file) {
      new import_obsidian8.Notice(message("missing", this.zh()));
      return false;
    }
    let text2;
    if (kind2 === "wiki") {
      const target = this.app.metadataCache.fileToLinktext(file, context.file.path, true);
      if (!safeWikiTarget(target)) {
        new import_obsidian8.Notice(message("unsafeLink", this.zh()));
        return false;
      }
      const alias = context.selected && !/[\[\]|\r\n]/u.test(context.selected) ? `|${context.selected}` : "";
      text2 = `[[${target}${alias}]]`;
    } else {
      text2 = this.app.fileManager.generateMarkdownLink(file, context.file.path);
      if ((kind2 === "image" || this.preferences().embedAttachments) && !text2.startsWith("!"))
        text2 = "!" + text2;
    }
    return this.commit(context, { text: text2, from: text2.length, to: text2.length, block: false });
  }
};
function commitInsertion(editor, text2, plan) {
  var _a;
  const end = editor.offsetToPos(text2.length), from = editor.offsetToPos(plan.from), to = editor.offsetToPos(plan.to);
  if (plan.append && plan.to !== text2.length)
    editor.transaction({ changes: [
      { from, to, text: plan.insert },
      { from: end, text: plan.append }
    ] }, "keyline-next-insert");
  else
    editor.replaceRange(plan.insert + ((_a = plan.append) != null ? _a : ""), from, to, "keyline-next-insert");
  editor.setSelection(editor.offsetToPos(plan.anchor), editor.offsetToPos(plan.head));
  editor.focus();
}
var SlashSuggest = class {
  constructor(_app, owner) {
    this.owner = owner;
    this.context = null;
  }
  close() {
    this.context = null;
  }
  onTrigger(cursor, editor, file) {
    var _a;
    if (!file || !this.owner.live || editor.somethingSelected() || editor.listSelections().length !== 1)
      return null;
    if (!editor.getLine(cursor.line).includes(this.owner.preferences().slashTrigger))
      return null;
    const hit = slashAt(editor.getValue(), editor.posToOffset(cursor), this.owner.preferences());
    if (!hit || !((_a = this.owner.capture(editor, file, hit)) == null ? void 0 : _a.valid()))
      return null;
    return { start: editor.offsetToPos(hit.from), end: cursor, query: hit.query };
  }
  getSuggestions(context) {
    return insertionEntries(this.owner.preferences(), this.owner.zh(), context.query);
  }
  renderSuggestion(entry, el) {
    el.addClass("keyline-next-insert-suggestion");
    el.setAttribute("data-insert-id", entry.id);
    el.setText(entry.label);
  }
  selectSuggestion(entry) {
    const current = this.context;
    if (!current || !this.owner.preferences().slash)
      return;
    const { editor, file, start, end } = current;
    const hit = this.onTrigger(editor.getCursor(), editor, file);
    if (!hit || editor.getRange(start, end) !== this.owner.preferences().slashTrigger + current.query || hit.start.line !== start.line || hit.start.ch !== start.ch || hit.end.line !== end.line || hit.end.ch !== end.ch) {
      this.close();
      return;
    }
    const context = this.owner.capture(editor, file, { from: editor.posToOffset(start), to: editor.posToOffset(end) });
    this.close();
    if (context)
      void this.owner.choose(context, entry);
  }
};
var FileInsertPicker = class extends import_obsidian8.SuggestModal {
  constructor(app, owner, context, kind2) {
    super(app);
    this.owner = owner;
    this.context = context;
    this.kind = kind2;
    this.setPlaceholder(message("selectFile", owner.zh()));
  }
  getSuggestions(query) {
    const files = this.kind === "wiki" ? this.app.vault.getMarkdownFiles() : this.app.vault.getFiles().filter((file) => this.kind === "image" ? /^(png|jpe?g|gif|webp|svg|bmp|avif)$/iu.test(file.extension) : file.extension !== "md");
    return files.filter((file) => (this.kind !== "wiki" || safeWikiTarget(file.path)) && file.path.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.path.localeCompare(b.path)).slice(0, 100);
  }
  renderSuggestion(file, el) {
    el.createDiv({ text: file.basename });
    el.createDiv({ text: file.path, cls: "setting-item-description" });
  }
  onChooseSuggestion(file) {
    this.owner.link(this.context, file, this.kind);
  }
  onClose() {
    super.onClose();
    this.owner.release(this);
  }
};

// src/platform/insert-settings.ts
var InsertSettingsModal = class extends import_obsidian9.Modal {
  constructor(app, owner) {
    super(app);
    this.owner = owner;
  }
  onOpen() {
    this.render();
  }
  render() {
    this.setTitle(message("insertMenu", this.owner.zh));
    this.contentEl.empty();
    this.contentEl.addClass("keyline-next-insert-settings");
    new import_obsidian9.Setting(this.contentEl).setName(message("customCommand", this.owner.zh)).addButton((b) => b.setButtonText(message("add", this.owner.zh)).setDisabled(this.owner.readOnly).onClick(() => {
      this.picker = new CommandPicker(this.app, this.owner.manifest.id, async (item) => {
        const customInsert = this.owner.preferences.customInsert.filter((c) => customInsertId(c) !== `command:${item.id}`);
        customInsert.push({ command: item.id, label: item.name });
        await this.owner.update({ customInsert });
        this.render();
      });
      this.picker.open();
    }));
    const entries = insertionEntries(this.owner.preferences, this.owner.zh, "", true);
    entries.forEach((entry, index) => {
      const row = new import_obsidian9.Setting(this.contentEl).setName(entry.label);
      row.settingEl.setAttribute("data-insert-id", entry.id);
      if (entry.command)
        row.setDesc(entry.command);
      const move = async (direction) => {
        var _a;
        const ids = entries.map((e) => e.id), next = index + direction;
        [ids[index], ids[next]] = [ids[next], ids[index]];
        await this.owner.update({ insertOrder: ids });
        this.render();
        const moved = this.contentEl.querySelectorAll(".setting-item")[next + 1];
        moved == null ? void 0 : moved.scrollIntoView({ block: "nearest" });
        const buttons = moved == null ? void 0 : moved.querySelectorAll(".clickable-icon");
        const button = buttons == null ? void 0 : buttons[direction < 0 ? 0 : 1];
        if ((button == null ? void 0 : button.getAttribute("aria-disabled")) !== "true")
          button == null ? void 0 : button.focus();
        else
          (_a = moved == null ? void 0 : moved.querySelector(".checkbox-container")) == null ? void 0 : _a.focus();
      };
      row.addExtraButton((b) => b.setIcon("arrow-up").setTooltip(message("up", this.owner.zh)).setDisabled(index === 0 || this.owner.readOnly).onClick(() => move(-1)));
      row.addExtraButton((b) => b.setIcon("arrow-down").setTooltip(message("down", this.owner.zh)).setDisabled(index === entries.length - 1 || this.owner.readOnly).onClick(() => move(1)));
      row.addToggle((toggle) => {
        toggle.toggleEl.setAttribute("aria-label", `${message("visible", this.owner.zh)}: ${entry.label}`);
        toggle.setValue(!this.owner.preferences.hiddenInsert.includes(entry.id)).setDisabled(this.owner.readOnly).onChange(async (enabled) => {
          const hiddenInsert = this.owner.preferences.hiddenInsert.filter((id) => id !== entry.id);
          if (!enabled)
            hiddenInsert.push(entry.id);
          await this.owner.update({ hiddenInsert });
        });
      });
      if (entry.command)
        row.addExtraButton((b) => b.setIcon("x").setTooltip(message("remove", this.owner.zh)).setDisabled(this.owner.readOnly).onClick(async () => {
          await this.owner.update({ customInsert: this.owner.preferences.customInsert.filter((c) => customInsertId(c) !== entry.id) });
          this.render();
        }));
    });
    new import_obsidian9.Setting(this.contentEl).setName(message("reset", this.owner.zh)).addButton((b) => b.setButtonText(message("reset", this.owner.zh)).setDisabled(this.owner.readOnly).onClick(async () => {
      await this.owner.update({ insertOrder: [], hiddenInsert: [] });
      this.render();
    }));
  }
  onClose() {
    var _a;
    (_a = this.picker) == null ? void 0 : _a.close();
  }
};
var CommandPicker = class extends import_obsidian9.SuggestModal {
  constructor(app, pluginId, choose) {
    super(app);
    this.pluginId = pluginId;
    this.choose = choose;
  }
  getSuggestions(query) {
    var _a, _b;
    return ((_b = (_a = hostCommands(this.app)) == null ? void 0 : _a.listCommands()) != null ? _b : []).filter((c) => !c.id.startsWith(`${this.pluginId}:insert`) && `${c.name} ${c.id}`.toLowerCase().includes(query.toLowerCase())).slice(0, 100);
  }
  renderSuggestion(value, el) {
    el.createDiv({ text: value.name });
    el.createDiv({ text: value.id, cls: "setting-item-description" });
  }
  onChooseSuggestion(value) {
    void this.choose(value);
  }
};

// src/platform/transfer-modal.ts
var import_obsidian10 = require("obsidian");

// src/domain/legacy-import.ts
var legacyId = "notion-craft-interaction-lab";
var legacyVersion = "0.7.4";
var importLimit = 2 * 1024 * 1024;
var boolMap = {
  enabled: "editingEnabled",
  nativeFileExplorerEnhancements: "fileNavigation",
  workspaceSwitcher: "workspaces",
  showHoverHints: "hints",
  selectionToolbar: "toolbar",
  hideSyntaxMarkers: "hideMarkers",
  guardSuspiciousSyntax: "markSuspicious",
  revealSyntaxWithOption: "optionReveal",
  notifyOnPaste: "pasteHints",
  snapSelectionToBlocks: "snapSelection",
  blockKeys: "blockKeys",
  handleAlwaysVisible: "handlePinned",
  foldHandle: "handleFold",
  plusHandle: "handlePlus",
  slashMenu: "slash",
  slashInline: "inlineSlash",
  embedAttachments: "embedAttachments"
};
var typeMap = {
  markdown: "note",
  pdf: "document",
  epub: "book",
  canvas: "canvas",
  audio: "audio",
  image: "image",
  video: "video",
  code: "code",
  archive: "archive",
  generic: "other",
  folder: "folder"
};
var layoutMap = {
  textMaxWidth: "width",
  pageSidePadding: "inset",
  editorLineHeight: "editorLeading",
  readingLineHeight: "readingLeading",
  paragraphGap: "paragraphGap",
  paragraphBefore: "paragraphBefore",
  paragraphAfter: "paragraphAfter",
  firstLineIndent: "firstIndent",
  listLineHeight: "listLeading",
  listItemSpacing: "listGap",
  listIndent: "listIndent",
  listMarkerGap: "markerGap",
  listBulletSize: "bulletSize",
  blockquoteIndent: "quoteIndent",
  headingBefore: "headingBefore",
  headingAfter: "headingAfter"
};
var itemMap = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  todo: "task",
  code: "codeblock",
  math: "math",
  table: "table",
  divider: "rule",
  toc: "toc",
  callout: "callout",
  page: "newpage",
  link: "wiki",
  "ext-link": "link",
  image: "image",
  attachment: "attachment",
  today: "today",
  yesterday: "yesterday",
  tomorrow: "tomorrow",
  time: "time",
  footnote: "footnote",
  comment: "comment"
};
var own = (v, k) => Object.prototype.hasOwnProperty.call(v, k);
function object(value, label2) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error(`${label2}: expected an object`);
  return value;
}
function jsonObject(text2, label2, limit2 = importLimit) {
  if (text2.length > limit2)
    throw Error(`${label2}: file too large`);
  return object(JSON.parse(text2.replace(/^\uFEFF/u, "")), label2);
}
function keys(raw, allowed, label2) {
  for (const key of Object.keys(raw))
    if (!allowed.includes(key))
      throw Error(`${label2}.${key}: unsupported field`);
}
function bool(raw, key, fallback) {
  if (!own(raw, key))
    return fallback;
  if (typeof raw[key] !== "boolean")
    throw Error(`${key}: expected a boolean`);
  return raw[key];
}
function text(raw, key, fallback, max = 80) {
  if (!own(raw, key))
    return fallback;
  const value = raw[key];
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\x00-\x1f\x7f]/u.test(value))
    throw Error(`${key}: invalid text`);
  return value.trim();
}
function number2(raw, key, fallback, max) {
  if (!own(raw, key))
    return fallback;
  const value = raw[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max || !Number.isInteger(value))
    throw Error(`${key}: invalid number`);
  return value;
}
function strings2(raw, key) {
  if (!own(raw, key))
    return [];
  const value = raw[key];
  if (!Array.isArray(value) || value.length > 1e3 || value.some((v) => typeof v !== "string" || v.length > 200))
    throw Error(`${key}: invalid IDs`);
  return value;
}
function planLegacyImport(manifestText, dataText, current) {
  const manifest = jsonObject(manifestText, "manifest", 16e3), raw = jsonObject(dataText, "data");
  if (manifest.id !== legacyId || manifest.version !== legacyVersion)
    throw Error(`Only ${legacyId} ${legacyVersion} is supported`);
  keys(raw, [
    ...Object.keys(boolMap),
    "fileIcons",
    "themeLayout",
    "marginalia",
    "dragGranularity",
    "hoverDelay",
    "hideDelay",
    "handleSide",
    "dateFormat",
    "timeFormat",
    "wikilinkInputAliases",
    "slashTrigger",
    "insertOrder",
    "insertHidden",
    "insertCustom"
  ], "data");
  if (!["enabled", "fileIcons", "themeLayout", "selectionToolbar"].some((k) => own(raw, k)))
    throw Error("Not a recognizable Keyline settings copy");
  const next = decodePreferences(current), baseline = decodePreferences(null), notices = [];
  for (const old of Object.keys(boolMap)) {
    const key = boolMap[old];
    next[key] = bool(raw, old, baseline[key]);
  }
  next.mentions = next.fullwidthLinks = bool(raw, "wikilinkInputAliases", true);
  next.blockHandles = true;
  if (own(raw, "marginalia")) {
    bool(raw, "marginalia", true);
    notices.push("marginalia-excluded");
  }
  const granularity = own(raw, "dragGranularity") ? raw.dragGranularity : "paragraph", side = own(raw, "handleSide") ? raw.handleSide : "left";
  if (granularity !== "paragraph" && granularity !== "line" || side !== "left" && side !== "right")
    throw Error("Invalid handle preferences");
  next.dragGranularity = granularity === "line" ? "line" : "block";
  next.handleSide = side;
  next.handleHoverDelay = number2(raw, "hoverDelay", 90, 1e3);
  next.handleHideDelay = number2(raw, "hideDelay", 260, 1500);
  next.dateFormat = text(raw, "dateFormat", "YYYY-MM-DD");
  next.timeFormat = text(raw, "timeFormat", "HH:mm");
  next.slashTrigger = text(raw, "slashTrigger", "/");
  if (!validSlashTrigger(next.slashTrigger))
    throw Error("Unsupported slash trigger");
  const layout = own(raw, "themeLayout") ? object(raw.themeLayout, "themeLayout") : {};
  keys(layout, Object.keys(layoutMap), "themeLayout");
  const values = {};
  for (const [key, value] of Object.entries(layout)) {
    if (typeof value !== "number" || !Number.isFinite(value))
      throw Error(`themeLayout.${key}: invalid number`);
    values[layoutMap[key]] = value;
  }
  next.typography = normalizeTypography(values);
  for (const [key, value] of Object.entries(values))
    if (Math.abs(next.typography[key] - value) > 1e-5)
      throw Error(`themeLayout.${key}: out of range or unsupported step`);
  const icons = own(raw, "fileIcons") ? object(raw.fileIcons, "fileIcons") : {};
  keys(icons, ["enabled", "monochrome", "types", "files"], "fileIcons");
  next.fileIcons = bool(icons, "enabled", true);
  next.monochrome = bool(icons, "monochrome", false);
  const rules = [];
  for (const scope of ["types", "files"]) {
    const entries = own(icons, scope) ? object(icons[scope], `fileIcons.${scope}`) : {};
    if (Object.keys(entries).length + rules.length > iconRuleLimit)
      throw Error("Too many icon rules");
    for (const [key, value] of Object.entries(entries)) {
      if (scope === "types" ? !own(typeMap, key) : !validIconPath(key))
        throw Error(`Invalid icon key: ${key}`);
      const item = object(value, `icon.${key}`);
      keys(item, ["icon", "color"], `icon.${key}`);
      const glyph = own(item, "icon") ? text(item, "icon", "").replace(/^lucide-/u, "") : void 0;
      const tint = own(item, "color") ? text(item, "color", "").toLowerCase() : void 0;
      const clean = cleanIconChoice({ glyph, tint });
      if (glyph && clean.glyph !== glyph || tint && clean.tint !== tint)
        throw Error(`Invalid icon choice: ${key}`);
      if (glyph || tint)
        rules.push({ scope: scope === "types" ? "type" : "path", key: scope === "types" ? typeMap[key] : key, ...clean });
    }
  }
  next.iconRules = rules;
  const custom = own(raw, "insertCustom") ? raw.insertCustom : [];
  if (!Array.isArray(custom) || custom.length > 32)
    throw Error("Invalid custom insert list (maximum 32)");
  const customIDs = /* @__PURE__ */ new Map();
  next.customInsert = custom.map((value, index) => {
    const item = object(value, "insertCustom");
    keys(item, ["id", "label", "icon", "commandId"], "insertCustom");
    const oldId = text(item, "id", "", 200), command = text(item, "commandId", "", 160), label2 = text(item, "label", "", 80);
    if (!oldId || own(itemMap, oldId) || customIDs.has(oldId) || !command || !label2)
      throw Error("Invalid or duplicate custom insert ID");
    const id = `custom:legacy-${index + 1}`;
    customIDs.set(oldId, id);
    const icon = text(item, "icon", "terminal", 100).replace(/^lucide-/u, "");
    return { id, command, label: label2, icon };
  });
  const mapID = (id) => {
    const mapped = own(itemMap, id) ? itemMap[id] : customIDs.get(id);
    if (!mapped)
      throw Error(`Unknown insert item: ${id}`);
    return mapped;
  };
  next.insertOrder = [...new Set([...strings2(raw, "insertOrder"), ...Object.keys(itemMap), ...customIDs.keys()].map(mapID))];
  next.hiddenInsert = [...new Set(strings2(raw, "insertHidden").map(mapID))];
  const normalized = normalizeInsert({ ...next });
  if (normalized.customInsert.length !== next.customInsert.length || normalized.customInsert.some((item, i) => ["id", "command", "label", "icon"].some((k) => item[k] !== next.customInsert[i][k])))
    throw Error("Unsupported custom command, label or icon");
  if (next.customInsert.length)
    notices.push("commands-not-executed");
  notices.push("notes-and-host-preferences-untouched");
  const changed = Object.keys(next).filter((k) => JSON.stringify(next[k]) !== JSON.stringify(current[k]));
  return { preferences: next, changed, notices };
}

// src/platform/settings-transfer.ts
var TransferFailure = class extends Error {
  constructor(message2, backup, uncertain = false) {
    super(message2);
    this.backup = backup;
    this.uncertain = uncertain;
  }
};
var safeName = (name2) => /^settings-[a-z0-9-]{1,100}\.json$/u.test(name2);
async function transferDigest(text2) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text2));
  return Array.from(new Uint8Array(bytes), (n) => n.toString(16).padStart(2, "0")).join("");
}
var SettingsTransfer = class {
  constructor(io, current, ready, committed, uncertain, name2 = () => `settings-${Date.now()}-${crypto.randomUUID()}.json`) {
    this.io = io;
    this.current = current;
    this.ready = ready;
    this.committed = committed;
    this.uncertain = uncertain;
    this.name = name2;
    this.busy = false;
    this.live = true;
    this.previews = /* @__PURE__ */ new WeakMap();
  }
  close() {
    this.live = false;
  }
  check() {
    if (!this.live || !this.ready())
      throw Error("Settings are read-only, unsaved or no longer active");
  }
  async run(action) {
    if (this.busy)
      throw Error("Another settings transfer is running");
    this.check();
    this.busy = true;
    try {
      return await action();
    } finally {
      this.busy = false;
    }
  }
  parsed(raw) {
    const value = raw === null ? null : jsonObject(raw, "current settings");
    if (!writablePreferences(value))
      throw Error("Unknown settings schema; no overwrite allowed");
    return value;
  }
  async baseline() {
    const raw = await this.io.read();
    this.check();
    const decoded = decodePreferences(this.parsed(raw));
    if (JSON.stringify(decoded) !== JSON.stringify(this.current()))
      throw Error("Settings changed outside this session; reload before importing");
    return raw;
  }
  issue(payload2, plan) {
    var _a, _b;
    const preview = Object.freeze({
      kind: payload2.kind,
      result: payload2.after,
      changes: Object.freeze((_a = plan == null ? void 0 : plan.changed.slice()) != null ? _a : ["restore-snapshot"]),
      notices: Object.freeze((_b = plan == null ? void 0 : plan.notices.slice()) != null ? _b : ["later-settings-replaced", "notes-and-host-preferences-untouched"])
    });
    this.previews.set(preview, payload2);
    return preview;
  }
  previewImport(manifest, source) {
    return this.run(async () => {
      const before = await this.baseline(), plan = planLegacyImport(manifest, source, this.current());
      return this.issue({ schema: 1, kind: "import", before, after: JSON.stringify(plan.preferences, null, 2), manifest, source }, plan);
    });
  }
  async backups() {
    return (await this.io.listBackups()).filter(safeName).sort().reverse();
  }
  previewRestore(name2) {
    return this.run(async () => {
      if (!safeName(name2))
        throw Error("Invalid backup name");
      const record = jsonObject(await this.io.readBackup(name2), "backup", importLimit * 4);
      if (Object.keys(record).some((k) => !["payload", "sha256"].includes(k)) || typeof record.payload !== "string" || record.sha256 !== await transferDigest(record.payload))
        throw Error("Backup integrity check failed");
      const payload2 = jsonObject(record.payload, "backup payload", importLimit * 4);
      if (payload2.schema !== 1 || !["import", "restore"].includes(payload2.kind) || Object.keys(payload2).some((k) => !["schema", "kind", "before", "after", "manifest", "source", "restoredFrom"].includes(k)) || !(payload2.before === null || typeof payload2.before === "string") || !(payload2.after === null || typeof payload2.after === "string"))
        throw Error("Unsupported backup schema");
      this.parsed(payload2.before);
      const before = await this.baseline();
      return this.issue({ schema: 1, kind: "restore", before, after: payload2.before, restoredFrom: name2 });
    });
  }
  apply(preview) {
    return this.run(async () => {
      const payload2 = this.previews.get(preview);
      if (!payload2)
        throw Error("Preview expired; review settings again");
      this.previews.delete(preview);
      if (await this.baseline() !== payload2.before)
        throw Error("Settings changed after preview; review again");
      const name2 = this.name();
      if (!safeName(name2))
        throw Error("Invalid generated backup name");
      const serialized = JSON.stringify(payload2), record = JSON.stringify({ payload: serialized, sha256: await transferDigest(serialized) }, null, 2);
      if (record.length > importLimit * 4)
        throw Error("Backup would exceed the verified recovery limit");
      await this.io.createBackup(name2, record);
      if (await this.io.readBackup(name2) !== record)
        throw new TransferFailure("Backup read-back failed; settings were not changed", name2);
      this.check();
      if (await this.io.read() !== payload2.before)
        throw new TransferFailure("Settings changed while backing up; no overwrite", name2);
      this.check();
      try {
        await this.io.write(payload2.after);
        if (await this.io.read() !== payload2.after)
          throw Error("Settings read-back failed");
      } catch (e) {
        let restored = false;
        try {
          const actual = await this.io.read();
          if (actual === payload2.before)
            restored = true;
          else if (actual === payload2.after) {
            await this.io.write(payload2.before);
            restored = await this.io.read() === payload2.before;
          }
        } catch (e2) {
        }
        if (!restored && this.live)
          this.uncertain();
        throw new TransferFailure(restored ? "Write failed; original settings retained" : "Write state uncertain; settings locked. Keep the backup and reload before recovery", name2, !restored);
      }
      if (this.live)
        this.committed(decodePreferences(this.parsed(payload2.after)));
      return name2;
    });
  }
};

// src/platform/transfer-modal.ts
var SettingsTransferModal = class extends import_obsidian10.Modal {
  constructor(owner, done) {
    super(owner.app);
    this.owner = owner;
    this.done = done;
    this.generation = { manifest: 0, data: 0 };
    this.closed = true;
    this.source = {};
  }
  onOpen() {
    this.closed = false;
    const zh = this.owner.zh, root = this.contentEl;
    this.setTitle(message("settingsTransfer", zh));
    root.addClass("keyline-next-transfer");
    root.createEl("p", { text: zh ? `\u9009\u62E9\u6574\u5408\u7248 Keyline ${legacyVersion} \u7684 manifest.json \u4E0E data.json \u526F\u672C\u3002\u53EA\u8BFB\u53D6\u9009\u4E2D\u7684\u6587\u4EF6\uFF0C\u4E0D\u542F\u505C\u65E7\u63D2\u4EF6\u3001\u4E0D\u4FEE\u6539\u7B14\u8BB0\u3001\u4E3B\u9898\u6216\u7CFB\u7EDF\u83DC\u5355\u3002\u8BF7\u52FF\u540C\u65F6\u542F\u7528\u65B0\u65E7\u63D2\u4EF6\u3002` : `Choose manifest.json and data.json copies from integrated Keyline ${legacyVersion}. Only selected files are read. The old plugin, notes, theme and system menus are not changed. Do not enable both companions together.` });
    for (const kind2 of ["manifest", "data"]) {
      const setting = new import_obsidian10.Setting(root).setName(kind2 === "manifest" ? zh ? "\u65E7\u7248\u7248\u672C\u6587\u4EF6" : "Legacy manifest" : zh ? "\u65E7\u7248\u8BBE\u7F6E\u6587\u4EF6" : "Legacy settings");
      const input = setting.controlEl.createEl("input", { attr: { type: "file", accept: ".json,application/json", "aria-label": `${kind2}.json` } });
      input.dataset.transferSource = kind2;
      input.addEventListener("change", () => {
        void this.readFile(kind2, input);
      });
    }
    new import_obsidian10.Setting(root).setName(zh ? "\u5148\u67E5\u770B\u5BFC\u5165\u9884\u89C8" : "Review before importing").addButton((button) => button.setButtonText(zh ? "\u9884\u89C8\u5BFC\u5165" : "Review import").onClick(() => this.work(async () => {
      if (!this.source.manifest || !this.source.data)
        throw Error(zh ? "\u8BF7\u5148\u9009\u62E9\u4E24\u4E2A\u6587\u4EF6" : "Choose both files first");
      this.show(await this.owner.transfer.previewImport(this.source.manifest, this.source.data));
    })));
    const restore = new import_obsidian10.Setting(root).setName(zh ? "\u4ECE\u5907\u4EFD\u56DE\u9000" : "Restore a backup");
    let selected = "";
    restore.addDropdown((dropdown) => {
      dropdown.selectEl.dataset.transferBackup = "true";
      dropdown.addOption("", zh ? "\u9009\u62E9\u5907\u4EFD" : "Choose backup").onChange((value) => {
        selected = value;
        this.invalidate();
      });
      void this.owner.transfer.backups().then((names2) => {
        if (!this.closed)
          for (const name2 of names2)
            dropdown.addOption(name2, name2);
      }, (error) => {
        if (!this.closed)
          this.status.textContent = String(error);
      });
    }).addButton((button) => button.setButtonText(zh ? "\u9884\u89C8\u56DE\u9000" : "Review restore").onClick(() => this.work(async () => {
      if (!selected)
        throw Error(zh ? "\u8BF7\u9009\u62E9\u5907\u4EFD" : "Choose a backup");
      this.show(await this.owner.transfer.previewRestore(selected));
    })));
    this.details = root.createDiv({ cls: "keyline-next-transfer-preview" });
    this.status = root.createEl("p", { attr: { role: "status", "aria-live": "polite" } });
    new import_obsidian10.Setting(root).addButton((button) => {
      this.applyControl = button;
      this.applyButton = button.buttonEl;
      button.buttonEl.dataset.transferApply = "true";
      button.setButtonText(zh ? "\u5907\u4EFD\u5E76\u5E94\u7528" : "Back up and apply").setCta().setDisabled(true).onClick(() => this.work(async () => {
        if (!this.preview)
          throw Error("Review settings first");
        const preview = this.preview;
        this.invalidate();
        const backup = await this.owner.transfer.apply(preview);
        if (!this.closed) {
          this.status.textContent = (zh ? "\u5DF2\u9A8C\u8BC1\u4FDD\u5B58\u3002\u5907\u4EFD\uFF1Asettings-backups/" : "Saved and verified. Backup: settings-backups/") + backup;
          this.details.empty();
          this.details.createEl("p", { text: zh ? "\u5173\u95ED\u540E\u53EF\u91CD\u65B0\u6253\u5F00\u6B64\u7A97\u53E3\uFF0C\u9884\u89C8\u5E76\u56DE\u9000\u672C\u6B21\u66F4\u6539\u3002" : "Close and reopen this window to review and restore this change." });
        }
      }));
    }).addButton((button) => button.setButtonText(message("close", zh)).onClick(() => this.close()));
  }
  invalidate() {
    var _a, _b;
    this.preview = void 0;
    (_a = this.applyControl) == null ? void 0 : _a.setDisabled(true);
    (_b = this.details) == null ? void 0 : _b.empty();
  }
  async readFile(kind2, input) {
    var _a;
    const generation = ++this.generation[kind2];
    this.invalidate();
    delete this.source[kind2];
    const file = (_a = input.files) == null ? void 0 : _a[0];
    if (!file)
      return;
    try {
      if (file.size > (kind2 === "manifest" ? 16e3 : importLimit))
        throw Error("File too large");
      const value = await file.text();
      if (this.closed || generation !== this.generation[kind2])
        return;
      this.source[kind2] = value;
      this.status.textContent = "";
    } catch (error) {
      if (!this.closed)
        this.status.textContent = String(error);
    }
  }
  show(preview) {
    var _a;
    if (this.closed)
      return;
    this.preview = preview;
    this.details.empty();
    const zh = this.owner.zh;
    this.details.createEl("h3", { text: preview.kind === "import" ? zh ? "\u5BFC\u5165\u9884\u89C8" : "Import preview" : zh ? "\u56DE\u9000\u9884\u89C8" : "Restore preview" });
    this.details.createEl("p", { text: preview.kind === "import" ? zh ? `\u5C06\u66F4\u6539 ${preview.changes.length} \u9879\u8BBE\u7F6E\uFF1B\u8BED\u8A00\u548C\u65B0\u7248\u72EC\u6709\u9009\u9879\u4FDD\u7559\u3002` : `${preview.changes.length} preference fields will change; language and rewrite-only options are retained.` : zh ? "\u5C06\u6062\u590D\u6240\u9009\u64CD\u4F5C\u524D\u7684\u8BBE\u7F6E\uFF1B\u4F60\u4E4B\u540E\u7684\u8BBE\u7F6E\u66F4\u6539\u4F1A\u5148\u53E6\u5B58\u5907\u4EFD\u3002" : "Restore settings from before the selected operation. Later settings will be backed up first." });
    if (preview.kind === "import")
      this.details.createEl("pre", { text: preview.changes.join("\n") });
    const expanded = this.details.createEl("details");
    expanded.createEl("summary", { text: zh ? "\u8F6C\u6362\u540E\u7684\u8BBE\u7F6E\uFF08JSON\uFF09" : "Resulting settings (JSON)" });
    const result = (_a = preview.result) != null ? _a : zh ? "\u65E0\u539F\u8BBE\u7F6E\u6587\u4EF6\uFF1A\u56DE\u9000\u5C06\u5220\u9664\u672C\u6B21\u521B\u5EFA\u7684 data.json\uFF0C\u6062\u590D\u9ED8\u8BA4\u8BBE\u7F6E\u3002" : "No prior settings file: restore removes the new data.json and returns to defaults.";
    expanded.createEl("pre", { text: result.length <= 2e4 ? result : result.slice(0, 2e4) + (zh ? "\n\u2026\u9884\u89C8\u622A\u65AD\uFF0C\u5B8C\u6574\u5185\u5BB9\u4F1A\u4FDD\u5B58\u5728\u5907\u4EFD\u4E2D\u3002" : "\n\u2026Preview truncated; the backup retains the complete content.") });
    for (const notice of preview.notices) {
      const labels3 = {
        "marginalia-excluded": ["Marginalia preference is excluded; the separate plugin is untouched.", "\u4E0D\u5BFC\u5165 Marginalia \u8BBE\u7F6E\uFF1B\u72EC\u7ACB\u63D2\u4EF6\u4E0D\u53D7\u5F71\u54CD\u3002"],
        "commands-not-executed": ["Custom command bindings are imported but never executed by this operation.", "\u53EA\u5BFC\u5165\u81EA\u5B9A\u4E49\u547D\u4EE4\u7ED1\u5B9A\uFF0C\u4E0D\u6267\u884C\u547D\u4EE4\u3002"],
        "notes-and-host-preferences-untouched": ["Notes, original files and host preferences remain unchanged.", "\u7B14\u8BB0\u3001\u6E90\u6587\u4EF6\u548C\u5BBF\u4E3B\u504F\u597D\u4E0D\u6539\u52A8\u3002"]
      };
      if (labels3[notice])
        this.details.createEl("p", { text: labels3[notice][zh ? 1 : 0] });
    }
    this.status.textContent = zh ? "\u786E\u8BA4\u9884\u89C8\u540E\uFF0C\u70B9\u51FB\u201C\u5907\u4EFD\u5E76\u5E94\u7528\u201D\u3002" : "After reviewing, choose Back up and apply.";
    this.applyControl.setDisabled(false);
  }
  async work(action) {
    var _a;
    if ((_a = this.owner.transfer) == null ? void 0 : _a.busy)
      return;
    const controls = Array.from(this.contentEl.querySelectorAll("input,button,select"));
    const previous = controls.map((c) => c.disabled);
    controls.forEach((c) => c.disabled = true);
    try {
      await action();
    } catch (error) {
      this.invalidate();
      if (!this.closed)
        this.status.textContent = (this.owner.zh ? "\u672A\u5B8C\u6210\uFF1A" : "Not completed: ") + String(error) + (error instanceof TransferFailure && error.backup ? `
settings-backups/${error.backup}` : "");
    } finally {
      if (!this.closed) {
        controls.forEach((c, i) => c.disabled = previous[i]);
        this.applyControl.setDisabled(!this.preview || this.owner.readOnly);
      }
    }
  }
  onClose() {
    if (this.closed)
      return;
    this.closed = true;
    this.generation.manifest++;
    this.generation.data++;
    this.source = {};
    this.preview = void 0;
    this.done();
  }
};

// src/settings.ts
var sections = ["interface", "typography", "icons", "editing", "insert", "advanced"];
var settingsSerial = 0;
var sectionIcons = ["panels-top-left", "type", "palette", "pencil", "plus", "settings"];
var descriptions = {
  interface: ["Navigation, menus and hints.", "\u5BFC\u822A\u3001\u83DC\u5355\u4E0E\u63D0\u793A\u3002"],
  typography: ["Page, body, lists and headings.", "\u9875\u9762\u3001\u6B63\u6587\u3001\u5217\u8868\u4E0E\u6807\u9898\u3002"],
  icons: ["File types, artwork and colours.", "\u6587\u4EF6\u7C7B\u578B\u3001\u56FE\u5F62\u4E0E\u989C\u8272\u3002"],
  editing: ["Writing guards, selection and block actions.", "\u4E66\u5199\u4FDD\u62A4\u3001\u6587\u672C\u9009\u62E9\u4E0E\u5757\u64CD\u4F5C\u3002"],
  insert: ["Triggers, attachments and menu items.", "\u89E6\u53D1\u65B9\u5F0F\u3001\u9644\u4EF6\u4E0E\u83DC\u5355\u9879\u76EE\u3002"],
  advanced: ["Compatibility and settings transfer.", "\u517C\u5BB9\u8BF4\u660E\u4E0E\u8BBE\u7F6E\u5BFC\u5165\u3002"]
};
var rows = [
  { section: "interface", key: "hints", label: "hints", hint: "hintsHint" },
  { section: "interface", key: "fileNavigation", label: "fileNavigation", hint: "fileNavigationHint" },
  { section: "interface", key: "workspaces", label: "workspace", hint: "workspaceHint" },
  { section: "typography", key: "typographyEnabled", label: "typographyEnabled", hint: "typographyHint" },
  { section: "icons", key: "fileIcons", label: "fileIcons", hint: "iconsHint" },
  { section: "icons", key: "monochrome", label: "monochrome" },
  { section: "editing", key: "editingEnabled", label: "editingEnabled", hint: "editingEnabledHint" },
  { section: "editing", key: "toolbar", label: "toolbar", hint: "toolbarHint" },
  { section: "editing", key: "hideMarkers", label: "hideMarkers", hint: "hideMarkersHint" },
  { section: "editing", key: "markSuspicious", label: "markSuspicious", hint: "markSuspiciousHint" },
  { section: "editing", key: "optionReveal", label: "optionReveal" },
  { section: "editing", key: "pasteHints", label: "pasteHints" },
  { section: "editing", key: "blockHandles", label: "blockHandles", hint: "blockHandlesHint" },
  { section: "editing", key: "handlePinned", label: "handlePinned" },
  { section: "editing", key: "handleFold", label: "handleFold" },
  { section: "editing", key: "handlePlus", label: "handlePlus" },
  { section: "editing", key: "snapSelection", label: "snapSelection", hint: "snapSelectionHint" },
  { section: "editing", key: "blockKeys", label: "blockKeys", hint: "blockKeysHint" },
  { section: "insert", key: "fullwidthLinks", label: "fullwidthLinks", hint: "fullwidthHint" },
  { section: "insert", key: "mentions", label: "mentions", hint: "mentionsHint" },
  { section: "insert", key: "slash", label: "slash", hint: "slashHint" },
  { section: "insert", key: "inlineSlash", label: "inlineSlash" },
  { section: "insert", key: "embedAttachments", label: "embedAttachments" }
];
var NextSettings = class extends import_obsidian11.PluginSettingTab {
  constructor(owner) {
    super(owner.app, owner);
    this.owner = owner;
    this.panelId = `keyline-next-panel-${++settingsSerial}`;
    this.section = "interface";
    this.query = "";
    this.shown = false;
  }
  display() {
    var _a, _b;
    this.shown = true;
    (_a = this.unsubscribe) == null ? void 0 : _a.call(this);
    (_b = this.resize) == null ? void 0 : _b.disconnect();
    const { containerEl: root, owner } = this, zh = owner.zh;
    owner.watchInterfaceDocument(root.ownerDocument);
    root.empty();
    root.addClass("keyline-next-settings");
    const header = root.createDiv({ cls: "keyline-next-settings-header" });
    header.createEl("h2", { text: message("title", zh) });
    header.createSpan({ text: owner.manifest.version, cls: "keyline-next-settings-version" });
    if (owner.readOnly)
      root.createEl("p", { text: message("incompatible", zh) });
    const status = root.createDiv({ cls: "keyline-next-save-status", attr: { "aria-live": "polite" } });
    const refreshStatus = () => {
      if (!status.isConnected)
        return;
      status.empty();
      if (owner.store.dirty)
        new import_obsidian11.Setting(status).setName(message("failed", owner.zh)).addButton((b) => b.setButtonText(message("retry", owner.zh)).onClick(async () => {
          await owner.store.retry();
          refreshStatus();
        }));
    };
    this.unsubscribe = owner.store.subscribe(refreshStatus);
    const update = async (patch) => {
      await owner.update(patch);
      refreshStatus();
    };
    const searchInput = header.createEl("input", { cls: "keyline-next-settings-search", attr: { type: "search", placeholder: message("search", zh), "aria-label": message("search", zh) } });
    searchInput.value = this.query;
    searchInput.addEventListener("input", () => {
      this.query = searchInput.value;
      renderPanel();
    });
    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !searchInput.value)
        return;
      event.preventDefault();
      event.stopPropagation();
      this.query = "";
      searchInput.value = "";
      renderPanel();
    });
    const select = root.createEl("select", { cls: "dropdown keyline-next-settings-select", attr: { "aria-label": zh ? "\u8BBE\u7F6E\u5206\u7C7B" : "Settings category" } });
    const layout = root.createDiv({ cls: "keyline-next-settings-layout" });
    const nav = layout.createDiv({ cls: "keyline-next-settings-nav", attr: { role: "tablist", "aria-orientation": "vertical", "aria-label": message("title", zh) } });
    const panel = layout.createDiv({ cls: "keyline-next-settings-panel", attr: { role: "tabpanel", id: this.panelId } });
    const tabs = [];
    sections.forEach((section, index) => {
      const button = nav.createEl("button", { attr: { role: "tab", id: `${this.panelId}-${section}`, "aria-controls": this.panelId } });
      const icon = button.createSpan({ cls: "keyline-next-settings-tab-icon", attr: { "aria-hidden": "true" } });
      (0, import_obsidian11.setIcon)(icon, sectionIcons[index]);
      button.createSpan({ text: message(section, zh) });
      select.createEl("option", { text: message(section, zh), value: section });
      button.type = "button";
      tabs.push(button);
      button.addEventListener("click", () => {
        this.section = section;
        this.query = "";
        searchInput.value = "";
        renderPanel();
        button.focus();
      });
      button.addEventListener("keydown", (event) => {
        if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
        const next = event.key === "Home" ? 0 : event.key === "End" ? sections.length - 1 : (index + direction + sections.length) % sections.length;
        this.section = sections[next];
        this.query = "";
        searchInput.value = "";
        renderPanel();
        tabs[next].focus();
        event.preventDefault();
      });
    });
    select.addEventListener("change", () => {
      this.section = select.value;
      this.query = "";
      searchInput.value = "";
      renderPanel();
    });
    const matches2 = (...values) => !this.query.trim() || values.join(" ").toLocaleLowerCase().includes(this.query.trim().toLocaleLowerCase());
    const labelMatches = (...keys2) => matches2(...keys2.reduce((all, key) => all.concat(message(key, false), message(key, true)), []));
    const updatePreview = () => {
      const preview = panel.querySelector(".keyline-next-type-preview");
      if (preview)
        for (const [name2, value] of Object.entries(typographyVariables(owner.preferences.typography)))
          preview.style.setProperty(name2, value);
    };
    const renderPanel = () => {
      var _a2, _b2, _c, _d;
      panel.empty();
      panel.setAttribute("aria-labelledby", `${this.panelId}-${this.section}`);
      select.value = this.section;
      tabs.forEach((tab, i) => {
        const selected = sections[i] === this.section;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      const shown = this.query.trim() ? sections : [this.section];
      for (const section of shown) {
        const group = panel.createDiv({ cls: "keyline-next-settings-group" });
        group.createEl("h3", { text: message(section, zh) });
        group.createEl("p", { text: descriptions[section][zh ? 1 : 0], cls: "keyline-next-settings-description" });
        let count2 = 0;
        if (section === "interface" && labelMatches("language", "languageHint")) {
          new import_obsidian11.Setting(group).setName(message("language", zh)).setDesc(message("languageHint", zh)).addDropdown((d) => {
            d.addOption("auto", message("auto", zh)).addOption("en", "English").addOption("zh", "\u4E2D\u6587");
            d.setValue(owner.preferences.language).setDisabled(owner.readOnly).onChange(async (value) => {
              if (value !== "auto" && value !== "en" && value !== "zh")
                return;
              await update({ language: value });
              this.display();
            });
          });
          count2++;
        }
        if (section === "interface" && labelMatches("menuStyle", "menuStyleHint")) {
          const current = (_b2 = (_a2 = owner.menuMode) == null ? void 0 : _a2.read()) != null ? _b2 : null;
          new import_obsidian11.Setting(group).setName(message("menuStyle", zh)).setDesc(message(current === null ? "menuUnavailable" : "menuStyleHint", zh)).addDropdown((d) => {
            d.selectEl.dataset.keylineMenuMode = "true";
            d.addOption("themed", message("menuThemed", zh)).addOption("system", message("menuNative", zh)).setValue(current ? "system" : "themed").setDisabled(owner.readOnly || current === null).onChange(async (value) => {
              var _a3, _b3, _c2;
              if (value !== "system" && value !== "themed")
                return;
              d.setDisabled(true);
              try {
                if (!await ((_a3 = owner.menuMode) == null ? void 0 : _a3.set(value === "system")))
                  new import_obsidian11.Notice(message("menuFailed", owner.zh));
              } finally {
                const actual = (_c2 = (_b3 = owner.menuMode) == null ? void 0 : _b3.read()) != null ? _c2 : null;
                d.setValue(actual ? "system" : "themed").setDisabled(owner.readOnly || actual === null);
              }
            });
          });
          count2++;
        }
        for (const row of rows.filter((row2) => row2.section === section && labelMatches(row2.label, ...row2.hint ? [row2.hint] : []))) {
          const setting = new import_obsidian11.Setting(group).setName(message(row.label, zh));
          if (row.hint)
            setting.setDesc(message(row.hint, zh));
          setting.addToggle((t2) => t2.setValue(owner.preferences[row.key]).setDisabled(owner.readOnly).onChange((value) => update({ [row.key]: value })));
          count2++;
        }
        if (section === "icons") {
          for (const kind2 of iconKinds)
            if (matches2(...kindLabels[kind2], message("changeIcon", zh))) {
              new import_obsidian11.Setting(group).setName(kindLabels[kind2][zh ? 1 : 0]).addButton((b) => b.setButtonText(message("changeIcon", zh)).setDisabled(owner.readOnly).onClick(() => {
                var _a3;
                return (_a3 = owner.iconEditor) == null ? void 0 : _a3.type(kind2);
              }));
              count2++;
            }
          if (!this.query)
            group.createEl("p", { text: message("iconRulesHint", zh), cls: "setting-item-description" });
        }
        if (section === "editing") {
          if (labelMatches("dragGranularity", "dragGranularityHint", "dragLine", "dragBlock")) {
            new import_obsidian11.Setting(group).setName(message("dragGranularity", zh)).setDesc(message("dragGranularityHint", zh)).addDropdown((d) => {
              d.selectEl.dataset.keylineDragGranularity = "true";
              d.addOption("block", message("dragBlock", zh)).addOption("line", message("dragLine", zh)).setValue(owner.preferences.dragGranularity).setDisabled(owner.readOnly).onChange((value) => {
                if (value === "line" || value === "block")
                  void update({ dragGranularity: value });
              });
            });
            count2++;
          }
          if (labelMatches("handleSide")) {
            new import_obsidian11.Setting(group).setName(message("handleSide", zh)).addDropdown((d) => {
              d.addOption("left", message("left", zh)).addOption("right", message("right", zh)).setValue(owner.preferences.handleSide).setDisabled(owner.readOnly).onChange((value) => update({ handleSide: value === "right" ? "right" : "left" }));
            });
            count2++;
          }
          for (const key of ["handleHoverDelay", "handleHideDelay"])
            if (labelMatches(key)) {
              new import_obsidian11.Setting(group).setName(message(key, zh)).addSlider((slider) => {
                slider.sliderEl.setAttribute("aria-label", message(key, zh));
                slider.setLimits(0, key === "handleHoverDelay" ? 1e3 : 1500, 10).setDisplayFormat((value) => `${value} ms`).setValue(owner.preferences[key]).setInstant(true).setDisabled(owner.readOnly).onChange((value) => update({ [key]: value }));
              });
              count2++;
            }
        }
        if (section === "insert") {
          if (labelMatches("trigger")) {
            const setting = new import_obsidian11.Setting(group).setName(message("trigger", zh));
            setting.addText((input) => input.setValue(owner.preferences.slashTrigger).setDisabled(owner.readOnly).onChange(async (value) => {
              input.inputEl.setAttribute("aria-invalid", String(!validSlashTrigger(value)));
              setting.setDesc(validSlashTrigger(value) ? "" : message("invalidTrigger", zh));
              if (validSlashTrigger(value))
                await update({ slashTrigger: value });
            }));
            count2++;
          }
          for (const key of ["dateFormat", "timeFormat"])
            if (labelMatches(key)) {
              const setting = new import_obsidian11.Setting(group).setName(message(key, zh));
              const preview = () => setting.setDesc(formattedDates(owner.preferences, zh)[key === "dateFormat" ? "today" : "time"]);
              setting.addText((input) => input.setValue(owner.preferences[key]).setDisabled(owner.readOnly).onChange(async (value) => {
                if (!value.trim() || value.length > 80 || /[\x00-\x1f]/u.test(value))
                  return;
                await update({ [key]: value });
                preview();
              }));
              preview();
              count2++;
            }
          if (labelMatches("insertMenu", "customCommand")) {
            new import_obsidian11.Setting(group).setName(message("insertMenu", zh)).setDesc(zh ? "\u6392\u5E8F\u3001\u9690\u85CF\u4E0E\u81EA\u5B9A\u4E49\u547D\u4EE4\u3002" : "Order, visibility and custom commands.").addButton((b) => b.setButtonText(message("insertMenu", zh)).setDisabled(owner.readOnly).onClick(() => {
              var _a3;
              (_a3 = this.insertModal) == null ? void 0 : _a3.close();
              this.insertModal = new InsertSettingsModal(owner.app, owner);
              this.insertModal.open();
            }));
            count2++;
          }
        }
        if (section === "typography") {
          for (const key of typographyKeys) {
            const spec = typographySpecs[key];
            if (!matches2(...spec.label))
              continue;
            const setting = new import_obsidian11.Setting(group).setName(spec.label[zh ? 1 : 0]);
            setting.addSlider((slider) => {
              slider.sliderEl.setAttribute("aria-label", spec.label[zh ? 1 : 0]);
              slider.setLimits(spec.min, spec.max, spec.step).setDisplayFormat(
                (value) => key === "inset" && value < 0 ? message("auto", zh) : `${value}${spec.unit}`
              ).setValue(owner.preferences.typography[key]).setInstant(true).setDisabled(owner.readOnly).onChange(async (value) => {
                await update({ typography: { ...owner.preferences.typography, [key]: value } });
                updatePreview();
              });
            });
            count2++;
          }
          if (!this.query) {
            new import_obsidian11.Setting(group).setName(message("reset", zh)).addButton((b) => b.setButtonText(message("reset", zh)).setDisabled(owner.readOnly).onClick(async () => {
              await update({ typography: normalizeTypography(null) });
              renderPanel();
            }));
            const preview = group.createDiv({ cls: "keyline-next-type-preview" });
            preview.createEl("h4", { text: message("preview", zh) });
            preview.createEl("p", { text: message("previewText", zh) });
            preview.createEl("p", { text: message("previewText", zh) });
            preview.createEl("ul").createEl("li", { text: message("previewText", zh) });
          }
        }
        if (section === "advanced" && labelMatches("compatibility")) {
          group.createEl("p", { text: message("compatibility", zh) });
          count2++;
        }
        if (section === "advanced" && labelMatches("settingsTransfer", "settingsTransferHint")) {
          new import_obsidian11.Setting(group).setName(message("settingsTransfer", zh)).setDesc(message("settingsTransferHint", zh)).addButton((button) => button.setButtonText(message("settingsTransfer", zh)).setDisabled(owner.readOnly || !owner.transfer).onClick(() => {
            var _a3;
            (_a3 = this.transferModal) == null ? void 0 : _a3.close();
            this.transferModal = new SettingsTransferModal(owner, () => {
              this.transferModal = void 0;
              if (this.shown && root.isConnected)
                this.display();
            });
            this.transferModal.open();
          }));
          count2++;
        }
        if (!count2)
          group.remove();
        else {
          const cards = /* @__PURE__ */ new Map();
          for (const child of Array.from(group.children)) {
            if (!child.matches(".setting-item"))
              continue;
            const name2 = (_d = (_c = child.querySelector(".setting-item-name")) == null ? void 0 : _c.textContent) != null ? _d : "";
            let label2 = message(section, zh);
            if (section === "typography") {
              const index = typographyKeys.findIndex((key) => typographySpecs[key].label.some((label3) => label3 === name2));
              label2 = index < 2 ? zh ? "\u9875\u9762" : "Page" : index < 8 ? zh ? "\u6B63\u6587" : "Body" : index < 13 ? zh ? "\u5217\u8868" : "Lists" : zh ? "\u5F15\u7528\u4E0E\u6807\u9898" : "Quotes and headings";
              if (index < 0)
                label2 = zh ? "\u9875\u9762" : "Page";
            } else if (section === "interface")
              label2 = [message("fileNavigation", zh), message("workspace", zh)].includes(name2) ? zh ? "\u5BFC\u822A" : "Navigation" : zh ? "\u663E\u793A" : "Display";
            let card = cards.get(label2);
            if (!card) {
              const sectionEl = group.createEl("section", { cls: "keyline-next-settings-card", attr: { "aria-label": label2 } });
              sectionEl.createEl("h4", { text: label2 });
              card = sectionEl.createDiv({ cls: "keyline-next-settings-items" });
              cards.set(label2, card);
            }
            card.appendChild(child);
          }
          const preview = group.querySelector(".keyline-next-type-preview");
          if (preview)
            group.appendChild(preview);
        }
      }
      if (!panel.children.length)
        panel.createEl("p", { text: message("noResults", zh), attr: { role: "status" } });
      updatePreview();
    };
    renderPanel();
    refreshStatus();
    const win = root.ownerDocument.defaultView;
    const resize = () => root.classList.toggle("is-narrow", root.getBoundingClientRect().width < 640);
    this.resize = new win.ResizeObserver(resize);
    this.resize.observe(root);
    resize();
  }
  hide() {
    var _a, _b, _c;
    this.shown = false;
    (_a = this.resize) == null ? void 0 : _a.disconnect();
    this.resize = void 0;
    (_b = this.unsubscribe) == null ? void 0 : _b.call(this);
    this.unsubscribe = void 0;
    (_c = this.insertModal) == null ? void 0 : _c.close();
    const modal = this.transferModal;
    this.transferModal = void 0;
    modal == null ? void 0 : modal.close();
  }
};

// src/platform/typography.ts
var TypographyController = class {
  constructor(app, preferences) {
    this.app = app;
    this.preferences = preferences;
    this.roots = /* @__PURE__ */ new Map();
  }
  refresh() {
    const current = new Set(this.preferences().typographyEnabled ? this.app.workspace.getLeavesOfType("markdown").map((leaf) => leaf.view.containerEl) : []);
    for (const root of this.roots.keys())
      if (!current.has(root))
        this.release(root);
    const variables = typographyVariables(this.preferences().typography);
    for (const root of current) {
      let owned2 = this.roots.get(root);
      if (!owned2) {
        owned2 = /* @__PURE__ */ new Map();
        this.roots.set(root, owned2);
      }
      root.classList.add("keyline-next-typography");
      if (this.preferences().typography.inset >= 0)
        root.classList.add("keyline-next-custom-inset");
      else
        root.classList.remove("keyline-next-custom-inset");
      for (const [name2, value] of Object.entries(variables)) {
        const old = owned2.get(name2);
        if (!old)
          owned2.set(name2, { before: root.style.getPropertyValue(name2), priority: root.style.getPropertyPriority(name2), written: value });
        else if (root.style.getPropertyValue(name2) !== old.written)
          continue;
        root.style.setProperty(name2, value);
        owned2.get(name2).written = value;
      }
    }
  }
  release(root) {
    var _a;
    for (const [name2, style] of (_a = this.roots.get(root)) != null ? _a : []) {
      if (root.style.getPropertyValue(name2) !== style.written)
        continue;
      if (style.before)
        root.style.setProperty(name2, style.before, style.priority);
      else
        root.style.removeProperty(name2);
    }
    root.classList.remove("keyline-next-typography");
    root.classList.remove("keyline-next-custom-inset");
    this.roots.delete(root);
  }
  dispose() {
    for (const root of this.roots.keys())
      this.release(root);
  }
};

// src/platform/editor-rhythm.ts
var import_state2 = require("@codemirror/state");
var import_view2 = require("@codemirror/view");
var import_obsidian12 = require("obsidian");

// src/domain/structure-presentation.ts
function flatQuoteContainers(tree) {
  const containers = [];
  tree.iterate({ enter({ node }) {
    if (node.name !== "Blockquote")
      return;
    for (let parent = node.parent; parent; parent = parent.parent)
      if (parent.name === "Blockquote")
        return;
    containers.push(node);
  } });
  return containers;
}
function structurePresentation(text2, host) {
  const result = { quotes: [], separators: [] };
  if (text2.length > 2 * 1024 * 1024)
    return result;
  const confirmed = (pattern) => {
    const tokens = host.filter((t2) => pattern.test(t2.name)).sort((a, b) => a.from - b.from);
    return (from, to) => {
      let lo = 0, hi = tokens.length;
      while (lo < hi) {
        const mid = lo + hi >>> 1;
        if (tokens[mid].from <= from)
          lo = mid + 1;
        else
          hi = mid;
      }
      return lo > 0 && tokens[lo - 1].to >= to;
    };
  };
  const quote = confirmed(/(?:^|_)formatting-quote(?:_|$)/u);
  const callout = confirmed(/(?:^|_)hmd-callout(?:_|$)/u);
  const list = confirmed(/(?:^|_)formatting-list(?:_|$)/u);
  const tree = markdownTree(text2);
  tree.iterate({ enter({ node }) {
    var _a, _b;
    if (node.name !== "ListMark" || ((_a = node.parent) == null ? void 0 : _a.name) !== "ListItem" || !list(node.from, node.to))
      return;
    if (!/[ \t]/u.test((_b = text2[node.to]) != null ? _b : ""))
      return;
    const end = text2.indexOf("\n", node.to), rest = text2.slice(node.to, end < 0 ? text2.length : end);
    const task = /^[ \t]+\[[^\]\r\n]\]([ \t])/u.exec(rest);
    const from = task ? node.to + task[0].length - 1 : node.to;
    result.separators.push({ from, to: from + 1, task: !!task });
  } });
  for (const root of flatQuoteContainers(tree)) {
    let at = text2.lastIndexOf("\n", Math.max(0, root.from - 1)) + 1;
    let segment = [], type;
    const finish = () => {
      if (segment.length) {
        segment[0].first = true;
        segment[segment.length - 1].last = true;
      }
      segment = [];
    };
    while (at <= root.to) {
      const newline = text2.indexOf("\n", at), end = Math.min(root.to, newline < 0 ? text2.length : newline);
      const row = text2.slice(at, end).replace(/\r$/u, ""), prefix = /^[ \t]*>[ \t]*/u.exec(row);
      if (!prefix || row[prefix[0].length] === ">") {
        finish();
        type = void 0;
      } else {
        const mark = at + prefix[0].indexOf(">");
        if (!quote(mark, mark + 1)) {
          finish();
          type = void 0;
        } else {
          const spaces = prefix[0].slice(prefix[0].indexOf(">") + 1);
          const markerEnd = spaces.length >= 5 || spaces.includes("	") ? mark + 1 + (spaces[0] === " " ? 1 : 0) : at + prefix[0].length;
          const candidate = /^\[!([\w-]{1,64})\][+-]?[ \t]*/u.exec(text2.slice(markerEnd, end));
          const header = candidate && callout(markerEnd, markerEnd + candidate[0].trim().length) ? candidate : null;
          if (header) {
            finish();
            type = header[1].toLowerCase();
          }
          const line = {
            from: at,
            to: at + row.length,
            marker: { from: mark, to: markerEnd },
            kind: type ? "callout" : "quote",
            type,
            first: false,
            last: false
          };
          if (header) {
            line.header = { from: markerEnd, to: markerEnd + header[0].length };
            line.explicitTitle = !!text2.slice(line.header.to, at + row.length).trim();
          }
          result.quotes.push(line);
          segment.push(line);
        }
      }
      if (newline < 0 || newline >= root.to)
        break;
      at = newline + 1;
    }
    finish();
  }
  return result;
}
var definitions = {
  note: ["Note", "\u4FBF\u7B7E", "pencil", "blue"],
  abstract: ["Abstract", "Abstract", "clipboard-list", "blue"],
  info: ["Info", "\u4FE1\u606F", "info", "blue"],
  todo: ["Todo", "\u5F85\u529E", "check-circle", "blue"],
  tip: ["Tip", "\u63D0\u793A", "flame", "cyan"],
  success: ["Success", "\u6210\u529F", "check", "green"],
  question: ["Question", "\u95EE\u9898", "help-circle", "purple"],
  warning: ["Warning", "\u8B66\u544A", "alert-triangle", "orange"],
  failure: ["Failure", "\u5931\u8D25", "x-circle", "red"],
  danger: ["Danger", "\u5371\u9669", "zap", "red"],
  bug: ["Bug", "\u7F3A\u9677", "bug", "red"],
  example: ["Example", "\u793A\u4F8B", "list", "purple"],
  quote: ["Quote", "\u5F15\u7528", "quote", "gray"]
};
var aliases = {
  summary: "abstract",
  tldr: "abstract",
  hint: "tip",
  important: "tip",
  check: "success",
  done: "success",
  help: "question",
  faq: "question",
  caution: "warning",
  attention: "warning",
  fail: "failure",
  missing: "failure",
  error: "danger",
  cite: "quote"
};
function calloutPresentation(type, zh) {
  var _a, _b, _c;
  const direct = definitions[type], known = direct != null ? direct : definitions[aliases[type]];
  return {
    label: (_a = direct == null ? void 0 : direct[zh ? 1 : 0]) != null ? _a : type.charAt(0).toUpperCase() + type.slice(1),
    icon: (_b = known == null ? void 0 : known[2]) != null ? _b : "pencil",
    tone: (_c = known == null ? void 0 : known[3]) != null ? _c : "blue"
  };
}

// src/domain/editor-rhythm.ts
var MAX_RHYTHM_UNITS = 2 * 1024 * 1024;
function editorRhythm(text2) {
  var _a;
  const result = { lines: [], gaps: [] };
  if (!text2.trim() || text2.length > MAX_RHYTHM_UNITS)
    return result;
  const roots2 = parseBlocks(text2).blocks.filter((block) => block.parent === null);
  let tree;
  const quoteRows = /* @__PURE__ */ new Map();
  if (text2.includes(">")) {
    tree = markdownTree(text2);
    for (const container of flatQuoteContainers(tree)) {
      let at2 = text2.lastIndexOf("\n", Math.max(0, container.from - 1)) + 1;
      let start = at2, callout = false;
      while (at2 <= container.to) {
        const newline = text2.indexOf("\n", at2), end = Math.min(container.to, newline < 0 ? text2.length : newline);
        const row = text2.slice(at2, end), prefix = /^[ \t]*>[ \t]*/u.exec(row);
        if (!prefix || row[prefix[0].length] === ">") {
          if (prefix)
            quoteRows.set(at2, {});
          start = newline + 1;
          callout = false;
        } else {
          const mark = prefix[0].indexOf(">"), spaces = prefix[0].slice(mark + 1);
          const body = spaces.length >= 5 || spaces.includes("	") ? mark + 1 + (spaces[0] === " " ? 1 : 0) : prefix[0].length;
          if (/^\[![\w-]{1,64}\][+-]?/u.test(row.slice(body))) {
            let opaque3 = false;
            for (let node = tree.resolveInner(at2 + body, 1); node.parent; node = node.parent)
              if (/^(?:FencedCode|CodeBlock|HTMLBlock)$/u.test(node.name)) {
                opaque3 = true;
                break;
              }
            if (!opaque3) {
              start = at2;
              callout = true;
            }
          }
          quoteRows.set(at2, { kind: callout ? "callout" : "quote", root: `quote:${container.from}:${start}` });
        }
        if (newline < 0 || newline >= container.to)
          break;
        at2 = newline + 1;
      }
    }
  }
  const rows2 = [];
  let index = 0, at = 0;
  for (const line of text2.split("\n")) {
    while (index < roots2.length && roots2[index].to < at)
      index++;
    const root = roots2[index];
    const inside = root && root.from <= at && at <= root.to;
    let kind2 = inside ? root.kind : /^\s*$/u.test(line) ? "paragraph" : void 0;
    if (kind2 === "list" && /^\s*$/u.test(line)) {
      tree != null ? tree : tree = markdownTree(text2);
      let opaque3 = false;
      for (let node = tree.resolveInner(at, 1); node.parent; node = node.parent)
        if (/^(?:FencedCode|CodeBlock|HTMLBlock|Keyline(?:Inline)?(?:Math|Comment))$/u.test(node.name)) {
          opaque3 = true;
          break;
        }
      if (!opaque3)
        kind2 = "paragraph";
    }
    if (inside && ["list", "quote", "callout"].includes(root.kind) && /^\S/u.test(line) && !line.startsWith(">")) {
      tree != null ? tree : tree = markdownTree(text2);
      for (let node = tree.resolveInner(at, 1); node.parent; node = node.parent) {
        if (/^(?:FencedCode|CodeBlock|HTMLBlock|Keyline(?:Inline)?(?:Math|Comment))$/u.test(node.name))
          break;
        if (node.name === "Paragraph" || node.name === "Task") {
          kind2 = "paragraph";
          break;
        }
      }
    }
    const quoted = quoteRows.get(at);
    if (quoted)
      kind2 = quoted.kind;
    rows2.push({ at, kind: kind2, root: quoted ? quoted.root : inside ? root.id : void 0 });
    if (kind2 === "paragraph" || kind2 === "heading")
      result.lines.push({ at, role: kind2 });
    at += line.length + 1;
  }
  const edge = (row) => {
    var _a2;
    return (row == null ? void 0 : row.kind) === "heading" ? "heading" : row && ["paragraph", "quote", "callout"].includes((_a2 = row.kind) != null ? _a2 : "") ? "paragraph" : void 0;
  };
  for (let i = 0; i <= rows2.length; i++) {
    const previous = rows2[i - 1], next = rows2[i];
    const gap = { at: (_a = next == null ? void 0 : next.at) != null ? _a : text2.length, side: next ? -1 : 1 };
    if ((previous == null ? void 0 : previous.kind) === "paragraph" && (next == null ? void 0 : next.kind) === "paragraph")
      gap.direct = "paragraph";
    else if ((previous == null ? void 0 : previous.root) && previous.root === (next == null ? void 0 : next.root) && previous.kind === next.kind) {
      if (previous.kind === "quote")
        gap.direct = "quote";
      else
        continue;
    } else {
      gap.before = edge(next);
      gap.after = edge(previous);
    }
    if (gap.direct || gap.before || gap.after)
      result.gaps.push(gap);
  }
  return result;
}

// src/platform/editor-rhythm.ts
var measureRhythm = import_state2.StateEffect.define();
var RhythmWidget = class extends import_view2.WidgetType {
  constructor(gap, preview) {
    super();
    this.gap = gap;
    this.preview = preview;
  }
  eq(other) {
    return this.preview === other.preview && this.gap.before === other.gap.before && this.gap.after === other.gap.after && this.gap.direct === other.gap.direct;
  }
  toDOM(view) {
    const element = view.dom.ownerDocument.createElement("div");
    element.className = "keyline-next-rhythm-gap";
    element.setAttribute("aria-hidden", "true");
    const token = (role, side) => role ? `var(--keyline-next-${role}${side}, 0px)` : "0px";
    element.style.height = this.gap.direct === "paragraph" ? token("paragraph", "Gap") : this.gap.direct === "quote" ? this.preview ? "var(--ncl-quote-line-gap, 10px)" : "0px" : `max(${token(this.gap.before, "Before")}, ${token(this.gap.after, "After")})`;
    return element;
  }
  ignoreEvent() {
    return true;
  }
};
var EditorRhythmController = class {
  constructor(preferences) {
    this.preferences = preferences;
    this.views = /* @__PURE__ */ new Map();
    this.active = true;
  }
  extension() {
    const owner = this;
    const build = (state) => {
      var _a;
      if (!owner.active || !owner.preferences().typographyEnabled || !((_a = state.field(import_obsidian12.editorInfoField, false)) == null ? void 0 : _a.file) || state.doc.length > MAX_RHYTHM_UNITS)
        return import_view2.Decoration.none;
      const plan = editorRhythm(state.doc.toString());
      const preview = !!state.field(import_obsidian12.editorLivePreviewField, false);
      return import_view2.Decoration.set([
        ...plan.lines.map((line) => import_view2.Decoration.line({ class: `keyline-next-rhythm-${line.role}` }).range(line.at)),
        ...plan.gaps.map((gap) => import_view2.Decoration.widget({ widget: new RhythmWidget(gap, preview), block: true, side: gap.side }).range(gap.at))
      ], true);
    };
    const field = import_state2.StateField.define({
      create: build,
      update(value, transaction) {
        var _a, _b;
        return transaction.docChanged || transaction.effects.some((effect) => effect.is(measureRhythm)) || ((_a = transaction.startState.field(import_obsidian12.editorInfoField, false)) == null ? void 0 : _a.file) !== ((_b = transaction.state.field(import_obsidian12.editorInfoField, false)) == null ? void 0 : _b.file) || transaction.startState.field(import_obsidian12.editorLivePreviewField, false) !== transaction.state.field(import_obsidian12.editorLivePreviewField, false) ? build(transaction.state) : value;
      },
      provide: (field2) => import_view2.EditorView.decorations.from(field2)
    });
    return [field, import_view2.ViewPlugin.define((view) => {
      let document2 = view.dom.ownerDocument;
      owner.views.set(view, null);
      return {
        update() {
          if (document2 !== view.dom.ownerDocument) {
            document2 = view.dom.ownerDocument;
            owner.schedule(view);
          }
        },
        destroy() {
          owner.detach(view);
        }
      };
    })];
  }
  detach(view) {
    const frame = this.views.get(view);
    if (frame)
      frame.window.cancelAnimationFrame(frame.id);
    this.views.delete(view);
  }
  refresh() {
    if (!this.active)
      return;
    for (const view of this.views.keys())
      this.schedule(view);
  }
  schedule(view) {
    if (!this.active || !this.views.has(view))
      return;
    const document2 = view.dom.ownerDocument, win = document2.defaultView, pending = this.views.get(view);
    if ((pending == null ? void 0 : pending.document) === document2)
      return;
    if (pending)
      pending.window.cancelAnimationFrame(pending.id);
    this.views.set(view, null);
    if (!win)
      return;
    const frame = { document: document2, window: win, id: 0 };
    this.views.set(view, frame);
    frame.id = win.requestAnimationFrame(() => {
      if (!this.active || this.views.get(view) !== frame)
        return;
      this.views.set(view, null);
      if (view.dom.ownerDocument !== document2) {
        this.schedule(view);
        return;
      }
      view.dispatch({ effects: measureRhythm.of(null) });
      view.requestMeasure();
    });
  }
  dispose() {
    this.active = false;
    for (const view of this.views.keys())
      this.detach(view);
  }
};

// src/platform/selection-toolbar.ts
var import_view3 = require("@codemirror/view");
var import_obsidian13 = require("obsidian");

// src/platform/native-selection.ts
function annotationProvider(app) {
  var _a, _b;
  try {
    const value = (_b = (_a = app.plugins) == null ? void 0 : _a.plugins) == null ? void 0 : _b["keyline-marginalia"];
    return (value == null ? void 0 : value.apiVersion) === 1 && value.active === true && typeof value.availability === "function" && typeof value.insertFromView === "function" ? value : null;
  } catch (e) {
    return null;
  }
}
function annotationStatus(app, view) {
  const provider = annotationProvider(app);
  if (!provider)
    return { provider: null, reason: null, error: false };
  try {
    const reason = provider.availability(view);
    if (reason === null || typeof reason === "string" && reason.trim())
      return { provider, reason, error: false };
  } catch (e) {
  }
  return { provider: null, reason: null, error: true };
}
function insertAnnotation(app, view, kind2, valid) {
  if (!valid())
    return { status: "stale" };
  const state = annotationStatus(app, view);
  if (state.error)
    return { status: "failed" };
  if (!state.provider || state.reason)
    return { status: "unavailable", ...state.reason ? { reason: state.reason } : {} };
  if (!valid() || annotationProvider(app) !== state.provider)
    return { status: "stale" };
  try {
    return { status: state.provider.insertFromView(view, kind2) === true ? "inserted" : "failed" };
  } catch (e) {
    return { status: "failed" };
  }
}
var nativeSelectionCommands = {
  bold: "editor:toggle-bold",
  italic: "editor:toggle-italics",
  strike: "editor:toggle-strikethrough",
  code: "editor:toggle-code",
  link: "editor:insert-link",
  highlight: "editor:toggle-highlight"
};
function nativeSelectionAction(app, editor, action, valid) {
  var _a;
  const api = app.commands;
  if (!valid() || !(api == null ? void 0 : api.executeCommandById))
    return false;
  editor.focus();
  if (!valid() || ((_a = app.workspace.activeEditor) == null ? void 0 : _a.editor) !== editor)
    return false;
  try {
    return api.executeCommandById(nativeSelectionCommands[action]);
  } catch (e) {
    return false;
  }
}
function selectionBlockLabel(line, zh) {
  const s = line, heading2 = /^(#{1,6})\s/u.exec(s);
  if (heading2)
    return `${zh ? "\u6807\u9898" : "Heading"} ${heading2[1].length}`;
  if (/^[-*+]\s+\[[ xX]\](?:\s|$)/u.test(s))
    return zh ? "\u5F85\u529E" : "Task";
  if (/^[-*+]\s/u.test(s))
    return zh ? "\u9879\u76EE\u7B26\u53F7\u5217\u8868" : "Bullet list";
  if (/^\d+[.)]\s/u.test(s))
    return zh ? "\u7F16\u53F7\u5217\u8868" : "Numbered list";
  if (/^>\s*\[!/u.test(s))
    return "Callout";
  if (/^>/u.test(s))
    return zh ? "\u5F15\u7528" : "Quote";
  if (/^(?:```|~~~)/u.test(s))
    return zh ? "\u4EE3\u7801\u5757" : "Code block";
  if (/^\$\$/u.test(s))
    return zh ? "\u516C\u5F0F\u5757" : "Math block";
  return zh ? "\u6B63\u6587" : "Text";
}

// src/platform/selection-toolbar.ts
var ToolbarController = class {
  constructor(app, preferences, zh, rich) {
    this.app = app;
    this.preferences = preferences;
    this.zh = zh;
    this.rich = rich;
    this.instances = /* @__PURE__ */ new Set();
  }
  extension() {
    const owner = this;
    return import_view3.ViewPlugin.define((view) => {
      const instance = new SelectionToolbar(view, owner);
      owner.instances.add(instance);
      return instance;
    }, { eventHandlers: {
      pointerdown(event) {
        this.pointer = !this.foreignInput(event.target);
        this.armed = false;
        this.hide();
      },
      keydown(event) {
        if (this.foreignInput(event.target)) {
          this.armed = false;
          this.hide();
          return false;
        }
        if (event.key === "Escape") {
          this.armed = false;
          this.hide();
          return false;
        }
        if (event.shiftKey || event.key.toLowerCase() === "a" && (event.metaKey || event.ctrlKey))
          this.armed = true;
        return false;
      },
      contextmenu() {
        this.armed = false;
        this.hide();
      }
    } });
  }
  refresh() {
    for (const instance of this.instances)
      instance.refresh();
  }
  focus(editor) {
    for (const instance of this.instances)
      if (instance.editor === editor) {
        instance.armed = true;
        instance.focusRequested = true;
        instance.schedule();
        return true;
      }
    return false;
  }
  remove(instance) {
    this.instances.delete(instance);
  }
  dispose() {
    for (const instance of [...this.instances])
      instance.destroy();
    this.instances.clear();
  }
};
var SelectionToolbar = class {
  constructor(view, owner) {
    this.view = view;
    this.owner = owner;
    this.pointer = false;
    this.armed = false;
    this.focusRequested = false;
    this.snapshot = { from: -1, to: -1, text: "", document: "" };
    this.shown = false;
    this.disposed = false;
    this.formatting = false;
    this.resumeAfterBlur = false;
    this.annotationChanged = () => this.refresh();
    this.windowBlur = () => {
      this.resumeAfterBlur = this.resumeAfterBlur || this.armed && this.shown;
      this.armed = false;
      this.pointer = false;
      this.hide();
    };
    this.windowFocus = () => this.schedule();
    var _a, _b, _c;
    const doc = view.dom.ownerDocument;
    this.boundDocument = doc;
    this.root = doc.createElement("div");
    this.root.className = "keyline-next-toolbar";
    this.root.setAttribute("role", "toolbar");
    this.root.setAttribute("aria-label", message("format", owner.zh()));
    this.root.hidden = true;
    doc.body.append(this.root);
    this.selectionKey = (event) => {
      if (this.foreignInput(event.target))
        return;
      if (event.key === "Escape") {
        this.resumeAfterBlur = false;
        this.armed = false;
        this.hide();
        return;
      }
      if (event.shiftKey || event.key.toLowerCase() === "a" && (event.metaKey || event.ctrlKey))
        this.armed = true;
    };
    view.dom.addEventListener("keydown", this.selectionKey, true);
    this.calloutPointer = (event) => {
      const target = event.target;
      if (event.button !== 0 || !(target == null ? void 0 : target.closest(".cm-callout > .embed-actions > .edit-block-button")) || this.foreignInput(target))
        return;
      this.pointer = true;
      this.armed = false;
      this.hide();
    };
    view.dom.addEventListener("pointerdown", this.calloutPointer, true);
    (_a = doc.defaultView) == null ? void 0 : _a.addEventListener("keyline-marginalia-settings", this.annotationChanged);
    (_b = doc.defaultView) == null ? void 0 : _b.addEventListener("blur", this.windowBlur);
    (_c = doc.defaultView) == null ? void 0 : _c.addEventListener("focus", this.windowFocus);
    this.root.addEventListener("mousedown", (e) => e.preventDefault());
    this.root.addEventListener("keydown", (e) => {
      var _a2, _b2;
      const buttons = Array.from(this.root.querySelectorAll("button:not([disabled])"));
      const index = buttons.indexOf(this.root.ownerDocument.activeElement);
      if (e.key === "Escape") {
        this.resumeAfterBlur = false;
        this.armed = false;
        this.hide();
        view.focus();
        e.preventDefault();
        e.stopPropagation();
      }
      if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
        const next = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : (index + (e.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length;
        (_a2 = buttons[next]) == null ? void 0 : _a2.focus();
        (_b2 = buttons[next]) == null ? void 0 : _b2.scrollIntoView({ block: "nearest", inline: "nearest" });
        e.preventDefault();
        e.stopPropagation();
      }
      if ((e.key === "Enter" || e.key === " ") && index >= 0) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat)
          buttons[index].click();
      }
    });
    this.releasePointer = () => {
      if (!this.pointer)
        return;
      this.pointer = false;
      this.armed = !this.foreignInput(this.root.ownerDocument.activeElement);
      this.schedule();
    };
    doc.addEventListener("pointerup", this.releasePointer);
    this.focusChanged = (event) => {
      if (this.root.contains(event.target))
        return;
      if (!this.view.contentDOM.contains(event.target) || this.foreignInput(event.target)) {
        this.resumeAfterBlur = false;
        this.armed = false;
        this.pointer = false;
        this.hide();
      }
    };
    doc.addEventListener("focusin", this.focusChanged);
  }
  get editor() {
    var _a;
    return (_a = this.view.state.field(import_obsidian13.editorInfoField, false)) == null ? void 0 : _a.editor;
  }
  /** Obsidian can move the existing CodeMirror view between native windows
   * without destroying it. The toolbar and document listeners must follow. */
  syncDocument() {
    var _a, _b, _c, _d, _e, _f;
    const doc = this.view.dom.ownerDocument, previous = this.boundDocument;
    if (doc === previous)
      return;
    previous.removeEventListener("pointerup", this.releasePointer);
    previous.removeEventListener("focusin", this.focusChanged);
    (_a = previous.defaultView) == null ? void 0 : _a.removeEventListener("keyline-marginalia-settings", this.annotationChanged);
    (_b = previous.defaultView) == null ? void 0 : _b.removeEventListener("blur", this.windowBlur);
    (_c = previous.defaultView) == null ? void 0 : _c.removeEventListener("focus", this.windowFocus);
    this.boundDocument = doc;
    this.resumeAfterBlur = false;
    this.armed = false;
    this.pointer = false;
    this.hide();
    doc.body.append(this.root);
    doc.addEventListener("pointerup", this.releasePointer);
    doc.addEventListener("focusin", this.focusChanged);
    (_d = doc.defaultView) == null ? void 0 : _d.addEventListener("keyline-marginalia-settings", this.annotationChanged);
    (_e = doc.defaultView) == null ? void 0 : _e.addEventListener("blur", this.windowBlur);
    (_f = doc.defaultView) == null ? void 0 : _f.addEventListener("focus", this.windowFocus);
  }
  foreignInput(target) {
    const input = target == null ? void 0 : target.closest("input,textarea,select,[contenteditable=true]");
    return !!input && input !== this.view.contentDOM;
  }
  update(update) {
    if (update.docChanged && !this.formatting) {
      this.armed = this.view.hasFocus && update.transactions.some((t2) => t2.isUserEvent("undo") || t2.isUserEvent("redo"));
    }
    if (update.selectionSet || update.docChanged || update.focusChanged || update.viewportChanged || update.geometryChanged)
      this.schedule();
  }
  refresh() {
    var _a;
    const buttons = Array.from(this.root.querySelectorAll("button"));
    const index = buttons.indexOf(this.root.ownerDocument.activeElement);
    if (this.shown) {
      this.render();
      if (index >= 0)
        (_a = this.root.querySelectorAll("button")[index]) == null ? void 0 : _a.focus();
    }
    this.root.setAttribute("aria-label", message("format", this.owner.zh()));
    this.schedule();
  }
  eligible() {
    var _a;
    const state = this.view.state, selected = state.selection.main, editor = this.editor;
    const active = this.view.dom.ownerDocument.activeElement;
    if (this.disposed || !editor || !this.view.dom.ownerDocument.hasFocus() || !this.owner.preferences().toolbar || !this.armed || this.pointer || this.view.composing || state.readOnly || state.doc.length > 2 * 1024 * 1024 || this.foreignInput(active))
      return false;
    if (!this.view.hasFocus && !this.root.contains(active) && !this.focusRequested)
      return false;
    if (state.selection.ranges.length !== 1 || selected.empty || selected.to - selected.from > 16e3 || !state.sliceDoc(selected.from, selected.to).trim() || inProtectedSyntax(state.doc.toString(), selected.from, selected.to, true))
      return false;
    return Boolean((_a = state.field(import_obsidian13.editorInfoField, false)) == null ? void 0 : _a.file);
  }
  schedule() {
    if (this.disposed)
      return;
    this.syncDocument();
    this.view.requestMeasure({
      key: this,
      read: () => {
        if (this.resumeAfterBlur && this.view.hasFocus && this.valid()) {
          this.resumeAfterBlur = false;
          this.armed = true;
        }
        if (!this.eligible())
          return null;
        const selected = this.view.state.selection.main;
        const a = this.view.coordsAtPos(selected.from), b = this.view.coordsAtPos(selected.to);
        const area = this.view.scrollDOM.getBoundingClientRect();
        if (!a || !b || b.bottom < area.top || a.top > area.bottom)
          return null;
        return { left: Math.max(area.left + 4, a.left), top: a.top, bottom: b.bottom };
      },
      write: (bounds) => {
        var _a;
        if (!bounds || !this.eligible()) {
          this.hide();
          return;
        }
        const selected = this.view.state.selection.main;
        const text2 = this.view.state.sliceDoc(selected.from, selected.to);
        const changed = text2 !== this.snapshot.text || this.snapshot.document !== this.view.state.doc.toString() || selected.from !== this.snapshot.from || selected.to !== this.snapshot.to;
        this.snapshot = { from: selected.from, to: selected.to, text: text2, document: this.view.state.doc.toString() };
        if (!this.shown || changed)
          this.render();
        const win = this.root.ownerDocument.defaultView;
        this.root.hidden = false;
        this.root.style.maxWidth = `${Math.max(100, win.innerWidth - 16)}px`;
        this.root.style.left = `${Math.max(8, Math.min(bounds.left, win.innerWidth - this.root.offsetWidth - 8))}px`;
        const height = this.root.offsetHeight;
        this.root.style.top = `${bounds.top >= height + 14 ? bounds.top - height - 6 : Math.min(bounds.bottom + 6, win.innerHeight - height - 8)}px`;
        this.shown = true;
        if (this.focusRequested) {
          (_a = this.root.querySelector("button:not([disabled])")) == null ? void 0 : _a.focus();
          this.focusRequested = false;
        }
      }
    });
  }
  valid() {
    const selected = this.view.state.selection.main, saved = this.snapshot;
    return !this.disposed && this.boundDocument.hasFocus() && this.owner.preferences().toolbar && !this.view.state.readOnly && this.boundDocument === this.view.dom.ownerDocument && this.view.state.selection.ranges.length === 1 && selected.from === saved.from && selected.to === saved.to && this.view.state.doc.toString() === saved.document && !this.view.composing;
  }
  render() {
    var _a;
    this.root.replaceChildren();
    for (const [key, icon] of [
      ["blockType", "chevron-down"],
      ["bold", "bold"],
      ["italic", "italic"],
      ["strike", "strikethrough"],
      ["code", "code"],
      ["link", "link"],
      ["highlight", "highlighter"],
      ["sidenote", "text-quote"],
      ["marginnote", "panel-right"],
      ["colors", "palette"],
      ["moreBlocks", "ellipsis"]
    ]) {
      if (["bold", "sidenote", "colors"].includes(key)) {
        const separator = this.root.ownerDocument.createElement("span");
        separator.className = "keyline-next-toolbar-separator";
        separator.setAttribute("aria-hidden", "true");
        this.root.append(separator);
      }
      const button = this.root.ownerDocument.createElement("button");
      button.type = "button";
      button.className = "clickable-icon";
      const label2 = message(key, this.owner.zh());
      button.setAttribute("aria-label", label2);
      button.dataset.action = key;
      if (key === "sidenote" || key === "marginnote") {
        const status = annotationStatus(this.owner.app, this.view);
        const reason = (_a = status.reason) != null ? _a : status.error ? message("annotationFailed", this.owner.zh()) : status.provider ? null : message("annotationUnavailable", this.owner.zh());
        button.disabled = !!reason;
        if (reason)
          button.title = reason;
      }
      if (this.owner.preferences().hints && !button.title)
        button.title = label2;
      if (key === "blockType") {
        button.classList.add("keyline-next-toolbar-type");
        const text2 = button.ownerDocument.createElement("span");
        text2.className = "keyline-next-toolbar-label";
        text2.textContent = selectionBlockLabel(this.view.state.doc.lineAt(this.snapshot.from).text, this.owner.zh());
        button.append(text2);
        const chevron = button.ownerDocument.createElement("span");
        (0, import_obsidian13.setIcon)(chevron, icon);
        button.append(chevron);
      } else
        (0, import_obsidian13.setIcon)(button, icon);
      this.root.append(button);
      button.addEventListener("click", () => {
        var _a2, _b;
        if (!this.valid() || !this.editor) {
          this.hide();
          return;
        }
        const editor = this.editor;
        const file = (_a2 = this.view.state.field(import_obsidian13.editorInfoField, false)) == null ? void 0 : _a2.file;
        const context = file && this.owner.rich.capture(editor, file, () => !this.disposed && !this.view.composing && !this.view.state.readOnly);
        const bounds = button.getBoundingClientRect(), point = { x: bounds.left, y: bounds.bottom };
        if (key === "sidenote" || key === "marginnote") {
          this.armed = false;
          this.hide();
          const result = insertAnnotation(this.owner.app, this.view, key, () => this.valid());
          if (result.status === "failed")
            new import_obsidian13.Notice(message("annotationFailed", this.owner.zh()));
          else if (result.status === "unavailable")
            new import_obsidian13.Notice((_b = result.reason) != null ? _b : message("annotationUnavailable", this.owner.zh()));
          return;
        }
        if (key in nativeSelectionCommands) {
          this.formatting = true;
          try {
            if (!nativeSelectionAction(this.owner.app, editor, key, () => this.valid())) {
              new import_obsidian13.Notice(message("commandUnavailable", this.owner.zh()));
            }
          } finally {
            this.formatting = false;
          }
          this.armed = !this.view.state.selection.main.empty;
          this.schedule();
          return;
        }
        this.armed = false;
        this.hide();
        this.view.focus();
        if (context)
          this.owner.rich.selectionMenu(context, point, this.root.ownerDocument, key === "colors" ? "color" : "main", (resume) => {
            if (!this.disposed) {
              this.armed = resume;
              this.schedule();
            }
          });
      });
    }
  }
  hide() {
    this.root.hidden = true;
    this.shown = false;
    this.focusRequested = false;
  }
  destroy() {
    var _a, _b, _c;
    this.disposed = true;
    this.boundDocument.removeEventListener("pointerup", this.releasePointer);
    this.boundDocument.removeEventListener("focusin", this.focusChanged);
    this.view.dom.removeEventListener("keydown", this.selectionKey, true);
    this.view.dom.removeEventListener("pointerdown", this.calloutPointer, true);
    (_a = this.boundDocument.defaultView) == null ? void 0 : _a.removeEventListener("keyline-marginalia-settings", this.annotationChanged);
    (_b = this.boundDocument.defaultView) == null ? void 0 : _b.removeEventListener("blur", this.windowBlur);
    (_c = this.boundDocument.defaultView) == null ? void 0 : _c.removeEventListener("focus", this.windowFocus);
    this.root.remove();
    this.owner.remove(this);
  }
};

// src/platform/workspaces.ts
var import_obsidian14 = require("obsidian");

// src/platform/workspace-state.ts
var WorkspaceFailure = class extends Error {
  constructor(problem) {
    super(problem);
    this.problem = problem;
  }
};
var fail = (problem) => {
  throw new WorkspaceFailure(problem);
};
var object2 = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var own2 = (v, key) => Object.prototype.hasOwnProperty.call(v, key);
function validWorkspaceName(name2) {
  name2 = name2.trim();
  return !!name2.trim() && name2.length <= 80 && !/[\x00-\x1f\x7f]/u.test(name2) && name2 !== "prototype" && !Object.getOwnPropertyNames(Object.prototype).includes(name2.trim());
}
function copy(value) {
  return JSON.parse(JSON.stringify(value));
}
function workspaceLayout(value) {
  if (!object2(value) || !object2(value.main))
    return fail("invalid");
  return copy(value);
}
function scene(value) {
  const result = workspaceLayout(value);
  delete result.mtime;
  const visit2 = (node) => {
    if (!object2(node))
      return;
    if (node.type === "leaf") {
      if (object2(node.state)) {
        delete node.state.icon;
        delete node.state.title;
      }
      return;
    }
    if (Array.isArray(node.children))
      node.children.forEach(visit2);
  };
  for (const key of ["main", "left", "right", "floating"])
    visit2(result[key]);
  return result;
}
var sameScene = (actual, target) => equalJson(scene(actual), scene(target));
function validRecovery(value) {
  return object2(value) && value.schema === 1 && typeof value.active === "string" && typeof value.at === "string" && Number.isFinite(Date.parse(value.at)) && object2(value.layout) && object2(value.layout.main);
}
function journal(value) {
  return object2(value) && value.schema === 2 && Number.isSafeInteger(value.sequence) && value.sequence > 0 && validRecovery({ ...value, schema: 1 });
}
var WorkspaceJournal = class {
  constructor(disk, directory) {
    this.disk = disk;
    this.directory = directory;
    this.paths = [0, 1].map((n) => `${directory}/workspace-recovery.${n}.json`);
  }
  async slots() {
    return Promise.all(this.paths.map(async (path) => {
      if (!await this.disk.exists(path))
        return { path, text: null, value: null, future: false };
      const text2 = await this.disk.read(path);
      let parsed2;
      try {
        parsed2 = JSON.parse(text2);
      } catch (e) {
        parsed2 = null;
      }
      return { path, text: text2, value: journal(parsed2) ? parsed2 : null, future: object2(parsed2) && parsed2.schema !== 2 };
    }));
  }
  async read() {
    const slots = await this.slots();
    const values = slots.map((s) => s.value).filter((s) => s !== null).sort((a, b) => b.sequence - a.sequence);
    if (values.length)
      return copy(values[0]);
    if (slots.some((s) => s.text !== null))
      return fail("recovery");
    const legacy = `${this.directory}/workspace-recovery.json`;
    if (!await this.disk.exists(legacy))
      return null;
    const value = JSON.parse(await this.disk.read(legacy));
    if (!validRecovery(value))
      return fail("recovery");
    return value;
  }
  async write(snapshot, valid) {
    var _a, _b, _c, _d;
    const slots = await this.slots();
    valid();
    const good = slots.filter((s) => s.value).sort((a, b) => b.value.sequence - a.value.sequence);
    if (!good.length && slots.some((s) => s.text !== null))
      return fail("recovery");
    const target = (_a = slots.find((s) => !s.value && !s.future)) != null ? _a : good.length === 2 ? good[1] : void 0;
    if (!target)
      return fail("recovery");
    const sequence = ((_d = (_c = (_b = good[0]) == null ? void 0 : _b.value) == null ? void 0 : _c.sequence) != null ? _d : 0) + 1;
    if (!Number.isSafeInteger(sequence))
      return fail("recovery");
    const text2 = JSON.stringify({ ...snapshot, schema: 2, sequence });
    const now = await this.disk.exists(target.path) ? await this.disk.read(target.path) : null;
    valid();
    if (now !== target.text)
      return fail("stale");
    await this.disk.write(target.path, text2);
    if (await this.disk.read(target.path) !== text2)
      return fail("recovery");
    valid();
  }
};
var WorkspaceActions = class {
  constructor(port, recovery) {
    this.port = port;
    this.recovery = recovery;
    this.busy = false;
    this.live = true;
  }
  core() {
    if (!this.live || !this.port.allowed())
      return fail("stale");
    if (this.port.conflict())
      return fail("conflict");
    const c = this.port.core();
    if (!c)
      return fail("unavailable");
    return c;
  }
  stop() {
    this.live = false;
  }
  async operation(action) {
    if (this.busy)
      return fail("busy");
    const c = this.core();
    this.busy = true;
    try {
      await action(c);
    } finally {
      this.busy = false;
    }
  }
  same(c) {
    if (this.core() !== c)
      fail("stale");
  }
  snapshot(c) {
    return { schema: 1, layout: workspaceLayout(this.port.current()), active: c.activeWorkspace || "", at: new Date().toISOString() };
  }
  unchanged(c, before) {
    this.same(c);
    if (c.activeWorkspace !== before.active || !equalJson(workspaceLayout(this.port.current()), before.layout))
      fail("stale");
  }
  async persist(c) {
    const expected = copy({ workspaces: c.workspaces, active: c.activeWorkspace });
    await c.saveData();
    const actual = await this.port.readSaved();
    this.same(c);
    if (!object2(actual) || !equalJson(actual.workspaces, expected.workspaces) || actual.active !== expected.active || !equalJson(copy(c.workspaces), expected.workspaces) || c.activeWorkspace !== expected.active)
      fail("failed");
  }
  async switchTo(name2) {
    return this.operation(async (c) => {
      if (!own2(c.workspaces, name2))
        return fail("missing");
      const selected = c.workspaces[name2], target = workspaceLayout(selected), before = this.snapshot(c);
      const valid = () => {
        this.unchanged(c, before);
        if (!own2(c.workspaces, name2) || c.workspaces[name2] !== selected || !equalJson(workspaceLayout(selected), target))
          fail("stale");
      };
      await this.recovery.write(before, valid);
      await this.apply(c, target, name2, before);
    });
  }
  async restore() {
    return this.operation(async (c) => {
      const before = this.snapshot(c), saved = await this.recovery.read();
      this.unchanged(c, before);
      if (!saved)
        return fail("missing");
      await this.recovery.write(before, () => this.unchanged(c, before));
      await this.apply(c, workspaceLayout(saved.layout), own2(c.workspaces, saved.active) ? saved.active : "", before);
    });
  }
  async apply(c, target, name2, before) {
    await this.port.apply(copy(target));
    this.same(c);
    const applied = workspaceLayout(this.port.current());
    if (!sameScene(applied, target) || c.activeWorkspace !== before.active)
      return fail("stale");
    c.activeWorkspace = name2;
    try {
      await this.persist(c);
    } catch (error) {
      this.same(c);
      if (c.activeWorkspace === name2 && equalJson(workspaceLayout(this.port.current()), applied)) {
        await this.port.apply(copy(before.layout));
        this.same(c);
        if (sameScene(workspaceLayout(this.port.current()), before.layout) && c.activeWorkspace === name2) {
          c.activeWorkspace = before.active;
          await this.persist(c);
        }
      }
      throw error;
    }
  }
  async save(name2, overwrite) {
    return this.operation(async (c) => {
      name2 = name2.trim();
      if (!validWorkspaceName(name2))
        return fail("invalid");
      const exists = own2(c.workspaces, name2), previous = c.workspaces[name2], active = c.activeWorkspace;
      if (exists && !overwrite)
        return fail("duplicate");
      if (overwrite && (!exists || name2 !== active))
        return fail("stale");
      const next = workspaceLayout(this.port.current());
      next.mtime = new Date().toISOString();
      const intended = copy(next);
      c.workspaces[name2] = next;
      c.activeWorkspace = name2;
      try {
        await this.persist(c);
      } catch (error) {
        if (this.live && this.port.allowed() && this.port.core() === c && c.workspaces[name2] === next && equalJson(next, intended)) {
          if (exists)
            c.workspaces[name2] = previous;
          else
            delete c.workspaces[name2];
          if (c.activeWorkspace === name2)
            c.activeWorkspace = active;
        }
        throw error;
      }
    });
  }
  async manage() {
    return this.operation(async (c) => {
      if (typeof c.onOpenModal !== "function")
        return fail("unavailable");
      const before = this.snapshot(c);
      await this.recovery.write(before, () => this.unchanged(c, before));
      c.onOpenModal();
    });
  }
};

// src/platform/workspaces.ts
function core(app) {
  var _a, _b, _c;
  const api = app;
  const p = (_b = (_a = api.internalPlugins) == null ? void 0 : _a.getPluginById) == null ? void 0 : _b.call(_a, "workspaces"), i = p == null ? void 0 : p.instance;
  return (p == null ? void 0 : p.enabled) && p._loaded !== false && ((_c = i == null ? void 0 : i.plugin) == null ? void 0 : _c._loaded) !== false && (i == null ? void 0 : i.workspaces) && typeof i.workspaces === "object" && !Array.isArray(i.workspaces) && typeof i.activeWorkspace === "string" && typeof i.saveData === "function" ? i : null;
}
var labels = {
  unavailable: ["Enable Workspaces in Settings \u2192 Core plugins.", "\u8BF7\u5728\u300C\u8BBE\u7F6E \u2192 \u6838\u5FC3\u63D2\u4EF6\u300D\u4E2D\u5F00\u542F\u300C\u5DE5\u4F5C\u533A\u300D\u3002"],
  conflict: ["Disable Workspaces Plus / Workspace++ before managing layouts here. Keep your saved layouts.", "\u8BF7\u5148\u505C\u7528 Workspaces Plus / Workspace++\uFF0C\u907F\u514D\u4E24\u5957\u5E03\u5C40\u7BA1\u7406\u540C\u65F6\u63A5\u7BA1\u3002\u539F\u5E03\u5C40\u65E0\u9700\u5220\u9664\u3002"],
  busy: ["A layout operation is in progress. Please wait.", "\u5E03\u5C40\u64CD\u4F5C\u8FDB\u884C\u4E2D\uFF0C\u8BF7\u7A0D\u5019\u3002"],
  stale: ["The workspace changed. Please choose the action again.", "\u5DE5\u4F5C\u533A\u72B6\u6001\u5DF2\u53D8\u5316\uFF0C\u8BF7\u91CD\u65B0\u64CD\u4F5C\u3002"],
  invalid: ["Enter a valid layout name (up to 80 characters).", "\u8BF7\u8F93\u5165\u6709\u6548\u5E03\u5C40\u540D\u79F0\uFF08\u6700\u591A 80 \u4E2A\u5B57\u7B26\uFF09\u3002"],
  duplicate: ["A layout with that name already exists. Choose another name.", "\u5DF2\u5B58\u5728\u540C\u540D\u5E03\u5C40\uFF0C\u8BF7\u6362\u4E00\u4E2A\u540D\u79F0\u3002"],
  missing: ["The selected layout or recovery snapshot is unavailable.", "\u6240\u9009\u5E03\u5C40\u6216\u6062\u590D\u5FEB\u7167\u4E0D\u5B58\u5728\u3002"],
  recovery: ["Could not verify the recovery snapshot. The current layout was not switched.", "\u6062\u590D\u5FEB\u7167\u672A\u901A\u8FC7\u6821\u9A8C\uFF0C\u672A\u5207\u6362\u5F53\u524D\u5E03\u5C40\u3002"],
  failed: ["The layout operation could not be confirmed. Check the current layout before retrying; existing recovery files are retained.", "\u65E0\u6CD5\u786E\u8BA4\u5E03\u5C40\u64CD\u4F5C\u7ED3\u679C\u3002\u8BF7\u5148\u68C0\u67E5\u5F53\u524D\u5E03\u5C40\u518D\u91CD\u8BD5\uFF1B\u5DF2\u6709\u6062\u590D\u6587\u4EF6\u4ECD\u4FDD\u7559\u3002"]
};
function explain(error, zh) {
  return labels[error instanceof WorkspaceFailure ? error.problem : "failed"][zh ? 1 : 0];
}
var owns = (c, name2) => Object.prototype.hasOwnProperty.call(c.workspaces, name2);
var menuSequence = 0;
function workspaceMenuDocument(app, fallback, focused) {
  if (!focused || focused === fallback || !focused.defaultView || focused.defaultView.closed)
    return fallback;
  let owned2 = false;
  app.workspace.iterateAllLeaves((leaf) => {
    if (leaf.view.containerEl.isConnected && leaf.view.containerEl.ownerDocument === focused)
      owned2 = true;
  });
  return owned2 ? focused : fallback;
}
var WorkspacePopup = class {
  constructor(app, doc, anchor, entries, zh, done) {
    this.app = app;
    this.doc = doc;
    this.anchor = anchor;
    this.done = done;
    this.rows = [];
    this.closed = false;
    this.outside = (event) => {
      var _a;
      const node = event.target;
      if (!this.root.contains(node) && !((_a = this.anchor) == null ? void 0 : _a.contains(node)))
        this.close(false);
    };
    this.blur = () => this.close(false);
    this.resize = () => this.close(true);
    var _a, _b, _c, _d, _e, _f;
    this.root = doc.createElement("div");
    this.root.className = "keyline-next-workspace-menu";
    this.root.id = `keyline-next-workspace-menu-${++menuSequence}`;
    this.root.setAttribute("role", "menu");
    this.root.setAttribute("aria-label", zh ? "\u5DE5\u4F5C\u533A\u5E03\u5C40" : "Workspace layouts");
    let initial = 0;
    for (const entry of entries) {
      if (!entry) {
        const separator = doc.createElement("div");
        separator.className = "keyline-next-workspace-divider";
        separator.setAttribute("role", "separator");
        this.root.append(separator);
        continue;
      }
      const row = doc.createElement("button");
      row.type = "button";
      row.tabIndex = -1;
      row.className = "keyline-next-workspace-item";
      row.setAttribute("role", entry.checked === void 0 ? "menuitem" : "menuitemradio");
      if (entry.checked !== void 0)
        row.setAttribute("aria-checked", String(entry.checked));
      if (entry.checked)
        initial = this.rows.length;
      const icon = doc.createElement("span"), text2 = doc.createElement("span");
      icon.className = "keyline-next-workspace-glyph";
      icon.setAttribute("aria-hidden", "true");
      text2.className = "keyline-next-workspace-title";
      text2.textContent = entry.title;
      if (entry.icon || entry.checked)
        (0, import_obsidian14.setIcon)(icon, (_a = entry.icon) != null ? _a : "check");
      row.append(icon, text2);
      this.root.append(row);
      this.rows.push(row);
      row.addEventListener("pointermove", () => row.focus({ preventScroll: true }));
      row.addEventListener("click", () => {
        if (!this.closed) {
          this.close();
          entry.action();
        }
      });
    }
    this.scope = new import_obsidian14.Scope(app.scope);
    this.scope.register([], "Escape", () => {
      this.close();
      return false;
    });
    this.scope.register([], "Tab", () => {
      this.close();
      return true;
    });
    for (const key of ["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "]) {
      this.scope.register([], key, () => {
        var _a2, _b2, _c2;
        const current = this.rows.indexOf(doc.activeElement);
        if (key === "Enter" || key === " ")
          (_a2 = this.rows[current]) == null ? void 0 : _a2.click();
        else {
          const index = key === "Home" ? 0 : key === "End" ? this.rows.length - 1 : (current + (key === "ArrowDown" ? 1 : -1) + this.rows.length) % this.rows.length;
          (_b2 = this.rows[index]) == null ? void 0 : _b2.focus({ preventScroll: true });
          (_c2 = this.rows[index]) == null ? void 0 : _c2.scrollIntoView({ block: "nearest" });
        }
        return false;
      });
    }
    doc.body.append(this.root);
    this.position();
    anchor == null ? void 0 : anchor.setAttribute("aria-controls", this.root.id);
    anchor == null ? void 0 : anchor.setAttribute("aria-expanded", "true");
    app.keymap.pushScope(this.scope);
    doc.addEventListener("pointerdown", this.outside, true);
    (_b = doc.defaultView) == null ? void 0 : _b.addEventListener("blur", this.blur);
    (_c = doc.defaultView) == null ? void 0 : _c.addEventListener("resize", this.resize);
    (_d = doc.defaultView) == null ? void 0 : _d.addEventListener("pagehide", this.blur);
    (_e = this.rows[initial]) == null ? void 0 : _e.focus({ preventScroll: true });
    (_f = this.rows[initial]) == null ? void 0 : _f.scrollIntoView({ block: "nearest" });
  }
  position() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    const win = this.doc.defaultView;
    if (!win || this.closed)
      return;
    const area = (_a = this.doc.querySelector(".app-container")) == null ? void 0 : _a.getBoundingClientRect();
    const trigger = (_b = this.anchor) == null ? void 0 : _b.getBoundingClientRect(), bar = (_d = (_c = this.anchor) == null ? void 0 : _c.closest(".status-bar")) == null ? void 0 : _d.getBoundingClientRect();
    const leftEdge = Math.max(0, (_e = area == null ? void 0 : area.left) != null ? _e : 0) + 8, rightEdge = Math.min(win.innerWidth, (_f = area == null ? void 0 : area.right) != null ? _f : win.innerWidth) - 8;
    const topEdge = Math.max(0, (_g = area == null ? void 0 : area.top) != null ? _g : 0) + 8;
    const width = Math.min(264, Math.max(0, rightEdge - leftEdge));
    const bottom = Math.max(topEdge, Math.min(((_i = (_h = bar == null ? void 0 : bar.top) != null ? _h : trigger == null ? void 0 : trigger.top) != null ? _i : win.innerHeight - 28) - 6, ((_j = area == null ? void 0 : area.bottom) != null ? _j : win.innerHeight) - 8));
    const center = trigger ? (trigger.left + trigger.right) / 2 : win.innerWidth / 2;
    Object.assign(this.root.style, {
      left: `${Math.max(leftEdge, Math.min(center - width / 2, rightEdge - width))}px`,
      bottom: `${win.innerHeight - bottom}px`,
      width: `${width}px`,
      maxHeight: `${Math.min(360, Math.max(0, bottom - topEdge))}px`
    });
  }
  close(restore = true) {
    var _a, _b, _c, _d, _e, _f;
    if (this.closed)
      return;
    this.closed = true;
    this.app.keymap.popScope(this.scope);
    this.root.remove();
    this.doc.removeEventListener("pointerdown", this.outside, true);
    (_a = this.doc.defaultView) == null ? void 0 : _a.removeEventListener("blur", this.blur);
    (_b = this.doc.defaultView) == null ? void 0 : _b.removeEventListener("resize", this.resize);
    (_c = this.doc.defaultView) == null ? void 0 : _c.removeEventListener("pagehide", this.blur);
    (_d = this.anchor) == null ? void 0 : _d.setAttribute("aria-expanded", "false");
    (_e = this.anchor) == null ? void 0 : _e.removeAttribute("aria-controls");
    if (restore && ((_f = this.anchor) == null ? void 0 : _f.isConnected) && !this.anchor.disabled)
      this.anchor.focus({ preventScroll: true });
    this.done();
  }
};
var WorkspaceController = class {
  constructor(app, slot, directory, enabled, zh) {
    this.app = app;
    this.slot = slot;
    this.enabled = enabled;
    this.zh = zh;
    this.live = true;
    this.observed = /* @__PURE__ */ new Set();
    this.schedule = () => {
      const win = this.slot.ownerDocument.defaultView;
      if (!win || !this.live || this.frame !== void 0)
        return;
      this.frame = win.requestAnimationFrame(() => {
        this.frame = void 0;
        this.refresh();
      });
    };
    this.actions = new WorkspaceActions({
      core: () => core(app),
      allowed: enabled,
      conflict: () => ["workspaces-plus", "workspace-plus-plus"].some((id) => {
        var _a, _b;
        return (_b = (_a = app.plugins) == null ? void 0 : _a.enabledPlugins) == null ? void 0 : _b.has(id);
      }),
      current: () => app.workspace.getLayout(),
      apply: (layout) => app.workspace.changeLayout(layout),
      readSaved: async () => JSON.parse(await app.vault.adapter.read(`${app.vault.configDir}/workspaces.json`))
    }, new WorkspaceJournal(app.vault.adapter, directory));
    slot.addClass("keyline-next-workspace");
    this.button = slot.createEl("button", { cls: "keyline-next-workspace-button" });
    this.button.type = "button";
    this.button.setAttribute("aria-haspopup", "menu");
    this.button.setAttribute("aria-expanded", "false");
    (0, import_obsidian14.setIcon)(this.button.createSpan({ attr: { "aria-hidden": "true" } }), "panels-top-left");
    this.name = this.button.createSpan({ cls: "keyline-next-workspace-name" });
    (0, import_obsidian14.setIcon)(this.button.createSpan({ cls: "keyline-next-workspace-arrow", attr: { "aria-hidden": "true" } }), "chevron-up");
    this.button.addEventListener("click", () => {
      if (this.menu)
        this.menu.close();
      else
        this.open(this.slot.ownerDocument);
    });
    this.button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        this.open(this.slot.ownerDocument);
      }
    });
    const doc = slot.ownerDocument, win = doc.defaultView;
    if (win) {
      this.observer = new win.MutationObserver((records) => {
        if (records.some((r) => {
          var _a, _b;
          return !slot.contains(r.target) && (((_b = (_a = r.target).closest) == null ? void 0 : _b.call(_a, ".status-bar")) || Array.from(r.addedNodes).concat(Array.from(r.removedNodes)).some((n) => {
            var _a2;
            return (_a2 = n.matches) == null ? void 0 : _a2.call(n, ".status-bar");
          }));
        }))
          this.schedule();
      });
      this.observer.observe(doc.body, { childList: true, subtree: true, characterData: true });
      this.resize = new win.ResizeObserver(this.schedule);
      win.addEventListener("resize", this.schedule);
    }
    this.refresh();
  }
  refresh() {
    var _a, _b, _c, _d, _e;
    if (!this.live)
      return;
    const doc = this.slot.ownerDocument, win = doc.defaultView;
    const bar = doc.querySelector(".app-container > .status-bar");
    const visible = this.enabled() && !doc.body.classList.contains("is-mobile") && (win == null ? void 0 : win.getComputedStyle(doc.body).getPropertyValue("--ncl-workspace-controls").trim()) === "1" && !!bar;
    this.slot.hidden = !visible;
    if (!this.enabled()) {
      (_a = this.menu) == null ? void 0 : _a.close(false);
      (_b = this.modal) == null ? void 0 : _b.close();
    }
    if (this.bar !== bar || !visible) {
      (_c = this.bar) == null ? void 0 : _c.classList.remove("keyline-next-workspace-bar");
      (_d = this.resize) == null ? void 0 : _d.disconnect();
      this.observed.clear();
      this.bar = void 0;
    }
    if (bar && visible) {
      this.bar = bar;
      bar.classList.add("keyline-next-workspace-bar");
      if (this.slot.parentElement !== bar)
        bar.append(this.slot);
      this.position(bar);
    }
    const c = core(this.app), label2 = c && c.activeWorkspace && owns(c, c.activeWorkspace) ? c.activeWorkspace : this.zh() ? "\u5E03\u5C40" : "Layout";
    if (this.name.textContent !== label2)
      this.name.textContent = label2;
    this.button.setAttribute("aria-label", this.zh() ? `\u5207\u6362\u5DE5\u4F5C\u533A\u5E03\u5C40\uFF1A${label2}` : `Switch workspace layout: ${label2}`);
    this.button.disabled = this.actions.busy;
    (_e = this.menu) == null ? void 0 : _e.position();
  }
  position(bar) {
    var _a, _b;
    const bounds = bar.getBoundingClientRect();
    let left = 0, right = bounds.width, row, wrapped = false;
    const observing = /* @__PURE__ */ new Set([bar]);
    for (const node of Array.from(bar.children)) {
      if (node === this.slot)
        continue;
      observing.add(node);
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height)
        continue;
      if (row === void 0)
        row = rect.top;
      else if (Math.abs(row - rect.top) > 3)
        wrapped = true;
      if (node.matches(".syncstatusbar"))
        left = Math.max(left, rect.right - bounds.left);
      else
        right = Math.min(right, rect.left - bounds.left);
    }
    for (const node of this.observed)
      if (!observing.has(node))
        (_a = this.resize) == null ? void 0 : _a.unobserve(node);
    for (const node of observing)
      if (!this.observed.has(node))
        (_b = this.resize) == null ? void 0 : _b.observe(node);
    this.observed = observing;
    const clearance = Math.floor(Math.min(bounds.width / 2 - left - 12, right - bounds.width / 2 - 12) * 2);
    const separate = wrapped || clearance < 32;
    const available = separate ? Math.max(32, bounds.width - 24) : clearance;
    this.slot.classList.toggle("is-separate-row", separate);
    this.slot.classList.toggle("is-icon-only", separate ? bounds.width < 100 : available < 80);
    this.slot.style.setProperty("--keyline-workspace-width", `${Math.min(180, available)}px`);
  }
  async run(action, success = false) {
    if (!this.live || !this.enabled())
      return;
    try {
      const pending = action();
      this.refresh();
      await pending;
      if (success && this.live)
        new import_obsidian14.Notice(message("saved", this.zh()));
    } catch (error) {
      if (this.live)
        new import_obsidian14.Notice(explain(error, this.zh()));
    } finally {
      this.refresh();
    }
  }
  open(focused = typeof activeDocument === "undefined" ? void 0 : activeDocument) {
    var _a;
    if (!this.live || !this.enabled() || this.actions.busy)
      return;
    (_a = this.menu) == null ? void 0 : _a.close(false);
    this.refresh();
    const entries = [];
    try {
      const c = this.actions.core();
      const active = c.activeWorkspace;
      const guarded = (action) => () => {
        try {
          if (this.actions.core() !== c || c.activeWorkspace !== active)
            throw new WorkspaceFailure("stale");
          action();
        } catch (error) {
          if (this.live)
            new import_obsidian14.Notice(explain(error, this.zh()));
        }
      };
      for (const name2 of Object.keys(c.workspaces)) {
        const selected = c.workspaces[name2];
        entries.push({ title: name2, checked: name2 === c.activeWorkspace, action: () => {
          void this.run(async () => {
            if (this.actions.core() !== c || c.workspaces[name2] !== selected)
              throw new WorkspaceFailure("stale");
            await this.actions.switchTo(name2);
          });
        } });
      }
      if (entries.length)
        entries.push(null);
      entries.push(
        { title: message("saveWorkspace", this.zh()), icon: "save", action: guarded(() => this.save()) },
        { title: message("saveWorkspaceAs", this.zh()), icon: "plus", action: guarded(() => this.saveAs()) },
        { title: message("restoreWorkspace", this.zh()), icon: "undo-2", action: guarded(() => {
          void this.restore();
        }) }
      );
      if (c.onOpenModal)
        entries.push({ title: this.zh() ? "\u539F\u751F\u5DE5\u4F5C\u533A\u7BA1\u7406\u2026" : "Manage workspaces\u2026", icon: "settings", action: guarded(() => {
          void this.manage();
        }) });
    } catch (error) {
      entries.push({ title: explain(error, this.zh()), icon: "info", action: () => {
        new import_obsidian14.Notice(explain(error, this.zh()));
      } });
    }
    const bounds = this.button.getBoundingClientRect();
    const doc = workspaceMenuDocument(this.app, this.slot.ownerDocument, focused);
    const anchor = doc === this.slot.ownerDocument && !this.slot.hidden && bounds.width > 0 && bounds.height > 0 ? this.button : null;
    const menu = new WorkspacePopup(
      this.app,
      doc,
      anchor,
      entries,
      this.zh(),
      () => {
        if (this.menu === menu)
          this.menu = void 0;
      }
    );
    this.menu = menu;
  }
  async switchTo(name2) {
    await this.run(() => this.actions.switchTo(name2));
  }
  async restore() {
    await this.run(() => this.actions.restore());
  }
  async manage() {
    await this.run(() => this.actions.manage());
  }
  save() {
    if (!this.live || !this.enabled())
      return;
    try {
      const c = this.actions.core();
      if (!c.activeWorkspace || !owns(c, c.activeWorkspace))
        this.saveAs();
      else
        void this.run(() => this.actions.save(c.activeWorkspace, true), true);
    } catch (error) {
      new import_obsidian14.Notice(explain(error, this.zh()));
    }
  }
  saveAs() {
    var _a;
    if (!this.live || !this.enabled() || this.actions.busy)
      return;
    try {
      const c = this.actions.core();
      (_a = this.modal) == null ? void 0 : _a.close();
      const modal = new WorkspaceNameModal(this.app, this.zh(), async (name2) => {
        if (this.actions.core() !== c)
          throw new WorkspaceFailure("stale");
        const pending = this.actions.save(name2, false);
        this.refresh();
        try {
          await pending;
          if (this.live)
            new import_obsidian14.Notice(message("saved", this.zh()));
        } finally {
          this.refresh();
        }
      }, () => {
        if (this.modal === modal)
          this.modal = void 0;
      });
      this.modal = modal;
      modal.open();
    } catch (error) {
      new import_obsidian14.Notice(explain(error, this.zh()));
    }
  }
  dispose() {
    var _a, _b, _c, _d, _e;
    this.live = false;
    this.actions.stop();
    (_a = this.menu) == null ? void 0 : _a.close(false);
    (_b = this.modal) == null ? void 0 : _b.close();
    (_c = this.observer) == null ? void 0 : _c.disconnect();
    (_d = this.resize) == null ? void 0 : _d.disconnect();
    const win = this.slot.ownerDocument.defaultView;
    win == null ? void 0 : win.removeEventListener("resize", this.schedule);
    if (this.frame !== void 0)
      win == null ? void 0 : win.cancelAnimationFrame(this.frame);
    (_e = this.bar) == null ? void 0 : _e.classList.remove("keyline-next-workspace-bar");
    this.slot.remove();
  }
};
var WorkspaceNameModal = class extends import_obsidian14.Modal {
  constructor(app, zh, save, done) {
    super(app);
    this.zh = zh;
    this.save = save;
    this.done = done;
    this.closed = false;
  }
  onOpen() {
    this.setTitle(this.zh ? "\u53E6\u5B58\u4E3A\u65B0\u5E03\u5C40" : "Save as new layout");
    this.modalEl.classList.add("keyline-next-workspace-dialog");
    const form = this.contentEl.createEl("form"), input = form.createEl("input", { type: "text" });
    input.placeholder = this.zh ? "\u4F8B\u5982\uFF1A\u9605\u8BFB\u3001\u5199\u4F5C" : "For example: Reading, Writing";
    input.setAttribute("aria-label", this.zh ? "\u5E03\u5C40\u540D\u79F0" : "Layout name");
    input.maxLength = 80;
    const error = form.createEl("p", { cls: "keyline-next-workspace-error", attr: { role: "alert" } });
    error.hidden = true;
    const actions = form.createDiv({ cls: "keyline-next-workspace-dialog-actions" });
    const cancel = actions.createEl("button", { text: message("cancel", this.zh) });
    cancel.type = "button";
    const submit = actions.createEl("button", { text: message("save", this.zh), cls: "mod-cta" });
    submit.type = "submit";
    cancel.addEventListener("click", () => this.close());
    let busy = false;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy || this.closed)
        return;
      busy = true;
      input.disabled = cancel.disabled = submit.disabled = true;
      error.hidden = true;
      try {
        await this.save(input.value);
        if (!this.closed)
          this.close();
      } catch (cause) {
        if (!this.closed) {
          error.textContent = explain(cause, this.zh);
          error.hidden = false;
        }
      } finally {
        busy = false;
        input.disabled = cancel.disabled = submit.disabled = false;
        if (!this.closed)
          input.focus();
      }
    });
    input.focus();
  }
  onClose() {
    this.closed = true;
    this.contentEl.replaceChildren();
    this.done();
  }
};

// src/platform/block-commands.ts
var import_obsidian15 = require("obsidian");

// src/domain/relocation.ts
var rootNames = {
  paragraph: /^Paragraph$/u,
  heading: /^(?:ATX|Setext)Heading/u,
  list: /^(?:Bullet|Ordered)List$/u,
  item: /^ListItem$/u,
  quote: /^Blockquote$/u,
  callout: /^Blockquote$/u,
  code: /^(?:FencedCode|CodeBlock)$/u,
  table: /^Table$/u,
  rule: /^HorizontalRule$/u,
  html: /^HTMLBlock$/u,
  math: /^KeylineMath$/u,
  comment: /^KeylineComment$/u,
  frontmatter: /^KeylineFrontmatter$/u,
  reference: /^LinkReference$/u
};
function columns2(white) {
  let col = 0;
  for (const ch of white)
    col += ch === "	" ? 4 - col % 4 : 1;
  return col;
}
function trimIndent(line, count2) {
  let width = 0, end = 0;
  while (end < line.length && width < count2 && /[ \t]/u.test(line[end])) {
    width += line[end++] === "	" ? 4 - width % 4 : 1;
  }
  return " ".repeat(Math.max(0, width - count2)) + line.slice(end);
}
function marker(source) {
  const match = /^([ \t]*)([-+*]|\d+[.)])([ \t]+)([^\r\n]*)/u.exec(source);
  if (!match)
    return null;
  return {
    indent: columns2(match[1]),
    mark: match[2],
    width: columns2(match[1] + match[2] + match[3]) - columns2(match[1]),
    body: match[4]
  };
}
function syntax(tree, text2, block) {
  const firstLineEnd = text2.indexOf("\n", block.from);
  const limit2 = firstLineEnd < 0 ? block.to : Math.min(block.to, firstLineEnd);
  const walk = (node) => {
    if (node.to < block.from || node.from > limit2)
      return null;
    if (node.from >= block.from && node.to <= block.to + Number(text2[block.to] === "\r") && rootNames[block.kind].test(node.name))
      return node;
    for (let child = node.firstChild; child; child = child.nextSibling) {
      const found = walk(child);
      if (found)
        return found;
    }
    return null;
  };
  return walk(tree);
}
function signature(node, text2, base) {
  const lines = text2.slice(node.from, node.to).replace(/\r$/u, "").split(/\r?\n/u);
  const relative = lines.map((line, i) => i ? trimIndent(line, base) : line).join("\n");
  const children2 = [];
  for (let child = node.firstChild; child; child = child.nextSibling)
    if (!(node.name === "FencedCode" && child.name === "CodeText"))
      children2.push(signature(child, text2, base));
  return [node.name, relative, children2];
}
function contentSignature(node, text2, base, end) {
  var _a;
  const content2 = [];
  const tail = text2.slice(node.to, end);
  const outside = /^(?:[ \t\r]*\n)+[ \t]*(\^[\w-]+)[ \t\r]*$/u.exec(tail);
  let anchor = (_a = outside == null ? void 0 : outside[1]) != null ? _a : null;
  if (tail && !outside)
    return null;
  const last = node.lastChild;
  const inside = node.name === "ListItem" && (last == null ? void 0 : last.name) === "Paragraph" && /^\^[\w-]+[ \t\r]*$/u.test(text2.slice(last.from, last.to)) ? last : null;
  if (inside)
    anchor = text2.slice(inside.from, inside.to).trim();
  if (node.name === "ListItem") {
    for (let child = node.firstChild; child; child = child.nextSibling)
      if (child.name !== "ListMark" && child.from !== (inside == null ? void 0 : inside.from))
        content2.push(signature(child, text2, base));
  } else
    content2.push(signature(node, text2, base));
  return JSON.stringify([content2, anchor]);
}
function ancestors(model, block) {
  const result = [];
  while (block == null ? void 0 : block.parent) {
    block = model.blocks.find((b) => b.id === block.parent);
    if (block)
      result.push(block);
  }
  return result;
}
function outerItem(model, block) {
  return ancestors(model, block).find((b) => b.kind === "item");
}
function roots(model, blocks2) {
  if (!blocks2.length)
    return null;
  const group = siblings(model, blocks2[0]), chosen = new Set(blocks2);
  const ordered2 = group.filter((b) => chosen.has(b));
  if (chosen.size !== blocks2.length || ordered2.length !== blocks2.length || ordered2.some((b) => b.locked))
    return null;
  const start = group.indexOf(ordered2[0]);
  return ordered2.every((b, i) => group[start + i] === b) ? ordered2 : null;
}
function rootOf(model, block) {
  var _a;
  const parents = ancestors(model, block);
  return (_a = parents[parents.length - 1]) != null ? _a : block;
}
function padBefore2(text2, n, eol) {
  var _a, _b;
  if (!text2)
    return "";
  const tail = text2.match(/(?:\r?\n[ \t]*)*$/u)[0];
  return eol.repeat(Math.max(0, n - ((_b = (_a = tail.match(/\n/gu)) == null ? void 0 : _a.length) != null ? _b : 0)));
}
function padAfter2(text2, n, eol) {
  var _a, _b;
  if (!text2)
    return "";
  const head = text2.match(/^(?:[ \t]*\r?\n)*/u)[0];
  return eol.repeat(Math.max(0, n - ((_b = (_a = head.match(/\n/gu)) == null ? void 0 : _a.length) != null ? _b : 0)));
}
function relocateBlocks(model, selected, rawTarget, placement) {
  var _a, _b, _c, _d, _e, _f, _g;
  if (model.text.length > 2 * 1024 * 1024 || !model.blocks.includes(rawTarget) || rawTarget.locked)
    return null;
  const sources = roots(model, selected);
  if (!sources)
    return null;
  if (sources.some((b) => b.from <= rawTarget.from && b.to >= rawTarget.to))
    return null;
  const target = placement.startsWith("root-") ? rootOf(model, rawTarget) : rawTarget;
  const inside = placement === "inside", after = placement === "after" || placement === "root-after";
  if (inside && target.kind !== "item")
    return null;
  if (sources.some((b) => b.from <= target.from && b.to >= target.to))
    return null;
  if (!inside && sources[0].parent === target.parent)
    return moveBlocks(model, sources, target, after);
  const text2 = model.text, eol = (_b = (_a = text2.match(/\r?\n/u)) == null ? void 0 : _a[0]) != null ? _b : "\n";
  const targetSource = text2.slice(target.from, target.to), targetMarker = target.kind === "item" ? marker(targetSource) : null;
  const itemDestination = !!targetMarker && !placement.startsWith("root-");
  if (inside && !targetMarker)
    return null;
  const existingChild = inside ? model.blocks.find((b) => b.parent === target.id && b.kind === "list" && b.to === target.to) : void 0;
  const childItem = existingChild && model.blocks.find((b) => b.parent === existingChild.id && b.kind === "item");
  const childMarker = childItem && marker(text2.slice(childItem.from, childItem.to));
  const targetPrefix = blockPrefixColumns(text2, target.from);
  const targetIndent = targetPrefix + ((_c = targetMarker == null ? void 0 : targetMarker.indent) != null ? _c : 0);
  const childIndent = childItem && childMarker ? blockPrefixColumns(text2, childItem.from) + childMarker.indent : void 0;
  const indent = itemDestination ? inside ? childIndent != null ? childIndent : targetIndent + targetMarker.width : targetIndent : 0;
  const mark = itemDestination ? inside ? (_d = childMarker == null ? void 0 : childMarker.mark) != null ? _d : "-" : targetMarker.mark : "";
  const depth = itemDestination ? target.depth + (inside ? 2 : 0) : 0;
  const tree = markdownTree(text2).topNode;
  const fragments = [];
  let body = "";
  for (const source of sources) {
    const value = text2.slice(source.from, source.to), sourceMarker = source.kind === "item" ? marker(value) : null;
    const node = syntax(tree, text2, source);
    if (!node || !closedBlockSyntax(node, text2) || source.kind === "item" && !sourceMarker)
      return null;
    const sourceBase = sourceMarker ? blockPrefixColumns(text2, source.from) + sourceMarker.indent + sourceMarker.width : 0;
    const lines = value.split(/\r?\n/u);
    let moved, base = 0, kind2 = source.kind, movedDepth = 0;
    if (itemDestination || sourceMarker) {
      const outputMark = itemDestination ? mark : sourceMarker.mark;
      const prefix2 = " ".repeat(indent) + outputMark + " ";
      base = prefix2.length;
      kind2 = "item";
      movedDepth = itemDestination ? depth : 1;
      const first2 = sourceMarker ? sourceMarker.body : lines[0];
      moved = prefix2 + first2 + lines.slice(1).map(
        (line) => eol + (line ? " ".repeat(base) + trimIndent(line, sourceBase) : "")
      ).join("");
    } else
      moved = value;
    if (body)
      body += itemDestination || ((_e = fragments[fragments.length - 1]) == null ? void 0 : _e.kind) === "item" && kind2 === "item" ? eol : eol + eol;
    const sourceSignature = contentSignature(node, text2, sourceBase, source.to);
    if (sourceSignature === null)
      return null;
    fragments.push({ text: moved, offset: body.length, base, kind: kind2, depth: movedDepth, signature: sourceSignature });
    body += moved;
  }
  const first = sources[0], last = sources[sources.length - 1];
  const cutFrom = first.from;
  let cutTo = last.to + (blockPrefixColumns(text2, first.from) ? 0 : (_g = (_f = text2.slice(last.to).match(/^\r?\n/u)) == null ? void 0 : _f[0].length) != null ? _g : 0);
  if (first.parent === null || cutFrom === 0)
    cutTo += text2.slice(cutTo).match(/^(?:[ \t]*\r?\n)*/u)[0].length;
  const position = inside || after ? target.to : target.from;
  if (position > cutFrom && position < last.to)
    return null;
  const cutLength = cutTo - cutFrom;
  const at = position < cutFrom ? position : position >= cutTo ? position - cutLength : cutFrom;
  const remaining = text2.slice(0, cutFrom) + text2.slice(cutTo);
  const minimum = itemDestination ? 1 : 2;
  const compactBefore = itemDestination && !inside && !after && targetPrefix > 0;
  if (compactBefore) {
    if (!body.startsWith(" ".repeat(targetPrefix)))
      return null;
    body = body.slice(targetPrefix);
    fragments[0].text = fragments[0].text.slice(targetPrefix);
    for (let i = 1; i < fragments.length; i++)
      fragments[i].offset -= targetPrefix;
  }
  const prefix = compactBefore ? "" : padBefore2(remaining.slice(0, at), minimum, eol);
  const suffix = padAfter2(remaining.slice(at), minimum, eol) + (compactBefore ? " ".repeat(targetPrefix) : "");
  const insertion = prefix + body + suffix;
  let candidateText = remaining.slice(0, at) + insertion + remaining.slice(at);
  if (!/\n$/u.test(text2))
    candidateText = candidateText.replace(/(?:\r?\n)+$/u, "");
  if (candidateText === text2)
    return null;
  const candidate = parseBlocks(candidateText), candidateTree = markdownTree(candidateText).topNode;
  const boundaryMap = new Map(candidate.blocks.map((b) => [`${b.from}:${b.kind}:${b.depth}`, b]));
  const mapped = (offset, right) => {
    const next = offset < cutFrom ? offset : offset >= cutTo ? offset - cutLength : cutFrom;
    return next > at || next === at && right ? next + insertion.length : next;
  };
  const mappedStart = (block) => mapped(block.from, true) - (compactBefore && block === target ? targetPrefix : 0);
  const movedIds = new Set(model.blocks.filter((b) => sources.some((s) => b.from >= s.from && b.to <= s.to && b.depth >= s.depth)).map((b) => b.id));
  const mutable = new Set(sources.reduce((all, s) => all.concat(ancestors(model, s)), []).map((b) => b.id));
  const destinationAncestors = inside ? [target, ...ancestors(model, target)] : ancestors(model, target);
  for (const b of destinationAncestors)
    mutable.add(b.id);
  for (const list of model.blocks.filter((b) => b.kind === "list" && !movedIds.has(b.id))) {
    const node = syntax(tree, text2, list);
    const tail = node ? text2.slice(node.to, list.to) : "";
    const anchor = /^(?:[ \t\r]*\n)+[ \t]*(\^[\w-]+)[ \t\r]*$/u.exec(tail);
    if (!anchor)
      continue;
    const surviving = model.blocks.filter((b) => b.parent === list.id && !movedIds.has(b.id));
    if (!surviving.length)
      return null;
    const next = candidate.blocks.find((b) => b.kind === "list" && b.to === mapped(list.to, false));
    if (!next || !candidateText.slice(next.from, next.to).endsWith(tail) || !surviving.every((b) => candidate.blocks.some((n) => n.from === mappedStart(b) && n.kind === b.kind && n.parent === next.id)))
      return null;
  }
  for (const b of model.blocks) {
    if (movedIds.has(b.id) || b.kind === "list")
      continue;
    const next = boundaryMap.get(`${mappedStart(b)}:${b.kind}:${b.depth}`);
    if (!next)
      return null;
    if (!mutable.has(b.id) && (next.to !== mapped(b.to, false) || (compactBefore && b === target ? blockTextInSlot(candidate, next, 0) !== blockTextInSlot(model, b, 0) : candidateText.slice(next.from, next.to) !== text2.slice(b.from, b.to))))
      return null;
    const parent = outerItem(model, b), nextParent = outerItem(candidate, next);
    if (parent ? (nextParent == null ? void 0 : nextParent.from) !== mappedStart(parent) : !!nextParent)
      return null;
  }
  for (const fragment2 of fragments) {
    const from = at + prefix.length + fragment2.offset;
    const moved = boundaryMap.get(`${from}:${fragment2.kind}:${fragment2.depth}`);
    if (!moved || moved.to !== from + fragment2.text.length)
      return null;
    const node = syntax(candidateTree, candidateText, moved);
    if (!node || !closedBlockSyntax(node, candidateText) || contentSignature(node, candidateText, fragment2.base, moved.to) !== fragment2.signature)
      return null;
    const parent = outerItem(candidate, moved);
    const expectedParent = itemDestination ? inside ? target : outerItem(model, target) : void 0;
    if (expectedParent ? (parent == null ? void 0 : parent.from) !== mappedStart(expectedParent) : !!parent)
      return null;
  }
  let begin = 0, end = text2.length, nextEnd = candidateText.length;
  while (begin < Math.min(first.from, target.from) && begin < nextEnd && text2[begin] === candidateText[begin])
    begin++;
  while (end > Math.max(last.to, target.to) && nextEnd > begin && text2[end - 1] === candidateText[nextEnd - 1]) {
    end--;
    nextEnd--;
  }
  return {
    from: begin,
    to: end,
    before: text2.slice(begin, end),
    insert: candidateText.slice(begin, nextEnd),
    anchor: at + prefix.length,
    head: at + prefix.length + body.length
  };
}
function changeBlockIndent(model, selected, direction) {
  const chosen = roots(model, selected);
  if (!chosen)
    return null;
  const group = siblings(model, chosen[0]);
  if (direction === 1) {
    const previous = group[group.indexOf(chosen[0]) - 1];
    return (previous == null ? void 0 : previous.kind) === "item" ? relocateBlocks(model, chosen, previous, "inside") : null;
  }
  const parent = outerItem(model, chosen[0]);
  return parent ? relocateBlocks(model, chosen, parent, "after") : null;
}

// src/platform/block-commands.ts
var blockActions = [
  { id: "select", label: "selectBlock", icon: "scan" },
  { id: "up", label: "moveBlockUp", icon: "arrow-up" },
  { id: "down", label: "moveBlockDown", icon: "arrow-down" },
  { id: "indent", label: "indentBlock", icon: "indent-increase" },
  { id: "outdent", label: "outdentBlock", icon: "indent-decrease" },
  { id: "duplicate", label: "duplicateBlock", icon: "copy" },
  { id: "delete", label: "deleteBlock", icon: "trash-2" }
];
var cache = /* @__PURE__ */ new WeakMap();
function captureBlock(editor, guard = () => true, range) {
  var _a, _b;
  if (!guard() || editor.listSelections().length !== 1)
    return null;
  const text2 = editor.getValue();
  if (text2.length > 2 * 1024 * 1024)
    return null;
  let model = cache.get(editor);
  if (!model || model.text !== text2) {
    model = parseBlocks(text2);
    cache.set(editor, model);
  }
  const selectedFrom = editor.posToOffset(editor.getCursor("from")), selectedTo = editor.posToOffset(editor.getCursor("to"));
  const from = (_a = range == null ? void 0 : range.from) != null ? _a : selectedFrom, to = (_b = range == null ? void 0 : range.to) != null ? _b : selectedTo;
  const blocks2 = blockSelection(model, from, to);
  if (!blocks2.length || blocks2.some((b) => b.locked))
    return null;
  return { editor, model, blocks: blocks2, from, to, valid: () => guard() && editor.getValue() === text2 && editor.listSelections().length === 1 && editor.posToOffset(editor.getCursor("from")) === selectedFrom && editor.posToOffset(editor.getCursor("to")) === selectedTo };
}
function blockActionPlan(context, action) {
  const blocks2 = context.blocks, model = context.model;
  return action === "up" ? shiftBlocks(model, blocks2, -1) : action === "down" ? shiftBlocks(model, blocks2, 1) : action === "indent" ? changeBlockIndent(model, blocks2, 1) : action === "outdent" ? changeBlockIndent(model, blocks2, -1) : action === "duplicate" ? duplicateBlocks(model, blocks2) : action === "delete" ? deleteBlocks(model, blocks2) : null;
}
function commitBlockEdit(context, plan) {
  if (!context.valid() || applyBlockEdit(context.model.text, plan) === null)
    return false;
  const editor = context.editor;
  editor.replaceRange(plan.insert, editor.offsetToPos(plan.from), editor.offsetToPos(plan.to), "set");
  editor.setSelection(editor.offsetToPos(plan.anchor), editor.offsetToPos(plan.head));
  editor.focus();
  return true;
}
function performBlock(context, action) {
  if (!context.valid())
    return false;
  if (action === "select") {
    const first = context.blocks[0], last = context.blocks[context.blocks.length - 1];
    context.editor.setSelection(context.editor.offsetToPos(first.from), context.editor.offsetToPos(last.to));
    context.editor.focus();
    return true;
  }
  const plan = blockActionPlan(context, action);
  return !!plan && commitBlockEdit(context, plan);
}
function appendBlockMenu(menu, app, context, zh, convert) {
  menu.addSeparator();
  for (const action of blockActions)
    menu.addItem((item) => item.setTitle(message(action.label, zh)).setIcon(action.icon).setDisabled(action.id !== "select" && !blockActionPlan(context, action.id)).onClick(() => {
      if (!performBlock(context, action.id))
        new import_obsidian15.Notice(message("blockUnavailable", zh));
    }));
  if (context.blocks.length)
    menu.addItem((item) => item.setTitle(message("convertBlock", zh)).setIcon("replace").onClick(convert != null ? convert : () => new BlockConvertPicker(app, context, zh).open()));
}
var conversions = ["paragraph", "h1", "h2", "h3", "h4", "h5", "h6", "task", "bullet", "number", "quote"];
var conversionLabels = {
  paragraph: ["Text", "\u6B63\u6587"],
  h1: ["Heading 1", "\u6807\u9898 1"],
  h2: ["Heading 2", "\u6807\u9898 2"],
  h3: ["Heading 3", "\u6807\u9898 3"],
  h4: ["Heading 4", "\u6807\u9898 4"],
  h5: ["Heading 5", "\u6807\u9898 5"],
  h6: ["Heading 6", "\u6807\u9898 6"],
  bullet: ["Bullet list", "\u5217\u8868"],
  number: ["Numbered list", "\u5E8F\u53F7"],
  task: ["Task", "\u4EFB\u52A1"],
  quote: ["Quote", "\u5F15\u7528"]
};
var BlockConvertPicker = class extends import_obsidian15.SuggestModal {
  constructor(app, context, zh) {
    super(app);
    this.context = context;
    this.zh = zh;
    this.plans = /* @__PURE__ */ new Map();
    this.setPlaceholder(message("convertBlock", zh));
  }
  plan(target) {
    var _a;
    if (!this.context.valid())
      return null;
    if (!this.plans.has(target))
      this.plans.set(target, convertBlocks(this.context.model, this.context.blocks, target));
    return (_a = this.plans.get(target)) != null ? _a : null;
  }
  getSuggestions(query) {
    if (!this.context.blocks.length || !this.context.valid())
      return [];
    return conversions.filter((target) => conversionLabels[target].join(" ").toLowerCase().includes(query.toLowerCase()) && this.plan(target));
  }
  renderSuggestion(value, el) {
    el.setText(conversionLabels[value][this.zh ? 1 : 0]);
  }
  onChooseSuggestion(target) {
    const plan = this.plan(target);
    if (!plan || !commitBlockEdit(this.context, plan))
      new import_obsidian15.Notice(message("blockUnavailable", this.zh));
  }
};

// src/platform/insertion-menus.ts
var import_state3 = require("@codemirror/state");
var import_view4 = require("@codemirror/view");
var import_obsidian16 = require("obsidian");
var callouts = [
  ["note", "Note", "\u4FBF\u7B7E", "pencil"],
  ["info", "Info", "\u4FE1\u606F", "info"],
  ["todo", "Todo", "\u5F85\u529E", "check-circle"],
  ["tip", "Tip", "\u63D0\u793A", "flame"],
  ["success", "Success", "\u6210\u529F", "check"],
  ["question", "Question", "\u95EE\u9898", "help-circle"],
  ["warning", "Warning", "\u8B66\u544A", "alert-triangle"],
  ["failure", "Failure", "\u5931\u8D25", "x-circle"],
  ["danger", "Danger", "\u5371\u9669", "zap"],
  ["bug", "Bug", "\u7F3A\u9677", "bug"],
  ["example", "Example", "\u793A\u4F8B", "list"],
  ["quote", "Quote", "\u5F15\u7528", "quote"]
];
var extras = /* @__PURE__ */ new Set(["text", "h6", "bullet", "number", "quote"]);
var links = /* @__PURE__ */ new Set(["newpage", "wiki", "link", "image", "attachment"]);
var datesAndInline = /* @__PURE__ */ new Set(["today", "yesterday", "tomorrow", "time", "footnote", "comment"]);
var menuSerial = 0;
var InsertionMenus = class {
  constructor(owner) {
    this.owner = owner;
    this.views = /* @__PURE__ */ new Map();
    owner.presenter = this;
  }
  extension() {
    const controller = this;
    return [import_view4.ViewPlugin.define((view) => {
      const menu = new InsertMenu(view, controller);
      controller.views.set(view, menu);
      return menu;
    }), import_state3.Prec.highest(import_view4.keymap.of(["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Enter", "Tab", "Escape"].map((key) => ({
      key,
      run: (view) => {
        var _a, _b;
        return (_b = (_a = controller.views.get(view)) == null ? void 0 : _a.key(key)) != null ? _b : false;
      }
    }))))];
  }
  open(context, point) {
    var _a;
    this.close();
    for (const [view, menu] of this.views)
      if (((_a = view.state.field(import_obsidian16.editorInfoField, false)) == null ? void 0 : _a.editor) === context.editor) {
        menu.open(context, point);
        return;
      }
  }
  claim(active) {
    for (const menu of this.views.values())
      if (menu !== active)
        menu.close();
  }
  close() {
    for (const menu of this.views.values())
      menu.close();
  }
  remove(view) {
    this.views.delete(view);
  }
  dispose() {
    for (const menu of [...this.views.values()])
      menu.destroy();
    if (this.owner.presenter === this)
      this.owner.presenter = void 0;
  }
};
var InsertMenu = class {
  constructor(view, controller) {
    this.view = view;
    this.controller = controller;
    this.entries = [];
    this.active = 0;
    this.subActive = -1;
    this.anchor = -1;
    this.typed = false;
    this.generation = 0;
    this.disposed = false;
    this.ariaValues = /* @__PURE__ */ new Map();
    this.composition = () => this.close();
    const doc = view.dom.ownerDocument;
    this.boundDocument = doc;
    this.outside = (event) => {
      if (!this.contains(event.target))
        this.close();
    };
    this.viewport = (event) => {
      if (event.type === "resize" || !this.contains(event.target))
        this.close();
    };
    this.bindDocument(doc);
    view.contentDOM.addEventListener("compositionstart", this.composition);
  }
  bindDocument(doc) {
    var _a;
    doc.addEventListener("pointerdown", this.outside, true);
    doc.addEventListener("focusin", this.outside, true);
    doc.addEventListener("scroll", this.viewport, true);
    (_a = doc.defaultView) == null ? void 0 : _a.addEventListener("resize", this.viewport);
  }
  unbindDocument(doc) {
    var _a;
    doc.removeEventListener("pointerdown", this.outside, true);
    doc.removeEventListener("focusin", this.outside, true);
    doc.removeEventListener("scroll", this.viewport, true);
    (_a = doc.defaultView) == null ? void 0 : _a.removeEventListener("resize", this.viewport);
  }
  syncDocument() {
    const doc = this.view.dom.ownerDocument;
    if (doc === this.boundDocument)
      return;
    this.close();
    this.unbindDocument(this.boundDocument);
    this.boundDocument = doc;
    this.bindDocument(doc);
  }
  get owner() {
    return this.controller.owner;
  }
  contains(node) {
    var _a, _b;
    return !!((_a = this.root) == null ? void 0 : _a.contains(node)) || !!((_b = this.submenu) == null ? void 0 : _b.contains(node));
  }
  eligible() {
    const state = this.view.state, info = state.field(import_obsidian16.editorInfoField, false);
    return !this.disposed && this.owner.live && !state.readOnly && !this.view.composing && this.view.hasFocus && this.view.dom.ownerDocument.activeElement === this.view.contentDOM && state.doc.length <= 2 * 1024 * 1024 && state.selection.ranges.length === 1 && !!(info == null ? void 0 : info.file) && !!info.editor;
  }
  open(context, point) {
    this.syncDocument();
    context.editor.focus();
    if (!context.valid() || !this.eligible())
      return;
    this.typed = false;
    this.context = context;
    this.point = point;
    this.entries = this.choices("");
    this.render();
    this.position();
  }
  update(update) {
    if (this.disposed)
      return;
    this.syncDocument();
    if (update.focusChanged && !this.view.hasFocus) {
      this.close();
      return;
    }
    if (!update.docChanged && !update.selectionSet)
      return;
    const input = update.transactions.some((t2) => t2.isUserEvent("input.type") && !t2.isUserEvent("input.type.compose"));
    const deletion = update.transactions.some((t2) => t2.isUserEvent("delete"));
    if (this.root || this.anchor >= 0) {
      if (this.typed && update.docChanged && (input || deletion)) {
        this.active = 0;
        this.schedule();
      } else
        this.close();
      return;
    }
    if (!input || !this.eligible())
      return;
    const trigger = this.owner.preferences().slashTrigger;
    let inserted = false;
    update.changes.iterChanges((_a, _b, _c, end, text2) => {
      if (text2.toString() === trigger && end === update.state.selection.main.head)
        inserted = true;
    });
    if (!inserted)
      return;
    const info = this.view.state.field(import_obsidian16.editorInfoField, false);
    if (!info.editor || !info.file)
      return;
    if (!this.owner.suggest.onTrigger(info.editor.getCursor(), info.editor, info.file))
      return;
    this.anchor = update.state.selection.main.head - trigger.length;
    this.typed = true;
    this.controller.claim(this);
    this.schedule();
  }
  schedule() {
    const win = this.view.dom.ownerDocument.defaultView;
    if (!win)
      return;
    if (this.pending !== void 0)
      win.clearTimeout(this.pending);
    const generation = this.generation;
    this.pending = win.setTimeout(() => {
      var _a;
      if (generation !== this.generation)
        return;
      this.pending = void 0;
      if (!this.eligible()) {
        this.close();
        return;
      }
      const info = this.view.state.field(import_obsidian16.editorInfoField, false);
      if (!info.editor || !info.file) {
        this.close();
        return;
      }
      const hit = this.owner.suggest.onTrigger(info.editor.getCursor(), info.editor, info.file);
      if (!hit || info.editor.posToOffset(hit.start) !== this.anchor) {
        this.close();
        return;
      }
      this.context = (_a = this.owner.capture(info.editor, info.file, { from: this.anchor, to: info.editor.posToOffset(hit.end) })) != null ? _a : void 0;
      if (!this.context) {
        this.close();
        return;
      }
      this.entries = this.choices(hit.query);
      this.active = 0;
      this.render();
      this.position();
    }, 0);
  }
  choices(query) {
    const entries = insertionEntries(this.owner.preferences(), this.owner.zh(), query);
    const label2 = this.owner.zh() ? "\u5173\u95ED\u83DC\u5355" : "Close menu";
    if (this.typed && (!query || `close menu \u5173\u95ED\u83DC\u5355`.includes(query.toLowerCase())))
      entries.push({ id: "close", label: label2, search: "", icon: "x", mode: "action" });
    return entries;
  }
  panel(sub = false) {
    const p = this.view.dom.ownerDocument.createElement("div");
    p.className = `keyline-next-insert-menu${sub ? " is-callout" : ""}`;
    p.id = `keyline-next-insert-${++menuSerial}`;
    p.setAttribute("role", "listbox");
    p.setAttribute("aria-label", sub ? "Callout" : this.owner.zh() ? "\u63D2\u5165" : "Insert");
    p.addEventListener("mousedown", (e) => e.preventDefault());
    this.view.dom.ownerDocument.body.append(p);
    return p;
  }
  render() {
    this.closeSubmenu();
    if (!this.root)
      this.root = this.panel();
    this.root.replaceChildren();
    const list = this.root.createDiv({ cls: "keyline-next-insert-list" });
    let group = "", band = "";
    for (const [index, entry] of this.entries.entries()) {
      const next = entry.id === "close" ? "" : entry.mode === "command" ? "Custom" : extras.has(entry.id) ? "More" : /^h[1-5]$/u.test(entry.id) ? "Headings" : "Insert";
      const nextBand = links.has(entry.id) ? "links" : datesAndInline.has(entry.id) ? "dates" : "blocks";
      if (next === "Insert" && group === next && band !== nextBand)
        list.createDiv({ cls: "keyline-next-insert-separator" });
      if (next && next !== group) {
        if (group)
          list.createDiv({ cls: "keyline-next-insert-separator" });
        const labels3 = { Headings: "\u6807\u9898", Insert: "\u65B0\u589E", More: "\u66F4\u591A", Custom: "\u81EA\u5B9A\u4E49" };
        list.createDiv({ cls: "keyline-next-insert-heading", text: this.owner.zh() ? labels3[next] : next }).setAttribute("aria-hidden", "true");
        group = next;
      }
      band = nextBand;
      if (entry.id === "close")
        list.createDiv({ cls: "keyline-next-insert-separator" });
      const row = this.row(list, entry.label, entry.icon, entry.id === "callout");
      row.dataset.insertId = entry.id;
      row.addEventListener("pointermove", () => {
        this.setActive(index);
        if (entry.id === "callout")
          this.showCallouts(false);
        else
          this.closeSubmenu();
      });
      row.addEventListener("click", () => {
        this.setActive(index);
        if (entry.id === "callout")
          this.showCallouts(false);
        else
          this.activate();
      });
    }
    if (!this.entries.length)
      list.createDiv({ cls: "keyline-next-insert-empty", text: this.owner.zh() ? "\u6CA1\u6709\u5339\u914D\u9879" : "No results" });
    this.aria("aria-expanded", "true");
    this.aria("aria-autocomplete", "list");
    this.setActive(Math.min(this.active, this.entries.length - 1), false);
  }
  row(parent, label2, icon, branch = false) {
    const row = parent.createDiv({ cls: "keyline-next-insert-suggestion" });
    row.setAttribute("role", "option");
    row.setAttribute("aria-selected", "false");
    row.id = `keyline-next-insert-option-${++menuSerial}`;
    const glyph = row.createSpan({ cls: "keyline-next-insert-icon" });
    glyph.setAttribute("aria-hidden", "true");
    (0, import_obsidian16.setIcon)(glyph, icon);
    row.createSpan({ cls: "keyline-next-insert-label", text: label2 });
    if (branch) {
      const chevron = row.createSpan({ cls: "keyline-next-insert-chevron" });
      (0, import_obsidian16.setIcon)(chevron, "chevron-right");
    }
    return row;
  }
  rows(sub = false) {
    var _a, _b;
    return Array.from((_b = (_a = sub ? this.submenu : this.root) == null ? void 0 : _a.querySelectorAll("[role=option]")) != null ? _b : []);
  }
  setActive(index, scroll = true) {
    this.active = index;
    this.rows().forEach((row, i) => {
      row.classList.toggle("is-active", i === index);
      row.setAttribute("aria-selected", String(i === index));
      if (i === index && scroll)
        row.scrollIntoView({ block: "nearest" });
    });
    this.syncAria();
  }
  showCallouts(keyboard) {
    if (!this.submenu) {
      this.submenu = this.panel(true);
      const list = this.submenu.createDiv({ cls: "keyline-next-insert-list" });
      list.createDiv({ cls: "keyline-next-insert-heading", text: "Callout" });
      callouts.forEach(([id, en, zh, icon], i) => {
        const row = this.row(list, this.owner.zh() ? zh : en, icon);
        row.dataset.insertId = `callout-${id}`;
        row.addEventListener("pointermove", () => this.setSubActive(i));
        row.addEventListener("click", () => this.commitCallout(i));
      });
      const base = this.root.getBoundingClientRect(), win = this.view.dom.ownerDocument.defaultView;
      this.submenu.style.left = `${Math.max(8, base.right + 6 + 164 > win.innerWidth - 8 ? base.left - 170 : base.right + 6)}px`;
      this.submenu.style.top = `${Math.max(8, Math.min(base.top, win.innerHeight - this.submenu.offsetHeight - 8))}px`;
    }
    if (keyboard)
      this.setSubActive(0);
  }
  setSubActive(index) {
    this.subActive = index;
    this.rows(true).forEach((r, i) => {
      r.classList.toggle("is-active", i === index);
      r.setAttribute("aria-selected", String(i === index));
      if (i === index)
        r.scrollIntoView({ block: "nearest" });
    });
    this.syncAria();
  }
  closeSubmenu() {
    var _a;
    (_a = this.submenu) == null ? void 0 : _a.remove();
    this.submenu = void 0;
    this.subActive = -1;
    this.syncAria();
  }
  aria(name2, value) {
    const el = this.view.contentDOM, previous = this.ariaValues.get(name2);
    this.ariaValues.set(name2, { before: previous ? previous.before : el.getAttribute(name2), value });
    el.setAttribute(name2, value);
  }
  restoreAria(name2) {
    const item = this.ariaValues.get(name2), el = this.view.contentDOM;
    if (item && el.getAttribute(name2) === item.value) {
      if (item.before === null)
        el.removeAttribute(name2);
      else
        el.setAttribute(name2, item.before);
    }
    this.ariaValues.delete(name2);
  }
  syncAria() {
    const sub = this.subActive >= 0, panel = sub ? this.submenu : this.root, row = this.rows(sub)[sub ? this.subActive : this.active];
    if (panel)
      this.aria("aria-controls", panel.id);
    if (row)
      this.aria("aria-activedescendant", row.id);
    else
      this.restoreAria("aria-activedescendant");
  }
  position() {
    var _a;
    if (!this.root || !this.context)
      return;
    const coords = this.view.coordsAtPos(this.typed ? this.anchor : this.context.from), win = this.view.dom.ownerDocument.defaultView;
    if (!coords && !this.point) {
      this.close();
      return;
    }
    const point = (_a = this.point) != null ? _a : { x: coords.left, y: coords.bottom + 6 };
    this.root.style.left = `${Math.max(8, Math.min(point.x, win.innerWidth - this.root.offsetWidth - 8))}px`;
    this.root.style.top = `${Math.max(8, Math.min(point.y, win.innerHeight - this.root.offsetHeight - 8))}px`;
  }
  key(key) {
    var _a, _b;
    this.syncDocument();
    if (!this.root)
      return false;
    if (!((_a = this.context) == null ? void 0 : _a.valid()) || !this.eligible()) {
      this.close();
      return false;
    }
    if (key === "Escape") {
      if (this.subActive >= 0)
        this.closeSubmenu();
      else
        this.close();
      return true;
    }
    if (key === "ArrowLeft") {
      if (this.submenu) {
        this.closeSubmenu();
        return true;
      }
      this.close();
      return false;
    }
    if (key === "ArrowRight") {
      if (((_b = this.entries[this.active]) == null ? void 0 : _b.id) === "callout") {
        this.showCallouts(true);
        return true;
      }
      this.close();
      return false;
    }
    if (key === "ArrowDown" || key === "ArrowUp") {
      const count2 = this.subActive >= 0 ? callouts.length : this.entries.length;
      if (!count2)
        return true;
      const at = this.subActive >= 0 ? this.subActive : this.active, next = (at + (key === "ArrowDown" ? 1 : count2 - 1)) % count2;
      if (this.subActive >= 0)
        this.setSubActive(next);
      else {
        this.closeSubmenu();
        this.setActive(next);
      }
      return true;
    }
    if (key === "Enter" || key === "Tab") {
      if (this.subActive >= 0)
        this.commitCallout(this.subActive);
      else
        this.activate();
      return true;
    }
    return false;
  }
  activate() {
    const entry = this.entries[this.active];
    if (!entry)
      return;
    if (entry.id === "callout") {
      this.showCallouts(true);
      return;
    }
    this.commit(entry);
  }
  commitCallout(index) {
    const item = callouts[index];
    if (item)
      this.commit({ id: `callout-${item[0]}`, label: item[1], search: "", icon: item[3], mode: "block" });
  }
  commit(entry) {
    const context = this.context, valid = (context == null ? void 0 : context.valid()) && this.eligible();
    this.close();
    if (valid && context && entry.id !== "close")
      void this.owner.choose(context, entry);
  }
  close() {
    var _a, _b;
    this.generation++;
    if (this.pending !== void 0)
      (_a = this.boundDocument.defaultView) == null ? void 0 : _a.clearTimeout(this.pending);
    this.pending = void 0;
    this.context = void 0;
    this.anchor = -1;
    this.point = void 0;
    this.typed = false;
    this.active = 0;
    (_b = this.root) == null ? void 0 : _b.remove();
    this.root = void 0;
    this.closeSubmenu();
    for (const name2 of [...this.ariaValues.keys()])
      this.restoreAria(name2);
  }
  destroy() {
    if (this.disposed)
      return;
    this.disposed = true;
    this.close();
    this.unbindDocument(this.boundDocument);
    this.view.contentDOM.removeEventListener("compositionstart", this.composition);
    this.controller.remove(this.view);
  }
};

// src/platform/writing.ts
var import_language = require("@codemirror/language");
var import_state4 = require("@codemirror/state");
var import_view5 = require("@codemirror/view");
var import_obsidian17 = require("obsidian");

// src/domain/writing.ts
var MAX_WRITING_UNITS = 2 * 1024 * 1024;
function warningRange(text2, range) {
  let at = range.to;
  while (at < text2.length && /[ \t]/u.test(text2[at]))
    at++;
  if (at < text2.length && text2[at] !== "\n" && text2[at] !== "\r")
    return { from: range.from, to: at + (text2.codePointAt(at) > 65535 ? 2 : 1) };
  at = range.from - 1;
  while (at >= 0 && /[ \t]/u.test(text2[at]))
    at--;
  if (at >= 0 && text2[at] !== "\n" && text2[at] !== "\r") {
    if (/[\udc00-\udfff]/u.test(text2[at]) && at > 0 && /[\ud800-\udbff]/u.test(text2[at - 1]))
      at--;
    return { from: at, to: range.to };
  }
  return range;
}
var opaque2 = /^(?:FencedCode|CodeBlock|InlineCode|HTMLBlock|HTMLTag|URL|Autolink|LinkReference|HorizontalRule|KeylineFrontmatter|Keyline(?:Inline)?Math|Keyline(?:Inline)?Comment)$/u;
function merged(spans) {
  const result = [];
  for (const span of [...spans].sort((a, b) => a.from - b.from)) {
    const previous = result[result.length - 1];
    if (previous && span.from <= previous.to)
      previous.to = Math.max(previous.to, span.to);
    else
      result.push({ from: span.from, to: span.to });
  }
  return result;
}
function preceding(at, spans) {
  let lo = 0, hi = spans.length;
  while (lo < hi) {
    const mid = lo + hi >>> 1;
    if (spans[mid].from <= at)
      lo = mid + 1;
    else
      hi = mid;
  }
  return lo - 1;
}
var covered = (range, spans) => {
  const i = preceding(range.from, spans);
  return i >= 0 && spans[i].to >= range.to;
};
var intersects = (range, spans) => {
  const i = preceding(range.to - 1, spans);
  return i >= 0 && spans[i].to > range.from;
};
function* matches(text2, expression) {
  let match;
  while (match = expression.exec(text2))
    yield match;
}
var escapesAt = (text2, at) => {
  let n = 0;
  while (at > 0 && text2[--at] === "\\")
    n++;
  return n % 2 === 1;
};
function analyzeWriting(text2, tokens) {
  var _a, _b;
  const hidden = [], suspicious = [], protectedRanges = [], confirmed = [];
  if (text2.length > MAX_WRITING_UNITS)
    return { hidden, suspicious };
  markdownTree(text2).iterate({ enter(node) {
    var _a2, _b2;
    if (opaque2.test(node.name))
      protectedRanges.push({ from: node.from, to: node.to });
    const parent = (_a2 = node.node.parent) == null ? void 0 : _a2.name;
    let kind2, to = node.to;
    if (node.name === "EmphasisMark" && parent === "StrongEmphasis")
      kind2 = "strong";
    else if (node.name === "EmphasisMark" && parent === "Emphasis")
      kind2 = "em";
    else if (node.name === "StrikethroughMark" && parent === "Strikethrough")
      kind2 = "strikethrough";
    else if (node.name === "CodeMark" && parent === "InlineCode")
      kind2 = "code";
    else if (node.name === "HeaderMark" && (parent == null ? void 0 : parent.startsWith("ATXHeading"))) {
      kind2 = "header";
      while (/[ \t]/u.test((_b2 = text2[to]) != null ? _b2 : "") && to < text2.length)
        to++;
    } else if (node.name === "Escape" && text2[node.from] === "\\") {
      kind2 = "escape";
      to = node.from + 1;
    }
    if (kind2)
      confirmed.push({ from: node.from, to, kind: kind2 });
  } });
  const hostRanges = /* @__PURE__ */ new Map();
  for (const kind2 of ["strong", "em", "strikethrough", "code", "header", "escape"])
    hostRanges.set(kind2, merged(tokens.filter((t2) => t2.name.split("_").includes(`formatting-${kind2}`) && !/(?:hmd-frontmatter|hmd-codeblock|comment|math)/u.test(t2.name))));
  const emphasisRanges = merged([...hostRanges.get("strong"), ...hostRanges.get("em")]);
  for (const marker2 of confirmed) {
    const host = marker2.kind === "strong" || marker2.kind === "em" ? emphasisRanges : hostRanges.get(marker2.kind);
    if (covered(marker2, host))
      hidden.push(marker2);
  }
  for (const match of matches(text2, /\[\[[^\]\r\n]*(?:\]\]|$)/gu))
    protectedRanges.push({ from: match.index, to: match.index + match[0].length });
  for (const token of tokens)
    if (/(?:^|_)(?:url|hmd-frontmatter|hmd-codeblock|comment|math)(?:_|$)/u.test(token.name))
      protectedRanges.push(token);
  const sorted = merged(confirmed), protectedUnion = merged(protectedRanges);
  for (const match of matches(text2, /`+|\*{2,}|_{2,}|~{2,}/gu)) {
    const from = match.index, to = from + match[0].length;
    if (escapesAt(text2, from) || covered({ from, to }, sorted) || intersects({ from, to }, protectedUnion))
      continue;
    if (match[0][0] === "_" && /[\p{L}\p{N}]/u.test((_a = text2[from - 1]) != null ? _a : "") && /[\p{L}\p{N}]/u.test((_b = text2[to]) != null ? _b : ""))
      continue;
    suspicious.push({ from, to, kind: match[0][0] === "`" ? "backtick" : match[0][0] === "~" ? "strike" : "emphasis" });
  }
  return { hidden, suspicious };
}
function bracketEdit(text2, from, to, input) {
  var _a;
  if (text2.length > MAX_WRITING_UNITS || from !== to || !Number.isInteger(from) || from < 0 || to > text2.length || !/^(?:【{1,2}|】{1,2})$/u.test(input))
    return null;
  const char = input[0], need = 2 - input.length;
  if (need && text2[from - 1] !== char)
    return null;
  const start = from - need, before = text2.slice(0, start);
  if (start < 0 || escapesAt(text2, start) || inProtectedSyntax(text2, start))
    return null;
  const line = before.slice(before.lastIndexOf("\n") + 1);
  if (line.lastIndexOf("](") > line.lastIndexOf(")") || ((_a = line.match(/(?<!\\)`+/gu)) != null ? _a : []).length % 2)
    return null;
  const open = line.lastIndexOf("[[") > line.lastIndexOf("]]");
  if (char === "\u3010") {
    if (open)
      return null;
    return { from: start, to, insert: text2.slice(to, to + 2) === "]]" ? "[[" : "[[]]", cursor: start + 2 };
  }
  if (!open)
    return null;
  return { from: start, to: text2.slice(to, to + 2) === "]]" ? to + 2 : to, insert: "]]", cursor: start + 2 };
}

// src/platform/writing.ts
var EditableCalloutHeader = class extends import_view5.WidgetType {
  constructor(type, explicit, zh) {
    super();
    this.type = type;
    this.explicit = explicit;
    this.zh = zh;
  }
  eq(other) {
    return this.type === other.type && this.explicit === other.explicit && this.zh === other.zh;
  }
  toDOM(view) {
    const doc = view.dom.ownerDocument, header = doc.createElement("span"), icon = doc.createElement("span");
    const info = calloutPresentation(this.type, this.zh);
    header.className = "keyline-next-callout-heading";
    icon.className = "keyline-next-callout-symbol";
    icon.setAttribute("aria-hidden", "true");
    (0, import_obsidian17.setIcon)(icon, info.icon);
    header.append(icon);
    if (this.explicit)
      header.setAttribute("aria-hidden", "true");
    else {
      const label2 = doc.createElement("span");
      label2.textContent = info.label;
      header.append(label2);
    }
    return header;
  }
  ignoreEvent() {
    return true;
  }
};
var redraw = import_state4.StateEffect.define();
var WritingController = class {
  constructor(preferences, zh) {
    this.preferences = preferences;
    this.zh = zh;
    this.instances = /* @__PURE__ */ new Set();
    this.documents = /* @__PURE__ */ new Map();
    this.registrations = /* @__PURE__ */ new Map();
    this.inputStats = { calls: 0, composing: 0, nonTyping: 0, skipped: 0, normalized: 0 };
    this.live = true;
  }
  extension() {
    const owner = this;
    const plugin = import_view5.ViewPlugin.define((view) => new WritingView(view, owner), {
      decorations: (value) => value.decorations,
      provide: (p) => import_view5.EditorView.atomicRanges.of((view) => {
        var _a, _b;
        return (_b = (_a = view.plugin(p)) == null ? void 0 : _a.atomic) != null ? _b : import_view5.Decoration.none;
      }),
      eventHandlers: {
        compositionstart() {
          this.beginComposition();
        },
        compositionend() {
          this.endComposition();
        }
      }
    });
    return [plugin, import_state4.Prec.highest(import_view5.EditorView.inputHandler.of((view, from, to, input, insert) => {
      var _a;
      if (/^[【】]{1,2}$/u.test(input)) {
        owner.inputStats.calls++;
        if (view.composing)
          owner.inputStats.composing++;
      }
      if (!owner.live || view.composing || view.state.readOnly || view.state.doc.length > MAX_WRITING_UNITS || view.state.selection.ranges.length !== 1 || !((_a = view.state.field(import_obsidian17.editorInfoField, false)) == null ? void 0 : _a.file) || !/^[【】]{1,2}$/u.test(input))
        return false;
      const transaction = insert();
      if (!transaction.isUserEvent("input.type") || transaction.isUserEvent("input.type.compose")) {
        owner.inputStats.nonTyping++;
        return false;
      }
      const text2 = view.state.doc.toString();
      const edit2 = owner.preferences().fullwidthLinks ? bracketEdit(text2, from, to, input) : null;
      if (!edit2) {
        owner.inputStats.skipped++;
        return false;
      }
      owner.inputStats.normalized++;
      view.dispatch({
        changes: { from: edit2.from, to: edit2.to, insert: edit2.insert },
        selection: { anchor: edit2.cursor },
        annotations: import_state4.Transaction.userEvent.of("input.type"),
        scrollIntoView: true
      });
      return true;
    }))];
  }
  attach(instance) {
    var _a;
    if (!this.live)
      return false;
    const doc = instance.view.dom.ownerDocument, previous = this.registrations.get(instance);
    if (previous === doc)
      return false;
    if (previous)
      this.detach(instance);
    this.instances.add(instance);
    this.registrations.set(instance, doc);
    const existing = this.documents.get(doc);
    if (existing) {
      existing.count++;
      return true;
    }
    const state = { count: 1, reveal: false, remove() {
    } };
    const set = (value) => {
      if (state.reveal !== value) {
        state.reveal = value;
        this.refresh(doc);
      }
    };
    const down = (event) => {
      if (event.key === "Alt")
        set(true);
    };
    const up = (event) => {
      if (event.key === "Alt" || !event.altKey)
        set(false);
    };
    const clear = () => set(false);
    doc.addEventListener("keydown", down, true);
    doc.addEventListener("keyup", up, true);
    doc.addEventListener("visibilitychange", clear);
    (_a = doc.defaultView) == null ? void 0 : _a.addEventListener("blur", clear);
    state.remove = () => {
      var _a2;
      doc.removeEventListener("keydown", down, true);
      doc.removeEventListener("keyup", up, true);
      doc.removeEventListener("visibilitychange", clear);
      (_a2 = doc.defaultView) == null ? void 0 : _a2.removeEventListener("blur", clear);
    };
    this.documents.set(doc, state);
    return true;
  }
  detach(instance) {
    this.instances.delete(instance);
    const doc = this.registrations.get(instance);
    this.registrations.delete(instance);
    if (!doc)
      return;
    const entry = this.documents.get(doc);
    if (entry && --entry.count === 0) {
      entry.remove();
      this.documents.delete(doc);
    }
  }
  revealed(doc) {
    var _a;
    return this.preferences().optionReveal && !!((_a = this.documents.get(doc)) == null ? void 0 : _a.reveal);
  }
  refresh(doc) {
    if (!this.live)
      return;
    for (const instance of this.instances)
      if (!doc || instance.view.dom.ownerDocument === doc)
        instance.view.dispatch({ effects: redraw.of(null) });
  }
  warnPaste(count2) {
    var _a;
    if (!this.live || !this.preferences().pasteHints || !count2)
      return;
    (_a = this.notice) == null ? void 0 : _a.hide();
    this.notice = new import_obsidian17.Notice(message("pasteWarning", this.zh()).replace("{n}", String(count2)));
  }
  next(editor) {
    var _a;
    const instance = [...this.instances].find((i) => i.editor === editor);
    if (!instance || !this.live || instance.view.composing)
      return false;
    if (instance.view.state.doc.length > MAX_WRITING_UNITS) {
      new import_obsidian17.Notice(message("writingTooLarge", this.zh()));
      return true;
    }
    const analysis = instance.analyze();
    if (!analysis) {
      new import_obsidian17.Notice(message("parsePending", this.zh()));
      return true;
    }
    const at = editor.posToOffset(editor.getCursor("to")), next = (_a = analysis.suspicious.find((r) => r.from >= at)) != null ? _a : analysis.suspicious[0];
    if (!next) {
      new import_obsidian17.Notice(message("noSuspicious", this.zh()));
      return true;
    }
    instance.navigate(next.from, next.to);
    return true;
  }
  inspect(editor) {
    const instance = [...this.instances].find((i) => i.editor === editor);
    if (!instance)
      return null;
    return {
      live: instance.view.state.field(import_obsidian17.editorLivePreviewField, false),
      nodes: instance.tokens,
      analysis: instance.analyze(),
      structure: instance.structure,
      applied: instance.applied,
      revealed: this.revealed(instance.view.dom.ownerDocument),
      inputStats: { ...this.inputStats }
    };
  }
  dispose() {
    var _a;
    this.live = false;
    (_a = this.notice) == null ? void 0 : _a.hide();
    for (const entry of this.documents.values())
      entry.remove();
    this.documents.clear();
    this.registrations.clear();
    for (const instance of this.instances)
      instance.cancelTimers();
  }
};
var WritingView = class {
  constructor(view, owner) {
    this.view = view;
    this.owner = owner;
    this.decorations = import_view5.Decoration.none;
    this.atomic = import_view5.Decoration.none;
    this.tokens = [];
    this.applied = 0;
    this.structure = { quotes: [], separators: [] };
    this.analysis = { hidden: [], suspicious: [] };
    this.destroyed = false;
    this.revision = 0;
    owner.attach(this);
    this.rebuild();
  }
  get editor() {
    var _a;
    return (_a = this.view.state.field(import_obsidian17.editorInfoField, false)) == null ? void 0 : _a.editor;
  }
  analyze() {
    var _a;
    const state = this.view.state, tree = (0, import_language.syntaxTree)(state);
    if (!this.owner.live || !((_a = state.field(import_obsidian17.editorInfoField, false)) == null ? void 0 : _a.file) || state.doc.length > MAX_WRITING_UNITS || !(0, import_language.syntaxTreeAvailable)(state, Math.min(state.doc.length, this.view.viewport.to)))
      return null;
    if (this.doc !== state.doc || this.tree !== tree) {
      this.tokens = [];
      tree.iterate({ enter: (n) => {
        if (n.name !== "Document")
          this.tokens.push({ name: n.name, from: n.from, to: n.to });
      } });
      this.analysis = analyzeWriting(state.doc.toString(), this.tokens);
      this.structure = structurePresentation(state.doc.toString(), this.tokens);
      this.doc = state.doc;
      this.tree = tree;
    }
    return this.analysis;
  }
  rebuild() {
    this.decorations = this.atomic = import_view5.Decoration.none;
    this.applied = 0;
    const analysis = this.analyze(), state = this.view.state, prefs = this.owner.preferences();
    if (!analysis)
      return;
    const visible = (r) => this.view.visibleRanges.some((v) => r.from >= v.from && r.to <= v.to);
    const shown = !!state.field(import_obsidian17.editorLivePreviewField, false);
    const formatted = prefs.hideMarkers && shown && !this.view.composing && !this.owner.revealed(this.view.dom.ownerDocument);
    const hidden = formatted ? analysis.hidden.filter(visible).map((r) => import_view5.Decoration.replace({}).range(r.from, r.to)) : [];
    const layout = [];
    if (formatted)
      for (const line of this.structure.quotes) {
        if (!this.view.visibleRanges.some((r) => r.from <= line.to && r.to >= line.from))
          continue;
        const tone = line.type ? calloutPresentation(line.type, this.owner.zh()).tone : "gray";
        layout.push(import_view5.Decoration.line({
          class: `keyline-next-edit-${line.kind}${line.first ? " is-first" : ""}${line.last ? " is-last" : ""}`,
          attributes: { "data-keyline-callout-tone": tone }
        }).range(line.from));
        hidden.push(import_view5.Decoration.replace({}).range(line.marker.from, line.marker.to));
        if (line.header && line.type)
          hidden.push(import_view5.Decoration.replace({ widget: new EditableCalloutHeader(line.type, !!line.explicitTitle, this.owner.zh()) }).range(line.header.from, line.header.to));
      }
    if (shown && prefs.typographyEnabled)
      for (const separator of this.structure.separators.filter(visible))
        layout.push(import_view5.Decoration.mark({ class: `keyline-next-list-separator is-${separator.task ? "task" : "marker"}` }).range(separator.from, separator.to));
    this.applied = hidden.length;
    this.atomic = import_view5.Decoration.set(hidden, true);
    const text2 = prefs.markSuspicious ? state.doc.toString() : "";
    const warnings = prefs.markSuspicious && !this.view.composing ? analysis.suspicious.filter(visible).map((r) => {
      const range = warningRange(text2, r);
      return import_view5.Decoration.mark({
        class: "keyline-next-suspicious",
        attributes: { title: message(r.kind === "backtick" ? "suspiciousCode" : r.kind === "strike" ? "suspiciousStrike" : "suspiciousEmphasis", this.owner.zh()) }
      }).range(range.from, range.to);
    }) : [];
    this.decorations = import_view5.Decoration.set([...hidden, ...warnings, ...layout], true);
  }
  update(update) {
    const moved = this.owner.attach(this);
    if (update.docChanged)
      this.revision++;
    if (moved || update.docChanged || update.viewportChanged || update.selectionSet || this.tree !== (0, import_language.syntaxTree)(update.state) || update.startState.field(import_obsidian17.editorLivePreviewField, false) !== update.state.field(import_obsidian17.editorLivePreviewField, false) || update.transactions.some((t2) => t2.effects.some((e) => e.is(redraw))))
      this.rebuild();
    if (update.transactions.some((t2) => t2.isUserEvent("input.paste")) && this.owner.preferences().pasteHints) {
      clearTimeout(this.pasteTimer);
      const revision = this.revision, changed = [];
      update.changes.iterChangedRanges((_a, _b, from, to) => changed.push({ from, to }));
      this.pasteTimer = setTimeout(() => {
        var _a;
        if (this.destroyed || this.revision !== revision)
          return;
        const analysis = this.analyze();
        const count2 = (_a = analysis == null ? void 0 : analysis.suspicious.filter((r) => changed.some((c) => r.from < c.to && r.to > c.from)).length) != null ? _a : 0;
        this.owner.warnPaste(count2);
      }, 250);
    }
  }
  navigate(from, to) {
    clearTimeout(this.navigationTimer);
    this.view.focus();
    this.view.dispatch({ selection: { anchor: from }, effects: import_view5.EditorView.scrollIntoView(from, { y: "center" }) });
    const { doc, selection } = this.view.state;
    this.navigationTimer = setTimeout(() => {
      if (this.destroyed || !this.owner.live || this.view.composing || !this.view.hasFocus || this.view.state.doc !== doc || this.view.state.selection !== selection)
        return;
      this.view.dispatch({ selection: { anchor: from, head: to } });
    }, 0);
  }
  beginComposition() {
    clearTimeout(this.compositionTimer);
    const s = this.view.state.selection;
    this.composingBefore = this.owner.preferences().fullwidthLinks && this.view.state.doc.length <= MAX_WRITING_UNITS && s.ranges.length === 1 && s.main.empty ? { text: this.view.state.doc.toString(), from: s.main.from, to: s.main.to } : void 0;
    this.compositionTimer = setTimeout(() => {
      if (!this.destroyed)
        this.view.dispatch({ effects: redraw.of(null) });
    }, 0);
  }
  endComposition() {
    clearTimeout(this.compositionTimer);
    const before = this.composingBefore;
    this.composingBefore = void 0;
    let attempts = 0;
    const finish = () => {
      if (this.destroyed || !this.owner.live)
        return;
      if (this.view.composing && ++attempts < 10) {
        this.compositionTimer = setTimeout(finish, 50);
        return;
      }
      const state = this.view.state, selection = state.selection.main;
      if (before && this.owner.preferences().fullwidthLinks && !this.view.composing && !state.readOnly && state.selection.ranges.length === 1 && selection.empty) {
        const text2 = state.doc.toString();
        const count2 = text2.length - before.text.length;
        if (count2 > 0 && count2 <= 2 && selection.head === before.from + count2 && text2.slice(0, before.from) === before.text.slice(0, before.from) && text2.slice(selection.head) === before.text.slice(before.to)) {
          const edit2 = bracketEdit(before.text, before.from, before.to, text2.slice(before.from, selection.head));
          if (edit2)
            this.view.dispatch({
              changes: { from: edit2.from, to: edit2.to + count2, insert: edit2.insert },
              selection: { anchor: edit2.cursor },
              annotations: import_state4.Transaction.userEvent.of("input.type")
            });
        }
      }
      this.view.dispatch({ effects: redraw.of(null) });
    };
    this.compositionTimer = setTimeout(finish, 0);
  }
  cancelTimers() {
    clearTimeout(this.compositionTimer);
    clearTimeout(this.pasteTimer);
    clearTimeout(this.navigationTimer);
  }
  destroy() {
    this.destroyed = true;
    this.cancelTimers();
    this.owner.detach(this);
  }
};

// src/platform/block-handles.ts
var import_language2 = require("@codemirror/language");
var import_view6 = require("@codemirror/view");
var import_obsidian20 = require("obsidian");

// src/domain/line-drag.ts
var limit = 2 * 1024 * 1024;
var parsed = /* @__PURE__ */ new WeakMap();
var baselines = /* @__PURE__ */ new WeakMap();
function blocks(model) {
  let value = parsed.get(model);
  if (!value) {
    value = parseBlocks(model.text);
    parsed.set(model, value);
  }
  return value;
}
function locked(model, first, last) {
  const start = model.lines[first].from, end = model.lines[last].to;
  return blocks(model).blocks.some((b) => b.locked && b.from <= end && b.to >= start);
}
function lineDocument(text2) {
  const lines = [];
  let from = 0;
  while (true) {
    const lf = text2.indexOf("\n", from), end = lf < 0 ? text2.length : lf;
    const to = lf >= 0 && text2[end - 1] === "\r" ? end - 1 : end;
    lines.push({ from, to, text: text2.slice(from, to), ending: text2.slice(to, lf < 0 ? end : lf + 1) });
    if (lf < 0)
      break;
    from = lf + 1;
  }
  return { text: text2, lines };
}
function lineIndex(model, position) {
  if (!Number.isInteger(position) || position < 0 || position > model.text.length)
    return -1;
  let low = 0, high = model.lines.length;
  while (low + 1 < high) {
    const mid = low + high >>> 1;
    if (model.lines[mid].from <= position)
      low = mid;
    else
      high = mid;
  }
  return low;
}
function lineDragRange(model, position, selection) {
  const at = lineIndex(model, position);
  if (at < 0 || model.text.length > limit)
    return null;
  let first = at, last = at;
  if (selection && selection.from !== selection.to) {
    const from = Math.min(selection.from, selection.to), to = Math.max(selection.from, selection.to);
    const start = lineIndex(model, from), end = lineIndex(model, Math.max(from, to - 1));
    if (start < 0 || lineIndex(model, to) < 0)
      return null;
    if (start < end && start <= at && at <= end) {
      first = start;
      last = end;
    }
  }
  if (locked(model, first, last))
    return null;
  return { first, last };
}
function structure(model, ids) {
  const roles = model.lines.map(() => []), groups = [];
  const tree = markdownTree(model.text);
  const scope = (from, to, role) => {
    for (let i = from; i <= to; i++)
      roles[i].push(role);
  };
  tree.iterate({ enter(node) {
    if (node.name === "Document")
      return;
    const first = lineIndex(model, node.from), last = lineIndex(model, Math.max(node.from, node.to - 1));
    const name2 = node.name, identity = `${ids[first]}:${ids[last]}`;
    if (name2 === "ListItem")
      scope(first, last, `item:${ids[first]}`);
    else if (/^(BulletList|OrderedList)$/u.test(name2))
      scope(first, last, name2);
    else if (name2 === "Blockquote") {
      const callout = /^(?:[ \t]*>[ \t]*)+\[![^\]]+\]/u.test(model.lines[first].text);
      scope(first, last, callout ? `callout:${ids[first]}` : "quote");
    } else if (name2 === "FencedCode")
      scope(first, last, `fence:${identity}`);
    else if (name2 === "Table")
      scope(first, last, `table:${ids[first]}`);
    else if (/^(Paragraph|ATXHeading\d|SetextHeading\d|HorizontalRule|CodeBlock|HTMLBlock|KeylineFrontmatter|KeylineMath|KeylineComment|LinkReference|TableHeader|TableDelimiter|TableRow|CodeMark)$/u.test(name2)) {
      scope(first, last, name2);
    }
    const atomic = /^(SetextHeading\d|HTMLBlock|KeylineFrontmatter|KeylineMath|KeylineComment|LinkReference)$/u.test(name2);
    const inline = /^(Emphasis|StrongEmphasis|Strikethrough|Link|Image|InlineCode|KeylineInlineMath|KeylineInlineComment)$/u.test(name2);
    if (atomic || inline && first !== last) {
      groups.push(`${name2}:${ids.slice(first, last + 1).join(",")}:${model.text.slice(node.from, node.to)}`);
    }
    if (name2 === "Paragraph" && first !== last && /==[\s\S]*\n[\s\S]*==|<\/?[A-Za-z][^>]*>/u.test(model.text.slice(node.from, node.to))) {
      groups.push(`opaque-paragraph:${ids.slice(first, last + 1).join(",")}:${model.text.slice(node.from, node.to)}`);
    }
  } });
  for (const block of blocks(model).blocks) {
    if (!/(?:^|[ \t\n])\^[\w-]+[ \t]*$/u.test(model.text.slice(block.from, block.to)))
      continue;
    const first = lineIndex(model, block.from), last = lineIndex(model, block.to);
    groups.push(`anchor:${ids.slice(first, last + 1).join(",")}:${model.text.slice(block.from, block.to)}`);
  }
  return { roles: roles.map((parts) => parts.join("/")), groups: groups.sort() };
}
function relocateLines(model, source, target, after) {
  var _a;
  const { first, last } = source, { lines, text: text2 } = model;
  if (text2.length > limit || ![first, last, target].every(Number.isInteger) || first < 0 || last < first || last >= lines.length || target < 0 || target >= lines.length || target >= first && target <= last)
    return null;
  if (locked(model, first, last))
    return null;
  const boundary = target + Number(after);
  if (boundary === first || boundary === last + 1)
    return null;
  const ids = lines.map((_, i) => i), moving = ids.slice(first, last + 1), order = ids.filter((i) => i < first || i > last);
  order.splice(boundary > last ? boundary - moving.length : boundary, 0, ...moving);
  const candidateText = order.map((id, index) => lines[id].text + lines[index].ending).join("");
  if (candidateText === text2)
    return null;
  const candidate = lineDocument(candidateText);
  const originalStructure = (_a = baselines.get(model)) != null ? _a : structure(model, ids);
  baselines.set(model, originalStructure);
  const nextStructure = structure(candidate, order);
  if (order.some((id, index) => originalStructure.roles[id] !== nextStructure.roles[index]) || originalStructure.groups.length !== nextStructure.groups.length || originalStructure.groups.some((group, i) => group !== nextStructure.groups[i]))
    return null;
  const start = Math.min(first, target), end = Math.max(last, target), movedAt = order.indexOf(first);
  return {
    from: lines[start].from,
    to: lines[end].to,
    before: text2.slice(lines[start].from, lines[end].to),
    insert: candidateText.slice(candidate.lines[start].from, candidate.lines[end].to),
    anchor: candidate.lines[movedAt].from,
    head: candidate.lines[movedAt + moving.length - 1].to
  };
}
function relocateLineBlocks(model, source, target, placement) {
  if (model.text.length > limit || !Number.isInteger(source.first) || !Number.isInteger(source.last) || source.first < 0 || source.last < source.first || source.last >= model.lines.length)
    return null;
  const parsed2 = blocks(model), from = model.lines[source.first].from, to = model.lines[source.last].to;
  const selected = blockSelection(parsed2, from, to), resolved = parsed2.blocks.find((b) => b.id === target.id);
  if (!resolved || !selected.length || selected[0].from !== from || selected[selected.length - 1].to !== to)
    return null;
  return relocateBlocks(parsed2, selected, resolved, placement);
}

// src/platform/line-drag.ts
var cache2 = /* @__PURE__ */ new WeakMap();
function captureLineDrag(editor, at, includeSelection, guard) {
  if (!guard() || editor.listSelections().length !== 1)
    return null;
  const text2 = editor.getValue();
  if (text2.length > 2 * 1024 * 1024)
    return null;
  let model = cache2.get(editor);
  if (!model || model.text !== text2) {
    model = lineDocument(text2);
    cache2.set(editor, model);
  }
  const from = editor.posToOffset(editor.getCursor("from")), to = editor.posToOffset(editor.getCursor("to"));
  const range = lineDragRange(model, at, includeSelection ? { from, to } : void 0);
  return range ? { editor, model, range, valid: () => guard() && editor.getValue() === text2 && editor.listSelections().length === 1 && editor.posToOffset(editor.getCursor("from")) === from && editor.posToOffset(editor.getCursor("to")) === to } : null;
}

// src/domain/handle-layout.ts
function handleLayout(viewport, content2, row, side, count2, nativeFold) {
  if (![viewport.left, viewport.right, viewport.top, viewport.bottom, content2.left, content2.right, row.top, row.bottom, count2].every(Number.isFinite) || viewport.right - viewport.left < 100 || viewport.bottom - viewport.top < 30 || count2 < 1 || count2 > 3 || !Number.isInteger(count2))
    return null;
  const gutter = side === "left" ? content2.left - viewport.left : viewport.right - content2.right;
  const size = Math.max(20, Math.min(28, Math.floor((gutter - 10 - (count2 - 1) * 2) / count2)));
  const width = size * count2 + (count2 - 1) * 2;
  const x = side === "left" ? Math.max(viewport.left + 6, content2.left - width - 4) : Math.min(content2.right + 4, viewport.right - width - 6);
  const y = (row.top + row.bottom - size) / 2;
  if (y < viewport.top || y + size > viewport.bottom)
    return null;
  if (side === "left" && nativeFold && Object.values(nativeFold).every(Number.isFinite) && nativeFold.right > nativeFold.left && nativeFold.bottom > nativeFold.top && y < nativeFold.bottom && y + size > nativeFold.top && x < nativeFold.right && x + width + 4 > nativeFold.left) {
    const left = handleLayout(viewport, { left: Math.min(content2.left, nativeFold.left), right: content2.right }, row, side, count2);
    if (left && left.x + left.size * count2 + (count2 - 1) * 2 + 4 <= nativeFold.left)
      return left;
    const right = handleLayout(viewport, content2, row, "right", count2);
    return right && right.x >= Math.max(viewport.left + 6, nativeFold.right + 4) ? { ...right, side: "right" } : null;
  }
  return { x, y, size };
}

// src/platform/handle-menu.ts
var import_obsidian18 = require("obsidian");

// src/domain/rich-format.ts
var tones = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"];
var plain = { text: "default", background: "default" };
function toneColor(tone) {
  return tone === "default" ? "inherit" : tone === "gray" ? "var(--text-muted)" : tone === "brown" ? "color-mix(in srgb, var(--color-orange) 62%, var(--text-muted))" : `var(--color-${tone})`;
}
function inkStyle(ink) {
  return [
    ink.text !== "default" ? `color: ${toneColor(ink.text)};` : "",
    ink.background !== "default" ? `background-color: color-mix(in srgb, ${toneColor(ink.background)} ${ink.background === "yellow" ? 42 : 22}%, transparent);` : ""
  ].filter(Boolean).join(" ");
}
function wrap(text2, ink) {
  const style = inkStyle(ink);
  if (!style || !text2)
    return { value: text2, prefix: 0 };
  const open = `<span data-keyline-color="${ink.text}:${ink.background}" style="${style}">`;
  return { value: open + text2 + "</span>", prefix: open.length };
}
function validRange(text2, from, to) {
  return text2.length <= 2 * 1024 * 1024 && Number.isInteger(from) && Number.isInteger(to) && from >= 0 && to > from && to <= text2.length && to - from <= 16e3 && !/[\r\n]/u.test(text2.slice(from, to));
}
function ownedInk(text2, from, to) {
  const names2 = ["default", ...tones].join("|"), pattern = new RegExp(`<span data-keyline-color="(${names2}):(${names2})" style="([^"]*)">`, "gu");
  let match;
  while (match = pattern.exec(text2)) {
    const start = match.index, body = start + match[0].length, close = text2.indexOf("</span>", body), end = close + 7;
    if (close < 0 || close - body > 16e3 || /[\r\n]|<span\b/iu.test(text2.slice(body, close)))
      continue;
    const ink = { text: match[1], background: match[2] };
    if (match[3] !== inkStyle(ink))
      continue;
    if (from === start && to === end)
      return { start, end, body, close, from: body, to: close, ink };
    if (from >= body && to <= close)
      return { start, end, body, close, from, to, ink };
  }
  return null;
}
function inlineBoundarySafe(text2, from, to, allowLinks) {
  let safe = true, hasReferences = false;
  const tree = markdownTree(text2);
  tree.iterate({ enter({ node }) {
    if (node.name === "LinkReference")
      hasReferences = true;
  } });
  tree.iterate({ from, to, enter({ node }) {
    if (node.to <= from || node.from >= to)
      return;
    if (!/^(?:StrongEmphasis|Emphasis|Strikethrough|Link|Image|Autolink|Escape)$/u.test(node.name))
      return;
    const whole = from <= node.from && to >= node.to;
    const literalBrackets = node.name === "Link" && !node.getChild("URL") && !node.getChild("LinkLabel") && !hasReferences;
    if (/^(?:Link|Image|Autolink)$/u.test(node.name) && !allowLinks && !(literalBrackets && whole)) {
      safe = false;
      return false;
    }
    if (whole)
      return;
    if (node.name === "Image" || node.name === "Autolink" || node.name === "Escape") {
      safe = false;
      return false;
    }
    const mark = node.name === "Link" ? "LinkMark" : node.name === "Strikethrough" ? "StrikethroughMark" : "EmphasisMark";
    const marks = node.getChildren(mark), first = marks[0], last = node.name === "Link" ? marks[1] : marks[marks.length - 1];
    if (!first || !last || from < first.to || to > last.from)
      safe = false;
  } });
  const wiki = /!?\[\[[^\[\]\r\n]*\]\]/gu;
  let found;
  while (found = wiki.exec(text2)) {
    let escapes = 0;
    for (let p = found.index - 1; p >= 0 && text2[p] === "\\"; p--)
      escapes++;
    if (escapes % 2)
      continue;
    const end = found.index + found[0].length;
    if (from < end && to > found.index && (!allowLinks || from > found.index || to < end))
      safe = false;
  }
  return safe;
}
function selectionInk(text2, from, to) {
  var _a, _b;
  return (_b = (_a = ownedInk(text2, from, to)) == null ? void 0 : _a.ink) != null ? _b : { ...plain };
}
function colorSelection(text2, from, to, patch) {
  var _a, _b, _c, _d, _e;
  if (!validRange(text2, from, to))
    return null;
  for (const value of Object.values(patch))
    if (value !== "default" && !tones.includes(value))
      return null;
  const own3 = ownedInk(text2, from, to), start = (_a = own3 == null ? void 0 : own3.from) != null ? _a : from, end = (_b = own3 == null ? void 0 : own3.to) != null ? _b : to;
  const selected = text2.slice(start, end);
  if (!selected.trim() || inProtectedSyntax(text2, start, end) || !inlineBoundarySafe(text2, start, end, true))
    return null;
  const ink = { ...(_c = own3 == null ? void 0 : own3.ink) != null ? _c : plain, ...patch };
  const changed = wrap(selected, ink), before = own3 ? wrap(text2.slice(own3.body, start), own3.ink).value : "";
  const after = own3 ? wrap(text2.slice(end, own3.close), own3.ink).value : "";
  const insert = before + changed.value + after, editFrom = (_d = own3 == null ? void 0 : own3.start) != null ? _d : from, editTo = (_e = own3 == null ? void 0 : own3.end) != null ? _e : to;
  if (insert === text2.slice(editFrom, editTo))
    return null;
  const anchor = editFrom + before.length + changed.prefix;
  return { from: editFrom, to: editTo, insert, anchor, head: anchor + selected.length };
}
function selectedLink(text2, from, to) {
  var _a;
  if (!validRange(text2, from, to) || inProtectedSyntax(text2, from, to))
    return null;
  const wiki = /!?\[\[([^\[\]\r\n|]+)(?:\|([^\[\]\r\n]*))?\]\]/gu;
  let match;
  while (match = wiki.exec(text2)) {
    if (match[0].startsWith("!"))
      continue;
    let escapes = 0;
    for (let p = match.index - 1; p >= 0 && text2[p] === "\\"; p--)
      escapes++;
    if (escapes % 2)
      continue;
    const start = match.index, end = start + match[0].length;
    const label2 = (_a = match[2]) != null ? _a : match[1], body = start + 2 + (match[2] === void 0 ? 0 : match[1].length + 1);
    if (from === start && to === end || from >= body && to <= body + label2.length)
      return { from: start, to: end, label: label2, destination: match[1], kind: "wiki" };
  }
  let found = null;
  markdownTree(text2).iterate({ from, to, enter({ node }) {
    if (node.name === "Image")
      return false;
    if (node.name !== "Link")
      return;
    const url = node.getChild("URL"), marks = node.getChildren("LinkMark");
    if (!url || marks.length < 4 || text2.slice(marks[1].from, marks[1].to) !== "]")
      return;
    const start = marks[0].to, end = marks[1].from;
    if (from === node.from && to === node.to || from >= start && to <= end)
      found = {
        from: node.from,
        to: node.to,
        label: text2.slice(start, end),
        destination: text2.slice(url.from, url.to).replace(/^<|>$/gu, ""),
        kind: "url",
        title: text2.slice(url.to, node.to - 1)
      };
  } });
  return found;
}
function externalDestination(input) {
  const value = input.trim();
  if (!value || /[\x00-\x20<>"]/u.test(value))
    return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:", "mailto:"].includes(url.protocol) || url.username || url.password)
      return null;
    if (url.protocol === "mailto:" && !url.pathname)
      return null;
    return url.href;
  } catch (e) {
    return null;
  }
}
function escapeLabel(label2) {
  let result = "", escapes = 0;
  for (const ch of label2) {
    if ((ch === "[" || ch === "]") && escapes % 2 === 0)
      result += "\\";
    result += ch;
    escapes = ch === "\\" ? escapes + 1 : 0;
  }
  return result;
}
function externalLinkEdit(text2, from, to, destination) {
  var _a, _b, _c, _d;
  if (!validRange(text2, from, to) || inProtectedSyntax(text2, from, to))
    return null;
  const target = externalDestination(destination);
  if (!target)
    return null;
  const old = selectedLink(text2, from, to), selected = text2.slice(from, to);
  if (!old && (!selected.trim() || !inlineBoundarySafe(text2, from, to, false) || /!?\[\[|\]\(/u.test(selected)))
    return null;
  const label2 = (old == null ? void 0 : old.kind) === "url" ? old.label : escapeLabel((_a = old == null ? void 0 : old.label) != null ? _a : selected);
  const insert = `[${label2}](<${target}>${(_b = old == null ? void 0 : old.title) != null ? _b : ""})`, start = (_c = old == null ? void 0 : old.from) != null ? _c : from, end = (_d = old == null ? void 0 : old.to) != null ? _d : to;
  if (text2.slice(start, end) === insert)
    return null;
  return { from: start, to: end, insert, anchor: start + 1, head: start + 1 + label2.length };
}
function unlinkSelection(text2, from, to) {
  const link = selectedLink(text2, from, to);
  return link ? { from: link.from, to: link.to, insert: link.label, anchor: link.from, head: link.from + link.label.length } : null;
}

// src/domain/handle-menu.ts
function handleRow(model, at) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const text2 = model.text;
  if (text2.length > 2 * 1024 * 1024 || !Number.isInteger(at) || at < 0 || at > text2.length)
    return null;
  const from = at === 0 ? 0 : text2.lastIndexOf("\n", at - 1) + 1;
  const end = text2.indexOf("\n", from), to = end < 0 ? text2.length : end - Number(text2[end - 1] === "\r");
  const value = text2.slice(from, to), block = blockAt(model, from);
  const ownedColour = () => colorSelection(text2, from, to, { text: "default", background: "default" });
  if ((block == null ? void 0 : block.locked) || inProtectedSyntax(text2, from, to, true) && !ownedColour())
    return null;
  if (block && !["paragraph", "heading", "quote", "item"].includes(block.kind))
    return null;
  if (block && block.kind !== "paragraph" && (block.from !== from || block.to !== to))
    return null;
  if ((block == null ? void 0 : block.kind) === "item") {
    const list = model.blocks.find((b) => b.id === block.parent);
    if (!list || list.parent !== null || block.children.length)
      return null;
  } else if (block == null ? void 0 : block.parent)
    return null;
  if (/(?:^|\s)\^[\w-]+[ \t]*$/u.test(value))
    return null;
  let prefix = "";
  if ((block == null ? void 0 : block.kind) === "heading")
    prefix = (_b = (_a = value.match(/^ {0,3}#{1,6}(?:[ \t]+|$)/u)) == null ? void 0 : _a[0]) != null ? _b : "";
  if ((block == null ? void 0 : block.kind) === "item")
    prefix = (_d = (_c = value.match(/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?/u)) == null ? void 0 : _c[0]) != null ? _d : "";
  if ((block == null ? void 0 : block.kind) === "quote")
    prefix = (_f = (_e = value.match(/^ {0,3}>[ \t]?/u)) == null ? void 0 : _e[0]) != null ? _f : "";
  if (block && block.kind !== "paragraph" && !prefix)
    return null;
  const body = value.slice(prefix.length);
  return { from, to, bodyFrom: from + prefix.length, body, plain: !prefix, eol: (_h = (_g = text2.match(/\r?\n/u)) == null ? void 0 : _g[0]) != null ? _h : "\n" };
}
function handleConversion(model, row, target) {
  var _a, _b, _c;
  const actual = handleRow(model, row.from);
  if (!actual || JSON.stringify(actual) !== JSON.stringify(row))
    return null;
  const before = model.text.slice(row.from, row.to), eol = row.eol, body = row.body;
  let insert;
  if (target === "divider") {
    const following = model.text.slice(row.to).match(/^(?:\r?\n){0,2}/u)[0].split("\n").length - 1;
    const value = `${eol}${eol}---${eol.repeat(2 - following)}`;
    return { from: row.to, to: row.to, before: "", insert: value, anchor: row.to, head: row.to };
  }
  if (target === "paragraph")
    insert = body;
  else if (/^h[1-6]$/u.test(target))
    insert = "#".repeat(Number(target.slice(1))) + " " + body;
  else if (target === "bullet")
    insert = "- " + body;
  else if (target === "number")
    insert = "1. " + body;
  else if (target === "task") {
    const checked = (_b = (_a = before.match(/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+\[([ xX])\]/u)) == null ? void 0 : _a[1]) != null ? _b : " ";
    insert = `- [${checked}] ` + body;
  } else if (target === "quote")
    insert = "> " + body;
  else if (target === "code") {
    const fence = "`".repeat(Math.max(2, ...((_c = body.match(/`+/gu)) != null ? _c : []).map((s) => s.length)) + 1);
    insert = `${fence}${eol}${body}${eol}${fence}`;
  } else if (target === "math") {
    if (body.includes("$$"))
      return null;
    insert = `$$${eol}${body}${eol}$$`;
  } else if (target.startsWith("callout-") && calloutTypes.includes(target.slice(8)))
    insert = `> [!${target.slice(8)}]${eol}> ${body}`;
  else
    return null;
  if (insert === before)
    return null;
  const candidate = parseBlocks(model.text.slice(0, row.from) + insert + model.text.slice(row.to));
  if (candidate.blocks.some((b) => b.locked && b.from <= row.from && b.to >= row.from + insert.length))
    return null;
  return { from: row.from, to: row.to, before, insert, anchor: row.from, head: row.from };
}
function handleDelete(model, row) {
  var _a, _b;
  const actual = handleRow(model, row.from);
  if (!actual || JSON.stringify(actual) !== JSON.stringify(row))
    return null;
  const from = row.from, tail = model.text.slice(row.to), eol = (_b = (_a = tail.match(/^\r?\n/u)) == null ? void 0 : _a[0]) != null ? _b : "";
  const to = row.to + eol.length;
  if (to === from)
    return null;
  return { from, to, before: model.text.slice(from, to), insert: "", anchor: from, head: from };
}

// src/platform/handle-menu.ts
function captureHandleMenu(app, editor, file, at, guard, doc, zh) {
  var _a, _b, _c;
  const text2 = editor.getValue(), path = file.path;
  if (!guard() || text2.length > 2 * 1024 * 1024 || editor.listSelections().length !== 1)
    return null;
  const selection = JSON.stringify(editor.listSelections()), model = parseBlocks(text2), row = handleRow(model, at);
  const blocks2 = blockSelection(model, at, at);
  if (!row && (!blocks2.length || blocks2.some((b) => b.locked)))
    return null;
  const valid = () => guard() && file.path === path && app.vault.getAbstractFileByPath(path) === file && editor.getValue() === text2 && JSON.stringify(editor.listSelections()) === selection;
  const context = { editor, file, text: text2, from: (_a = row == null ? void 0 : row.bodyFrom) != null ? _a : at, to: (_b = row == null ? void 0 : row.to) != null ? _b : at, valid };
  const commit = (plan) => {
    if (!valid() || applyBlockEdit(text2, plan) === null)
      return false;
    editor.replaceRange(plan.insert, editor.offsetToPos(plan.from), editor.offsetToPos(plan.to), "set");
    editor.focus();
    return true;
  };
  const remove = row && handleDelete(model, row), clipboard = (_c = doc.defaultView) == null ? void 0 : _c.navigator.clipboard;
  const copyPlan = blockLinkPlan(model, blocks2, path, "ki-probe");
  const actions = {
    plain: !!(row == null ? void 0 : row.plain),
    commit,
    conversion(target) {
      if (row)
        return handleConversion(model, row, target);
      if (blocks2.some((b) => b.kind === "item" && (b.depth > 1 || b.children.length > 0)))
        return null;
      return target === "code" || target === "math" || target === "divider" || target.startsWith("callout-") ? selectionBlockPlan(model, blocks2, target) : convertBlocks(model, blocks2, target);
    },
    canColor: !!row && !!(colorSelection(text2, row.bodyFrom, row.to, { text: "blue" }) || colorSelection(text2, row.bodyFrom, row.to, { text: "red" })),
    color(patch) {
      const edit2 = row && colorSelection(text2, row.bodyFrom, row.to, patch);
      if (!edit2 || !commit({ ...edit2, before: text2.slice(edit2.from, edit2.to) }))
        return false;
      editor.setCursor(editor.offsetToPos(edit2.head));
      return true;
    },
    remove: remove ? () => {
      commit(remove);
    } : void 0,
    copy: copyPlan && clipboard ? () => {
      if (!valid())
        return;
      const entropy = new Uint32Array(2);
      doc.defaultView.crypto.getRandomValues(entropy);
      const plan = blockLinkPlan(model, blocks2, path, `ki-${Array.from(entropy, (n) => n.toString(36)).join("-")}`);
      if (!plan || plan.edit && !commit(plan.edit))
        return;
      void clipboard.writeText(plan.link).then(
        () => new import_obsidian18.Notice(zh ? "\u533A\u5757\u94FE\u63A5\u5DF2\u590D\u5236" : "Block link copied"),
        () => new import_obsidian18.Notice(zh ? "\u65E0\u6CD5\u5199\u5165\u526A\u8D34\u677F\u3002\u65B0\u589E\u7684\u533A\u5757 ID \u53EF\u64A4\u9500\u3002" : "Could not write to clipboard. A newly added block ID can be undone.")
      );
    } : void 0
  };
  return { context, actions };
}

// src/platform/selection-menu.ts
var import_obsidian19 = require("obsidian");
var calloutLabels = {
  note: ["Note", "\u4FBF\u7B7E", "pencil"],
  info: ["Info", "\u4FE1\u606F", "info"],
  todo: ["Todo", "\u5F85\u529E", "check-circle"],
  tip: ["Tip", "\u63D0\u793A", "flame"],
  success: ["Success", "\u6210\u529F", "check"],
  question: ["Question", "\u95EE\u9898", "help-circle"],
  warning: ["Warning", "\u8B66\u544A", "alert-triangle"],
  failure: ["Failure", "\u5931\u8D25", "x-circle"],
  danger: ["Danger", "\u5371\u9669", "zap"],
  bug: ["Bug", "\u7F3A\u9677", "bug"],
  example: ["Example", "\u793A\u4F8B", "list"],
  quote: ["Quote", "\u5F15\u7528", "quote"]
};
var SelectionMenu = class {
  constructor(app, owner, context, point, doc, initial, release, actions) {
    this.app = app;
    this.owner = owner;
    this.context = context;
    this.point = point;
    this.doc = doc;
    this.release = release;
    this.actions = actions;
    this.closed = false;
    this.acting = false;
    this.windowBlur = () => this.close();
    this.viewport = (e) => {
      if (e.type === "resize" || !this.root.contains(e.target))
        this.close();
    };
    var _a, _b;
    this.root = doc.createElement("div");
    this.root.className = "keyline-next-format-popover";
    this.root.dataset.keyboard = "false";
    this.panel = this.createPanel("main");
    this.root.append(this.panel);
    doc.body.append(this.root);
    this.scope = new import_obsidian19.Scope(app.scope);
    this.scope.register([], "Escape", () => {
      this.close(true);
      return false;
    });
    for (const key of ["ArrowUp", "ArrowDown", "Home", "End", "ArrowLeft", "ArrowRight", "Enter", " "]) {
      this.scope.register([], key, () => {
        this.navigate(key);
        return false;
      });
    }
    this.pointer = (e) => {
      if (!this.root.contains(e.target))
        this.close();
    };
    this.focus = (e) => {
      if (!this.acting && !this.root.contains(e.target))
        this.close();
    };
    doc.addEventListener("pointerdown", this.pointer, true);
    doc.addEventListener("focusin", this.focus, true);
    doc.addEventListener("scroll", this.viewport, true);
    (_a = doc.defaultView) == null ? void 0 : _a.addEventListener("resize", this.viewport);
    (_b = doc.defaultView) == null ? void 0 : _b.addEventListener("blur", this.windowBlur);
    app.keymap.pushScope(this.scope);
    this.render();
    if (initial === "color")
      this.showSubmenu("color");
    this.position();
    this.focusFirst(this.panel);
  }
  createPanel(kind2) {
    const panel = this.doc.createElement("div");
    panel.className = `keyline-next-format-panel keyline-next-format-${kind2}`;
    panel.setAttribute("role", "menu");
    panel.setAttribute("aria-label", kind2 === "callout" ? "Callout" : message(kind2 === "color" ? "colors" : "blockType", this.owner.zh()));
    const list = this.doc.createElement("div");
    list.className = "keyline-next-format-items";
    panel.append(list);
    return panel;
  }
  contents(panel) {
    return panel.firstElementChild;
  }
  title(panel, label2) {
    const e = this.doc.createElement("div");
    e.className = "keyline-next-format-heading";
    e.textContent = label2;
    this.contents(panel).append(e);
  }
  separator(panel) {
    const e = this.doc.createElement("hr");
    e.setAttribute("role", "separator");
    this.contents(panel).append(e);
  }
  button(panel, label2, icon, action, disabled = false) {
    const b = this.doc.createElement("button");
    b.type = "button";
    b.setAttribute("role", "menuitem");
    b.disabled = disabled;
    const glyph = this.doc.createElement("span");
    glyph.className = "keyline-next-format-glyph";
    (0, import_obsidian19.setIcon)(glyph, icon);
    const text2 = this.doc.createElement("span");
    text2.textContent = label2;
    b.append(glyph, text2);
    b.addEventListener("click", () => {
      if (this.closed || b.disabled)
        return;
      this.acting = true;
      try {
        action();
      } finally {
        this.acting = false;
      }
    });
    b.addEventListener("pointerenter", () => {
      this.root.dataset.keyboard = "false";
      if (!b.disabled)
        b.focus({ preventScroll: true });
      if (panel === this.panel && !b.dataset.submenu && this.submenu) {
        this.submenu.remove();
        this.submenu = void 0;
        for (const opener of Array.from(this.panel.querySelectorAll("[data-submenu]")))
          opener.setAttribute("aria-expanded", "false");
      }
    });
    this.contents(panel).append(b);
    return b;
  }
  render() {
    var _a;
    const zh = this.owner.zh(), block = this.actions ? null : captureBlock(this.context.editor, this.context.valid);
    this.title(this.panel, zh ? "\u8F6C\u6362\u6210" : "Turn into");
    const icons = { paragraph: "text", task: "check-square", bullet: "list", number: "list-ordered", quote: "quote" };
    for (const target of conversions.filter((target2) => target2 !== "h6")) {
      const plan = this.actions ? this.actions.conversion(target) : block && convertBlocks(block.model, block.blocks, target);
      const unchangedText = target === "paragraph" && (this.actions ? this.actions.plain : block == null ? void 0 : block.blocks.every((b2) => b2.kind === "paragraph"));
      const icon = target.startsWith("h") ? `heading-${target.slice(1)}` : icons[target];
      const shortLabels = { paragraph: "\u6587\u672C", task: "\u5F85\u529E\u5217\u8868", bullet: "\u65E0\u5E8F\u5217\u8868", number: "\u6709\u5E8F\u5217\u8868" };
      const label2 = zh && target in shortLabels ? shortLabels[target] : conversionLabels[target][zh ? 1 : 0];
      const b = this.button(this.panel, label2, icon, () => {
        if (plan)
          this.actions ? this.actions.commit(plan) : block && commitBlockEdit(block, plan);
        this.close(true);
      }, !plan && !unchangedText);
      b.dataset.convert = target;
    }
    for (const [target, en, cn, icon] of [
      ["code", "Code block", "\u4EE3\u7801\u5757", "code"],
      ["math", "Math block", "\u6570\u5B66\u5757", "sigma"],
      ["divider", "Divider", "\u5206\u5272\u7EBF", "minus"]
    ]) {
      const plan = this.actions ? this.actions.conversion(target) : block && selectionBlockPlan(block.model, block.blocks, target);
      const b = this.button(this.panel, zh ? cn : en, icon, () => {
        if (plan)
          this.actions ? this.actions.commit(plan) : block && commitBlockEdit(block, plan);
        this.close(true);
      }, !plan);
      b.dataset.convert = target;
      if (target === "divider")
        b.title = zh ? "\u5728\u5757\u540E\u63D2\u5165\u5206\u5272\u7EBF\uFF0C\u4FDD\u7559\u539F\u6587" : "Insert a divider after this block; keep its text";
    }
    this.submenuButton("callout", "Callout", "pencil");
    this.separator(this.panel);
    this.submenuButton("color", zh ? "\u989C\u8272" : "Color", "paint-roller");
    this.separator(this.panel);
    const link = block && blockLinkPlan(block.model, block.blocks, this.context.file.path, "ki-probe");
    const copy2 = this.button(this.panel, zh ? "\u62F7\u8D1D\u533A\u5757\u94FE\u63A5" : "Copy block link", "link", () => {
      var _a2, _b, _c;
      if (this.actions) {
        (_b = (_a2 = this.actions).copy) == null ? void 0 : _b.call(_a2);
        this.close(true);
        return;
      }
      if (!(block == null ? void 0 : block.valid())) {
        this.close();
        return;
      }
      const entropy = new Uint32Array(2);
      this.doc.defaultView.crypto.getRandomValues(entropy);
      const plan = blockLinkPlan(block.model, block.blocks, this.context.file.path, `ki-${Array.from(entropy, (n) => n.toString(36)).join("-")}`);
      if (!plan || plan.edit && !commitBlockEdit(block, plan.edit)) {
        this.close();
        return;
      }
      const clipboard = (_c = this.doc.defaultView) == null ? void 0 : _c.navigator.clipboard;
      if (clipboard)
        void clipboard.writeText(plan.link).then(
          () => new import_obsidian19.Notice(zh ? "\u533A\u5757\u94FE\u63A5\u5DF2\u590D\u5236" : "Block link copied"),
          () => new import_obsidian19.Notice(zh ? "\u65E0\u6CD5\u5199\u5165\u526A\u8D34\u677F\u3002\u65B0\u589E\u7684\u533A\u5757 ID \u53EF\u64A4\u9500\u3002" : "Could not write to clipboard. A newly added block ID can be undone.")
        );
      else
        new import_obsidian19.Notice(zh ? "\u5F53\u524D\u7A97\u53E3\u65E0\u6CD5\u4F7F\u7528\u526A\u8D34\u677F" : "Clipboard is unavailable in this window");
      this.close(true);
    }, this.actions ? !this.actions.copy : !link || !((_a = this.doc.defaultView) == null ? void 0 : _a.navigator.clipboard));
    copy2.dataset.blockAction = "copy-link";
    const shortcut = this.doc.createElement("span");
    shortcut.className = "keyline-next-format-shortcut";
    shortcut.textContent = import_obsidian19.Platform.isMacOS ? "\u2318\u2303L" : "Ctrl+Alt+L";
    copy2.append(shortcut);
    this.scope.register(import_obsidian19.Platform.isMacOS ? ["Mod", "Ctrl"] : ["Ctrl", "Alt"], "l", () => {
      copy2.click();
      return false;
    });
    const remove = this.button(this.panel, zh ? "\u5220\u9664" : "Delete", "trash-2", () => {
      var _a2, _b;
      if (this.actions)
        (_b = (_a2 = this.actions).remove) == null ? void 0 : _b.call(_a2);
      else if (block)
        performBlock(block, "delete");
      this.close(true);
    }, this.actions ? !this.actions.remove : !block);
    remove.dataset.blockAction = "delete";
    const deleteShortcut = this.doc.createElement("span");
    deleteShortcut.className = "keyline-next-format-shortcut";
    deleteShortcut.textContent = "Del";
    remove.append(deleteShortcut);
    this.scope.register([], "Delete", () => {
      remove.click();
      return false;
    });
  }
  submenuButton(page, label2, icon) {
    const b = this.button(this.panel, label2, icon, () => this.showSubmenu(page, true));
    b.dataset.submenu = page;
    b.setAttribute("aria-haspopup", "menu");
    b.setAttribute("aria-expanded", "false");
    const arrow = this.doc.createElement("span");
    (0, import_obsidian19.setIcon)(arrow, "chevron-right");
    b.append(arrow);
    b.addEventListener("pointerenter", () => this.showSubmenu(page));
  }
  showSubmenu(page, focus = false) {
    var _a;
    if (!this.submenu || this.page !== page) {
      (_a = this.submenu) == null ? void 0 : _a.remove();
      this.page = page;
      this.submenu = this.createPanel(page);
      this.root.append(this.submenu);
      if (page === "callout") {
        const block = this.actions ? null : captureBlock(this.context.editor, this.context.valid);
        this.title(this.submenu, "Callout");
        for (const type of calloutTypes) {
          const target = `callout-${type}`;
          const plan = this.actions ? this.actions.conversion(target) : block && selectionBlockPlan(block.model, block.blocks, target);
          const labels3 = calloutLabels[type];
          const b = this.button(this.submenu, labels3[this.owner.zh() ? 1 : 0], labels3[2], () => {
            if (plan)
              this.actions ? this.actions.commit(plan) : block && commitBlockEdit(block, plan);
            this.close(true);
          }, !plan);
          b.dataset.convert = `callout-${type}`;
        }
      } else {
        const ink = selectionInk(this.context.text, this.context.from, this.context.to), zh = this.owner.zh();
        for (const kind2 of ["text", "background"]) {
          if (kind2 === "background")
            this.separator(this.submenu);
          this.title(this.submenu, zh ? kind2 === "text" ? "\u6587\u672C\u989C\u8272" : "\u80CC\u666F\u989C\u8272" : kind2 === "text" ? "Text color" : "Background color");
          for (const tone of ["default", ...tones]) {
            const labels3 = { default: "toneDefault", gray: "toneGray", brown: "toneBrown", orange: "toneOrange", yellow: "toneYellow", green: "toneGreen", blue: "toneBlue", purple: "tonePurple", pink: "tonePink", red: "toneRed" };
            const label2 = message(labels3[tone], zh) + (zh ? `${tone === "default" ? "" : "\u8272"}${kind2 === "text" ? "\u6587\u672C" : "\u80CC\u666F"}` : "");
            const b = this.button(this.submenu, label2, "", () => {
              this.actions ? this.actions.color({ [kind2]: tone }) : this.owner.color(this.context, { [kind2]: tone });
              this.close(true);
            }, this.actions && !this.actions.canColor);
            b.dataset.color = `${kind2}:${tone}`;
            b.setAttribute("aria-checked", String(ink[kind2] === tone));
            b.setAttribute("role", "menuitemradio");
            const glyph = b.firstElementChild;
            glyph.textContent = kind2 === "text" ? "A" : "";
            glyph.classList.add("keyline-next-format-swatch");
            glyph.dataset.tone = tone;
            if (tone !== "default")
              glyph.style.color = toneColor(tone);
          }
        }
      }
    }
    for (const b of Array.from(this.panel.querySelectorAll("[data-submenu]")))
      b.setAttribute("aria-expanded", String(b.dataset.submenu === page));
    this.position();
    if (focus)
      this.focusFirst(this.submenu);
  }
  focusFirst(panel) {
    var _a;
    (_a = panel.querySelector("button:not(:disabled)")) == null ? void 0 : _a.focus();
  }
  navigate(key) {
    var _a, _b, _c, _d;
    this.root.dataset.keyboard = "true";
    const active = this.doc.activeElement, panel = (_a = active == null ? void 0 : active.closest(".keyline-next-format-panel")) != null ? _a : this.panel;
    if (key === "ArrowLeft" && ((_b = this.submenu) == null ? void 0 : _b.contains(active))) {
      this.submenu.remove();
      this.submenu = void 0;
      const opener = this.panel.querySelector(`[data-submenu="${this.page}"]`);
      opener == null ? void 0 : opener.focus();
      opener == null ? void 0 : opener.setAttribute("aria-expanded", "false");
      return;
    }
    if (key === "ArrowRight" && ((active == null ? void 0 : active.dataset.submenu) === "color" || (active == null ? void 0 : active.dataset.submenu) === "callout")) {
      this.showSubmenu(active.dataset.submenu, true);
      return;
    }
    if (key === "Enter" || key === " ") {
      active == null ? void 0 : active.click();
      return;
    }
    const buttons = Array.from(panel.querySelectorAll("button:not(:disabled)")), at = buttons.indexOf(active);
    const next = key === "Home" ? 0 : key === "End" ? buttons.length - 1 : key === "ArrowDown" ? (at + 1) % buttons.length : key === "ArrowUp" ? (at - 1 + buttons.length) % buttons.length : at;
    (_c = buttons[next]) == null ? void 0 : _c.focus();
    (_d = buttons[next]) == null ? void 0 : _d.scrollIntoView({ block: "nearest" });
  }
  position() {
    var _a, _b;
    const win = this.doc.defaultView;
    const maxHeight = Math.min(300, win.innerHeight - 16);
    for (const panel of [this.panel, this.submenu].filter(Boolean))
      panel.style.maxHeight = `${maxHeight}px`;
    const w = this.panel.offsetWidth, h = Math.max(this.panel.offsetHeight, (_b = (_a = this.submenu) == null ? void 0 : _a.offsetHeight) != null ? _b : 0);
    const x = Math.max(8, Math.min(this.point.x, win.innerWidth - w - 8));
    const gap = this.actions ? 0 : 4;
    const y = this.point.y + gap + h < win.innerHeight - 8 ? this.point.y + gap : Math.max(8, this.point.y - h - 32);
    this.panel.style.left = `${x}px`;
    this.panel.style.top = `${y}px`;
    if (this.submenu) {
      const cw = this.submenu.offsetWidth;
      this.submenu.style.left = `${x + w + 6 + cw <= win.innerWidth - 8 ? x + w + 6 : Math.max(8, x - cw - 6)}px`;
      this.submenu.style.top = `${y}px`;
    }
  }
  hide() {
    this.close();
  }
  close(refocus = false) {
    var _a, _b;
    if (this.closed)
      return;
    this.closed = true;
    this.doc.removeEventListener("pointerdown", this.pointer, true);
    this.doc.removeEventListener("focusin", this.focus, true);
    this.doc.removeEventListener("scroll", this.viewport, true);
    (_a = this.doc.defaultView) == null ? void 0 : _a.removeEventListener("resize", this.viewport);
    (_b = this.doc.defaultView) == null ? void 0 : _b.removeEventListener("blur", this.windowBlur);
    this.app.keymap.popScope(this.scope);
    this.root.remove();
    this.release(refocus);
    if (refocus)
      this.context.editor.focus();
  }
};

// src/platform/block-handles.ts
var mime = "application/x-keyline-next-block";
var dragSerial = 0;
var BlockHandles = class {
  constructor(app, preferences, zh, insertion, changeGranularity) {
    this.app = app;
    this.preferences = preferences;
    this.zh = zh;
    this.insertion = insertion;
    this.changeGranularity = changeGranularity;
    this.live = true;
    this.instances = /* @__PURE__ */ new Set();
  }
  extension() {
    const owner = this;
    return import_view6.ViewPlugin.define((view) => {
      const instance = new HandleView(view, owner);
      owner.instances.add(instance);
      return instance;
    }, { eventHandlers: {
      keydown(event) {
        if (event.key === "Escape")
          this.cancel();
      },
      compositionstart() {
        this.cancel();
      }
    } });
  }
  focus(editor) {
    const instance = [...this.instances].find((i) => i.editor === editor);
    return !!(instance == null ? void 0 : instance.focus());
  }
  canFocus(editor) {
    var _a;
    return !!((_a = [...this.instances].find((i) => i.editor === editor)) == null ? void 0 : _a.canFocus());
  }
  refresh() {
    for (const instance of this.instances)
      instance.refresh();
  }
  remove(instance) {
    this.instances.delete(instance);
  }
  dispose() {
    this.live = false;
    for (const instance of this.instances)
      instance.destroy();
    this.instances.clear();
  }
};
var HandleView = class {
  constructor(view, owner) {
    this.view = view;
    this.owner = owner;
    this.shown = false;
    this.destroyed = false;
    this.keyboard = false;
    this.pressing = false;
    this.release = [];
    this.granularity = owner.preferences().dragGranularity;
    const doc = view.dom.ownerDocument;
    this.boundDocument = doc;
    this.root = doc.createElement("div");
    this.root.className = "keyline-next-block-handle";
    this.root.hidden = true;
    this.root.setAttribute("role", "toolbar");
    doc.body.append(this.root);
    this.dropLine = doc.createElement("div");
    this.dropLine.className = "keyline-next-block-drop";
    this.dropLine.hidden = true;
    doc.body.append(this.dropLine);
    this.root.addEventListener("pointerdown", (event) => {
      const target = event.target;
      if (event.button === 0 && target.closest("[data-action=grip]")) {
        this.pressing = true;
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
      }
    });
    this.root.addEventListener("mousedown", (event) => {
      if (!event.target.closest("[data-action=grip]"))
        event.preventDefault();
    });
    this.root.addEventListener("pointerenter", () => clearTimeout(this.hideTimer));
    this.root.addEventListener("pointerleave", () => this.leave());
    this.root.addEventListener("contextmenu", (event) => {
      if (!event.target.closest('[data-action="grip"]'))
        return;
      event.preventDefault();
      event.stopPropagation();
      this.openStructuralMenu();
    });
    this.root.addEventListener("keydown", (event) => {
      var _a;
      const buttons = Array.from(this.root.querySelectorAll("button:not([disabled])"));
      const index = buttons.indexOf(this.root.ownerDocument.activeElement);
      if (event.key === "ContextMenu" || event.key === "F10" && event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        this.openStructuralMenu();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.cancel();
        this.view.focus();
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        (_a = buttons[(index + (event.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length]) == null ? void 0 : _a.focus();
      }
      if ((event.key === "Enter" || event.key === " ") && index >= 0) {
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat)
          buttons[index].click();
      }
    });
    this.bindDocument(doc);
    this.refresh();
  }
  get editor() {
    var _a;
    return (_a = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a.editor;
  }
  bindDocument(doc) {
    var _a, _b;
    const view = this.view;
    const dragover = (event) => this.dragOver(event), drop = (event) => this.onDrop(event);
    const end = () => this.endDrag(), resize = () => this.refresh(), blur = () => this.cancel();
    const hover = (event) => this.hover(event), leave = () => this.leave();
    const releasePress = (event) => {
      const heldGrip = this.pressing;
      this.pressing = false;
      if (!heldGrip && event.type === "pointerup" && event.button === 0)
        this.hover(event);
    };
    doc.addEventListener("dragover", dragover, true);
    doc.addEventListener("drop", drop, true);
    view.contentDOM.addEventListener("pointermove", hover, true);
    view.contentDOM.addEventListener("pointerleave", leave);
    doc.addEventListener("pointerup", releasePress, true);
    doc.addEventListener("pointercancel", releasePress, true);
    doc.addEventListener("dragend", end, true);
    (_a = doc.defaultView) == null ? void 0 : _a.addEventListener("resize", resize);
    (_b = doc.defaultView) == null ? void 0 : _b.addEventListener("blur", blur);
    view.scrollDOM.addEventListener("scroll", resize, { passive: true });
    this.release.push(() => {
      var _a2, _b2;
      doc.removeEventListener("dragover", dragover, true);
      doc.removeEventListener("drop", drop, true);
      view.contentDOM.removeEventListener("pointermove", hover, true);
      view.contentDOM.removeEventListener("pointerleave", leave);
      doc.removeEventListener("pointerup", releasePress, true);
      doc.removeEventListener("pointercancel", releasePress, true);
      doc.removeEventListener("dragend", end, true);
      (_a2 = doc.defaultView) == null ? void 0 : _a2.removeEventListener("resize", resize);
      (_b2 = doc.defaultView) == null ? void 0 : _b2.removeEventListener("blur", blur);
      view.scrollDOM.removeEventListener("scroll", resize);
    });
  }
  syncDocument() {
    const doc = this.view.dom.ownerDocument;
    if (doc === this.boundDocument)
      return;
    this.cancel();
    this.target = void 0;
    for (const release of this.release.splice(0))
      release();
    this.boundDocument = doc;
    doc.body.append(this.root, this.dropLine);
    this.bindDocument(doc);
  }
  eligible() {
    var _a;
    return !this.destroyed && this.owner.live && this.owner.preferences().blockHandles && !this.view.composing && this.boundDocument === this.view.dom.ownerDocument && !this.view.state.readOnly && this.view.state.doc.length <= 2 * 1024 * 1024 && this.view.state.selection.ranges.length === 1 && !!((_a = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a.file);
  }
  parsed() {
    var _a;
    const text2 = this.view.state.doc.toString();
    if (((_a = this.model) == null ? void 0 : _a.text) !== text2)
      this.model = parseBlocks(text2);
    return this.model;
  }
  at(position) {
    var _a;
    if (!this.eligible())
      return;
    const model = this.parsed(), block = blockAt(model, position);
    if (block == null ? void 0 : block.locked)
      return;
    const line = this.view.state.doc.lineAt(position);
    if (!block && line.text.trim())
      return;
    return {
      model,
      block: block != null ? block : void 0,
      visualAt: line.from,
      at: this.owner.preferences().dragGranularity === "line" ? line.from : (_a = block == null ? void 0 : block.from) != null ? _a : line.from
    };
  }
  hover(event) {
    var _a;
    this.syncDocument();
    if (event.buttons || this.drag || this.menu || !this.eligible())
      return;
    if (!this.view.contentDOM.contains(event.target))
      return;
    const pos = this.view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
    if (pos === null)
      return;
    const target = this.at(pos);
    if (!target) {
      this.leave();
      return;
    }
    clearTimeout(this.hideTimer);
    if (((_a = this.target) == null ? void 0 : _a.at) === target.at && this.target.visualAt === target.visualAt && this.shown)
      return;
    this.keyboard = false;
    clearTimeout(this.showTimer);
    this.showTimer = setTimeout(() => {
      if (this.eligible() && this.view.state.doc.toString() === target.model.text) {
        this.target = target;
        this.show();
      }
    }, this.owner.preferences().handleHoverDelay);
  }
  leave() {
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    if (this.destroyed || !this.owner.live)
      return;
    if (this.pressing || this.drag || this.menu || this.root.contains(this.root.ownerDocument.activeElement))
      return;
    if (this.owner.preferences().handlePinned) {
      this.target = this.at(this.view.state.selection.main.head);
      this.show();
      return;
    }
    this.hideTimer = setTimeout(() => this.hide(), this.owner.preferences().handleHideDelay);
  }
  hide() {
    this.root.hidden = true;
    this.shown = false;
  }
  cancel() {
    var _a;
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    (_a = this.menu) == null ? void 0 : _a.hide();
    this.menu = void 0;
    this.keyboard = false;
    this.pressing = false;
    this.endDrag();
    this.hide();
  }
  update(update) {
    if (update.docChanged) {
      this.model = void 0;
      this.target = void 0;
      this.cancel();
    }
    if (update.docChanged || update.selectionSet || update.viewportChanged || update.geometryChanged || update.focusChanged)
      this.refresh();
  }
  refresh() {
    var _a;
    this.syncDocument();
    if (this.granularity !== this.owner.preferences().dragGranularity) {
      this.granularity = this.owner.preferences().dragGranularity;
      const at = (_a = this.target) == null ? void 0 : _a.visualAt;
      this.cancel();
      this.target = at === void 0 ? void 0 : this.at(at);
    }
    if (!this.eligible()) {
      this.cancel();
      return;
    }
    if (this.pressing || this.drag || this.menu)
      return;
    if (this.owner.preferences().handlePinned)
      this.target = this.at(this.view.state.selection.main.head);
    if (this.target && (this.shown || this.owner.preferences().handlePinned || this.keyboard))
      this.show();
    else if (!this.target)
      this.hide();
  }
  focus() {
    this.syncDocument();
    clearTimeout(this.showTimer);
    clearTimeout(this.hideTimer);
    this.target = this.at(this.view.state.selection.main.head);
    if (!this.target) {
      this.cancel();
      return false;
    }
    this.keyboard = true;
    this.show();
    return true;
  }
  canFocus() {
    const target = this.at(this.view.state.selection.main.head);
    return !!target;
  }
  context() {
    var _a;
    const editor = this.editor, target = this.target, file = (_a = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a.file;
    if (!editor || !(target == null ? void 0 : target.block) || !file || !this.eligible())
      return null;
    const selected = this.view.state.selection.main;
    const chosen = this.owner.preferences().snapSelection && !selected.empty ? blockSelection(target.model, selected.from, selected.to) : [];
    const useSelection = chosen.some((b) => b.from <= target.block.from && b.to >= target.block.to);
    return captureBlock(
      editor,
      () => {
        var _a2;
        return this.eligible() && ((_a2 = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a2.file) === file;
      },
      useSelection ? void 0 : { from: target.block.from, to: target.block.to }
    );
  }
  insert() {
    var _a, _b;
    const editor = this.editor, target = this.target, file = (_a = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a.file;
    if (!editor || !target || !file || !this.eligible() || this.view.state.doc.toString() !== target.model.text)
      return;
    const context = target.block ? this.owner.insertion.capture(editor, file, { from: target.block.to, to: target.block.to }, target.block.id) : this.owner.insertion.capture(editor, file, { from: target.at, to: target.at });
    if (context) {
      const rect = (_b = this.root.querySelector('[data-action="insert"]')) == null ? void 0 : _b.getBoundingClientRect();
      this.hide();
      this.owner.insertion.open(context, rect && { x: rect.left, y: rect.bottom });
    }
  }
  foldRange() {
    var _a;
    if (!((_a = this.target) == null ? void 0 : _a.block))
      return null;
    if (this.target.at !== this.target.block.from)
      return null;
    const line = this.view.state.doc.lineAt(this.target.at);
    let existing = null;
    (0, import_language2.foldedRanges)(this.view.state).between(line.from, line.to, (from, to) => {
      existing = { from, to, folded: true };
    });
    const range = existing != null ? existing : (0, import_language2.foldable)(this.view.state, line.from, line.to);
    return range ? { ...range, folded: !!existing } : null;
  }
  toggleFold() {
    var _a;
    if (!this.eligible() || this.view.state.doc.toString() !== ((_a = this.target) == null ? void 0 : _a.model.text))
      return;
    const range = this.foldRange();
    if (range)
      this.view.dispatch({ effects: (range.folded ? import_language2.unfoldEffect : import_language2.foldEffect).of({ from: range.from, to: range.to }) });
    this.show();
  }
  openMenu() {
    var _a, _b, _c, _d;
    const editor = this.editor, target = this.target, file = (_a = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a.file;
    if (!editor || !target || !file)
      return;
    const doc = this.root.ownerDocument, captured = captureHandleMenu(
      this.owner.app,
      editor,
      file,
      target.visualAt,
      () => {
        var _a2;
        return this.eligible() && ((_a2 = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a2.file) === file;
      },
      doc,
      this.owner.zh()
    );
    if (!captured)
      return;
    (_b = this.menu) == null ? void 0 : _b.hide();
    const bounds = (_d = (_c = this.root.querySelector('[data-action="grip"]')) == null ? void 0 : _c.getBoundingClientRect()) != null ? _d : this.root.getBoundingClientRect();
    this.hide();
    const menu = new SelectionMenu(
      this.owner.app,
      { zh: this.owner.zh, color: (_, patch) => captured.actions.color(patch) },
      captured.context,
      { x: bounds.left, y: bounds.bottom },
      doc,
      "main",
      () => {
        if (this.menu === menu)
          this.menu = void 0;
      },
      captured.actions
    );
    this.menu = menu;
  }
  openStructuralMenu() {
    var _a;
    const context = this.context();
    if (!context && (!this.target || !this.eligible() || this.granularity !== "line"))
      return;
    (_a = this.menu) == null ? void 0 : _a.hide();
    const menu = new import_obsidian20.Menu();
    this.menu = menu;
    menu.addItem((item) => item.setTitle(message("insertAfter", this.owner.zh())).setIcon("plus").onClick(() => this.insert()));
    if (context)
      appendBlockMenu(menu, this.owner.app, context, this.owner.zh());
    menu.addSeparator();
    menu.addItem((item) => item.setTitle(message(this.granularity === "line" ? "dragUseBlock" : "dragUseLine", this.owner.zh())).setIcon("rows-3").onClick(() => {
      if (this.owner.live)
        void this.owner.changeGranularity(this.granularity === "line" ? "block" : "line");
    }));
    menu.onHide(() => {
      if (this.menu === menu)
        this.menu = void 0;
      this.leave();
    });
    const bounds = this.root.getBoundingClientRect();
    menu.showAtPosition({ x: bounds.left, y: bounds.bottom }, this.root.ownerDocument);
  }
  button(action, label2, icon, run) {
    const button = this.root.ownerDocument.createElement("button");
    button.type = "button";
    button.className = "clickable-icon";
    button.dataset.action = action;
    button.setAttribute("aria-label", message(label2, this.owner.zh()));
    if (this.owner.preferences().hints)
      button.title = message(label2, this.owner.zh());
    (0, import_obsidian20.setIcon)(button, icon);
    button.addEventListener("click", run);
    this.root.append(button);
    return button;
  }
  show() {
    if (!this.target || !this.eligible()) {
      this.hide();
      return;
    }
    const target = this.target, prefs = this.owner.preferences();
    this.view.requestMeasure({
      key: this,
      read: () => {
        var _a, _b;
        if (!this.eligible() || target !== this.target || target.model.text !== this.view.state.doc.toString())
          return null;
        const text2 = this.view.coordsAtPos(target.visualAt);
        if (!text2)
          return null;
        const node = this.view.domAtPos(target.visualAt).node;
        const element = node.nodeType === 1 ? node : node.parentElement;
        const fold = (_b = (_a = element == null ? void 0 : element.closest(".cm-line")) == null ? void 0 : _a.querySelector(".cm-fold-indicator .collapse-indicator")) == null ? void 0 : _b.getBoundingClientRect();
        const count2 = Number(prefs.handlePlus) + 1 + Number(prefs.handleFold);
        const layout = handleLayout(
          this.view.scrollDOM.getBoundingClientRect(),
          this.view.contentDOM.getBoundingClientRect(),
          text2,
          prefs.handleSide,
          count2,
          fold && { left: fold.left, right: fold.right, top: fold.top, bottom: fold.bottom }
        );
        return layout && { ...layout, fold: prefs.handleFold ? this.foldRange() : null };
      },
      write: (bounds) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.pressing || this.drag || this.menu)
          return;
        if (!bounds || !this.eligible() || target !== this.target) {
          this.hide();
          return;
        }
        const focused = (_a = this.root.ownerDocument.activeElement) == null ? void 0 : _a.dataset.action;
        this.root.replaceChildren();
        this.root.setAttribute("aria-label", message("blockControls", this.owner.zh()));
        this.root.dataset.from = String(target.at);
        this.root.dataset.side = (_b = bounds.side) != null ? _b : prefs.handleSide;
        this.root.dataset.visualFrom = String(target.visualAt);
        this.root.style.setProperty("--keyline-next-handle-size", `${bounds.size}px`);
        this.root.dataset.granularity = this.granularity;
        if (prefs.handlePlus)
          this.button("insert", "blockHandleAdd", "plus", () => this.insert());
        {
          if (prefs.handleFold) {
            const fold = this.button(
              "fold",
              ((_c = bounds.fold) == null ? void 0 : _c.folded) ? "unfoldBlock" : "foldBlock",
              ((_d = bounds.fold) == null ? void 0 : _d.folded) ? "chevron-right" : "chevron-down",
              () => this.toggleFold()
            );
            fold.disabled = !bounds.fold;
            fold.setAttribute("aria-expanded", String(!((_e = bounds.fold) == null ? void 0 : _e.folded)));
          }
          const grip = this.button("grip", "blockHandleDrag", "grip-vertical", () => this.openMenu());
          grip.setAttribute("aria-description", message(this.granularity === "line" ? "lineMenu" : "blockMenu", this.owner.zh()));
          grip.draggable = true;
          grip.addEventListener("dragstart", (event) => this.startDrag(event));
        }
        this.root.style.left = `${bounds.x}px`;
        this.root.style.top = `${bounds.y}px`;
        this.root.hidden = false;
        this.shown = true;
        if (focused)
          (_f = this.root.querySelector(`[data-action="${focused}"]`)) == null ? void 0 : _f.focus();
        else if (this.keyboard) {
          (_h = (_g = this.root.querySelector('[data-action="grip"]')) != null ? _g : this.root.querySelector("button")) == null ? void 0 : _h.focus();
          this.keyboard = false;
        }
      }
    });
  }
  startDrag(event) {
    var _a;
    if (!event.dataTransfer || !this.target) {
      event.preventDefault();
      return;
    }
    const file = (_a = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a.file;
    const preferenceMode = this.granularity, mode = !this.target.block ? "line" : preferenceMode;
    const line = mode === "line" && this.editor && file ? captureLineDrag(
      this.editor,
      this.target.at,
      this.owner.preferences().snapSelection,
      () => {
        var _a2;
        return this.eligible() && this.owner.preferences().dragGranularity === preferenceMode && ((_a2 = this.view.state.field(import_obsidian20.editorInfoField, false)) == null ? void 0 : _a2.file) === file;
      }
    ) : null;
    const block = mode === "block" ? this.context() : null;
    if (!line && !block) {
      event.preventDefault();
      return;
    }
    clearTimeout(this.hideTimer);
    const token = `keyline-${++dragSerial}`;
    this.pressing = false;
    this.drag = line ? { mode: "line", context: line, token } : { mode: "block", context: block, token };
    this.drop = void 0;
    this.dropCache = void 0;
    event.dataTransfer.setData(mime, token);
    event.dataTransfer.effectAllowed = "move";
    this.root.classList.add("is-dragging");
  }
  dragOver(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (!this.drag || !this.view.scrollDOM.contains(event.target))
      return;
    event.preventDefault();
    event.stopPropagation();
    this.drop = void 0;
    this.dropLine.hidden = true;
    if (!this.drag.context.valid()) {
      this.endDrag();
      return;
    }
    const box = this.view.scrollDOM.getBoundingClientRect();
    if (event.clientY < box.top + 32)
      this.view.scrollDOM.scrollTop -= 16;
    else if (event.clientY > box.bottom - 32)
      this.view.scrollDOM.scrollTop += 16;
    const pos = this.view.posAtCoords({ x: event.clientX, y: event.clientY }, false);
    if (pos === null)
      return;
    if (this.drag.mode === "line") {
      const model2 = this.drag.context.model, index = lineIndex(model2, pos);
      if (index < 0)
        return;
      const target2 = model2.lines[index], top2 = this.view.documentTop + this.view.lineBlockAt(target2.from).top;
      const bottom2 = this.view.documentTop + this.view.lineBlockAt(target2.to).bottom, after2 = event.clientY >= (top2 + bottom2) / 2;
      const syntax2 = this.parsed();
      const initial = blockAt(syntax2, pos);
      let structuralTarget = initial, origin2 = initial && this.view.coordsAtPos(initial.from), root2 = false;
      while ((structuralTarget == null ? void 0 : structuralTarget.kind) === "item" && origin2 && event.clientX < origin2.left - 12) {
        const list = syntax2.blocks.find((b) => b.id === structuralTarget.parent);
        const parent2 = syntax2.blocks.find((b) => b.id === (list == null ? void 0 : list.parent));
        if (!parent2) {
          root2 = true;
          if (list)
            structuralTarget = list;
          break;
        }
        structuralTarget = parent2;
        origin2 = this.view.coordsAtPos(parent2.from);
      }
      const structuralTop = structuralTarget ? this.view.documentTop + this.view.lineBlockAt(structuralTarget.from).top : top2;
      const firstBottom2 = structuralTarget ? this.view.documentTop + this.view.lineBlockAt(structuralTarget.from).bottom : bottom2;
      const structuralBottom = structuralTarget ? this.view.documentTop + this.view.lineBlockAt(structuralTarget.to).bottom : bottom2;
      origin2 = structuralTarget && this.view.coordsAtPos(structuralTarget.from);
      const inside2 = (structuralTarget == null ? void 0 : structuralTarget.kind) === "item" && !!origin2 && event.clientX >= origin2.left + 32 && event.clientY > structuralTop + (firstBottom2 - structuralTop) * 0.25 && event.clientY < firstBottom2 - (firstBottom2 - structuralTop) * 0.25;
      const structuralAfter = event.clientY >= (structuralTop + structuralBottom) / 2;
      const placement2 = inside2 ? "inside" : root2 ? structuralAfter ? "root-after" : "root-before" : structuralAfter ? "after" : "before";
      const explicitStructure = inside2 || root2 || structuralTarget !== initial;
      if (explicitStructure) {
        const cacheKey3 = `line-block:${structuralTarget == null ? void 0 : structuralTarget.id}:${placement2}`;
        if (((_a = this.dropCache) == null ? void 0 : _a.key) !== cacheKey3)
          this.dropCache = {
            key: cacheKey3,
            plan: structuralTarget ? relocateLineBlocks(model2, this.drag.context.range, structuralTarget, placement2) : null
          };
        const plan3 = this.dropCache.plan;
        if (!plan3) {
          if (event.dataTransfer)
            event.dataTransfer.dropEffect = "none";
          return;
        }
        this.drop = { plan: plan3 };
        if (event.dataTransfer)
          event.dataTransfer.dropEffect = "move";
        const left3 = Math.max(box.left + 6, ((_b = origin2 == null ? void 0 : origin2.left) != null ? _b : box.left + 6) + (inside2 ? 24 : 0));
        this.dropLine.dataset.placement = placement2;
        this.dropLine.dataset.label = message(inside2 ? "dropInside" : root2 ? "dropRoot" : structuralAfter ? "dropAfter" : "dropBefore", this.owner.zh());
        this.dropLine.style.left = `${left3}px`;
        this.dropLine.style.width = `${Math.max(0, box.right - left3 - 12)}px`;
        this.dropLine.style.top = `${inside2 || structuralAfter ? structuralBottom : structuralTop}px`;
        this.dropLine.hidden = false;
        return;
      }
      const cacheKey2 = `line:${index}:${after2}`;
      if (((_c = this.dropCache) == null ? void 0 : _c.key) !== cacheKey2)
        this.dropCache = { key: cacheKey2, plan: relocateLines(model2, this.drag.context.range, index, after2) };
      const plan2 = this.dropCache.plan;
      if (!plan2) {
        if (event.dataTransfer)
          event.dataTransfer.dropEffect = "none";
        return;
      }
      this.drop = { plan: plan2 };
      if (event.dataTransfer)
        event.dataTransfer.dropEffect = "move";
      const left2 = Math.max(box.left + 6, (_e = (_d = this.view.coordsAtPos(target2.from)) == null ? void 0 : _d.left) != null ? _e : box.left + 6);
      this.dropLine.dataset.placement = after2 ? "line-after" : "line-before";
      this.dropLine.dataset.label = message(after2 ? "dropLineAfter" : "dropLineBefore", this.owner.zh());
      this.dropLine.style.left = `${left2}px`;
      this.dropLine.style.width = `${Math.max(0, box.right - left2 - 12)}px`;
      this.dropLine.style.top = `${after2 ? bottom2 : top2}px`;
      this.dropLine.hidden = false;
      return;
    }
    const model = this.drag.context.model, parent = this.drag.context.blocks[0].parent;
    let target = (_g = (_f = blockAt(model, pos)) != null ? _f : siblingDropTarget(model, pos, parent)) != null ? _g : siblingDropTarget(model, pos, null);
    if (!target)
      return;
    let origin = this.view.coordsAtPos(target.from), root = false;
    while (target.kind === "item" && origin && event.clientX < origin.left - 12) {
      const list = model.blocks.find((b) => b.id === target.parent);
      const parentItem = model.blocks.find((b) => b.id === (list == null ? void 0 : list.parent));
      if (!parentItem) {
        root = true;
        if (list)
          target = list;
        break;
      }
      target = parentItem;
      origin = this.view.coordsAtPos(target.from);
    }
    origin = this.view.coordsAtPos(target.from);
    const top = this.view.documentTop + this.view.lineBlockAt(target.from).top;
    const bottom = this.view.documentTop + this.view.lineBlockAt(target.to).bottom;
    const firstBottom = this.view.documentTop + this.view.lineBlockAt(target.from).bottom;
    const height = firstBottom - top, after = event.clientY >= (top + bottom) / 2;
    const inside = target.kind === "item" && !!origin && event.clientX >= origin.left + 32 && event.clientY > top + height * 0.25 && event.clientY < firstBottom - height * 0.25;
    const placement = inside ? "inside" : root ? after ? "root-after" : "root-before" : after ? "after" : "before";
    const cacheKey = `${target.id}/${placement}`;
    if (((_h = this.dropCache) == null ? void 0 : _h.key) !== cacheKey)
      this.dropCache = { key: cacheKey, plan: relocateBlocks(model, this.drag.context.blocks, target, placement) };
    const plan = this.dropCache.plan;
    if (!plan) {
      if (event.dataTransfer)
        event.dataTransfer.dropEffect = "none";
      return;
    }
    this.drop = { plan };
    if (event.dataTransfer)
      event.dataTransfer.dropEffect = "move";
    const left = Math.max(box.left + 6, ((_i = origin == null ? void 0 : origin.left) != null ? _i : box.left + 6) + (inside ? 24 : 0));
    this.dropLine.dataset.placement = placement;
    this.dropLine.dataset.label = message(inside ? "dropInside" : root ? "dropRoot" : after ? "dropAfter" : "dropBefore", this.owner.zh());
    this.dropLine.style.left = `${left}px`;
    this.dropLine.style.width = `${Math.max(0, box.right - left - 12)}px`;
    this.dropLine.style.top = `${inside || after ? bottom : top}px`;
    this.dropLine.hidden = false;
  }
  onDrop(event) {
    var _a, _b;
    const drag = this.drag;
    if (!drag || !this.view.scrollDOM.contains(event.target))
      return;
    event.preventDefault();
    event.stopPropagation();
    this.dragOver(event);
    const plan = (_a = this.drop) == null ? void 0 : _a.plan, owned2 = ((_b = event.dataTransfer) == null ? void 0 : _b.getData(mime)) === drag.token;
    this.endDrag();
    if (!owned2 || !plan || !commitBlockEdit(drag.context, plan))
      new import_obsidian20.Notice(message("blockUnavailable", this.owner.zh()));
  }
  endDrag() {
    this.pressing = false;
    this.drag = void 0;
    this.drop = void 0;
    this.dropCache = void 0;
    this.dropLine.hidden = true;
    this.root.classList.remove("is-dragging");
  }
  destroy() {
    if (this.destroyed)
      return;
    this.destroyed = true;
    this.cancel();
    for (const release of this.release)
      release();
    this.root.remove();
    this.dropLine.remove();
    this.owner.remove(this);
  }
};

// src/platform/block-keys.ts
var import_state5 = require("@codemirror/state");
var import_view7 = require("@codemirror/view");
var import_obsidian21 = require("obsidian");

// src/domain/block-keys.ts
function expandBlockSelection(model, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < from || to > model.text.length)
    return null;
  const current = blockAt(model, from);
  if (!current || current.locked || from === 0 && to === model.text.length)
    return null;
  const scopes = model.blocks.filter((b) => !b.locked && b.from <= from && b.to >= to && (b.from < from || b.to > to)).sort((a, b) => a.to - a.from - (b.to - b.from) || b.depth - a.depth);
  const scope = scopes[0];
  return scope ? { anchor: scope.from, head: scope.to } : { anchor: 0, head: model.text.length };
}
function backspaceBlock(model, at) {
  var _a, _b;
  const block = blockAt(model, at);
  if (!block || block.locked || inProtectedSyntax(model.text, at))
    return null;
  const value = model.text.slice(block.from, block.to);
  if (/[\r\n]/u.test(value) && !(block.kind === "item" && block.depth > 1))
    return null;
  const prefix = (_a = /^[ \t]*(?:#{1,6}[ \t]+|>[ \t]?|(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?)/u.exec(value)) == null ? void 0 : _a[0];
  if (!prefix || block.from + prefix.length !== at)
    return null;
  let plan = null;
  if (block.kind === "item" && block.depth > 1)
    plan = changeBlockIndent(model, [block], -1);
  else if (block.kind === "item" && /\[[ xX]\][ \t]+$/u.test(prefix))
    plan = convertBlock(model, block, "bullet");
  else if (["item", "heading", "quote"].includes(block.kind))
    plan = convertBlock(model, block, "paragraph");
  if (!plan)
    return null;
  const next = model.text.slice(0, plan.from) + plan.insert + model.text.slice(plan.to);
  if (block.kind === "item" && block.depth > 1) {
    const newPrefix = (_b = /^[ \t]*(?:[-+*]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?/u.exec(next.slice(plan.anchor))) == null ? void 0 : _b[0];
    if (!newPrefix)
      return null;
    plan.anchor += newPrefix.length;
  } else {
    const converted = blockAt(parseBlocks(next), plan.anchor);
    const expected = block.kind === "item" && /\[[ xX]\][ \t]+$/u.test(prefix) ? "item" : "paragraph";
    if (!converted || converted.kind !== expected || converted.from !== block.from || converted.to !== block.from + plan.insert.length || converted.locked)
      return null;
  }
  return { ...plan, head: plan.anchor };
}

// src/platform/block-keys.ts
var BlockKeys = class {
  constructor(preferences) {
    this.preferences = preferences;
    this.live = true;
    this.cache = /* @__PURE__ */ new WeakMap();
  }
  model(view) {
    var _a;
    if (!this.live || !this.preferences().blockKeys || !view.hasFocus || view.composing || view.state.readOnly || view.state.doc.length > 2 * 1024 * 1024 || view.state.selection.ranges.length !== 1 || !((_a = view.state.field(import_obsidian21.editorInfoField, false)) == null ? void 0 : _a.file))
      return null;
    const text2 = view.state.doc.toString(), cached = this.cache.get(view);
    if ((cached == null ? void 0 : cached.text) === text2)
      return cached;
    const model = parseBlocks(text2);
    this.cache.set(view, model);
    return model;
  }
  extension() {
    return import_state5.Prec.highest(import_view7.keymap.of([
      { key: "Mod-a", run: (view) => {
        const model = this.model(view), range = view.state.selection.main;
        const selection = model && expandBlockSelection(model, range.from, range.to);
        if (!selection)
          return false;
        view.dispatch({ selection, scrollIntoView: true, annotations: import_state5.Transaction.userEvent.of("select") });
        return true;
      } },
      { key: "Backspace", run: (view) => {
        if (!view.state.selection.main.empty)
          return false;
        const model = this.model(view), edit2 = model && backspaceBlock(model, view.state.selection.main.head);
        if (!edit2)
          return false;
        view.dispatch({
          changes: { from: edit2.from, to: edit2.to, insert: edit2.insert },
          selection: { anchor: edit2.anchor },
          scrollIntoView: true,
          annotations: import_state5.Transaction.userEvent.of("delete.backward")
        });
        return true;
      } }
    ]));
  }
  dispose() {
    this.live = false;
    this.cache = /* @__PURE__ */ new WeakMap();
  }
};

// src/platform/row-selection.ts
var import_state6 = require("@codemirror/state");
var import_view8 = require("@codemirror/view");
var import_obsidian22 = require("obsidian");

// src/domain/row-selection.ts
var MAX_SELECTION_DOCUMENT = 2 * 1024 * 1024;
function wholeRows(doc, range) {
  const { anchor, head } = range;
  if (!Number.isInteger(anchor) || !Number.isInteger(head) || Math.min(anchor, head) < 0 || Math.max(anchor, head) > doc.length || doc.length > MAX_SELECTION_DOCUMENT)
    return range;
  const a = doc.lineAt(anchor), h = doc.lineAt(head);
  if (a.from === h.from)
    return range;
  return anchor < head ? { anchor: a.from, head: h.to } : { anchor: a.to, head: h.from };
}
function selectedRowStarts(doc, ranges, visible) {
  if (doc.length > MAX_SELECTION_DOCUMENT)
    return [];
  const result = /* @__PURE__ */ new Set();
  for (const range of ranges) {
    const expanded = wholeRows(doc, range);
    if (expanded === range)
      continue;
    const from = Math.min(expanded.anchor, expanded.head), to = Math.max(expanded.anchor, expanded.head);
    for (const window of visible) {
      const left = Math.max(0, from, window.from), right = Math.min(doc.length, to, window.to);
      if (left > right)
        continue;
      let row = doc.lineAt(left);
      while (row.from <= right) {
        result.add(row.from);
        if (row.to >= right || row.to === doc.length)
          break;
        row = doc.lineAt(row.to + 1);
      }
    }
  }
  return [...result].sort((a, b) => a - b);
}

// src/platform/row-selection.ts
var repaint = import_state6.StateEffect.define();
var RowPaint = class {
  constructor(view, owner) {
    this.view = view;
    this.owner = owner;
    this.decorations = import_view8.Decoration.none;
    this.theme = false;
    this.document = view.dom.ownerDocument;
    owner.views.add(this);
    this.refresh();
  }
  refresh() {
    var _a;
    const { view } = this;
    this.document = view.dom.ownerDocument;
    this.theme = ((_a = view.dom.ownerDocument.defaultView) == null ? void 0 : _a.getComputedStyle(view.dom).getPropertyValue("--ncl-shell-controls").trim()) === "1";
    this.build();
  }
  build() {
    var _a;
    const { view } = this;
    const rows2 = this.owner.enabled && ((_a = view.state.field(import_obsidian22.editorInfoField, false)) == null ? void 0 : _a.file) ? selectedRowStarts(view.state.doc, view.state.selection.ranges, view.visibleRanges) : [];
    this.decorations = import_view8.Decoration.set(rows2.map((at) => import_view8.Decoration.line({ class: "keyline-next-selected-row" }).range(at)));
  }
  update(update) {
    var _a, _b;
    if (this.document !== this.view.dom.ownerDocument) {
      this.owner.cancelFrame(this.view);
      this.refresh();
    } else if (update.transactions.some((tr) => tr.effects.some((e) => e.is(repaint))))
      this.refresh();
    else if (update.docChanged || update.selectionSet || update.viewportChanged || ((_a = update.startState.field(import_obsidian22.editorInfoField, false)) == null ? void 0 : _a.file) !== ((_b = update.state.field(import_obsidian22.editorInfoField, false)) == null ? void 0 : _b.file))
      this.build();
  }
  destroy() {
    this.owner.detach(this);
  }
};
var RowSelection = class {
  constructor(preferences) {
    this.preferences = preferences;
    this.active = true;
    this.views = /* @__PURE__ */ new Set();
    this.frames = /* @__PURE__ */ new Map();
  }
  get enabled() {
    return this.active && this.preferences().editingEnabled;
  }
  extension() {
    const owner = this;
    const plugin = import_view8.ViewPlugin.define((view) => new RowPaint(view, owner), {
      decorations: (instance) => instance.decorations,
      provide: (plugin2) => import_view8.EditorView.editorAttributes.of((view) => {
        const instance = view.plugin(plugin2);
        return (instance == null ? void 0 : instance.decorations.size) ? { class: `keyline-next-row-selection${instance.theme ? " keyline-next-themed-row-selection" : ""}` } : null;
      })
    });
    return [plugin, import_state6.EditorState.transactionFilter.of((transaction) => {
      var _a;
      if (!owner.enabled || !owner.preferences().snapSelection || !transaction.selection || transaction.docChanged || !transaction.isUserEvent("select.pointer") || transaction.startState.readOnly || !((_a = transaction.startState.field(import_obsidian22.editorInfoField, false)) == null ? void 0 : _a.file) || transaction.newDoc.length > MAX_SELECTION_DOCUMENT || ![...owner.views].some(({ view }) => view.state === transaction.startState && view.hasFocus && !view.composing))
        return transaction;
      const ranges = transaction.newSelection.ranges.map((range) => {
        const next = wholeRows(transaction.newDoc, range);
        return next === range ? range : import_state6.EditorSelection.range(next.anchor, next.head);
      });
      if (ranges.every((range, i) => range.eq(transaction.newSelection.ranges[i])))
        return transaction;
      return [transaction, { selection: import_state6.EditorSelection.create(ranges, transaction.newSelection.mainIndex), sequential: true }];
    })];
  }
  refresh() {
    if (!this.active)
      return;
    for (const { view } of this.views)
      this.schedule(view);
  }
  schedule(view) {
    const doc = view.dom.ownerDocument, win = doc.defaultView, previous = this.frames.get(view);
    if ((previous == null ? void 0 : previous.document) === doc)
      return;
    this.cancelFrame(view);
    if (!win)
      return;
    const frame = { document: doc, window: win, id: 0 };
    this.frames.set(view, frame);
    frame.id = win.requestAnimationFrame(() => {
      if (this.frames.get(view) !== frame)
        return;
      this.frames.delete(view);
      if (!this.active || ![...this.views].some((item) => item.view === view))
        return;
      if (view.dom.ownerDocument !== doc) {
        this.schedule(view);
        return;
      }
      view.dispatch({ effects: repaint.of(null) });
    });
  }
  cancelFrame(view) {
    const frame = this.frames.get(view);
    if (frame)
      frame.window.cancelAnimationFrame(frame.id);
    this.frames.delete(view);
  }
  detach(instance) {
    this.cancelFrame(instance.view);
    this.views.delete(instance);
  }
  dispose() {
    this.active = false;
    for (const view of this.frames.keys())
      this.cancelFrame(view);
    this.frames.clear();
    this.views.clear();
  }
};

// src/platform/rich-format.ts
var import_obsidian23 = require("obsidian");
var labels2 = {
  default: "toneDefault",
  gray: "toneGray",
  brown: "toneBrown",
  orange: "toneOrange",
  yellow: "toneYellow",
  green: "toneGreen",
  blue: "toneBlue",
  purple: "tonePurple",
  pink: "tonePink",
  red: "toneRed"
};
var RichFormatting = class {
  constructor(app, zh, insertion, composing) {
    this.app = app;
    this.zh = zh;
    this.insertion = insertion;
    this.composing = composing;
    this.live = true;
    this.dialogs = /* @__PURE__ */ new Set();
    this.menus = /* @__PURE__ */ new Set();
    this.selectionMenus = /* @__PURE__ */ new Set();
  }
  capture(editor, file, guard = () => true) {
    if (!this.live || !guard() || this.composing(editor) || editor.listSelections().length !== 1)
      return null;
    const text2 = editor.getValue(), path = file.path;
    const from = editor.posToOffset(editor.getCursor("from")), to = editor.posToOffset(editor.getCursor("to"));
    if (text2.length > 2 * 1024 * 1024 || from === to || to - from > 16e3)
      return null;
    return { editor, file, text: text2, from, to, valid: () => this.live && guard() && !this.composing(editor) && file.path === path && this.app.vault.getAbstractFileByPath(path) === file && editor.getValue() === text2 && editor.listSelections().length === 1 && editor.posToOffset(editor.getCursor("from")) === from && editor.posToOffset(editor.getCursor("to")) === to && this.app.workspace.getLeavesOfType("markdown").some((leaf) => {
      const view = leaf.view;
      return view.editor === editor && view.file === file;
    }) };
  }
  commit(context, edit2) {
    if (!context.valid() || !edit2) {
      if (this.live)
        new import_obsidian23.Notice(message(edit2 ? "stale" : "formatUnavailable", this.zh()));
      return false;
    }
    context.editor.replaceRange(edit2.insert, context.editor.offsetToPos(edit2.from), context.editor.offsetToPos(edit2.to), "keyline-next-format");
    context.editor.setSelection(context.editor.offsetToPos(edit2.anchor), context.editor.offsetToPos(edit2.head));
    context.editor.focus();
    return true;
  }
  color(context, patch) {
    return this.commit(context, colorSelection(context.text, context.from, context.to, patch));
  }
  url(context, destination) {
    return this.commit(context, externalLinkEdit(context.text, context.from, context.to, destination));
  }
  show(dialog) {
    if (this.live) {
      this.dialogs.add(dialog);
      dialog.open();
    }
  }
  release(dialog) {
    this.dialogs.delete(dialog);
  }
  colors(context) {
    if (context.valid())
      this.show(new ColorModal(this.app, this, context));
  }
  selectionMenu(context, point, doc, page = "main", closed = () => {
  }) {
    if (!context.valid())
      return;
    for (const menu2 of this.selectionMenus)
      menu2.close();
    const menu = new SelectionMenu(this.app, this, context, point, doc, page, (resume) => {
      this.selectionMenus.delete(menu);
      closed(resume);
    });
    this.selectionMenus.add(menu);
  }
  link(context, point, doc) {
    if (!context.valid())
      return;
    const menu = new import_obsidian23.Menu(), oneLine = !/[\r\n]/u.test(context.text.slice(context.from, context.to));
    menu.addItem((item) => item.setTitle(message("linkPage", this.zh())).setIcon("file-text").setDisabled(!oneLine).onClick(() => {
      var _a;
      if (!context.valid()) {
        new import_obsidian23.Notice(message("stale", this.zh()));
        return;
      }
      const controller = this.insertion(), insert = controller == null ? void 0 : controller.capture(context.editor, context.file);
      const old = selectedLink(context.text, context.from, context.to);
      const alias = (_a = old == null ? void 0 : old.label) != null ? _a : context.text.slice(context.from, context.to);
      if (/[\[\]|\r\n]/u.test(alias)) {
        new import_obsidian23.Notice(message("unsafeLink", this.zh()));
        return;
      }
      if (controller && insert)
        controller.pickFile(old ? { ...insert, from: old.from, to: old.to, selected: alias } : insert, "wiki");
    }));
    menu.addItem((item) => item.setTitle(message("linkUrl", this.zh())).setIcon("link").setDisabled(!oneLine).onClick(() => {
      if (context.valid())
        this.show(new LinkModal(this.app, this, context));
    }));
    menu.addItem((item) => item.setTitle(message("unlink", this.zh())).setIcon("unlink").setDisabled(!selectedLink(context.text, context.from, context.to)).onClick(() => this.commit(context, unlinkSelection(context.text, context.from, context.to))));
    this.menu(menu, point, doc);
  }
  blocks(context, point, doc) {
    if (!context.valid())
      return;
    const menu = new import_obsidian23.Menu(), block = captureBlock(context.editor, context.valid);
    menu.addItem((item) => item.setTitle(message("openInsert", this.zh())).setIcon("plus").onClick(() => {
      if (!context.valid())
        return;
      const controller = this.insertion(), insert = controller == null ? void 0 : controller.capture(context.editor, context.file);
      if (controller && insert)
        controller.open(insert);
    }));
    if (block)
      appendBlockMenu(menu, this.app, block, this.zh(), () => this.convert(context));
    this.menu(menu, point, doc);
  }
  convert(context) {
    const block = captureBlock(context.editor, context.valid), owner = this;
    if (!block || !block.blocks.length)
      return;
    this.show(new class extends BlockConvertPicker {
      onClose() {
        super.onClose();
        owner.release(this);
      }
    }(this.app, block, this.zh()));
  }
  menu(menu, point, doc) {
    this.menus.add(menu);
    menu.onHide(() => this.menus.delete(menu));
    menu.showAtPosition(point, doc);
  }
  dispose() {
    this.live = false;
    for (const menu of this.menus)
      menu.hide();
    for (const dialog of this.dialogs)
      dialog.close();
    for (const menu of this.selectionMenus)
      menu.close();
    this.menus.clear();
    this.dialogs.clear();
  }
};
var LinkModal = class extends import_obsidian23.Modal {
  constructor(app, owner, context) {
    super(app);
    this.owner = owner;
    this.context = context;
  }
  onOpen() {
    this.setTitle(message("linkUrl", this.owner.zh()));
    this.contentEl.addClass("keyline-next-link-dialog");
    const current = selectedLink(this.context.text, this.context.from, this.context.to);
    let value = (current == null ? void 0 : current.kind) === "url" ? current.destination : "";
    const form = this.contentEl.createEl("form");
    new import_obsidian23.Setting(form).setName(message("url", this.owner.zh())).addText((input) => {
      input.setValue(value).setPlaceholder("https://\u2026");
      input.inputEl.type = "url";
      input.inputEl.required = true;
      input.inputEl.setAttribute("aria-label", message("url", this.owner.zh()));
      input.onChange((next) => {
        value = next;
      });
      input.inputEl.focus();
    });
    const status = form.createEl("p", { attr: { role: "status" } });
    const submit = form.createEl("button", { text: message("apply", this.owner.zh()), cls: "mod-cta" });
    submit.type = "submit";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.context.valid()) {
        status.setText(message("stale", this.owner.zh()));
        return;
      }
      if (!externalDestination(value)) {
        status.setText(message("invalidUrl", this.owner.zh()));
        return;
      }
      if (this.owner.url(this.context, value))
        this.close();
    });
  }
  onClose() {
    this.owner.release(this);
  }
};
var ColorModal = class extends import_obsidian23.Modal {
  constructor(app, owner, context) {
    super(app);
    this.owner = owner;
    this.context = context;
  }
  onOpen() {
    this.setTitle(message("colors", this.owner.zh()));
    this.contentEl.addClass("keyline-next-color-dialog");
    const active = selectionInk(this.context.text, this.context.from, this.context.to);
    for (const kind2 of ["text", "background"]) {
      this.contentEl.createEl("h3", { text: message(kind2 === "text" ? "textColor" : "backgroundColor", this.owner.zh()) });
      const group = this.contentEl.createDiv({ cls: "keyline-next-color-grid" });
      for (const tone of ["default", ...tones]) {
        const button = group.createEl("button", { text: message(labels2[tone], this.owner.zh()) });
        button.type = "button";
        button.dataset.color = `${kind2}:${tone}`;
        button.setAttribute("aria-pressed", String(active[kind2] === tone));
        const sample = button.createSpan({ text: "Aa", cls: "keyline-next-color-sample", attr: { "aria-hidden": "true" } });
        if (kind2 === "text")
          sample.style.color = toneColor(tone);
        else
          sample.style.backgroundColor = tone === "default" ? "transparent" : `color-mix(in srgb, ${toneColor(tone)} ${tone === "yellow" ? 42 : 22}%, transparent)`;
        button.addEventListener("click", () => {
          if (this.owner.color(this.context, { [kind2]: tone }))
            this.close();
        });
      }
    }
    this.contentEl.addEventListener("keydown", (event) => {
      const target = event.target;
      if ((event.key === "Enter" || event.key === " ") && target.tagName === "BUTTON") {
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat)
          target.click();
      }
    });
  }
  onClose() {
    this.owner.release(this);
  }
};

// src/platform/icon-editor.ts
var import_obsidian24 = require("obsidian");
function availableGlyphs() {
  return identityGlyphs();
}
var IconEditor = class {
  constructor(owner) {
    this.owner = owner;
    this.live = true;
    this.dialogs = /* @__PURE__ */ new Set();
  }
  file(file) {
    this.open("path", file.path, file);
  }
  type(kind2) {
    if (iconKinds.includes(kind2))
      this.open("type", kind2);
  }
  open(scope, key, file) {
    if (!this.live || this.owner.readOnly)
      return;
    if (iconOwnerPresent(this.owner.app)) {
      new import_obsidian24.Notice(message("iconManaged", this.owner.zh));
      return;
    }
    const initial = iconChoice(this.owner.preferences.iconRules, scope, key);
    const valid = () => this.live && !this.owner.readOnly && !iconOwnerPresent(this.owner.app) && (!file || file.path === key && this.owner.app.vault.getAbstractFileByPath(key) === file) && JSON.stringify(iconChoice(this.owner.preferences.iconRules, scope, key)) === JSON.stringify(initial);
    if (!valid())
      return;
    const dialog = new IconDialog(
      this.owner.app,
      this.owner,
      scope,
      key,
      initial,
      file instanceof import_obsidian24.TFolder,
      valid,
      async (choice) => {
        if (!valid())
          return false;
        const rules = setIconChoice(this.owner.preferences.iconRules, scope, key, choice);
        if (JSON.stringify(iconChoice(rules, scope, key)) !== JSON.stringify(cleanIconChoice(choice)))
          return false;
        await this.owner.update({ iconRules: rules });
        return true;
      },
      () => this.dialogs.delete(dialog)
    );
    this.dialogs.add(dialog);
    dialog.open();
  }
  dispose() {
    this.live = false;
    for (const dialog of this.dialogs)
      dialog.close();
    this.dialogs.clear();
  }
};
var aliases2 = [
  ["folder", "\u6587\u4EF6\u5939 \u76EE\u5F55"],
  ["file", "\u6587\u4EF6 \u7B14\u8BB0 \u6587\u6863"],
  ["calendar", "\u65E5\u5386 \u65E5\u671F"],
  ["star", "\u661F \u661F\u6807"],
  ["home", "\u4E3B\u9875 \u5BB6"],
  ["house", "\u4E3B\u9875 \u5BB6"],
  ["book", "\u4E66 \u9605\u8BFB"],
  ["heart", "\u7231 \u559C\u6B22"],
  ["music", "\u97F3\u4E50"],
  ["audio", "\u97F3\u9891 \u58F0\u97F3"],
  ["image", "\u56FE\u7247"],
  ["video", "\u89C6\u9891"],
  ["code", "\u4EE3\u7801"],
  ["archive", "\u5F52\u6863 \u538B\u7F29"],
  ["briefcase", "\u5DE5\u4F5C \u9879\u76EE"],
  ["lightbulb", "\u60F3\u6CD5 \u7075\u611F"],
  ["check", "\u4EFB\u52A1 \u5B8C\u6210"],
  ["tag", "\u6807\u7B7E"]
];
function matchGlyph(id, query) {
  const words = `${id} ${id.replace(/-/gu, " ")} ${aliases2.filter(([key]) => id.split("-").includes(key)).map(([, words2]) => words2).join(" ")}`.toLowerCase();
  return query.trim().toLowerCase().split(/\s+/u).every((word) => words.includes(word));
}
var IconDialog = class extends import_obsidian24.Modal {
  constructor(app, owner, targetScope, key, choice, folder, valid, save, releasePicker) {
    super(app);
    this.owner = owner;
    this.targetScope = targetScope;
    this.key = key;
    this.choice = choice;
    this.folder = folder;
    this.valid = valid;
    this.save = save;
    this.releasePicker = releasePicker;
  }
  onOpen() {
    const zh = this.owner.zh;
    this.setTitle(message("changeIcon", zh));
    this.contentEl.addClass("keyline-next-icon-dialog");
    this.contentEl.createEl("p", { text: this.targetScope === "type" ? kindLabels[this.key][zh ? 1 : 0] : this.key, cls: "keyline-next-icon-path" });
    const preview = this.contentEl.createDiv({ cls: "keyline-next-icon-preview" });
    const sample = preview.createSpan({ attr: { "aria-hidden": "true" } }), summary = preview.createSpan();
    let query = "", draft = { ...this.choice };
    const icons = availableGlyphs();
    new import_obsidian24.Setting(this.contentEl).setName(message("iconSearch", zh)).addSearch((search) => {
      search.setPlaceholder(message("iconSearchHint", zh));
      search.inputEl.setAttribute("aria-label", message("iconSearch", zh));
      search.onChange((value) => {
        query = value;
        render();
      });
    });
    const count2 = this.contentEl.createEl("p", { cls: "setting-item-description", attr: { role: "status" } });
    const grid = this.contentEl.createDiv({ cls: "keyline-next-icon-grid" });
    let colors, custom;
    new import_obsidian24.Setting(this.contentEl).setName(message("iconColor", zh)).addDropdown((dropdown) => {
      var _a, _b;
      colors = dropdown;
      dropdown.addOption("", message("auto", zh));
      for (const tint of iconTints)
        dropdown.addOption(tint, message(tint === "cyan" ? "toneCyan" : `tone${tint[0].toUpperCase()}${tint.slice(1)}`, zh));
      if (draft.tint === "yellow")
        dropdown.addOption("yellow", message("toneYellow", zh));
      if ((_a = draft.tint) == null ? void 0 : _a.startsWith("#"))
        dropdown.addOption(draft.tint, draft.tint);
      dropdown.setValue((_b = draft.tint) != null ? _b : "").onChange((value) => {
        draft = { ...draft, tint: value || void 0 };
        custom.setValue(value.startsWith("#") ? value : "");
        custom.inputEl.setAttribute("aria-invalid", "false");
        status.setText("");
        updatePreview();
      });
    }).addText((input) => {
      var _a;
      custom = input;
      input.setPlaceholder("#336699").setValue(((_a = draft.tint) == null ? void 0 : _a.startsWith("#")) ? draft.tint : "");
      input.inputEl.setAttribute("aria-label", message("customIconColor", zh));
      input.onChange((value) => {
        var _a2;
        const valid = value === "" || /^#[\da-f]{6}$/iu.test(value);
        input.inputEl.setAttribute("aria-invalid", String(!valid));
        if (valid) {
          draft = { ...draft, tint: value.toLowerCase() || void 0 };
          if (draft.tint)
            colors.addOption(draft.tint, draft.tint);
          colors.setValue((_a2 = draft.tint) != null ? _a2 : "");
          status.setText("");
          updatePreview();
        }
      });
    });
    const status = this.contentEl.createEl("p", { attr: { role: "status" } });
    new import_obsidian24.Setting(this.contentEl).addButton((button) => button.setButtonText(message("iconAutomatic", zh)).onClick(() => {
      draft = {};
      colors.setValue("");
      custom.setValue("");
      custom.inputEl.setAttribute("aria-invalid", "false");
      status.setText("");
      render();
      updatePreview();
    })).addButton((button) => button.setButtonText(message("cancel", zh)).onClick(() => this.close())).addButton((button) => button.setButtonText(message("save", zh)).setCta().onClick(async () => {
      if (!this.valid()) {
        status.setText(message("iconChanged", zh));
        return;
      }
      if (this.contentEl.querySelector('[aria-invalid="true"]')) {
        status.setText(message("invalidIconColor", zh));
        return;
      }
      button.setDisabled(true);
      try {
        if (await this.save(cleanIconChoice(draft)))
          this.close();
        else
          status.setText(message("iconChanged", zh));
      } catch (e) {
        status.setText(message("failed", zh));
      } finally {
        button.setDisabled(false);
      }
    }));
    const updatePreview = () => {
      var _a, _b, _c, _d;
      const base = this.targetScope === "type" ? kindIdentity(this.key) : resolveIdentity(this.key, this.owner.preferences.iconRules.filter((r) => r.scope !== "path" || r.key !== this.key), false, this.folder);
      const glyph = (_a = draft.glyph) != null ? _a : base.icon;
      paintIdentityGlyph(sample, icons.includes(glyph) ? glyph : base.icon);
      sample.style.color = iconTintCss((_b = draft.tint) != null ? _b : base.color);
      summary.setText(`${(_c = draft.glyph) != null ? _c : message("auto", zh)} \xB7 ${(_d = draft.tint) != null ? _d : message("auto", zh)}`);
    };
    const render = () => {
      grid.empty();
      const matches2 = icons.filter((id) => matchGlyph(id, query)), visible = matches2.slice(0, 120);
      count2.setText(`${visible.length} / ${matches2.length} \xB7 ${message("iconNarrowSearch", zh)}`);
      for (const id of visible) {
        const button = grid.createEl("button", { attr: { "aria-label": id, "aria-pressed": String(draft.glyph === id), title: id } });
        button.type = "button";
        button.dataset.glyph = id;
        paintIdentityGlyph(button, id);
        button.addEventListener("click", () => {
          draft = { ...draft, glyph: id };
          grid.querySelectorAll("button").forEach((e) => e.setAttribute("aria-pressed", String(e === button)));
          updatePreview();
        });
      }
    };
    render();
    updatePreview();
    this.contentEl.addEventListener("keydown", (event) => {
      const button = event.target;
      if (button.tagName === "BUTTON" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat)
          button.click();
      }
    });
  }
  onClose() {
    this.releasePicker();
  }
};

// src/platform/explorer.ts
var import_obsidian26 = require("obsidian");

// src/platform/button-keys.ts
var import_obsidian25 = require("obsidian");
var ButtonKeys = class {
  constructor(app) {
    this.app = app;
  }
  focus(button, parent = this.app.scope, activate = () => button.click()) {
    var _a;
    if (((_a = this.active) == null ? void 0 : _a.button) === button)
      return;
    this.clear();
    if (!button.isConnected || button.ownerDocument.activeElement !== button || button.disabled)
      return;
    const scope = new import_obsidian25.Scope(parent != null ? parent : this.app.scope);
    for (const key of ["Enter", " "])
      scope.register([], key, (event) => {
        var _a2;
        if (((_a2 = this.active) == null ? void 0 : _a2.scope) !== scope || !button.isConnected || button.ownerDocument.activeElement !== button) {
          this.clear();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat && !button.disabled)
          activate();
        return false;
      });
    this.active = { button, scope };
    this.app.keymap.pushScope(scope);
  }
  blur(button) {
    var _a;
    if (((_a = this.active) == null ? void 0 : _a.button) === button)
      this.clear();
  }
  releaseWithin(root) {
    if (this.active && root.contains(this.active.button))
      this.clear();
  }
  prune() {
    if (this.active && !this.active.button.isConnected)
      this.clear();
  }
  clear() {
    if (!this.active)
      return;
    const scope = this.active.scope;
    this.active = void 0;
    this.app.keymap.popScope(scope);
  }
};

// src/platform/explorer.ts
var actionsClass = "keyline-next-row-actions";
var ExplorerActions = class {
  constructor(owner) {
    this.owner = owner;
    this.live = true;
    this.roots = /* @__PURE__ */ new Map();
    this.windowFocus = /* @__PURE__ */ new Map();
    this.busy = /* @__PURE__ */ new Set();
    this.keys = new ButtonKeys(owner.app);
  }
  valid(folder, path) {
    return this.live && this.owner.preferences.fileNavigation && folder.path === path && (path === "/" ? this.owner.app.vault.getRoot() === folder : this.owner.app.vault.getAbstractFileByPath(path) === folder);
  }
  async createNote(folder) {
    const path = folder.path;
    if (!this.valid(folder, path) || this.busy.has(folder))
      return;
    this.busy.add(folder);
    try {
      const target = availableNotePath(path, this.owner.zh, (p) => this.owner.app.vault.getAbstractFileByPath(p) !== null);
      if (!target || !this.valid(folder, path))
        throw Error("Unavailable destination");
      const file = await this.owner.app.vault.create(target, "");
      if (!this.live)
        return;
      if (!this.valid(folder, path) || this.owner.app.vault.getAbstractFileByPath(file.path) !== file) {
        new import_obsidian26.Notice(`${message("createdNotOpened", this.owner.zh)} ${file.path}`);
        return;
      }
      try {
        await this.owner.app.workspace.getLeaf(false).openFile(file);
      } catch (e) {
        if (this.live)
          new import_obsidian26.Notice(`${message("createdNotOpened", this.owner.zh)} ${file.path}`);
      }
    } catch (e) {
      if (this.live)
        new import_obsidian26.Notice(message("createFailed", this.owner.zh));
    } finally {
      this.busy.delete(folder);
    }
  }
  action(row, kind2) {
    if (!this.live || !this.owner.preferences.fileNavigation || !row.isConnected)
      return;
    const path = row.dataset.path, file = path && this.owner.app.vault.getAbstractFileByPath(path);
    if (!file) {
      new import_obsidian26.Notice(message("explorerChanged", this.owner.zh));
      return;
    }
    if (kind2 === "new") {
      if (file instanceof import_obsidian26.TFolder)
        void this.createNote(file);
      return;
    }
    const win = row.ownerDocument.defaultView, anchor = row.querySelector(`[data-keyline-action="more"]`);
    if (!win || !anchor)
      return;
    const rect = anchor.getBoundingClientRect();
    row.dispatchEvent(new win.MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      view: win,
      button: 2,
      buttons: 0,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2
    }));
  }
  mount(row, folder, parentScope) {
    let bar = row.querySelector(`:scope > .${actionsClass}`);
    const shape2 = folder ? "folder" : "file";
    if ((bar == null ? void 0 : bar.dataset.kind) !== shape2) {
      if (bar) {
        this.keys.releaseWithin(bar);
        bar.remove();
      }
      bar = null;
    }
    if (!bar) {
      bar = row.ownerDocument.createElement("span");
      bar.className = actionsClass;
      bar.dataset.kind = shape2;
      bar.setAttribute("role", "group");
      for (const kind2 of folder ? ["new", "more"] : ["more"]) {
        const button = row.ownerDocument.createElement("button");
        button.type = "button";
        button.dataset.keylineAction = kind2;
        button.classList.add("clickable-icon");
        button.dataset.tooltipPosition = "top";
        (0, import_obsidian26.setIcon)(button, kind2 === "new" ? "plus" : "ellipsis");
        bar.append(button);
        button.addEventListener("pointerdown", (e) => e.stopPropagation());
        button.addEventListener("mousedown", (e) => e.stopPropagation());
        button.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.action(row, kind2);
        });
        button.addEventListener("focus", () => this.keys.focus(button, parentScope));
        button.addEventListener("blur", () => this.keys.blur(button));
        button.addEventListener("keydown", (e) => {
          if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.key !== "Enter" && e.key !== " ")
            return;
          e.preventDefault();
          e.stopPropagation();
          if (!e.repeat)
            button.click();
        });
      }
      row.append(bar);
    }
    bar.setAttribute("aria-label", `${message("quickActions", this.owner.zh)}: ${row.dataset.path}`);
    for (const button of Array.from(bar.querySelectorAll("button"))) {
      button.setAttribute("aria-label", `${message(button.dataset.keylineAction === "new" ? "noteHere" : "moreActions", this.owner.zh)}: ${row.dataset.path}`);
    }
  }
  refresh() {
    var _a, _b, _c, _d;
    if (!this.live)
      return;
    this.keys.prune();
    const views = this.owner.preferences.fileNavigation ? attachedViews(this.owner.app, "file-explorer") : [];
    const current = new Map(views.map((view) => [view.containerEl, view.scope]));
    for (const [root, observer] of this.roots)
      if (!current.has(root)) {
        observer.disconnect();
        this.release(root);
        this.roots.delete(root);
      }
    for (const [root, parentScope] of current) {
      if (!this.roots.has(root)) {
        const Observer = (_a = root.ownerDocument.defaultView) == null ? void 0 : _a.MutationObserver;
        if (!Observer)
          continue;
        const observer = new Observer((records) => {
          if (records.some((record) => {
            var _a2, _b2;
            return !((_b2 = (_a2 = record.target).closest) == null ? void 0 : _b2.call(_a2, `.${actionsClass}`)) && (record.type === "attributes" || [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)].some((node) => !(node.nodeType === 1 && node.matches(`.${actionsClass}`))));
          }))
            this.schedule();
        });
        observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-path"] });
        this.roots.set(root, observer);
        const focus = () => {
          const button = root.ownerDocument.activeElement;
          if ((button == null ? void 0 : button.matches(`.${actionsClass} button`)) && root.contains(button))
            this.keys.focus(button, parentScope);
        };
        const blur = () => this.keys.releaseWithin(root);
        (_b = root.ownerDocument.defaultView) == null ? void 0 : _b.addEventListener("focus", focus);
        (_c = root.ownerDocument.defaultView) == null ? void 0 : _c.addEventListener("blur", blur);
        this.windowFocus.set(root, { focus, blur });
      }
      root.classList.add("keyline-next-explorer");
      for (const row of Array.from(root.querySelectorAll(".nav-file-title[data-path],.nav-folder-title[data-path]"))) {
        const file = this.owner.app.vault.getAbstractFileByPath((_d = row.dataset.path) != null ? _d : "");
        const folder = file instanceof import_obsidian26.TFolder;
        if (!file || row.querySelector(":scope > .nav-file-title-actions,:scope > .nav-folder-title-actions,:scope > .ncl-native-row-actions")) {
          this.removeBar(row);
          continue;
        }
        if (!row.querySelector(folder ? ".nav-folder-title-content" : ".nav-file-title-content")) {
          this.removeBar(row);
          continue;
        }
        this.mount(row, folder, parentScope);
      }
    }
  }
  removeBar(row) {
    const bar = row.querySelector(`:scope > .${actionsClass}`);
    if (bar) {
      this.keys.releaseWithin(bar);
      bar.remove();
    }
  }
  schedule() {
    if (!this.live || this.pending !== void 0)
      return;
    this.pending = setTimeout(() => {
      this.pending = void 0;
      this.refresh();
    }, 60);
  }
  release(root) {
    var _a, _b;
    this.keys.releaseWithin(root);
    const listeners = this.windowFocus.get(root);
    if (listeners) {
      (_a = root.ownerDocument.defaultView) == null ? void 0 : _a.removeEventListener("focus", listeners.focus);
      (_b = root.ownerDocument.defaultView) == null ? void 0 : _b.removeEventListener("blur", listeners.blur);
      this.windowFocus.delete(root);
    }
    root.querySelectorAll(`.${actionsClass}`).forEach((el) => el.remove());
    root.classList.remove("keyline-next-explorer");
  }
  dispose() {
    this.live = false;
    if (this.pending !== void 0)
      clearTimeout(this.pending);
    for (const [root, observer] of this.roots) {
      observer.disconnect();
      this.release(root);
    }
    this.roots.clear();
    this.keys.clear();
  }
};

// src/platform/interface.ts
var import_obsidian27 = require("obsidian");
var hostMenu = import_obsidian27.Menu;
var MenuMode = class {
  constructor(app) {
    this.app = app;
    this.tail = Promise.resolve(true);
    this.live = true;
  }
  read() {
    const vault = this.app.vault;
    if (!import_obsidian27.Platform.isDesktopApp || typeof vault.getConfig !== "function" || typeof vault.setConfig !== "function" || typeof vault.saveConfig !== "function" || typeof vault.readConfigJson !== "function" || !("useNativeMenu" in hostMenu))
      return null;
    try {
      if (typeof hostMenu.useNativeMenu === "boolean")
        return hostMenu.useNativeMenu;
      const value = vault.getConfig("nativeMenus");
      return typeof value === "boolean" ? value : null;
    } catch (e) {
      return null;
    }
  }
  set(value) {
    this.tail = this.tail.catch(() => false).then(async () => {
      if (!this.live || this.read() === null || typeof value !== "boolean")
        return false;
      const vault = this.app.vault;
      try {
        await vault.setConfig("nativeMenus", value);
        await vault.saveConfig();
        const saved = await vault.readConfigJson("appearance");
        if (!saved || typeof saved !== "object" || saved.nativeMenus !== value)
          return false;
        if (vault.getConfig("nativeMenus") !== value)
          return false;
        if (!this.live)
          return false;
        hostMenu.useNativeMenu = value;
        return this.read() === value;
      } catch (e) {
        return false;
      }
    });
    return this.tail;
  }
  dispose() {
    this.live = false;
  }
};
var HoverHints = class {
  constructor(enabled) {
    this.enabled = enabled;
    this.documents = /* @__PURE__ */ new Map();
    this.live = true;
  }
  watch(doc) {
    if (!this.live || !doc.body)
      return;
    if (!this.documents.has(doc))
      this.documents.set(doc, doc.body.classList.contains("keyline-next-no-hints"));
    this.refresh();
  }
  refresh() {
    var _a;
    if (!this.live)
      return;
    for (const [doc, initial] of this.documents) {
      if ((_a = doc.defaultView) == null ? void 0 : _a.closed) {
        this.documents.delete(doc);
        continue;
      }
      doc.body.classList.toggle("keyline-next-no-hints", !this.enabled() || initial);
    }
  }
  dispose() {
    this.live = false;
    for (const [doc, initial] of this.documents)
      doc.body.classList.toggle("keyline-next-no-hints", initial);
    this.documents.clear();
  }
};

// src/platform/shell.ts
var import_obsidian28 = require("obsidian");

// src/domain/footer.ts
function footerGeometry(value) {
  const { workspace, dock, ribbon, dockOpen, ribbonVisible } = value;
  if (![workspace, dock, ribbon].every((r) => [r.left, r.right, r.width].every(Number.isFinite)) || workspace.width <= 0 || dock.width < 0 || ribbon.width < 0)
    return null;
  const compact = !dockOpen;
  const hidden = compact && !ribbonVisible;
  const start = dockOpen ? (ribbonVisible ? ribbon.left : dock.left) + 8 : ribbon.left;
  const end = dockOpen ? dock.right - 8 : ribbon.right + 8;
  const left = Math.max(0, Math.min(workspace.width, start - workspace.left));
  const width = Math.max(0, Math.min(workspace.width - left, end - workspace.left - left));
  return { left, width, compact, hidden: hidden || width === 0 };
}

// src/platform/presentation.ts
var PresentationLease = class {
  constructor() {
    this.attrs = /* @__PURE__ */ new Map();
    this.styles = /* @__PURE__ */ new Map();
    this.classes = /* @__PURE__ */ new Map();
  }
  attribute(el, name2, value) {
    let fields = this.attrs.get(el);
    if (!fields)
      this.attrs.set(el, fields = /* @__PURE__ */ new Map());
    let field = fields.get(name2);
    const current = el.getAttribute(name2);
    if (!field)
      fields.set(name2, field = { before: current, last: current, lost: false });
    if (field.lost || current !== field.last) {
      field.lost = true;
      return;
    }
    if (current !== value) {
      if (value === null)
        el.removeAttribute(name2);
      else
        el.setAttribute(name2, value);
    }
    field.last = value;
  }
  style(el, name2, value) {
    let fields = this.styles.get(el);
    if (!fields)
      this.styles.set(el, fields = /* @__PURE__ */ new Map());
    let field = fields.get(name2);
    const current = el.style.getPropertyValue(name2);
    if (!field)
      fields.set(name2, field = { before: current, priority: el.style.getPropertyPriority(name2), last: current, lastPriority: el.style.getPropertyPriority(name2), lost: false });
    if (field.lost || current !== field.last || el.style.getPropertyPriority(name2) !== field.lastPriority) {
      field.lost = true;
      return;
    }
    if (current !== value || el.style.getPropertyPriority(name2))
      el.style.setProperty(name2, value);
    field.last = el.style.getPropertyValue(name2);
    field.lastPriority = el.style.getPropertyPriority(name2);
  }
  addClass(el, name2) {
    this.toggleClass(el, name2, true);
  }
  toggleClass(el, name2, enabled) {
    let fields = this.classes.get(el);
    if (!fields)
      this.classes.set(el, fields = /* @__PURE__ */ new Map());
    let field = fields.get(name2);
    const current = el.classList.contains(name2);
    if (!field)
      fields.set(name2, field = { before: current, last: current, lost: false });
    if (field.lost || current !== field.last) {
      field.lost = true;
      return;
    }
    el.classList.toggle(name2, enabled);
    field.last = enabled;
  }
  release() {
    for (const [el, fields] of this.classes)
      for (const [name2, field] of fields) {
        if (!field.lost && el.classList.contains(name2) === field.last)
          el.classList.toggle(name2, field.before);
      }
    for (const [el, fields] of this.attrs)
      for (const [name2, field] of fields) {
        if (field.lost || el.getAttribute(name2) !== field.last)
          continue;
        if (field.before === null)
          el.removeAttribute(name2);
        else
          el.setAttribute(name2, field.before);
      }
    for (const [el, fields] of this.styles)
      for (const [name2, field] of fields) {
        if (field.lost || el.style.getPropertyValue(name2) !== field.last || el.style.getPropertyPriority(name2) !== field.lastPriority)
          continue;
        if (field.before)
          el.style.setProperty(name2, field.before, field.priority);
        else
          el.style.removeProperty(name2);
      }
    this.attrs.clear();
    this.styles.clear();
    this.classes.clear();
  }
};

// src/platform/shell.ts
var shellSelector = ".workspace,.workspace-ribbon.mod-left,.mod-left-split,.workspace-sidedock-vault-profile";
var FooterDocument = class {
  constructor(app, doc, zh) {
    this.app = app;
    this.doc = doc;
    this.zh = zh;
    this.live = true;
    this.onResize = () => this.schedule();
    this.onBlur = () => this.keys.clear();
    this.onFocus = () => {
      const current = this.doc.activeElement;
      if (current && this.mounted && [this.mounted.switcher, this.mounted.settings, this.mounted.help].includes(current)) {
        this.focus(current);
      }
    };
    this.keys = new ButtonKeys(app);
    const win = doc.defaultView;
    if (!win || !doc.body)
      return;
    this.observer = new win.MutationObserver((records) => {
      if (records.some((record) => {
        var _a, _b, _c;
        if (record.type === "attributes")
          return [doc.body, (_a = this.mounted) == null ? void 0 : _a.workspace, (_b = this.mounted) == null ? void 0 : _b.dock, (_c = this.mounted) == null ? void 0 : _c.ribbon].includes(record.target);
        return [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)].some((node) => node.nodeType === 1 && (node.matches(shellSelector) || !!node.querySelector(shellSelector)));
      }))
        this.schedule();
    });
    this.observer.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    this.resize = new win.ResizeObserver(this.onResize);
    win.addEventListener("resize", this.onResize);
    win.addEventListener("blur", this.onBlur);
    win.addEventListener("focus", this.onFocus);
    this.refresh();
  }
  activate(el) {
    var _a;
    if (!this.live || !((_a = this.mounted) == null ? void 0 : _a.profile.contains(el)) || !el.isConnected)
      return;
    const win = this.doc.defaultView, rect = el.getBoundingClientRect();
    if (!win || rect.width <= 0 || rect.height <= 0)
      return;
    el.dispatchEvent(new win.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      view: win
    }));
  }
  focus(el) {
    this.keys.focus(el, this.app.scope, () => this.activate(el));
  }
  discover() {
    var _a, _b, _c;
    const workspace = this.doc.querySelector(".workspace");
    const dock = workspace == null ? void 0 : workspace.querySelector(":scope > .mod-left-split");
    const ribbon = workspace == null ? void 0 : workspace.querySelector(":scope > .workspace-ribbon.mod-left");
    const profile = dock == null ? void 0 : dock.querySelector(":scope > .workspace-sidedock-vault-profile");
    if (!workspace || !dock || !ribbon || !profile || profile.matches(".ncl-shell-profile,.keyline-next-footer"))
      return;
    const switcher = profile.querySelector(".workspace-drawer-vault-switcher");
    const name2 = switcher == null ? void 0 : switcher.querySelector(".workspace-drawer-vault-name");
    const settings = (_a = profile.querySelector(".workspace-drawer-vault-actions .lucide-settings")) == null ? void 0 : _a.closest(".clickable-icon");
    const help = (_c = (_b = profile.querySelector(".workspace-drawer-vault-actions :is(svg.help,.lucide-circle-help,.lucide-help-circle)")) == null ? void 0 : _b.closest(".clickable-icon")) != null ? _c : null;
    if (switcher && name2 && settings)
      return { workspace, dock, ribbon, profile, switcher, name: name2, settings, help };
  }
  attach(parts) {
    var _a;
    const { workspace, dock, ribbon, profile, switcher, settings, help } = parts;
    const lease = new PresentationLease(), space2 = this.doc.createElement("div"), glyph = this.doc.createElement("span");
    space2.className = "ncl-shell-footer-space keyline-next-footer-space";
    space2.setAttribute("aria-hidden", "true");
    glyph.className = "ncl-shell-vault-icon keyline-next-vault-glyph";
    glyph.setAttribute("aria-hidden", "true");
    (0, import_obsidian28.setIcon)(glyph, "vault");
    const removeListeners = [];
    this.mounted = { ...parts, lease, space: space2, glyph, removeListeners };
    lease.addClass(workspace, "ncl-shell-managed");
    lease.addClass(ribbon, "ncl-shell-ribbon");
    lease.addClass(profile, "ncl-shell-profile");
    lease.addClass(profile, "keyline-next-footer");
    lease.addClass(settings, "ncl-shell-settings");
    if (help)
      lease.addClass(help, "ncl-shell-secondary");
    const focused = profile.contains(this.doc.activeElement) ? this.doc.activeElement : void 0;
    profile.replaceWith(space2);
    workspace.append(profile);
    switcher.prepend(glyph);
    for (const el of [switcher, settings, help].filter((el2) => !!el2)) {
      if (!el.getAttribute("role"))
        lease.attribute(el, "role", "button");
      if (!el.hasAttribute("tabindex"))
        lease.attribute(el, "tabindex", "0");
      lease.attribute(el, "data-tooltip-position", "top");
      lease.attribute(el, "title", null);
      const focus = () => this.focus(el), blur = () => this.keys.blur(el);
      const key = (event) => {
        if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey || !["Enter", " "].includes(event.key))
          return;
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat)
          this.activate(el);
      };
      el.addEventListener("focus", focus);
      el.addEventListener("blur", blur);
      el.addEventListener("keydown", key);
      removeListeners.push(() => {
        el.removeEventListener("focus", focus);
        el.removeEventListener("blur", blur);
        el.removeEventListener("keydown", key);
      });
    }
    const quiet = (event) => {
      if (profile.dataset.keylineFooterMode === "expanded")
        event.stopImmediatePropagation();
    };
    switcher.addEventListener("mouseover", quiet, true);
    removeListeners.push(() => switcher.removeEventListener("mouseover", quiet, true));
    for (const el of [workspace, dock, ribbon, profile])
      (_a = this.resize) == null ? void 0 : _a.observe(el);
    focused == null ? void 0 : focused.focus({ preventScroll: true });
  }
  refresh() {
    var _a;
    if (!this.live)
      return;
    const win = this.doc.defaultView;
    const enabled = import_obsidian28.Platform.isDesktopApp && !this.doc.body.classList.contains("is-mobile") && win && win.getComputedStyle(this.doc.body).getPropertyValue("--ncl-shell-controls").trim() === "1";
    if (!enabled) {
      this.detach();
      return;
    }
    const previous = this.mounted;
    if (previous && (!previous.workspace.isConnected || !previous.dock.isConnected || !previous.ribbon.isConnected || previous.profile.parentElement !== previous.workspace || previous.space.parentElement !== previous.dock || !previous.profile.contains(previous.switcher) || !previous.profile.contains(previous.settings) || previous.dock.querySelector(":scope > .workspace-sidedock-vault-profile")))
      this.detach();
    if (!this.mounted) {
      const parts = this.discover();
      if (parts)
        this.attach(parts);
    }
    const m = this.mounted;
    if (!m)
      return;
    const ribbonStyle = win.getComputedStyle(m.ribbon);
    const geometry = footerGeometry({
      workspace: m.workspace.getBoundingClientRect(),
      dock: m.dock.getBoundingClientRect(),
      ribbon: m.ribbon.getBoundingClientRect(),
      dockOpen: m.workspace.classList.contains("is-left-sidedock-open"),
      ribbonVisible: ribbonStyle.display !== "none" && ribbonStyle.visibility !== "hidden" && m.ribbon.getBoundingClientRect().width > 0
    });
    if (!geometry) {
      this.detach();
      return;
    }
    m.lease.attribute(m.switcher, "aria-label", `${message("switchVault", this.zh())}: ${(_a = m.name.textContent) != null ? _a : ""}`);
    m.lease.attribute(m.settings, "aria-label", message("shellSettings", this.zh()));
    if (m.help)
      m.lease.attribute(m.help, "aria-label", message("shellHelp", this.zh()));
    m.lease.attribute(m.profile, "data-keyline-footer-mode", geometry.compact ? "compact" : "expanded");
    m.lease.toggleClass(m.profile, "is-compact", geometry.compact);
    m.lease.style(m.profile, "display", geometry.hidden ? "none" : "");
    m.lease.style(m.profile, "left", `${geometry.left}px`);
    m.lease.style(m.profile, "width", `${geometry.width}px`);
    const height = geometry.hidden ? 0 : m.profile.getBoundingClientRect().height;
    if (!Number.isFinite(height)) {
      this.detach();
      return;
    }
    m.space.style.height = `${geometry.compact ? 0 : height}px`;
    m.lease.style(m.ribbon, "--ncl-shell-footer-height", `${height}px`);
    const focused = this.doc.activeElement;
    if (focused && m.profile.contains(focused) && !focused.getBoundingClientRect().width)
      this.keys.clear();
  }
  schedule() {
    if (!this.live || this.timer !== void 0)
      return;
    this.timer = setTimeout(() => {
      this.timer = void 0;
      this.refresh();
    }, 40);
  }
  detach() {
    var _a;
    const m = this.mounted;
    if (!m)
      return;
    this.mounted = void 0;
    (_a = this.resize) == null ? void 0 : _a.disconnect();
    this.keys.clear();
    for (const remove of m.removeListeners)
      remove();
    m.glyph.remove();
    m.lease.release();
    if (m.profile.parentElement === m.workspace) {
      if (m.space.isConnected && m.space.parentElement === m.dock && !m.dock.querySelector(":scope > .workspace-sidedock-vault-profile"))
        m.space.replaceWith(m.profile);
      else
        m.profile.remove();
    }
    m.space.remove();
  }
  dispose() {
    var _a;
    this.live = false;
    if (this.timer !== void 0)
      clearTimeout(this.timer);
    (_a = this.observer) == null ? void 0 : _a.disconnect();
    const win = this.doc.defaultView;
    win == null ? void 0 : win.removeEventListener("resize", this.onResize);
    win == null ? void 0 : win.removeEventListener("blur", this.onBlur);
    win == null ? void 0 : win.removeEventListener("focus", this.onFocus);
    this.detach();
    this.keys.clear();
  }
};
var ShellPresentation = class {
  constructor(app, zh) {
    this.app = app;
    this.zh = zh;
    this.documents = /* @__PURE__ */ new Map();
    this.live = true;
  }
  watch(doc) {
    if (!this.live || !doc.body || this.documents.has(doc))
      return;
    this.documents.set(doc, new FooterDocument(this.app, doc, this.zh));
  }
  refresh() {
    var _a;
    if (!this.live)
      return;
    for (const [doc, footer] of this.documents) {
      if ((_a = doc.defaultView) == null ? void 0 : _a.closed) {
        footer.dispose();
        this.documents.delete(doc);
      } else
        footer.refresh();
    }
  }
  dispose() {
    this.live = false;
    for (const footer of this.documents.values())
      footer.dispose();
    this.documents.clear();
  }
};

// src/platform/sync-status.ts
var import_obsidian29 = require("obsidian");

// src/domain/sync-status.ts
var glyphs = /* @__PURE__ */ new Map([
  ["\u{1F310}", "globe"],
  ["\u{1F4F2}", "smartphone"],
  ["\u23F9", "square"],
  ["\u{1F4A4}", "pause"],
  ["\u{1F300}", "refresh-cw"],
  ["\u26A1", "zap"],
  ["\u{1F4E6}", "package"],
  ["\u23F3", "hourglass"],
  ["\u{1F6EB}", "upload"],
  ["\u{1F4EC}", "inbox"],
  ["\u26A0", "triangle-alert"],
  ["\u26D4", "circle-alert"],
  ["\u2191", "arrow-up"],
  ["\u2193", "arrow-down"]
]);
var ordinaryStates = /* @__PURE__ */ new Set(["\u23F9", "\u{1F4A4}", "\u{1F300}", "\u26A1", "\u{1F4E6}"]);
function syncStatus(text2) {
  const at = text2.indexOf("Sync:");
  if (at < 0 || text2.length > 16e3)
    return null;
  const parts = [];
  let plain2 = "";
  for (let index = 0; index < text2.length; ) {
    const point = String.fromCodePoint(text2.codePointAt(index));
    index += point.length;
    const icon = glyphs.get(point);
    if (!icon) {
      plain2 += point;
      continue;
    }
    if (plain2) {
      parts.push({ text: plain2 });
      plain2 = "";
    }
    const variant = text2[index] === "\uFE0F" ? text2[index++] : "";
    parts.push({ text: point + variant, icon, warning: point === "\u26A0" || point === "\u26D4" });
  }
  if (plain2)
    parts.push({ text: plain2 });
  const remainder = parts.filter((part) => !part.icon).map((part) => part.text).join("");
  const halves = remainder.split("Sync:");
  const counters = (value) => /^[\s\d.:()]*$/u.test(value);
  const tail = text2.slice(at + 5).replace(/^\s+/u, ""), first = [...tail][0];
  const routine = halves.length === 2 && counters(halves[0]) && counters(halves[1].replace(/\bLIVE\b/gu, "")) && ordinaryStates.has(first) && !parts.some((part) => part.warning);
  return { parts, attention: !routine };
}

// src/platform/sync-status.ts
var itemSelector = ".status-bar > .syncstatusbar";
var SyncStatusDocument = class {
  constructor(doc, onDispose = () => {
  }) {
    this.doc = doc;
    this.onDispose = onDispose;
    this.live = true;
    this.painted = [];
    this.schedule = () => {
      if (!this.live || this.timer !== void 0)
        return;
      this.timer = this.win.setTimeout(() => {
        this.timer = void 0;
        this.refresh();
      }, 30);
    };
    this.dispose = () => {
      if (!this.live)
        return;
      this.live = false;
      this.observer.disconnect();
      if (this.timer !== void 0)
        this.win.clearTimeout(this.timer);
      this.timer = void 0;
      this.win.removeEventListener("pagehide", this.dispose);
      this.release();
      this.onDispose();
    };
    this.win = doc.defaultView;
    this.observer = new this.win.MutationObserver((records) => {
      if (records.some((r) => {
        var _a;
        return r.type === "attributes" && r.target === doc.body || this.painted.some((paint) => paint.item === r.target || paint.content.contains(r.target)) || ((_a = r.target.nodeType === 1 ? r.target : r.target.parentElement) == null ? void 0 : _a.closest(".syncstatusbar")) || [...Array.from(r.addedNodes), ...Array.from(r.removedNodes)].some((node) => node.nodeType === 1 && (node.matches(".status-bar,.syncstatusbar") || node.querySelector(".status-bar,.syncstatusbar")));
      }))
        this.schedule();
    });
    this.win.addEventListener("pagehide", this.dispose);
    this.refresh();
  }
  release() {
    for (const paint of this.painted) {
      for (const { token, source, svg } of paint.tokens) {
        if (svg.parentNode === token)
          svg.remove();
        if (source.parentNode === token)
          source.replaceWith(...Array.from(source.childNodes));
        if (token.parentNode)
          token.replaceWith(...Array.from(token.childNodes));
      }
      if (paint.content.parentNode)
        paint.content.replaceWith(...Array.from(paint.content.childNodes));
      paint.lease.release();
    }
    this.painted = [];
  }
  refresh() {
    var _a;
    if (!this.live)
      return;
    this.observer.disconnect();
    this.release();
    const enabled = import_obsidian29.Platform.isDesktopApp && !this.doc.body.classList.contains("is-mobile") && this.win.getComputedStyle(this.doc.body).getPropertyValue("--ncl-shell-controls").trim() === "1";
    if (enabled)
      for (const item of Array.from(this.doc.querySelectorAll(itemSelector))) {
        if (item.matches(".ncl-sync-known,.ncl-sync-attention") || Array.from(item.childNodes).some((node) => node.nodeType !== 3))
          continue;
        const plan = syncStatus((_a = item.textContent) != null ? _a : "");
        if (!plan)
          continue;
        const content2 = this.doc.createElement("span");
        content2.className = "keyline-next-sync-content";
        const paint = { item, content: content2, tokens: [], lease: new PresentationLease() };
        for (const part of plan.parts) {
          const icon = part.icon && (0, import_obsidian29.getIcon)(part.icon);
          if (!icon || icon.textContent) {
            content2.append(this.doc.createTextNode(part.text));
            continue;
          }
          const token = this.doc.createElement("span"), source = this.doc.createElement("span");
          const svg = this.doc.importNode(icon, true);
          token.className = "keyline-next-sync-token";
          if (part.warning)
            token.classList.add("is-warning");
          source.className = "keyline-next-sync-source";
          source.textContent = part.text;
          svg.setAttribute("aria-hidden", "true");
          svg.setAttribute("focusable", "false");
          token.append(source, svg);
          content2.append(token);
          paint.tokens.push({ token, source, svg });
        }
        paint.lease.addClass(item, plan.attention ? "ncl-sync-attention" : "ncl-sync-known");
        item.replaceChildren(content2);
        this.painted.push(paint);
      }
    this.observer.observe(this.doc.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class"] });
  }
};
var SyncStatusPresentation = class {
  constructor() {
    this.docs = /* @__PURE__ */ new Map();
    this.live = true;
  }
  watch(doc) {
    if (!this.live || !doc.body || !doc.defaultView || doc.defaultView.closed || this.docs.has(doc))
      return;
    this.docs.set(doc, new SyncStatusDocument(doc, () => this.docs.delete(doc)));
  }
  refresh() {
    if (!this.live)
      return;
    for (const [doc, presentation] of this.docs) {
      if (!doc.defaultView || doc.defaultView.closed) {
        presentation.dispose();
        this.docs.delete(doc);
      } else
        presentation.refresh();
    }
  }
  dispose() {
    this.live = false;
    for (const presentation of this.docs.values())
      presentation.dispose();
    this.docs.clear();
  }
};

// src/main.ts
var KeylineNext = class extends import_obsidian30.Plugin {
  constructor() {
    super(...arguments);
    this.preferences = { ...defaults };
    this.readOnly = false;
    this.composition = /* @__PURE__ */ new WeakSet();
    this.ready = false;
    this.active = true;
  }
  get zh() {
    return isChinese(this.preferences);
  }
  get editorPreferences() {
    return editingPreferences(this.preferences);
  }
  watchInterfaceDocument(doc) {
    var _a;
    (_a = this.hints) == null ? void 0 : _a.watch(doc);
  }
  async onload() {
    var _a, _b;
    if (import_obsidian30.Platform.isMobile) {
      new import_obsidian30.Notice(message("mobile", this.zh));
      return;
    }
    this.register(() => {
      this.active = false;
    });
    try {
      const data = await this.loadData();
      this.preferences = decodePreferences(data);
      this.readOnly = !writablePreferences(data);
    } catch (e) {
      this.readOnly = true;
    }
    if (!this.active)
      return;
    this.store = new VerifiedStore((value) => this.saveData(value), () => this.loadData(), (state) => this.saveStatus(state));
    this.register(() => {
      var _a2;
      this.store.close();
      (_a2 = this.warning) == null ? void 0 : _a2.hide();
    });
    const adapter = this.app.vault.adapter, directory = (_a = this.manifest.dir) != null ? _a : `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
    const dataPath = `${directory}/data.json`, backups = `${directory}/settings-backups`;
    this.transfer = new SettingsTransfer(
      {
        read: async () => await adapter.exists(dataPath) ? adapter.read(dataPath) : null,
        write: async (value) => {
          if (value === null) {
            if (await adapter.exists(dataPath))
              await adapter.remove(dataPath);
          } else
            await adapter.write(dataPath, value);
        },
        createBackup: async (name2, value) => {
          if (!await adapter.exists(backups))
            await adapter.mkdir(backups);
          const target = `${backups}/${name2}`;
          if (await adapter.exists(target))
            throw Error("Backup already exists; no overwrite");
          await adapter.write(target, value);
        },
        readBackup: (name2) => adapter.read(`${backups}/${name2}`),
        listBackups: async () => await adapter.exists(backups) ? (await adapter.list(backups)).files.map((path) => path.slice(path.lastIndexOf("/") + 1)) : []
      },
      () => this.preferences,
      () => this.active && !this.readOnly && !this.store.dirty,
      (value) => {
        this.preferences = value;
        this.refreshPreferences();
      },
      () => {
        this.readOnly = true;
      }
    );
    this.register(() => {
      var _a2;
      return (_a2 = this.transfer) == null ? void 0 : _a2.close();
    });
    this.identities = new FileIdentities(this.app, () => this.preferences);
    this.register(() => {
      var _a2;
      return (_a2 = this.identities) == null ? void 0 : _a2.dispose();
    });
    this.iconEditor = new IconEditor(this);
    this.register(() => {
      var _a2;
      return (_a2 = this.iconEditor) == null ? void 0 : _a2.dispose();
    });
    this.explorer = new ExplorerActions(this);
    this.register(() => {
      var _a2;
      return (_a2 = this.explorer) == null ? void 0 : _a2.dispose();
    });
    this.menuMode = new MenuMode(this.app);
    this.register(() => {
      var _a2;
      return (_a2 = this.menuMode) == null ? void 0 : _a2.dispose();
    });
    this.hints = new HoverHints(() => this.preferences.hints);
    this.hints.watch(document);
    this.register(() => {
      var _a2;
      return (_a2 = this.hints) == null ? void 0 : _a2.dispose();
    });
    this.shell = new ShellPresentation(this.app, () => this.zh);
    this.register(() => {
      var _a2;
      return (_a2 = this.shell) == null ? void 0 : _a2.dispose();
    });
    this.syncStatus = new SyncStatusPresentation();
    this.register(() => {
      var _a2;
      return (_a2 = this.syncStatus) == null ? void 0 : _a2.dispose();
    });
    this.registerEvent(this.app.workspace.on("window-open", (_workspace, win) => {
      var _a2, _b2, _c, _d;
      (_a2 = this.hints) == null ? void 0 : _a2.watch(win.document);
      (_b2 = this.explorer) == null ? void 0 : _b2.schedule();
      (_c = this.shell) == null ? void 0 : _c.watch(win.document);
      (_d = this.syncStatus) == null ? void 0 : _d.watch(win.document);
    }));
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
      menu.addItem((item) => item.setTitle(message("changeIcon", this.zh)).setIcon("palette").setDisabled(this.readOnly).onClick(() => {
        var _a2;
        return (_a2 = this.iconEditor) == null ? void 0 : _a2.file(file);
      }));
    }));
    this.addCommand({ id: "file-icon", name: message("currentFileIcon", this.zh), checkCallback: (checking) => {
      var _a2;
      const file = this.app.workspace.getActiveFile();
      if (!file || this.readOnly)
        return false;
      if (!checking)
        (_a2 = this.iconEditor) == null ? void 0 : _a2.file(file);
      return true;
    } });
    this.typography = new TypographyController(this.app, () => this.preferences);
    this.register(() => {
      var _a2;
      return (_a2 = this.typography) == null ? void 0 : _a2.dispose();
    });
    this.rhythm = new EditorRhythmController(() => this.editorPreferences);
    this.registerEditorExtension(this.rhythm.extension());
    this.register(() => {
      var _a2;
      return (_a2 = this.rhythm) == null ? void 0 : _a2.dispose();
    });
    this.rowSelection = new RowSelection(() => this.editorPreferences);
    this.registerEditorExtension(this.rowSelection.extension());
    this.register(() => {
      var _a2;
      return (_a2 = this.rowSelection) == null ? void 0 : _a2.dispose();
    });
    this.rich = new RichFormatting(this.app, () => this.zh, () => this.insertion, (editor) => this.app.workspace.getLeavesOfType("markdown").some((leaf) => leaf.view.editor === editor && this.composition.has(leaf.view.containerEl.ownerDocument)));
    this.register(() => {
      var _a2;
      return (_a2 = this.rich) == null ? void 0 : _a2.dispose();
    });
    this.toolbar = new ToolbarController(this.app, () => this.editorPreferences, () => this.zh, this.rich);
    this.registerEditorExtension(this.toolbar.extension());
    this.register(() => {
      var _a2;
      return (_a2 = this.toolbar) == null ? void 0 : _a2.dispose();
    });
    this.workspaces = new WorkspaceController(
      this.app,
      this.addStatusBarItem(),
      (_b = this.manifest.dir) != null ? _b : `${this.app.vault.configDir}/plugins/${this.manifest.id}`,
      () => !this.readOnly && this.preferences.workspaces,
      () => this.zh
    );
    this.register(() => {
      var _a2;
      return (_a2 = this.workspaces) == null ? void 0 : _a2.dispose();
    });
    const watched = /* @__PURE__ */ new WeakSet();
    const bindDocuments = () => {
      this.app.workspace.iterateAllLeaves((leaf) => {
        var _a2, _b2, _c;
        const doc = leaf.view.containerEl.ownerDocument;
        if (watched.has(doc))
          return;
        watched.add(doc);
        (_a2 = this.hints) == null ? void 0 : _a2.watch(doc);
        (_b2 = this.shell) == null ? void 0 : _b2.watch(doc);
        (_c = this.syncStatus) == null ? void 0 : _c.watch(doc);
        this.registerDomEvent(doc, "compositionstart", () => this.composition.add(doc));
        this.registerDomEvent(doc, "compositionend", () => this.composition.delete(doc));
      });
    };
    this.app.workspace.onLayoutReady(() => {
      var _a2, _b2, _c, _d, _e, _f;
      if (!this.active)
        return;
      this.ready = true;
      (_a2 = this.shell) == null ? void 0 : _a2.watch(document);
      (_b2 = this.syncStatus) == null ? void 0 : _b2.watch(document);
      bindDocuments();
      (_c = this.identities) == null ? void 0 : _c.refresh();
      (_d = this.explorer) == null ? void 0 : _d.refresh();
      (_e = this.typography) == null ? void 0 : _e.refresh();
      (_f = this.workspaces) == null ? void 0 : _f.refresh();
    });
    this.registerEvent(this.app.workspace.on("layout-change", () => {
      var _a2, _b2, _c, _d, _e;
      if (this.ready) {
        bindDocuments();
        (_a2 = this.shell) == null ? void 0 : _a2.refresh();
        (_b2 = this.identities) == null ? void 0 : _b2.schedule();
        (_c = this.explorer) == null ? void 0 : _c.schedule();
        (_d = this.typography) == null ? void 0 : _d.refresh();
        (_e = this.workspaces) == null ? void 0 : _e.refresh();
      }
    }));
    this.registerEvent(this.app.workspace.on("css-change", () => {
      var _a2, _b2, _c, _d, _e, _f, _g, _h;
      (_a2 = this.shell) == null ? void 0 : _a2.refresh();
      (_b2 = this.syncStatus) == null ? void 0 : _b2.refresh();
      (_c = this.identities) == null ? void 0 : _c.schedule();
      (_d = this.explorer) == null ? void 0 : _d.schedule();
      (_e = this.typography) == null ? void 0 : _e.refresh();
      (_f = this.rhythm) == null ? void 0 : _f.refresh();
      (_g = this.rowSelection) == null ? void 0 : _g.refresh();
      (_h = this.workspaces) == null ? void 0 : _h.refresh();
    }));
    this.registerEvent(this.app.vault.on("rename", (file, before) => {
      var _a2, _b2;
      const result = renameIconRules(this.preferences.iconRules, before, file.path);
      if (result.conflict)
        new import_obsidian30.Notice(message("iconRenameConflict", this.zh));
      else if (JSON.stringify(result.rules) !== JSON.stringify(this.preferences.iconRules))
        void this.update({ iconRules: result.rules });
      (_a2 = this.identities) == null ? void 0 : _a2.schedule();
      (_b2 = this.explorer) == null ? void 0 : _b2.schedule();
    }));
    this.insertion = new InsertionController(this.app, () => this.editorPreferences, () => this.zh, (editor) => this.app.workspace.getLeavesOfType("markdown").some((leaf) => leaf.view.editor === editor && this.composition.has(leaf.view.containerEl.ownerDocument)));
    this.register(() => {
      var _a2;
      return (_a2 = this.insertion) == null ? void 0 : _a2.dispose();
    });
    this.insertMenus = new InsertionMenus(this.insertion);
    this.registerEditorExtension(this.insertMenus.extension());
    this.register(() => {
      var _a2;
      return (_a2 = this.insertMenus) == null ? void 0 : _a2.dispose();
    });
    this.handles = new BlockHandles(
      this.app,
      () => this.editorPreferences,
      () => this.zh,
      this.insertion,
      (dragGranularity) => this.update({ dragGranularity })
    );
    this.registerEditorExtension(this.handles.extension());
    this.register(() => {
      var _a2;
      return (_a2 = this.handles) == null ? void 0 : _a2.dispose();
    });
    const blockKeys = new BlockKeys(() => this.editorPreferences);
    this.registerEditorExtension(blockKeys.extension());
    this.register(() => blockKeys.dispose());
    this.addCommand({
      id: "focus-block-handle",
      name: message("focusBlockHandle", this.zh),
      editorCheckCallback: (checking, editor, view) => {
        var _a2, _b2;
        if (!view.file || !this.editorPreferences.blockHandles || editor.listSelections().length !== 1)
          return false;
        return checking ? !!((_a2 = this.handles) == null ? void 0 : _a2.canFocus(editor)) : !!((_b2 = this.handles) == null ? void 0 : _b2.focus(editor));
      }
    });
    this.mentions = new MentionController(this.app, () => this.editorPreferences, () => this.zh);
    this.registerEditorExtension(this.mentions.extension());
    this.register(() => {
      var _a2;
      return (_a2 = this.mentions) == null ? void 0 : _a2.dispose();
    });
    this.writing = new WritingController(() => this.editorPreferences, () => this.zh);
    this.registerEditorExtension(this.writing.extension());
    this.register(() => {
      var _a2;
      return (_a2 = this.writing) == null ? void 0 : _a2.dispose();
    });
    this.addCommand({
      id: "toggle-markers",
      name: message("toggleMarkers", this.zh),
      callback: () => {
        void this.update({ hideMarkers: !this.preferences.hideMarkers });
      }
    });
    this.addCommand({
      id: "next-suspicious",
      name: message("nextSuspicious", this.zh),
      editorCheckCallback: (checking, editor, view) => {
        var _a2;
        if (!view.file || editor.listSelections().length !== 1)
          return false;
        return checking || !!((_a2 = this.writing) == null ? void 0 : _a2.next(editor));
      }
    });
    const settings = new NextSettings(this);
    this.addSettingTab(settings);
    this.register(() => settings.hide());
    this.addCommand({
      id: "insert",
      name: message("openInsert", this.zh),
      editorCheckCallback: (checking, editor, view) => {
        var _a2, _b2;
        const context = view.file && ((_a2 = this.insertion) == null ? void 0 : _a2.capture(editor, view.file));
        const eligible = !!(context == null ? void 0 : context.valid());
        if (eligible && !checking)
          (_b2 = this.insertion) == null ? void 0 : _b2.open(context);
        return eligible;
      }
    });
    for (const action of blockActions)
      this.addCommand({
        id: `block-${action.id}`,
        name: message(action.label, this.zh),
        editorCheckCallback: (checking, editor, view) => {
          const file = view.file, doc = "containerEl" in view ? view.containerEl.ownerDocument : void 0;
          const context = captureBlock(editor, () => this.active && !!doc && !!file && view.file === file && !this.composition.has(doc));
          const eligible = !!context && (action.id === "select" || !!blockActionPlan(context, action.id));
          if (eligible && !checking)
            performBlock(context, action.id);
          return eligible;
        }
      });
    this.addCommand({
      id: "block-convert",
      name: message("convertBlock", this.zh),
      editorCheckCallback: (checking, editor, view) => {
        const file = view.file, doc = "containerEl" in view ? view.containerEl.ownerDocument : void 0;
        const context = captureBlock(editor, () => this.active && !!doc && !!file && view.file === file && !this.composition.has(doc));
        if (context && !checking)
          new BlockConvertPicker(this.app, context, this.zh).open();
        return !!context;
      }
    });
    for (const [id, label2, run] of [
      ["switch-workspace", "switchWorkspace", () => {
        var _a2;
        return (_a2 = this.workspaces) == null ? void 0 : _a2.open();
      }],
      ["save-workspace", "saveWorkspace", () => {
        var _a2;
        return (_a2 = this.workspaces) == null ? void 0 : _a2.save();
      }],
      ["save-workspace-as", "saveWorkspaceAs", () => {
        var _a2;
        return (_a2 = this.workspaces) == null ? void 0 : _a2.saveAs();
      }],
      ["restore-workspace", "restoreWorkspace", () => {
        var _a2;
        void ((_a2 = this.workspaces) == null ? void 0 : _a2.restore());
      }]
    ])
      this.addCommand({ id, name: message(label2, this.zh), callback: run });
    this.addCommand({
      id: "focus-toolbar",
      name: message("focusToolbar", this.zh),
      editorCheckCallback: (checking, editor) => {
        var _a2;
        const selected = editor.getSelection(), text2 = editor.getValue();
        const eligible = this.editorPreferences.toolbar && editor.listSelections().length === 1 && !!selected.trim() && selected.length <= 16e3 && text2.length <= 2 * 1024 * 1024 && !inProtectedSyntax(text2, editor.posToOffset(editor.getCursor("from")), editor.posToOffset(editor.getCursor("to")));
        if (eligible && !checking)
          (_a2 = this.toolbar) == null ? void 0 : _a2.focus(editor);
        return eligible;
      }
    });
    for (const action of ["colors", "link"])
      this.addCommand({
        id: `selection-${action}`,
        name: message(action, this.zh),
        editorCheckCallback: (checking, editor, view) => {
          var _a2;
          const context = view.file && ((_a2 = this.rich) == null ? void 0 : _a2.capture(editor, view.file));
          if (!(context == null ? void 0 : context.valid()))
            return false;
          if (!checking) {
            if (action === "colors")
              this.rich.colors(context);
            else if ("containerEl" in view) {
              const rect = view.containerEl.getBoundingClientRect();
              this.rich.link(context, { x: rect.left + 24, y: rect.top + 80 }, view.containerEl.ownerDocument);
            }
          }
          return true;
        }
      });
    for (const style of inlineStyles)
      this.addCommand({
        id: `format-${style}`,
        name: message(style, this.zh),
        editorCheckCallback: (checking, editor) => {
          const eligible = editor.listSelections().length === 1 && inlineEdit(editor.getSelection(), style) !== null;
          if (eligible && !checking)
            formatSelection(editor, style);
          return eligible;
        }
      });
    this.addCommand({
      id: "format-selection",
      name: message("format", this.zh),
      editorCheckCallback: (checking, editor) => {
        const eligible = editor.listSelections().length === 1 && inlineEdit(editor.getSelection(), "bold") !== null;
        if (eligible && !checking)
          new FormatPicker(this.app, editor, this.zh).open();
        return eligible;
      }
    });
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
      const file = view.file, doc = "containerEl" in view ? view.containerEl.ownerDocument : void 0;
      const context = captureBlock(editor, () => this.active && !!doc && !!file && view.file === file && !this.composition.has(doc));
      if (context)
        appendBlockMenu(menu, this.app, context, this.zh);
      if (editor.listSelections().length !== 1 || !inlineEdit(editor.getSelection(), "bold"))
        return;
      menu.addItem((item) => item.setTitle(message("format", this.zh)).setIcon("type").onClick(() => new FormatPicker(this.app, editor, this.zh).open()));
    }));
  }
  async update(patch) {
    var _a;
    if (this.readOnly || !this.store || ((_a = this.transfer) == null ? void 0 : _a.busy))
      return;
    this.preferences = decodePreferences({ ...this.preferences, ...patch });
    this.refreshPreferences();
    await this.store.save(this.preferences);
  }
  refreshPreferences() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    (_a = this.identities) == null ? void 0 : _a.refresh();
    (_b = this.explorer) == null ? void 0 : _b.refresh();
    (_c = this.hints) == null ? void 0 : _c.refresh();
    (_d = this.shell) == null ? void 0 : _d.refresh();
    (_e = this.typography) == null ? void 0 : _e.refresh();
    (_f = this.rhythm) == null ? void 0 : _f.refresh();
    (_g = this.rowSelection) == null ? void 0 : _g.refresh();
    (_h = this.toolbar) == null ? void 0 : _h.refresh();
    (_i = this.workspaces) == null ? void 0 : _i.refresh();
    (_j = this.writing) == null ? void 0 : _j.refresh();
    (_k = this.handles) == null ? void 0 : _k.refresh();
    (_l = this.mentions) == null ? void 0 : _l.refresh();
    (_m = this.insertMenus) == null ? void 0 : _m.close();
  }
  saveStatus(state) {
    var _a, _b, _c;
    if (state === "saved") {
      if (this.warning) {
        this.warning.hide();
        this.warning = void 0;
        new import_obsidian30.Notice(message("saved", this.zh));
      }
    } else if (!((_a = this.warning) == null ? void 0 : _a.noticeEl.isConnected)) {
      const doc = (_c = (_b = this.app.workspace.getMostRecentLeaf()) == null ? void 0 : _b.view.containerEl.ownerDocument) != null ? _c : document;
      const fragment2 = doc.createDocumentFragment();
      fragment2.createDiv({ text: message("failed", this.zh) });
      const retry = fragment2.createEl("button", { text: message("retry", this.zh) });
      retry.type = "button";
      retry.addEventListener("click", (event) => {
        event.stopPropagation();
        void this.store.retry();
      });
      this.warning = new import_obsidian30.Notice(fragment2, 0);
    }
  }
};
