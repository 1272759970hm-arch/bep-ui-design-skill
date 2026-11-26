# Scripter API Cheatsheet (only what you need for C 端商城 pages)

> Scripter is a Figma plugin that runs JavaScript with the full Figma Plugin API plus its own conveniences. Source of truth: `docs/scripter-env.d.ts` in rsms/scripter.

## Node creation shortcuts

Scripter exposes uppercase factory functions that **also auto-append the node to the current page**:

```js
Frame(props, ...children)      // FrameNode + appended
Rectangle(props)               // RectangleNode + appended
Text(props)                    // TextNode + appended
Ellipse(props)                 // EllipseNode + appended
Group(props, ...children)      // GroupNode + appended
Component(props, ...children)  // ComponentNode + appended
```

Lowercase `create*` versions (`createFrame`, `createText`, …) return the node **without** appending — useful when nesting manually.

`props` is a `Partial<NodeType>` — any settable property of that node type.

**Children:** when passing children to `Frame(...)`, those children get parented to the new frame (not the page). This is the JSX-like pattern.

```js
let card = Frame(
  { name: "Card", layoutMode: "VERTICAL", fills: [{type:"SOLID", color:{r:1,g:1,b:1}}] },
  createText({ characters: "Hello", fontSize: 16 }),
  createRectangle({ resize: [100, 1], fills: [{type:"SOLID", color:{r:0.92,g:0.93,b:0.94}}] }),
)
```

## Fonts — must load before creating Text

```js
await figma.loadFontAsync({ family: "PingFang SC", style: "Regular" })
await figma.loadFontAsync({ family: "PingFang SC", style: "Medium" })
```

The preamble's `loadC 端商城Fonts()` does both. **Always `await` it at script top before any Text node.**

## Colors — RGB 0–1 floats

```js
fills: [{ type: "SOLID", color: { r: 1, g: 0.408, b: 0.082 } }]   // #FF6815 (primary)
```

Use `hex2rgb("#FF6815")` from preamble — or just reference `RGB.primary` etc.

## AutoLayout (the only layout you should use)

```js
Frame({
  layoutMode: "VERTICAL",          // or "HORIZONTAL", "NONE"
  primaryAxisSizingMode: "AUTO",   // hug along main axis (or "FIXED")
  counterAxisSizingMode: "FIXED",  // fixed cross axis (or "AUTO" to hug)
  primaryAxisAlignItems: "MIN",    // MIN | CENTER | MAX | SPACE_BETWEEN
  counterAxisAlignItems: "CENTER", // MIN | CENTER | MAX
  paddingTop: 16,
  paddingRight: 16,
  paddingBottom: 16,
  paddingLeft: 16,
  itemSpacing: 12,
  resize: [375, 0],                // fixed width 375; height will hug
})
```

For Text nodes inside an AutoLayout to fill width:
```js
text.layoutAlign = "STRETCH"       // stretch on cross axis
text.layoutGrow = 1                // grow to fill main axis
```

## Common text properties

```js
Text({
  characters: "登录",
  fontName: { family: "PingFang SC", style: "Medium" },
  fontSize: 16,
  lineHeight: { unit: "PIXELS", value: 22 },
  letterSpacing: { unit: "PIXELS", value: 0 },
  textAlignHorizontal: "LEFT",     // LEFT | CENTER | RIGHT | JUSTIFIED
  textAlignVertical: "TOP",
  fills: [{ type: "SOLID", color: RGB.text }],
})
```

`characters` is set as a property — Scripter handles the async font load if the font is already loaded.

## Strokes (borders)

```js
strokes: [{ type: "SOLID", color: RGB.border }],
strokeWeight: 1,
strokeAlign: "INSIDE",   // INSIDE | OUTSIDE | CENTER — C 端商城 uses INSIDE for cell dividers
```

## Corner radius

```js
cornerRadius: 4                                   // all four corners
topLeftRadius: 8; topRightRadius: 8;               // per-corner
bottomLeftRadius: 0; bottomRightRadius: 0;
```

## Effects (shadows, used in dialogs/sheets)

```js
effects: [{
  type: "DROP_SHADOW",
  color: { r: 0, g: 0, b: 0, a: 0.08 },
  offset: { x: 0, y: 4 },
  radius: 16,
  spread: 0,
  visible: true,
  blendMode: "NORMAL",
}]
```

## Inserting into current page vs. existing frame

- `Frame()`, `Rectangle()`, etc. (uppercase): **auto-appended to `figma.currentPage`**.
- `createFrame()` etc. (lowercase): **detached** — must `parentFrame.appendChild(node)` yourself.

For a screen, you typically want the screen Frame at the top level (auto-appended), and all its content created with `create*` then nested via the spread children pattern, OR appended manually.

## Pitfalls

- **`resize(w, h)` vs `resize: [w,h]`**: in props, use `resize: [w, h]` (array). On a node instance, it's a method: `node.resize(w, h)`.
- **Setting `characters` before font is loaded** throws. Always `await loadC 端商城Fonts()` first.
- **`fills: []` (empty array)** = no fill (transparent). For default Figma gray, set `[]` then add a SOLID.
- **AutoLayout + manual x/y**: don't set x/y on children inside an AutoLayout frame — it ignores them.
- **`figma.currentPage.selection = [node]`** to highlight the result for the user after generation.
- **`figma.viewport.scrollAndZoomIntoView([node])`** to focus camera on it.

## Fills / Effects 常见坑（Scripter 实测）

- **渐变 stops 的 color 必须是 RGBA（带 `a`）**，传 `C.*` 这种纯 RGB 会直接抛错、脚本中断：
  ```js
  // ✗ 崩：{ position:0, color:C.primary }
  // ✓ 对：{ position:0, color:{ r:1, g:.408, b:.082, a:1 } }
  node.fills = [{ type:'GRADIENT_LINEAR',
    gradientStops:[ { position:0, color:{...c, a:1} }, { position:1, color:{...c2, a:1} } ],
    gradientTransform:[[1,0,0],[0,1,0]] }];
  ```
- **DROP_SHADOW / INNER_SHADOW 的 color 同样必须带 `a`**
- 纯色想半透明：`{ type:'SOLID', color: C.t1, opacity: 0.4 }`（opacity 在 paint 上，不在 color 里）
- Figma 的 `appendChild` **保留绝对坐标**——新建节点进容器前先 `pos()`，否则会飞出容器
