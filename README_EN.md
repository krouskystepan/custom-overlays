## 🎛️ Channel Points Timers – README / Guide

This overlay allows you to manage **multiple independent timers** that appear when Channel Point rewards are redeemed. In addition, you can control timers manually via **chat commands** — e.g., start, pause, or create a new one.

---

### 🧩 Settings Overview (`fieldData`)

| Key                                               | Meaning                                         |
| ------------------------------------------------- | ----------------------------------------------- |
| `reward_1` to `reward_5`                          | Definitions of rewards linked to Channel Points |
| [createTimer](#-1-create-a-new-timer-dynamically) | Chat command to create a new timer              |
| [pauseTimer](#-2-pause-one-timer)                 | Chat command to pause one timer                 |
| [unpauseTimer](#-3-resume-one-timer)              | Chat command to resume one timer                |
| [pauseAllTimers](#-4-pause-all-timers)            | Chat command to pause all timers                |
| [unpauseAllTimers](#-5-resume-all-timers)         | Chat command to resume all timers               |
| [adjustTimer](#-6-adjust-timer-time)              | Chat command to modify a timer's time           |
| [deleteTimer](#-7-reset-delete-one-timer)         | Chat command to reset one timer                 |
| [deleteAllTimers](#-8-reset-delete-all-timers)    | Chat command to reset all timers                |
| [privileges](#-who-can-use-the-commands)          | Who can control timers via commands             |
| [timerAlign](#-timer-alignment)                   | Placement of timers on the overlay              |
| [volume](#-sound-at-timer-end)                    | Sound volume when a timer finishes              |

---

## 🎁 Rewards

Configure how Twitch Channel Point rewards appear on the overlay — either as timed **timers** or as **one-time** events.

### ⏱️ Timer Rewards

Each variable `timer_reward_X` defines one **countdown timer** that starts when the corresponding Channel Point reward is redeemed.

📌 **Value format:**

```
VISIBLE:REWARD NAME:SEC
```

| Part          | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `VISIBLE`     | Text shown on the overlay (e.g., `Break`, `Chaos`, `Blackout`)      |
| `REWARD NAME` | Exact Twitch Channel Point reward name (must match exactly 1:1)     |
| `SEC`         | Timer length in seconds (e.g., `3600` = 1 hour, `600` = 10 minutes) |

📝 **Example:**

```
Blackout:Blind Mode:600
```

This entry creates a timer labeled `Blackout` on the overlay when someone redeems the CP reward named `Blind Mode`. The timer runs for 10 minutes.

---

### 🚨 One-Time Rewards

Each variable `oneTime_reward_X` defines a **one-time reward**, briefly displayed on the overlay without a timer.

📌 **Value format:**

```
VISIBLE:REWARD NAME
```

| Part          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `VISIBLE`     | Text displayed on the overlay (e.g., `Jump`, `Spin`, `Boom!`)   |
| `REWARD NAME` | Exact Twitch Channel Point reward name (must match exactly 1:1) |

📝 **Example:**

```
Jump:Jumping Time
```

This displays the text `Jump` on the overlay when someone redeems the CP reward `Jumping Time`.

---

## 💬 Chat Commands

Commands can be used manually (e.g., after restarting the overlay or when you want to trigger something without a redemption). They are intended primarily for **moderators or the broadcaster** (see `privileges`).

---

### 🔹 1. Create a new timer (dynamically)

```
!ccptimer <VISIBLE>:<REWARD NAME>:<seconds>
```

Adds a new timer to the overlay and starts it. (If a timer with that reward name already exists, nothing happens — use other commands to add/remove time.)

**Example:**

```
!ccptimer Break:Break Mode:900
```

> Creates and starts a “Break” timer with ID “Break Mode” for 15 minutes (900 seconds).

---

### 🔹 2. Pause one timer

```
!pcptimer <REWARD NAME>
```

Pauses the running timer with the given name.

**Example:**

```
!pcptimer Break Mode
```

> Pauses the timer with ID “Break Mode”.

---

### 🔹 3. Resume one timer

```
!upcptimer <REWARD NAME>
```

Resumes the timer with the given name.

**Example:**

```
!upcptimer Break Mode
```

> Resumes the “Break Mode” timer.

---

### 🔹 4. Pause all timers

```
!pcptimers
```

Pauses all running timers.

---

### 🔹 5. Resume all timers

```
!upcptimers
```

Resumes all paused timers.

---

### 🔹 6. Adjust timer time

```
!acptimer <action>:<REWARD NAME>:<seconds>
```

Allows you to **add or subtract time** from an existing timer.  
The action can be:

- `+` → add time
- `-` → subtract time

**Examples:**

```
!acptimer +:Break Mode:300
```

> Adds 5 minutes (300 seconds) to the timer with ID “Break Mode”.

```
!acptimer -:Break Mode:60
```

> Subtracts 1 minute (60 seconds) from the timer “Break Mode”.

---

### 🔹 7. Reset (delete) one timer

```
!dcptimer <REWARD NAME>
```

Resets the specified timer and removes it from the overlay (deleted from the DOM).

**Example:**

```
!dcptimer Break Mode
```

> Deletes the “Break Mode” timer from the overlay.

---

### 🔹 8. Reset (delete) all timers

```
!dcptimers
```

Resets and removes all timers from the overlay (deleted from the DOM).

---

## 👥 Who can use the commands

Use `privileges` to control who can use these commands:

| Value         | Who can control them    |
| ------------- | ----------------------- |
| `everybody`   | All viewers             |
| `justSubs`    | Subscribers only        |
| `subs`        | Subscribers, VIPs, Mods |
| `vips`        | VIPs and Mods           |
| `mods`        | Moderators only         |
| `broadcaster` | Only you (the streamer) |

---

## 🎨 Timer Alignment

The timer wrapper is aligned independently on the horizontal and vertical axes:

- **Horizontal alignment (`horizontalAlign`):**

  - `flex-start` – Left
  - `center` – Center (default)
  - `flex-end` – Right

- **Vertical alignment (`verticalAlign`):**
  - `flex-start` – Top
  - `center` – Center (default)
  - `flex-end` – Bottom

> **Note:** Alignment is applied via CSS properties `justify-content` (horizontal) and `align-items` (vertical), so timer content will be positioned precisely according to the chosen values on both axes.

---

## 🔊 Sound at Timer End

- Control volume via the `volume` slider (`0.0 – 1.0`)
- When a timer ends, a sound (`#sound`) is played
