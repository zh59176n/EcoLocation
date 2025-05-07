# EcoLocation 🌱⚡  
### *Sustainable Energy Found Simple*

![EcoLocation Poster](src/assets/EcoLocation%Poster.png)

---

## 🚀 Features

- 🔐 **Secure Login & Authentication**  
  - Firebase Auth for secure email/password login  
  - Forgot password functionality with email recovery  
  - Route protection based on login state  

- 🔌 **EV Charging Station Finder**  
  - Interactive Leaflet.js map with real-time OpenChargeMap API data  
  - Custom pins, borough filtering, and charger level indicators  
  - Favorites system tied to user profiles  

- ☀️ **Solar Provider Directory**  
  - Searchable, filterable list of solar panel providers  
  - Mobile-responsive layout and map split from EV tools  

- 🧮 **Carbon Footprint Calculator**  
  - Estimate emissions from everyday activities  
  - Saves history to Firestore with weekly challenge integration  

- 📰 **Local Green News Feed**  
  - Pulls environmental articles via The Guardian API  
  - Supports pagination, sorting, and offline fallback/retry logic  

- 🏆 **Profile Page & Eco Challenge Tracker**  
  - Customize avatar and view earned badges  
  - Track weekly eco-challenges and leaderboard rank  
  - View saved stations/providers and green point stats  

- 🌑 **Dark Mode Toggle**  
  - Global light/dark mode using Tailwind and toggle component  
  - Responsive styling throughout the app  

- 📲 **Progressive Web App UX**  
  - Mobile-first design  
  - Accessible UI with ARIA support and keyboard navigation  

- 🚀 **CI/CD & Testing**  
  - GitHub Actions CI with deploys to Vercel  
  - Unit + E2E tests using Jest, Cypress, jest-axe  
  - Lighthouse and accessibility audits  

---

## 🧪 Tech Stack

- ⚛️ React (Vite, React Router)  
- 🔥 Firebase (Auth + Firestore)  
- 🌬️ Tailwind CSS  
- 🗺️ Leaflet.js  
- 🧪 Jest, React Testing Library  
- 🚦 Cypress, jest-axe  
- 🔁 GitHub Actions  
- 🎨 Figma, Canva, Google Fonts, Flaticon  

---

## 👑 Team Roles & Workload (~100+ hrs each)

| <img src="https://i.imgur.com/RfHET4T.jpeg" width="100" height="100" style="border-radius: 8px; object-fit: cover;"/> | <img src="https://github.com/paceuniversity/cs491s2025team5/blob/main/public/Donovan_Lane_headshot-r.png?raw=true" width="100" height="100" style="border-radius: 8px; object-fit: cover;"/> | <img src="https://github.com/paceuniversity/cs491s2025team5/blob/main/public/zara.jpg?raw=true" width="100" height="100" style="border-radius: 8px; object-fit: cover;"/> | <img src="https://github.com/paceuniversity/cs491s2025team5/blob/main/public/patrick.jpg?raw=true" width="100" height="100" style="border-radius: 8px; object-fit: cover;"/> |
|:--:|:--:|:--:|:--:|
| **Grace Langton**<br>Product Owner: UI, styling,   dark mode, login, home/map    | **Donovan Lane**<br>Developer: Firebase,   auth, ESLint setup | **Zara Hameedi**<br>Developer: Accessibility, CO₂ calculator, weekly challenges, newsfeed, push notifications, testing | **Patrick Casseus**<br>Lead Developer: Counter,   routing, responsiveness, profile, styling |

---

## 🧠 Idea Proposal  
📄 [View Proposal Doc](https://docs.google.com/document/d/1p9ygoiYIbuHljajCr72dQITItc8PGiHo/edit?usp=sharing)

---

## 🗓️ Team Calendar  
📅 [Open Calendar](https://calendar.google.com/calendar/u/0?cid=aXZoMmU3NjhzMjRkdGlxZWYwcXZvbzhxcjBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)

---

## 📦 Product Backlog

- 📖 [Requirements Discovery](https://docs.google.com/document/d/16X1yzg3AdO9H6APF4BPhv2etBvdd28b6hR-P6vI2YK8/edit?tab=t.0)  
- ✅ [Product Backlog Validation](https://docs.google.com/document/d/1xiTEGXpSIJWw-BiDMn5NYWY0mI_-y0AU1b1AS8UWnJ8/edit?tab=t.0)  
- 📊 [Full Product Backlog Sheet](https://docs.google.com/spreadsheets/d/1V1j0ffJiR_iQvUImlrDzco2Sz34ZC-l-Mt9YnEWp6GI/edit?usp=sharing)

---

## 📅 Sprint 1 — Planning & Progress

We’ve kicked off **Sprint 1**, laying down our foundation and building the core structure of the app.

### ✅ Selected User Stories:
- **US1:** Login system *(7 pts)*  
- **US2:** Firebase setup *(5 pts)*  
- **US3:** Counter component *(3 pts)*  

> 🏁 **Planned Velocity:** 15 points  
> *(Core functionality & foundational setup)*

### 💡 Sprint Docs:
- 📄 [Sprint 1 Spreadsheet](https://docs.google.com/spreadsheets/d/1V1j0ffJiR_iQvUImlrDzco2Sz34ZC-l-Mt9YnEWp6GI/edit?usp=sharing)  
- 🗒️ [Scrum 1 Notes](https://docs.google.com/document/d/1bnLyXPCKPVjfwZvzAg-fsqB9oC3pqbDjBiXTS9wzOGI/edit?usp=sharing)  
- 🗒️ [Retro Document](https://docs.google.com/document/d/1GbeDqYc5blDBnmV19-KofSS-fLuVNXIREOjp3Q_22ds/edit?tab=t.0)

**📷 Demo 1 Video**  
- [Watch Demo 1](https://drive.google.com/drive/folders/1YX6_qybbskUXy9_Le9vRIS5nhmcBNPZr?usp=sharing)
  
### 👥 Team Workload — 16 hrs each:
- **Grace** – Login UI, Tailwind, dark mode, Home/About  
- **Donovan** – Firebase setup, Auth, ESLint, testing  
- **Patrick** – Counter, routing, responsiveness  
- **Zara** – Accessibility, documentation, test scaffolding  

---

## 🚀 Sprint 2 — Planning & Progress

We’ve wrapped up **Sprint 2**, implementing advanced features, eco-specific UI enhancements, and expanding the app’s news and solar tracking capabilities.

### ✅ Selected User Stories:
- **T2.15**: Build Solar Provider UI *(4 pts)*  
- **T2.16**: Build basic News Feed layout *(3 pts)*  
- **T2.17**: Fetch dummy news or live feed *(3 pts)*  
- **T2.18**: Display articles in scrollable list *(2 pts)*  
- **T2.19–T2.22**: Dark mode + mobile responsiveness + links *(6 pts total)*  
- **T2.27**: Add carbon calculator UI *(3 pts)*  

> **Planned Velocity**: 21 points  
> *Eco functionality + green interface expansion*

### 📄 Sprint Docs:
- [Sprint 2 Spreadsheet](https://docs.google.com/spreadsheets/d/1V1j0ffJiR_iQvUImlrDzco2Sz34ZC-l-Mt9YnEWp6GI/edit?usp=drivesdk)  
- [Sprint 2 Notes](https://docs.google.com/document/d/1bnLyXPCKPVjfwZvzAg-fsqB9oC3pqbDjBiXTS9wzOGI/edit?usp=drivesdk)  
- [Retro Document](https://docs.google.com/document/d/1p6QRJ5_DuGICe584cZBOos4Pocob7prhDT4nd-K0WYE/edit?usp=drivesdk)

**🎥 Demo 2 Video**  
- [Watch Demo 2](https://drive.google.com/file/d/1TM1KpxXYniXd2FSQomR9vh7G0q352vCT/view?usp=sharing)

### 👥 Team Workload — 16 hrs each:
- **Grace** – Home/About redesign, dark mode QA, news styling  
- **Donovan** – Firebase structure, solar API loader, page protection  
- **Patrick** – News feed, modal UI, carbon calculator  
- **Zara** – Dark mode logic, usability feedback, test cleanup  

---

## 🚀 Sprint 3 — Planning & Progress

We’ve successfully wrapped up **Sprint 3**, delivering key personalization features, major map upgrades, and performance improvements across EcoLocation’s user-facing pages.

### ✅ Selected User Stories:
- **T3.2**: NewsFeed → Guardian Resilience *(3 pts)*  
- **T3.4**: Solar Provider Filters + Search *(5 pts)*  
- **T3.5**: User Profile Page *(6 pts)*  
- **T3.6**: Eco Challenge → Push Notification Opt-in *(5 pts)*  
- **T3.7**: Carbon Calculator → Persist History *(4 pts)*  
- **T3.11**: CI/CD to Vercel *(3 pts)*  
- **T3.12**: Leaderboard → Weekly Rank Logic *(3 pts)*  
- **T3.14**: NewsFeed → Sort + Pagination *(5 pts)*  
- **T3.15**: NewsFeed → Fallback + Retry Messaging *(3 pts)*  
- **T3.19**: Solar UI → Mobile Responsive QA *(1 pt)*  

> **Planned Velocity**: 27 points  
> *Personalization + advanced map tools + resilience improvements*

### 📄 Sprint Docs:
- [Sprint 3 Spreadsheet](https://docs.google.com/spreadsheets/d/1V1j0ffJiR_iQvUImlrDzco2Sz34ZC-l-Mt9YnEWp6GI/edit#gid=123456)  
- [Sprint 3 Notes](https://docs.google.com/document/d/1p6QRJ5_DuGICe584cZBOos4Pocob7prhDT4nd-K0WYE/edit)  
- [Retro Document](https://docs.google.com/document/d/1LhWgTO3WkUCB1M_NMv3dSuTDfi5x5LbCxwAh7g0ZYYI/edit?usp=sharing)

**🎥 Demo 3 Video**  
- [Watch Demo 3](https://drive.google.com/file/d/1O74_Dm7ralMdUJUyhiOtsSjRTl6vbbuE/view?usp=sharing)

---

## 📽️ Additional Demos & Docs

- [Product Proposal](https://docs.google.com/document/d/1p9ygoiYIbuHljajCr72dQITItc8PGiHo/edit?usp=sharing)  
- [Team Calendar](https://calendar.google.com/calendar/u/0?cid=aXZoMmU3NjhzMjRkdGlxZWYwcXZvbzhxcjBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)  
- [Sprint Backlogs & Retrospectives](https://docs.google.com/spreadsheets/d/1V1j0ffJiR_iQvUImlrDzco2Sz34ZC-l-Mt9YnEWp6GI/edit?usp=sharing)  

---

## 🛠 Setup Instructions

### 🧪 Local Development

1. **Clone the repository**  
```bash
git clone https://github.com/paceuniversity/cs491s2025team5.git
cd cs491s2025team5
```

2. **Install dependencies**  
```bash
npm install
```

3. **Run the development server**  
```bash
npm run dev
```

4. **Firebase Configuration**  
> Create a `.env` file in the root with your Firebase project credentials:  
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. **Open the App**  
> Once the server is running, open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🙌 Thank You

Built with care by Team 5 at Pace University.

