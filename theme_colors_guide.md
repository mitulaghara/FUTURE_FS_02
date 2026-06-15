# 🎨 Theme Color Guide — Client Lead Management System

Yeh file project ke **saare colors** ka complete reference hai —  
CSS variables, hardcoded hex values, aur inline rgba — sab kuch ek jagah.

---

## 📁 Primary File: `frontend/src/index.css`

Yahan **sabse pehle** change karo — yeh CSS variables poore project par apply hote hain.

### `:root` CSS Variables (Lines 3–37)

| Variable | Current Value | Kahan Use Hota Hai |
|---|---|---|
| `--bg-primary` | `#0a0e17` | Body background, scrollbar track, navbar background |
| `--bg-secondary` | `#121826` | Drawer/slide-out panel background, modal background |
| `--bg-card` | `rgba(22, 30, 49, 0.7)` | Glass card background (sabse zyada visible element) |
| `--bg-card-hover` | `rgba(30, 41, 67, 0.9)` | Glass card hover state |
| `--border-color` | `rgba(255, 255, 255, 0.08)` | Borders everywhere (table, inputs, cards) |
| `--border-focus` | `rgba(99, 102, 241, 0.5)` | Focus ring (indigo tint) |
| `--text-primary` | `#f8fafc` | Main body text |
| `--text-secondary` | `#94a3b8` | Subheadings, labels, muted text |
| `--text-muted` | `#64748b` | Placeholder icons, footnotes |
| `--primary` | `#6366f1` (**Indigo**) | Buttons, badges, links, nav gradient, focus borders |
| `--primary-hover` | `#4f46e5` | Primary button hover |
| `--primary-glow` | `rgba(99, 102, 241, 0.15)` | Input focus box-shadow |
| `--success` | `#10b981` (**Emerald Green**) | "Converted" status badge & button |
| `--success-glow` | `rgba(16, 185, 129, 0.15)` | Success glow effect |
| `--warning` | `#f59e0b` (**Amber**) | "Contacted" status badge & button |
| `--warning-glow` | `rgba(245, 158, 11, 0.15)` | Warning glow effect |
| `--info` | `#0ea5e9` (**Sky Blue**) | Source channel cell, cURL section title |
| `--danger` | `#ef4444` (**Red**) | Delete button, error messages, "Required" label |
| `--shadow-glow` | `0 0 20px rgba(99, 102, 241, 0.2)` | Primary button hover glow |

---

## 🔴 Hardcoded Colors (CSS Variables se Bahar — Direct Change Karne Padenge)

### `frontend/src/index.css`

| Color Value | Line # | Kahan Use Hota Hai |
|---|---|---|
| `rgba(10, 14, 23, 0.8)` | L97 | Navbar background (glassmorphism) |
| `linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)` | L112 | Brand logo gradient text |
| `#1e293b` | L63 | Scrollbar thumb default color |
| `#334155` | L67 | Scrollbar thumb hover color |
| `rgba(18, 24, 38, 0.8)` | L360 | Table `<th>` background |
| `rgba(255, 255, 255, 0.02)` | L382, L623, L655 | Table row hover, note items, follow-up items |
| `rgba(255, 255, 255, 0.05)` | L190 | Secondary button hover |
| `rgba(255, 255, 255, 0.12)` | L153 | Card hover border |
| `rgba(239, 68, 68, 0.1)` | L195 | Danger button background tint |
| `rgba(239, 68, 68, 0.2)` | L197 | Danger button border |
| `rgba(239, 68, 68, 0.1)` | L299 | Login error box background |
| `rgba(239, 68, 68, 0.3)` | L300 | Login error box border |
| `rgba(99, 102, 241, 0.1)` | L252, L426 | "New" badge bg, Indigo metric icon bg |
| `rgba(99, 102, 241, 0.3)` | L254 | "New" badge border |
| `rgba(99, 102, 241, 0.05)` | L712 | Setup box background |
| `rgba(245, 158, 11, 0.1)` | L258, L431 | "Contacted" badge bg, Amber metric icon bg |
| `rgba(245, 158, 11, 0.3)` | L260 | "Contacted" badge border |
| `rgba(16, 185, 129, 0.1)` | L264, L436 | "Converted" badge bg, Emerald metric icon bg |
| `rgba(16, 185, 129, 0.3)` | L266 | "Converted" badge border |
| `rgba(5, 7, 12, 0.7)` | L512 | Drawer overlay dark backdrop |
| `rgba(0, 0, 0, 0.5)` | L527 | Drawer shadow |
| `rgba(0, 0, 0, 0.15)` / `rgba(0, 0, 0, 0.3)` | L31–32 | Shadow variables |
| `rgba(255, 255, 255, 0.02)` | L580 | Lead status action background |
| `#06090f` | L470 | Code block wrapper background (darkest black) |
| `#38bdf8` | L483 | Code block text color (light blue) |
| `rgba(255, 255, 255, 0.05)` | L490 | Copy button background |

---

### `frontend/src/components/Dashboard.jsx`

| Color Value | Line # | Kahan Use Hota Hai |
|---|---|---|
| `rgba(14, 165, 233, 0.1)` | L193 | "Contacted" metric icon bg (inline style) |
| `rgba(0, 0, 0, 0.5)` | L46 | Add lead modal box-shadow |

---

### `frontend/src/components/Login.jsx`

| Color Value | Line # | Kahan Use Hota Hai |
|---|---|---|
| `rgba(16, 185, 129, 0.1)` | L65 | Success message background (inline) |
| `rgba(16, 185, 129, 0.3)` | L65 | Success message border (inline) |

---

### `frontend/src/components/LeadDetails.jsx`

| Color Value | Line # | Kahan Use Hota Hai |
|---|---|---|
| `rgba(255, 255, 255, 0.01)` | L138 | Metadata card background (inline) |
| `rgba(0, 0, 0, 0.2)` | L222 | Follow-up schedule form background (inline) |

---

## 🗂️ Theme Change Strategy

### Sirf ek Color Scheme Badlna Hai?

**Step 1** — `index.css` mein `:root` ke andar sirf yeh variables change karo:

```css
/* Abhi indigo hai — isko apne naye color se replace karo */
--primary: #6366f1;
--primary-hover: #4f46e5;
--primary-glow: rgba(99, 102, 241, 0.15);
--border-focus: rgba(99, 102, 241, 0.5);
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.2);
```

**Step 2** — Nav brand gradient bhi update karo (L112 `index.css`):
```css
background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%);
/* Yahan #a5b4fc light tint hai aur #6366f1 main color hai */
```

**Step 3** — Badge aur icon hardcoded rgba values bhi match karni padegi:
```css
/* "New" badge — L252–254 */
rgba(99, 102, 241, 0.1)   → apna new color rgba(R,G,B, 0.1)
rgba(99, 102, 241, 0.3)   → apna new color rgba(R,G,B, 0.3)

/* Metric icon indigo — L426 */
rgba(99, 102, 241, 0.1)   → apna new color rgba(R,G,B, 0.1)
```

### Background Color Badlna Hai (Dark → Light / Alag Dark)?

```css
--bg-primary: #0a0e17;     /* Sabse dark background */
--bg-secondary: #121826;   /* Drawer / modal background */
--bg-card: rgba(22, 30, 49, 0.7);  /* Card background */
```

Saath mein yeh bhi badlo:
- L97: `rgba(10, 14, 23, 0.8)` → navbar glass
- L360: `rgba(18, 24, 38, 0.8)` → table header
- L512: `rgba(5, 7, 12, 0.7)` → drawer overlay
- L470: `#06090f` → code block background

---

## ✅ Quick Reference: Color Groups

```
🟣 PRIMARY (Indigo)   → #6366f1 / #4f46e5 / rgba(99,102,241,...)
🟢 SUCCESS (Emerald)  → #10b981 / rgba(16,185,129,...)
🟡 WARNING (Amber)    → #f59e0b / rgba(245,158,11,...)
🔵 INFO (Sky Blue)    → #0ea5e9 / rgba(14,165,233,...)
🔴 DANGER (Red)       → #ef4444 / rgba(239,68,68,...)
⚫ BG DARK            → #0a0e17 / #121826 / rgba(22,30,49,...)
⚪ TEXT LIGHT         → #f8fafc / #94a3b8 / #64748b
```
