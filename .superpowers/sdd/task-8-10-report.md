# Tasks 8-10 Implementation Report

## Status: COMPLETE — 3 commits on `main`

```
079cdc7  feat: add Contact service with SendGrid email integration
c8ba13b  feat: add Contact entity and DTOs with validation
8d41fd5  feat: add Hero component with mesh gradient and marquee
```

---

## Task 8 — Hero Component

### Files created
- `frontend/components/Hero.tsx`
- `frontend/components/Hero.module.css`

### Implementation details
- **Mesh gradient animation**: three absolutely-positioned blurred orbs (`orb1/2/3`) each driven by independent `orbFloat` keyframes (14 s / 18 s / 22 s), colors mapped to `--primary`, `--secondary`, `--accent`. A subtle SVG-noise overlay sits on top.
- **Heading**: `<span class="firstName">` is solid `#ffffff`; `<span class="lastName">` uses `background-clip: text` with a 135-deg gradient across all three CSS color variables.
- **Bio**: max-width 600 px, `--muted` color, Space Grotesk.
- **Stack chips**: first 6 techs from `TECH_STACK` array rendered as pill badges with hover state.
- **Buttons**: primary uses gradient fill + glow shadow; secondary is outlined with teal hover.
- **Marquee**: full `TECH_STACK` list duplicated (×2) in `.marqueeTrack`, animated via `marqueeScroll` at 30 s linear infinite. Fade masks on left/right via `mask-image`. All items hidden from assistive tech (`aria-hidden`).
- **Animations**: `fadeUp` staggered across eyebrow → heading → bio → chips → buttons (0 → 300 ms delays).
- **Responsive**: orb sizes shrink at ≤ 768 px; buttons go full-width and stack vertically.
- **CSS variables used**: `--primary`, `--secondary`, `--accent`, `--bg`, `--surface`, `--border`, `--text`, `--muted`, `--font-bricolage`, `--font-space-grotesk`.

---

## Task 9 — Contact Entity & DTOs

### Files created
- `backend/src/contact/contact.entity.ts`
- `backend/src/contact/contact.dto.ts`

### Entity: `ContactMessage` (`@Entity('contact_messages')`)
| Field | Decorator | Type |
|---|---|---|
| `id` | `@PrimaryGeneratedColumn('uuid')` | `string` |
| `name` | `@Column varchar(120)` | `string` |
| `email` | `@Column varchar(254)` | `string` |
| `subject` | `@Column varchar(200)` | `string` |
| `message` | `@Column text` | `string` |
| `createdAt` | `@CreateDateColumn` | `Date` |
| `read` | `@Column boolean default false` | `boolean` |

### DTOs
- **`CreateContactDto`**: all four user-supplied fields validated with `class-validator` — `IsEmail`, `IsString`, `IsNotEmpty`, `MinLength`, `MaxLength` with Spanish error messages.
- **`ContactResponseDto`**: plain class with `success: boolean` and `messageId: string`.

---

## Task 10 — Contact Service

### File created
- `backend/src/contact/contact.service.ts`

### `ContactService` (`@Injectable`)

#### `createContact(dto: CreateContactDto): Promise<ContactResponseDto>`
1. Calls `this.contactRepository.create()` + `.save()` — wraps in try/catch, throws `BadRequestException` on DB failure.
2. Calls `this.sendEmail(saved)` — best-effort (email failure is logged as a warning but does not fail the request, since the record is already persisted).
3. Returns `{ success: true, messageId: saved.id }`.

#### `private sendEmail(message: ContactMessage): Promise<void>`
- Reads `SENDGRID_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` from `process.env`.
- Skips silently if `SENDGRID_API_KEY` is unset (safe for local dev).
- POSTs to `https://api.sendgrid.com/v3/mail/send` via `axios` with 8 s timeout.
- Sets `reply_to` to the sender's email so replies go directly to the user.

#### `private buildEmailHtml(message: ContactMessage): string`
- Constructs a dark-themed HTML email matching the portfolio palette (`#0a0a0f` bg, `#c084fc`/`#f472b6` gradient header).
- Formats `createdAt` with `Intl.DateTimeFormat` in `America/Mexico_City` timezone.
- All user content passed through `escapeHtml()` to prevent injection.

---

## Verification Checklist

- [x] 3 commits with exact specified messages
- [x] Hero renders: mesh gradient (3 animated orbs), name split white/gradient, bio, 6 stack chips, 2 CTA buttons, marquee
- [x] `ContactMessage` entity has all 7 required fields with correct TypeORM decorators
- [x] `ContactService` has `createContact()` method with DB save + SendGrid POST + `BadRequestException`
- [x] All CSS uses `--primary`, `--secondary`, `--accent` variables (no hardcoded colors for theme colors)
- [x] `axios` used for SendGrid (already in `backend/package.json` dependencies)
- [x] `class-validator` decorators used in DTO (already in `backend/package.json`)
