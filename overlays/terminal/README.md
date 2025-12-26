# 🖥️ Terminal Alerts – README / Guide

This StreamElements widget displays **follow, subscription, and tip alerts** in a **terminal-style UI**, mimicking a CLI command execution with typed text, result output, and a blinking cursor.

The widget listens to selected event types (FOLLOW / SUB / TIP) and renders them in a unified terminal format.

---

## ✨ Features

- Terminal-style alert window (macOS-like)
- Typed-in command animation
- Blinking cursor
- Support for:
  - 👤 Follows
  - ⭐ Subscriptions (normal + gifted)
  - 💰 Tips (donations)
- Optional display of:
  - Subscription duration (months)
  - Gifted sub sender
  - Donation amount + currency
- Fully configurable via **StreamElements fields**
- One unified widget for all supported event types

---

## 🧩 Widget Settings (`fieldData`)

### 🖥️ Terminal Text

| Field          | Description                                 |
| -------------- | ------------------------------------------- |
| `command`      | Command shown after `$` prompt (e.g. `git`) |
| `actionFollow` | Action word for FOLLOW events               |
| `actionSub`    | Action word for SUB events                  |
| `actionTip`    | Action word for TIP events                  |
| `resultText`   | Default fallback result text                |

---

### 👂 Event Listening

| Field          | Description             |
| -------------- | ----------------------- |
| `listenFollow` | Listen to FOLLOW events |
| `listenSub`    | Listen to SUB events    |
| `listenTip`    | Listen to TIP events    |

---

### ⏱️ Visibility

| Field      | Description                             |
| ---------- | --------------------------------------- |
| `duration` | How long the terminal stays visible (s) |

---

## 📥 Supported Events & Behavior

### 👤 FOLLOW

```
$ git follow username
✔ follow
```

### ⭐ SUB (Normal)

```
$ git sub username
✔ subscribed (3 months)
Thanks for the stream!
```

### 🎁 SUB (Gifted)

```
$ git sub username
✔ gifterName gifted 5 subs
```

### 💰 TIP

```
$ git tip username
✔ donated €10
Great stream!
```

---

## 🧠 Internal Logic

Only `*-latest` events are processed to avoid duplicates.

```js
function isPrimaryEvent(ev) {
  if (!ev.originalEventName) return true
  return ev.originalEventName.endsWith('-latest')
}
```

---

## 🧱 HTML Structure

```html
<div id="wrapper">
  <div class="terminal">
    <div class="terminal-header"></div>
    <div class="terminal-body">
      <div class="line">
        $ <span id="command"></span> <span id="action"></span>
        <span id="name"></span>
      </div>
      <div id="result"></div>
      <div id="extra"></div>
      <div class="cursor">█</div>
    </div>
  </div>
</div>
```

---

## 🚀 Usage

Add this widget as a **Custom Widget** in StreamElements and paste:

- HTML
- CSS
- JS
- Fields JSON

Then use it as an OBS browser source.

---

## 🔮 Future Ideas

- Sounds
