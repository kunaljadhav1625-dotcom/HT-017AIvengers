# 📱 ANDROID JAVA APP — FULL PROMPT FOR AI CODE GENERATION

> **Copy everything below this line and paste it directly into your AI (ChatGPT / Gemini / Claude).**
> The prompt is self-contained and describes every screen, feature, API call, color, and UI behavior needed to build the exact Android Java version of the **Bharat E-Vote** app.

---

---

# MASTER PROMPT: Build "Bharat E-Vote" Android Java Application

## 🎯 PROJECT OVERVIEW

Build a **complete, production-quality Android application in Java** named **"Bharat E-Vote"** — a secure, blockchain-backed electronic voting system for Indian General Elections.

The app connects to a **Node.js REST API backend** running at `http://10.0.2.2:5000/api` (which is `localhost:5000` from the Android Emulator). All API endpoints are described in detail below.

The app must replicate the **exact UI design, screens, and features** of the existing React web application. Every screen, color, animation, and interaction must be coded.

---

## 🛠️ TECH STACK & SETUP

### Required Libraries (add to `build.gradle` app-level):
```gradle
dependencies {
    // Core AndroidX
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'com.google.android.material:material:1.12.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.cardview:cardview:1.0.0'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'

    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'

    // Image Loading
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'

    // Charts for Results Page
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'

    // Face Detection (ML Kit)
    implementation 'com.google.mlkit:face-detection:16.1.6'

    // Camera X for face capture
    implementation 'androidx.camera:camera-core:1.3.4'
    implementation 'androidx.camera:camera-camera2:1.3.4'
    implementation 'androidx.camera:camera-lifecycle:1.3.4'
    implementation 'androidx.camera:camera-view:1.3.4'

    // SharedPreferences (for auth token)
    implementation 'androidx.preference:preference:1.2.1'
}
```

### `AndroidManifest.xml` Permissions:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-feature android:name="android.hardware.camera" android:required="true"/>
```

---

## 🎨 GLOBAL DESIGN SYSTEM

### Color Palette (define in `res/values/colors.xml`):
```xml
<resources>
    <!-- Dark Background (used in Login, Results, Blockchain screens) -->
    <color name="bg_dark">#0f172a</color>
    <color name="bg_dark_card">#1e293b</color>
    <color name="bg_dark_surface">#0f172a</color>

    <!-- Light Background (used in Home, Voting screens) -->
    <color name="bg_light">#F8FAFC</color>
    <color name="bg_white">#FFFFFF</color>

    <!-- Brand / Accent Colors -->
    <color name="primary_blue">#2563EB</color>
    <color name="primary_blue_dark">#1D4ED8</color>
    <color name="cyan_accent">#22D3EE</color>
    <color name="indigo_accent">#6366F1</color>
    <color name="emerald_accent">#10B981</color>
    <color name="amber_accent">#F59E0B</color>
    <color name="red_accent">#EF4444</color>

    <!-- India Flag Colors (for Home screen gradient) -->
    <color name="india_orange">#FF9933</color>
    <color name="india_green">#138808</color>
    <color name="india_white">#FFFFFF</color>

    <!-- Text Colors -->
    <color name="text_white">#FFFFFF</color>
    <color name="text_slate_100">#F1F5F9</color>
    <color name="text_slate_400">#94A3B8</color>
    <color name="text_slate_500">#64748B</color>
    <color name="text_gray_800">#1F2937</color>
    <color name="text_blue_900">#1E3A5F</color>

    <!-- Status Colors -->
    <color name="success_green">#16A34A</color>
    <color name="error_red">#DC2626</color>
    <color name="warning_orange">#EA580C</color>

    <!-- Border / Dividers -->
    <color name="border_dark">#334155</color>
    <color name="border_light">#E2E8F0</color>
    <color name="border_white_10">#1AFFFFFF</color>
</resources>
```

### Typography (define in `res/values/styles.xml`):
- Use **Roboto** font (default on Android) everywhere
- Title: Bold, 28sp
- Subtitle: SemiBold, 18sp
- Body: Regular, 14sp
- Label: Bold, 11sp, ALL CAPS, 0.2em letter spacing
- Monospace (for block hashes): Monospace, 10sp

### Theme (in `res/values/themes.xml`):
```xml
<style name="Theme.BharatEVote" parent="Theme.MaterialComponents.DayNight.NoActionBar">
    <item name="colorPrimary">@color/primary_blue</item>
    <item name="colorPrimaryVariant">@color/primary_blue_dark</item>
    <item name="colorOnPrimary">@color/text_white</item>
    <item name="android:windowBackground">@color/bg_dark</item>
</style>
```

---

## 📱 APP NAVIGATION STRUCTURE

```
SplashActivity  →  HomeActivity (Voter Entry / Public Portal)
                →  LoginActivity (Admin Portal)
                →  VotingActivity  →  BiometricVerificationActivity
                →  VoteSuccessActivity
                →  ResultsActivity
                →  BlockchainActivity
```

Use **`Intent`-based navigation** between Activities. Pass data using `Intent.putExtra()`.

---

## 🖥️ SCREEN 1: `SplashActivity`

### Purpose:
Show a branded splash screen for 2 seconds, then navigate to `HomeActivity`.

### UI Design:
- **Background**: Vertical gradient from `#0f172a` (top) → `#1e293b` (bottom)
- **Center**: Indian Emblem image (load from URL: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png`) — 120dp × 120dp, white tint (`ColorFilter`)
- **Below emblem**: Text `"BHARAT E-VOTE"` — Bold, 32sp, white, centered
- **Below title**: Text `"General Election 2026"` — Regular, 14sp, `#94A3B8`, centered, tracking wide
- **Below subtitle**: Pulsing cyan dot + text `"Secure Blockchain Voting"` — 12sp, `#22D3EE`

### Animation:
- Fade in all elements over 800ms using `AlphaAnimation`
- After 2.5 seconds, fade out then navigate to `HomeActivity`

### Code Logic:
```java
new Handler(Looper.getMainLooper()).postDelayed(() -> {
    startActivity(new Intent(SplashActivity.this, HomeActivity.class));
    finish();
}, 2500);
```

---

## 🖥️ SCREEN 2: `HomeActivity` — Voter Entry Portal

### Purpose:
Public-facing screen. Voter selects their State → City → Village (optional), enters their Voter ID, and proceeds to vote. Has an admin login link at the bottom.

### Background:
- Diagonal gradient: Start color `#FF9933` (orange) → Middle `#FFFFFF` → End `#138808` (green)
- This represents the Indian tricolor flag

### Layout (ScrollView wrapping a centered card):

**Card (`CardView`):**
- Background: White `#FFFFFF`
- Corner Radius: 20dp
- Elevation: 16dp
- Margin: 16dp horizontal
- Padding: 24dp inside

**Card Contents (top to bottom):**

1. **Indian Emblem Image**
   - URL: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png`
   - Load with Glide
   - Size: 80dp × 80dp
   - Center horizontally

2. **Title Text**: `"GENERAL ELECTION 2026"`
   - Font: Bold, 26sp
   - Color: `#1E3A5F` (dark navy)
   - Center aligned

3. **Subtitle Badge** (a rounded rectangle):
   - Background: `#FFF7ED` (light orange)
   - Border: 1dp solid `#FED7AA`
   - Padding: 4dp horizontal, 2dp vertical
   - Corner radius: 20dp
   - Text: `"POST: MEMBER OF LEGISLATIVE ASSEMBLY (MLA)"`
   - Text color: `#C2410C`
   - Font: Bold, 10sp
   - ALL CAPS, tracking wide

4. **Description Text**: `"Secure, Transparent & Decentralized Voting System for the Modern Democracy of India."`
   - 13sp, `#6B7280`, center aligned
   - Margin top: 8dp

5. **Spinner: Select Your State**
   - Label: `"Select Your State"` — Bold, 14sp, `#374151`
   - Spinner (Dropdown): Outline border style, blue border on focus
   - Loads list via API: `GET /api/locations/states`
   - On selection → triggers load of Cities

6. **Spinner: Select Your City**
   - Label: `"Select Your City"` — Bold, 14sp
   - Disabled (grayed out) until a State is selected
   - Loads list via API: `GET /api/locations/cities?state={selectedState}`
   - On selection → triggers load of Villages

7. **Spinner: Select Your Village / Area**
   - Label: `"Select Your Village / Area"` — Bold, 14sp
   - Optional — shows `"-- Optional --"` placeholder
   - Disabled until City is selected
   - Loads via API: `GET /api/locations/villages?city={selectedCity}`

8. **Voter ID Input**
   - Label: `"Enter Voter ID Number"` — Bold, 14sp
   - EditText: All caps input, placeholder `"Ex: IND-123456789"`
   - Border turns red if error
   - Helper text below: `"Note: One Vote Per ID. Strict Enforcement."`
   - If loading, show spinning ProgressBar on the right side

9. **Error Message** (only shows if validation fails):
   - Red animated pulsing text with ⚠️ icon
   - Examples: `"❌ Invalid Voter ID. Not found in database."` or `"⚠️ ACCESS DENIED: You have ALREADY voted."`

10. **Submit Button: `"Proceed to Vote →"`**
    - Background: `#2563EB` (blue), white text
    - Full width, corner radius 12dp
    - When loading: Gray background, text `"Verifying..."`, shows ProgressBar spinner
    - On press: Small scale-down animation (press effect)
    - Elevation: 8dp

11. **Admin Link (bottom)**:
    - Gray horizontal divider
    - Text: `"Admin Access Only"` — 12sp, `#9CA3AF`
    - Clickable text: `"Login to Dashboard"` — 13sp, `#2563EB`, underline
    - On click → navigate to `LoginActivity`

### Business Logic (on Submit button click):
```
1. Validate: city selected AND voter ID not empty → show error if not
2. Show loading spinner
3. API CALL: GET /api/status/{voterId}
   → If 404: show "❌ Invalid Voter ID"
   → If exists=true AND hasVoted=true: show "⚠️ ACCESS DENIED: Already voted"
   → If exists=true AND hasVoted=false:
       → Navigate to VotingActivity
       → Pass: city (String), voterId (String)
4. Hide loading spinner
```

---

## 🖥️ SCREEN 3: `LoginActivity` — Admin Portal

### Purpose:
Admin login screen with dark glassmorphism design. Accepts username + password, calls login API, stores token, navigates to ResultsActivity.

### Background:
- Solid color: `#0f172a`
- Draw two large blurred circles using `Paint` + `Canvas` (or use a custom `GlowBackgroundView`):
  - Top-left: `#3730A3` with 40% alpha (indigo glow)
  - Bottom-right: `#0E7490` with 40% alpha (cyan glow)
- Draw a subtle grid pattern overlay using custom View (draw lines every 40dp in `#1e293b` at 20% opacity)

### Layout (centered vertically):

**Header Section:**
1. **Emblem Icon Container** (rounded rectangle box):
   - Background: `#1e293b` with border `#FFFFFF20`
   - Size: 64dp × 64dp, corner radius 16dp
   - Center content: Indian Emblem image (Glide), 40dp×40dp, white tint

2. **Title**: `"Admin Portal"`
   - Font: Bold, 28sp, White `#FFFFFF`
   - Center aligned, margin top 16dp

3. **Subtitle Badge**: Contains ShieldCheck icon (draw a shield icon or use Material icons) + text `"SECURE ACCESS"`
   - Text color: `#22D3EE` (cyan)
   - 11sp, Bold, tracking wide, ALL CAPS

**Error Banner** (only visible if login fails):
- Background: `#7F1D1D` (dark red) with 20% alpha, border: `#DC2626` 30% alpha
- Corner radius: 12dp
- Icon: Lock icon (red)
- Title: `"Authentication Failed"` — Bold, 13sp, `#F87171`
- Message: error text from API — 11sp, `#FCA5A5`

**Form Card** (glassmorphism style):
- Background: `#0F172A` with 40% alpha → simulate with `#661e293b`
- Border: `#FFFFFF10` (very subtle white border)
- Corner radius: 24dp
- Elevation: 24dp
- Padding: 32dp

**Form Fields inside card:**

1. **Administrator ID Field**:
   - Label: `"ADMINISTRATOR ID"` — Bold, 11sp, `#94A3B8`, ALL CAPS
   - EditText with Person icon on left (24dp icon in `#94A3B8`)
   - Background: `#0F172A` with 50% alpha + subtle border
   - Text color: White, hint color: `#475569`
   - On focus → icon turns cyan `#22D3EE` + border turns cyan

2. **Secure Password Field**:
   - Label: `"SECURE PASSWORD"` — Bold, 11sp, `#94A3B8`, ALL CAPS
   - EditText with Key icon on left, password input type
   - Same styling as username field

3. **Submit Button: `"Access Dashboard →"`**:
   - Background: Horizontal gradient left→right `#0891B2` (cyan-600) → `#2563EB` (blue-600)
   - White text, Bold, 15sp
   - Corner radius: 12dp
   - Full width
   - Arrow icon on right
   - On click: shows `ProgressBar`, hides arrow icon, text changes to `"Verifying Credential..."`
   - On press: slight scale-down (0.98) animation

**Back Link** (below card):
- Text: `"← Return to Public Portal"`
- Color: `#94A3B8`, on click → `#22D3EE`
- 13sp, centered
- On click → `finish()` (go back to HomeActivity)

### Business Logic:
```
1. On submit: validate fields not empty
2. Show loading state
3. API CALL: POST /api/auth/admin-login
   Body: { "username": "...", "password": "..." }
   → On success: store token in SharedPreferences key "auth_token"
                 store role="admin" in SharedPreferences
                 navigate to ResultsActivity
   → On failure (401): show error banner with API error message
4. Reset loading state
```

### SharedPreferences Helper:
```java
// Save
SharedPreferences prefs = getSharedPreferences("BharatEVote", MODE_PRIVATE);
prefs.edit().putString("auth_token", token).putString("role", "admin").apply();

// Read
String token = prefs.getString("auth_token", null);
String role = prefs.getString("role", "guest");
```

---

## 🖥️ SCREEN 4: `VotingActivity` — Cast Your Vote

### Purpose:
Shows the voter's profile info + a live countdown timer. Displays a grid of candidate cards. Voter selects one candidate, then proceeds to face verification.

### Receives via Intent:
- `String city` — the constituency
- `String voterId` — the voter's ID

### Background: Light gray `#F8FAFC`

### Layout:

**Header Card** (white card, 16dp corner radius, 4dp elevation):
- Contains two sections side-by-side:

LEFT SIDE:
1. **Voter Photo** (circular, 60dp):
   - Load `voterData.photoUrl` using Glide
   - Circular crop, Blue border 3dp `#DBEAFE`
   - Green dot (12dp) in bottom-right corner indicates "active"
2. **Voter Info Text**:
   - Small label: `"GENERAL ELECTION 2026"` — 10sp, `#2563EB`, Bold, ALL CAPS
   - Name: `"Hello, {voter name}"` — Bold, 20sp, `#1F2937`
   - Constituency: `"Voting for MLA in {city} Constituency"` — 13sp, `#6B7280`

RIGHT SIDE:
1. **Timer Display**:
   - Label: `"TIME REMAINING"` — 10sp, `#6B7280`, Bold, ALL CAPS
   - Timer: Monospace font, Bold, 28sp, `#2563EB`
   - Background: `#EFF6FF` (light blue), 8dp corner radius, 16dp padding
   - Format: `MM:SS` → starts at `03:00` (180 seconds), counts down every second using `CountDownTimer`

**Candidates Grid** (RecyclerView, 2 columns, GridLayoutManager):

**Each Candidate Card** (`CardView`):
- Background: White
- Corner radius: 12dp
- Elevation: 4dp (selected: 12dp)
- Border: 2dp — transparent when unselected, `#2563EB` (blue) when selected
- When selected: slight scale-up animation to 1.02x
- On click → select this candidate (deselect all others)

Card Contents:
1. **Candidate Image**: Full width, height 160dp, `scaleType="centerCrop"`, load URL using Glide
2. **Candidate Name**: Bold, 17sp, `#111827`, padding 12dp left
3. **Party Name**: Regular, 13sp, `#6B7280`, padding 4dp bottom

**Bottom Action Bar** (fixed at bottom, white background, top shadow):
- Left: Text — if candidate selected: `"Candidate Selected ✓"` (green), else `"Select a candidate to vote"` (gray)
- Right: Button `"Proceed to Verification"`:
  - Blue background when enabled, gray when no candidate selected
  - Disabled state: `setEnabled(false)`
  - On click → open `BiometricVerificationActivity` as dialog-style (pass `voterId`, `candidateId`, `voterPhotoUrl`)

### Loading State:
While fetching data, show `ProgressBar` in center of screen.

### Business Logic on Load:
```
1. API CALL: GET /api/status/{voterId}
   → If hasVoted=true: show AlertDialog "Already Voted", navigate back HOME
   → Store voterData (name, photoUrl)
2. API CALL: GET /api/candidates?city={city}
   → Populate RecyclerView adapter with candidate list
3. Start 180-second countdown timer
```

---

## 🖥️ SCREEN 5: `BiometricVerificationActivity` — Face Verification

### Purpose:
Full-screen modal (dialog Activity) for face verification using device camera. Shows camera preview → user captures photo → app sends to backend → success/fail animation.

### Style:
- Background: Black, 95% opacity — full screen overlay feel
- Use `android:theme="@style/Theme.MaterialComponents.Dialog.FullScreen"` or `getWindow().setBackgroundDrawable(new ColorDrawable(Color.argb(242, 0, 0, 0)))`
- Center card: White, 20dp corner radius, max width 400dp, padded 24dp

### States & UI for each:

#### STATE 1: `CAMERA_INIT`
- Center: Spinning `ProgressBar` (blue, 48dp)
- Text: `"Accessing Camera..."` — Bold, 15sp, `#374151`

#### STATE 2: `SCANNING`
- Title row: Face icon (ScanFace) + `"Face Verification"` — Bold, 18sp
- Camera Preview box (using CameraX `PreviewView`):
  - Width: 300dp, Height: 240dp
  - Border: 4dp solid `#2563EB`
  - Corner radius: 12dp
  - Mirror horizontally (front camera): `previewView.setScaleX(-1)` 
  - Oval face guide overlay drawn on top (dashed oval using custom view, cyan color)
  - Animated scanning line: a thin green line animating top-to-bottom on repeat using `ObjectAnimator`
- Button: `"📸 Capture & Verify"` — Blue, full width, 50dp height, rounded

#### STATE 3: `VERIFYING`
- Title: `"Analyzing Facial Features..."` — Bold, 18sp
- Side-by-side comparison:
  - LEFT: Voter's stored ID photo (circular, 80dp) with label `"STORED ID"` above
  - MIDDLE: Animated loading bar (animated width 0→100% → 0→100% looping) + text `"Comparing Vectors..."` (pulsing animation)
  - RIGHT: Captured live photo (circular, 80dp) with label `"LIVE CAPTURE"` above

#### STATE 4: `SUCCESS`
- Animated: Large green circle bouncing in with CheckCircle icon (80dp)
- Title: `"Identity Verified!"` — Bold, 24sp, Green `#16A34A`
- Subtitle: `"Access Granted."` — Gray
- Auto-close after 2 seconds → return result to VotingActivity → cast vote → navigate to VoteSuccessActivity

#### STATE 5: `FAILED`
- Pulsing red circle with X icon (80dp)
- Title: `"Verification Failed"` — Bold, 24sp, Red
- Message: error from API (e.g., `"Face Mismatch! Score: 0.42"`)
- Small text: `"Retrying camera in 4s..."` — Gray, 12sp
- After 4 seconds → automatically restart camera (go back to STATE 3)

### Camera Setup (CameraX):
```java
ListenableFuture<ProcessCameraProvider> cameraProviderFuture = 
    ProcessCameraProvider.getInstance(this);

cameraProviderFuture.addListener(() -> {
    ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
    Preview preview = new Preview.Builder().build();
    CameraSelector cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA;
    preview.setSurfaceProvider(previewView.getSurfaceProvider());
    cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageCapture);
}, ContextCompat.getMainExecutor(this));
```

### Capture & Send Logic:
```
1. Capture frame from CameraX ImageCapture
2. Convert Bitmap to Base64 JPEG string:
   ByteArrayOutputStream stream = new ByteArrayOutputStream();
   bitmap.compress(Bitmap.CompressFormat.JPEG, 80, stream);
   String base64 = "data:image/jpeg;base64," + Base64.encodeToString(stream.toByteArray(), Base64.DEFAULT);
3. Switch to STATE VERIFYING
4. Wait 2000ms (for analysis feel)
5. API CALL: POST /api/verify-biometric
   Body: { "voterId": "...", "city": "...", "image": "<base64 string>" }
   → On success (200): switch to STATE SUCCESS
   → On failure (401/500): switch to STATE FAILED with error message
```

---

## 🖥️ SCREEN 6: `VoteSuccessActivity` — Vote Confirmation

### Purpose:
Confirmation screen shown after a vote is successfully cast and recorded on the blockchain.

### Receives via Intent:
- `String candidateName` — name of voted candidate
- `String blockHash` — SHA256 hash of the blockchain block
- `int blockIndex` — block number

### Background: Light green `#F0FDF4`

### Layout (centered card, white, green top border 4dp):

1. **Success Icon**: Large CircleCheckIcon — Green circle 100dp with white check, bouncing animation using `ScaleAnimation` (0→1.2→1 over 500ms)

2. **Title**: `"Vote Recorded!"` — ExtraBold, 28sp, `#111827`

3. **Subtitle**: `"Your vote for "` + **bold candidate name** + `" is secured on the blockchain."` — 15sp, `#4B5563`

4. **Block Hash Box**:
   - Background: `#F3F4F6` (light gray), corner radius 8dp
   - Monospace font, 11sp, `#374151`
   - Text: `"BLOCK HASH: {blockHash}"`
   - Allow long press to copy hash to clipboard

5. **Blockchain Badge**:
   - Green background `#DCFCE7`, border, shield icon
   - Text: `"Tamper-Proof • Block #{blockIndex} • PoW Verified"`
   - 11sp, Bold, `#15803D`

6. **Return Home Button**:
   - Blue background, white text, full width, rounded 12dp
   - Text: `"Return to Home"`
   - On click → navigate to `HomeActivity`, clear all back stack using `Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK`

### Business Logic (called from BiometricVerificationActivity result):
```
After biometric success:
API CALL: POST /api/vote
Body: { "candidateId": selectedCandidateId, "voterId": voterId }
→ On success: navigate to VoteSuccessActivity with:
    - response.candidate (name)
    - response.blockHash
    - response.blockIndex
→ On error: Toast "Failed to cast vote"
```

---

## 🖥️ SCREEN 7: `ResultsActivity` — Live Election Dashboard

### Purpose:
Real-time election results dashboard. Public can view results. Admins see extra controls (Add Candidate, Register Voter, Delete Candidate, Reset Election).

### Auto-refresh every 3 seconds using `Handler.postDelayed()`.

### Navigation Bar:
- Background: `#0f172a` with blur effect (set `windowTranslucentStatus = true`)
- Left: Indian Emblem (white tint) + `"BHARAT E-VOTE"` (Bold, 22sp, white) + `"● Live Election Dashboard"` (10sp, cyan)
- Right buttons (as `MaterialButton` with rounded corners):
  - If admin: RED pulsing button `"↺ RESET DEMO"` with shadow glow
  - Green button: `"🛡 Blockchain"` → navigates to `BlockchainActivity`
  - Zone Dropdown: Spinner with cities list (loaded from API), shows `"🇮🇳 National View"` or `"📍 {city}"`
  - If admin logged in: Red outline button `"Logout"` → clears SharedPreferences, navigates to HomeActivity

### Section 1: Hero Stats (Top Cards)

**Winner Card** (spans 2/3 width on large screens, full width on phones):
- Background: Gradient from `#1E1B4B` (dark indigo) → `#0f172a`
- Border: 1dp `#6366F1` (indigo) with glow shadow
- Corner radius: 24dp
- Top badge: `"👑 NATIONAL LEAD"` or `"📍 {City} Leader"` — amber `#F59E0B`, small rounded pill
- Candidate Name: ExtraBold, 36sp, White
- Party + City: `Award icon + "{party} • {city}"` — 13sp, `#CBD5E1`
- Candidate Photo: 80dp circular, indigo glow border, `#1 badge` in amber bottom-right
- Vote Percentage: Giant text `"{percentage}%"` — ExtraBold, 56sp, White → Indigo gradient text
- Sub-label: `"of total votes"` — 13sp, `#94A3B8`

**Total Votes Card** (below or beside winner card):
- Background: `#1e293b`, border: `#FFFFFF0D`
- Cyan icon box (Users/People icon)
- Giant number: `{stats.totalVotes}` — ExtraBold, 48sp, White
- Label: `"VOTES CAST"` — 11sp, Bold, `#94A3B8`, ALL CAPS
- Bottom-right: Pulsing `"⚡ Live"` in cyan

**Blockchain Status Card**:
- Background: `#1e293b`, border: `#10B981` (emerald, 20% alpha)
- Bottom line: Gradient `#10B981` → `#22D3EE`
- Shield icon + `"Blockchain"` title, White
- `"Mining Difficulty: 2"` — 13sp, emerald
- Latest Hash preview: `"0000a7252c239f57be..."` — Monospace, 10sp, `#34D399`
- Secured indicator: green dot + `"SECURED"` badge

### Section 2: Analytics Charts

**Bar Chart** (using MPAndroidChart `BarChart`):
- Background: `#1e293b`, rounded 24dp
- Title: `"📊 Vote Distribution"` + subtitle `"Top 5 Candidates"`
- Bar colors (per bar): `#38BDF8`, `#4ADE80`, `#FACC15`, `#F87171`, `#A78BFA`
- No axes visible except X-axis (candidate first names)
- Rounded bar tops (radius)
- Custom tooltip on tap showing candidate name + votes

**Donut / Pie Chart** (using MPAndroidChart `PieChart`):
- Background: `#1e293b`, rounded 24dp
- Title: `"Market Share"`
- Inner radius (hole): 70%
- Center text: Total votes count, ExtraBold white
- Slice colors match bar chart colors
- Slice gap: 4dp, rounded corners

### Section 3: Candidate Roster Table (RecyclerView)

Header:
- Title: `"Candidate Roster"` — Bold, 22sp, White
- Subtitle: `"Manage & Monitor {count} Active Candidates"` — 13sp, `#94A3B8`
- Right: Search box + buttons (admin only: `"Register Voter"` emerald, `"Add Candidate"` indigo)

**Search Box**:
- Dark background `#000000` 20% alpha, white border 10% alpha
- Magnify icon on left, turns cyan on focus
- Placeholder: `"Search database..."` — `#475569`
- Filters candidates in real-time

**Each Row** (RecyclerView item, `list_item_candidate.xml`):
- Background: transparent, on hover/press: white 5% overlay
- Dividers: `#FFFFFF0D`

Row layout:
1. **Rank**: `#1`, `#2`, `#3` in amber, rest in dark gray — Bold, 18sp
2. **Candidate Photo**: 48dp × 48dp, rounded 12dp, Using Glide to load URL
   - Crown badge (amber) for rank #1
3. **Name + Party**:
   - Name: Bold, 15sp, White
   - Party tag: small pill background `#FFFFFF0D`, 10sp, `#94A3B8`
4. **Zone (City)**: MapPin icon + city name — 13sp, `#94A3B8`
5. **Vote Count**: Bold, 22sp, White, right aligned
6. **Progress Bar**:
   - Background: black 40% alpha, 10dp height, rounded
   - Fill: Gradient `#06B6D4` (cyan) → `#3B82F6` (blue)
   - Animated shimmer effect on fill
   - Width = `(percentage / 100) * totalWidth`
7. **Percentage**: Bold, 13sp, `#CBD5E1`, 48dp width right aligned
8. **Delete Button** (admin only, revealed on long press or row swipe):
   - Trash icon, red tint
   - On click → `AlertDialog` confirmation → `DELETE /api/candidates/{id}`

### Admin: Add Candidate Form (shown inline below table header when button clicked):
Expandable section with animation (height 0 → wrap_content):
- Background: `#1E1B4B` 10% alpha (indigo tint)
- Fields: Candidate Name, Party, State (Spinner), City (Spinner), Image URL or camera capture
- Upload Image: Allow picking from gallery OR taking photo with camera
  - Convert to multipart form data for API call
- Submit button: indigo, `"Add Candidate"` → `POST /api/candidates` (multipart)

### Admin: Register Voter Form (shown inline):
Expandable section:
- Background: `#064E3B` 10% alpha (emerald tint)
- Split layout (on phone: stacked, on tablet: side by side):
  - LEFT: Name field, State/City/Village spinners
  - RIGHT: Camera preview for face capture (CameraX)
    - Same camera UI as biometric step
    - Capture button (circle, white)
    - After capture: shows captured image, "Retake" button
    - "Captured" green badge overlay
- Submit: `"Complete Registration"` → `POST /api/voters` with Base64 image
- On success: Shows card with `"Voter ID: IND-XXXXXXXXX"` in cyan, copy button

---

## 🖥️ SCREEN 8: `BlockchainActivity` — Blockchain Explorer

### Purpose:
Display the full blockchain ledger with all vote blocks. Allow integrity verification and tamper simulation.

### Background: `#0f172a` (same as dark screens)

### Layout:

**Header**:
- Title: `"⛓ Blockchain Explorer"` — Bold, 28sp, White, center
- Subtitle: `"Total Blocks: {count}"` — 14sp, `#94A3B8`

**Action Buttons Row**:
- `"💀 Simulate Attack"` — Outlined red button, Skull icon
  - On click → `AlertDialog`: `"WARNING: This will corrupt the blockchain. Demo purposes only. Proceed?"`
  - On confirm → `POST /api/admin/tamper` → shows result toast → refresh
- `"🛡 Verify Integrity"` — Blue button, Shield icon
  - On click → `GET /api/blockchain/verify`
  - On success: show green success banner `"✅ Blockchain is valid and tamper-free"`
  - On failure: show red banner `"⚠️ Blockchain has been tampered with!"`

**Verification Result Banner** (appears below buttons):
- If valid: Green background `#DCFCE7`, green border, Shield icon, `"Blockchain is valid"` — Green bold text
- If invalid: Red background `#FEE2E2`, red border, Warning icon, `"Blockchain has been tampered with!"` — Red text

**Blockchain Blocks List** (RecyclerView, vertical):

Each Block Card (`block_item.xml`):
- Background: White, corner radius 12dp, elevation 4dp
- Header: `"Block #{index}"` (Bold Blue) on left, timestamp on right
- Two columns:
  - `"Previous Hash:"` + truncated hash code (monospace, 12sp)
  - `"Hash:"` + truncated hash (monospace)
- If not genesis block → show vote data section:
  - Background: `#F3F4F6`, rounded, padding 12dp
  - `"Candidate: {candidateName}"` — Bold, 15sp
  - If tampered: `"⚠️ TAMPERED DATA DETECTED"` — Bold red text
  - `"Vote Time: {timestamp}"` — 12sp, gray

---

## 🌐 COMPLETE API REFERENCE

### Base URL: `http://10.0.2.2:5000/api`
(Use `10.0.2.2` in Android Emulator — this maps to `localhost` on your dev machine)

**Create a Retrofit interface:**
```java
public interface ApiService {
    // Auth
    @POST("auth/admin-login")
    Call<LoginResponse> adminLogin(@Body LoginRequest body);

    // Voter
    @GET("status/{voterId}")
    Call<VoterStatusResponse> checkVoterStatus(@Path("voterId") String voterId);

    // Candidates
    @GET("candidates")
    Call<List<Candidate>> getCandidates(@Query("city") String city);

    @Multipart
    @POST("candidates")
    Call<MessageResponse> addCandidate(
        @Part("name") RequestBody name,
        @Part("party") RequestBody party,
        @Part("state") RequestBody state,
        @Part("city") RequestBody city,
        @Part MultipartBody.Part image
    );

    @DELETE("candidates/{id}")
    Call<MessageResponse> deleteCandidate(@Path("id") int id);

    // Voting
    @POST("verify-biometric")
    Call<BiometricResponse> verifyBiometric(@Body BiometricRequest body);

    @POST("vote")
    Call<VoteResponse> castVote(@Body VoteRequest body);

    @POST("voters")
    Call<RegisterVoterResponse> registerVoter(@Body RegisterVoterRequest body);

    // Locations
    @GET("locations/states")
    Call<List<String>> getStates();

    @GET("locations/cities")
    Call<List<String>> getCities(@Query("state") String state);

    @GET("locations/villages")
    Call<List<String>> getVillages(@Query("city") String city);

    // Results
    @GET("results/summary")
    Call<ResultsSummaryResponse> getResults(@Query("city") String city);

    @GET("results/cities")
    Call<List<String>> getCities();

    // Blockchain
    @GET("blockchain")
    Call<BlockchainResponse> getBlockchain();

    @GET("blockchain/verify")
    Call<VerifyResponse> verifyBlockchain();

    @POST("admin/tamper")
    Call<MessageResponse> tamperBlockchain();

    // Reset (Admin)
    @POST("vote/reset")
    Call<MessageResponse> resetElection();
}
```

### Response Model Classes (POJO / Data classes):

```java
// LoginRequest.java
public class LoginRequest {
    public String username;
    public String password;
}

// LoginResponse.java
public class LoginResponse {
    public boolean success;
    public String token;
    public String role;
}

// VoterStatusResponse.java
public class VoterStatusResponse {
    public boolean exists;
    public boolean hasVoted;
    public String name;
    public String city;
    public String photoUrl;
}

// Candidate.java
public class Candidate {
    public int id;
    public String name;
    public String party;
    public String city;
    public String state;
    public String image;
    public int voteCount;
    public double percentage;
}

// BiometricRequest.java
public class BiometricRequest {
    public String voterId;
    public String city;
    public String image; // base64 jpeg
}

// BiometricResponse.java
public class BiometricResponse {
    public boolean success;
    public String message;
    public String voterName;
    public double score;
}

// VoteRequest.java
public class VoteRequest {
    public int candidateId;
    public String voterId;
}

// VoteResponse.java
public class VoteResponse {
    public String message;
    public String blockHash;
    public int blockIndex;
    public String candidate;
}

// ResultsSummaryResponse.java
public class ResultsSummaryResponse {
    public Stats stats;
    public List<Candidate> candidates;

    public static class Stats {
        public int totalVotes;
        public Candidate leadingCandidate;
    }
}

// BlockchainResponse.java
public class BlockchainResponse {
    public List<Block> chain;
    public int length;
    public boolean isValid;

    public static class Block {
        public int index;
        public long timestamp;
        public BlockData data;
        public String previousHash;
        public String hash;
        public int nonce;

        public static class BlockData {
            public String type;
            public String candidateName;
            public String voterId;
            public String timestamp;
            public boolean tampered;
        }
    }
}

// RegisterVoterRequest.java
public class RegisterVoterRequest {
    public String name;
    public String state;
    public String city;
    public String village;
    public String image; // base64
}

// RegisterVoterResponse.java
public class RegisterVoterResponse {
    public String message;
    public String voterId;
    public String name;
}
```

### Retrofit Setup (Singleton):
```java
public class RetrofitClient {
    private static final String BASE_URL = "http://10.0.2.2:5000/api/";
    private static RetrofitClient instance;
    private ApiService apiService;

    private RetrofitClient() {
        OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .addInterceptor(chain -> {
                Request original = chain.request();
                SharedPreferences prefs = // get prefs
                String token = prefs.getString("auth_token", "");
                Request request = original.newBuilder()
                    .header("Authorization", "Bearer " + token)
                    .build();
                return chain.proceed(request);
            })
            .addInterceptor(new HttpLoggingInterceptor().setLevel(Level.BODY))
            .build();

        Retrofit retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build();

        apiService = retrofit.create(ApiService.class);
    }

    public static synchronized RetrofitClient getInstance() {
        if (instance == null) instance = new RetrofitClient();
        return instance;
    }

    public ApiService getApi() { return apiService; }
}
```

---

## 🔄 APP-WIDE BEHAVIORS & UX RULES

### Loading States:
- Every API call + loading = show `ProgressBar` or `CircularProgressIndicator` (Material)
- Disable interactive elements while loading
- Never show a blank screen

### Error Handling:
- All Retrofit `onFailure` → show `Toast.makeText(..., "Network Error. Please try again.", Toast.LENGTH_SHORT).show()`
- 4xx errors → parse and show the `error` field from JSON response body in meaningful UI
- 5xx errors → generic "Server Error" toast

### Animations:
1. **Pulse Animation** (for Live dot, Reset button): `AlphaAnimation` cycling 1.0→0.3→1.0, infinite repeat
2. **Bounce Animation** (for success icon): `ScaleAnimation` 0→1.2→1, duration 500ms, `RELATIVE_TO_SELF`
3. **Card Press Effect**: `ScaleAnimation` to 0.97 on press, 1.0 on release
4. **Scan Line in Camera**: `ObjectAnimator.ofFloat(scanLine, "translationY", 0, cameraHeight)` infinite + reverse
5. **Shimmer on Progress Bars**: use a `drawable/shimmer_gradient.xml` animated with `ObjectAnimator`
6. **Slide-in Sections**: Use `Slide` transition from `android.transition` package when showing/hiding admin forms

### Admin-Only UI Controls:
- Check SharedPreferences:
  ```java
  boolean isAdmin = "admin".equals(prefs.getString("role", "guest"));
  if (isAdmin) {
      addCandidateButton.setVisibility(View.VISIBLE);
      resetButton.setVisibility(View.VISIBLE);
      deleteButtons.setVisibility(View.VISIBLE);
  }
  ```

### Back Stack & Navigation:
- After vote success: clear entire back stack
  ```java
  Intent intent = new Intent(this, HomeActivity.class);
  intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
  startActivity(intent);
  ```
- Login → Results: same clear back stack
- Voting back press: show confirmation `AlertDialog` ("Are you sure? Your session will end.")

### Real-time Results Refresh:
```java
Handler handler = new Handler();
Runnable refreshRunnable = new Runnable() {
    @Override
    public void run() {
        fetchResults(); // API call
        handler.postDelayed(this, 3000); // repeat every 3s
    }
};
// Start in onResume, stop in onPause
@Override protected void onResume() { handler.post(refreshRunnable); }
@Override protected void onPause() { handler.removeCallbacks(refreshRunnable); }
```

### Image Upload (Candidate Photo):
- Option 1: URL string input
- Option 2: Gallery pick → convert URI → Bitmap → Base64
  ```java
  ActivityResultLauncher<Intent> pickImage = registerForActivityResult(
      new ActivityResultContracts.StartActivityForResult(), result -> {
          if (result.getResultCode() == RESULT_OK) {
              Uri uri = result.getData().getData();
              Bitmap bmp = MediaStore.Images.Media.getBitmap(getContentResolver(), uri);
              ByteArrayOutputStream out = new ByteArrayOutputStream();
              bmp.compress(Bitmap.CompressFormat.JPEG, 80, out);
              String b64 = Base64.encodeToString(out.toByteArray(), Base64.DEFAULT);
          }
      }
  );
  ```

---

## 📁 PROJECT STRUCTURE

```
app/
├── src/main/
│   ├── java/com/bharatevote/
│   │   ├── activities/
│   │   │   ├── SplashActivity.java
│   │   │   ├── HomeActivity.java
│   │   │   ├── LoginActivity.java
│   │   │   ├── VotingActivity.java
│   │   │   ├── BiometricVerificationActivity.java
│   │   │   ├── VoteSuccessActivity.java
│   │   │   ├── ResultsActivity.java
│   │   │   └── BlockchainActivity.java
│   │   ├── adapters/
│   │   │   ├── CandidateVotingAdapter.java   (for VotingActivity grid)
│   │   │   ├── CandidateResultsAdapter.java  (for ResultsActivity table)
│   │   │   └── BlockAdapter.java             (for BlockchainActivity list)
│   │   ├── models/
│   │   │   ├── Candidate.java
│   │   │   ├── LoginRequest.java / LoginResponse.java
│   │   │   ├── VoterStatusResponse.java
│   │   │   ├── BiometricRequest.java / BiometricResponse.java
│   │   │   ├── VoteRequest.java / VoteResponse.java
│   │   │   ├── ResultsSummaryResponse.java
│   │   │   ├── BlockchainResponse.java
│   │   │   └── RegisterVoterRequest.java / RegisterVoterResponse.java
│   │   ├── network/
│   │   │   ├── ApiService.java
│   │   │   └── RetrofitClient.java
│   │   └── utils/
│   │       ├── ImageUtils.java    (Bitmap↔Base64 conversions)
│   │       ├── AnimUtils.java     (pulse, bounce, shimmer animations)
│   │       └── AuthManager.java   (SharedPreferences auth helpers)
│   └── res/
│       ├── layout/
│       │   ├── activity_splash.xml
│       │   ├── activity_home.xml
│       │   ├── activity_login.xml
│       │   ├── activity_voting.xml
│       │   ├── activity_biometric.xml
│       │   ├── activity_vote_success.xml
│       │   ├── activity_results.xml
│       │   ├── activity_blockchain.xml
│       │   ├── item_candidate_voting.xml
│       │   ├── item_candidate_result.xml
│       │   └── item_block.xml
│       ├── values/
│       │   ├── colors.xml
│       │   ├── strings.xml
│       │   ├── themes.xml
│       │   └── styles.xml
│       └── drawable/
│           ├── bg_gradient_india.xml     (tricolor gradient)
│           ├── bg_rounded_card.xml
│           ├── bg_button_blue.xml
│           └── shimmer_gradient.xml
```

---

## 🔐 SECURITY NOTES (for the app)

1. **Voter ID validation** is enforced server-side — the app just displays the error
2. **Face verification** is done server-side via Python `face_recognition` library — app only sends Base64 image
3. **Admin token** is stored in `SharedPreferences` (for hackathon) — in production use Android Keystore
4. **One-vote enforcement**: server marks voter as `has_voted=1` and rejects any further vote attempts
5. **Blockchain integrity**: every vote is stored as a block with SHA-256 hash + Proof of Work (difficulty 2)

---

## ✅ FEATURE CHECKLIST

**Public Features:**
- [x] State → City → Village cascading dropdowns
- [x] Voter ID validation against database
- [x] Already-voted detection with clear error messaging
- [x] Candidate grid with photos (2 columns)
- [x] Face verification via camera capture
- [x] Vote success screen with blockchain hash
- [x] 3-minute session countdown timer

**Admin Features:**
- [x] Secure admin login (username: `admin`, password: `admin123`)
- [x] Live results dashboard with 3-sec auto-refresh
- [x] Bar chart + Donut chart visualization
- [x] Candidate roster table with vote counts and progress bars
- [x] Add new candidate (with image upload)
- [x] Register new voter (with camera face capture)
- [x] Delete candidate (with confirmation)
- [x] Reset election (all votes cleared, blockchain reset)
- [x] City/Zone filter for results
- [x] Blockchain explorer (view all blocks)
- [x] Verify blockchain integrity
- [x] Simulate tamper attack (for demo)

---

## 📝 FINAL INSTRUCTIONS FOR AI

1. **Generate ALL files** listed in the project structure above
2. **Write complete Java code** for every Activity (no pseudo-code, no TODOs)
3. **Write complete XML layouts** for every screen — use the exact colors, dimensions, and design described
4. **Use Material Design 3** components where possible (MaterialButton, TextInputLayout, etc.)
5. **Use CameraX** for all camera functionality (not deprecated Camera API)
6. **Use Glide** for all image loading from URLs
7. **Use MPAndroidChart** for the bar and pie charts in ResultsActivity
8. **Use Retrofit 2 + Gson** for all API calls
9. **All RecyclerView adapters** must be fully implemented with ViewHolder pattern
10. **Test on API 26+ (Android 8.0 Oreo and above)**
11. Make the UI **pixel-perfect** matching all the colors, gradients, card shadows, and typography described
12. Add **proper error handling** in every Retrofit callback (onFailure + error response parsing)
13. Generate the complete `AndroidManifest.xml` with all Activities registered and permissions declared
14. Generate `build.gradle` (app level) with all dependencies included

**Start with:** `SplashActivity.java` + `activity_splash.xml`, then continue screen-by-screen.
