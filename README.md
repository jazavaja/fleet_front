# Fleet Core Frontend

A modern, user-friendly fleet management web application frontend built with **React** and **TypeScript**. This project provides an admin dashboard for managing fleets, vehicle types, sizes, brands, axes (mehvars), users, permissions, and more.

## Features

- **Dashboard**: Centralized admin dashboard for all fleet management operations.
- **Fleet Management**: Create, edit, delete, and search fleets (NavyMain) with support for types, sizes, brands, and axes.
- **Dynamic Dropdowns**: Cascading selects for type, size, brand, and axis, with data fetched from the backend.
- **Search & Pagination**: Search fleets by name or attributes, with paginated results.
- **User & Permissions Management**: Manage users, groups, and permissions (see `pages/UsersManagement.tsx`, `pages/GroupPermissions.tsx`).
- **Error Handling**: Custom error pages for 404 and 500 errors.
- **Responsive UI**: Clean, RTL-friendly design using Tailwind CSS (or similar utility classes).

## Project Structure

```
fleet-core-frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context (e.g., Auth)
│   ├── data/              # Static data (provinces, cities)
│   ├── layouts/           # Layout components (e.g., DashboardLayout)
│   ├── pages/             # Main pages (Dashboard, NavyMain, Users, etc.)
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app entry
│   └── main.tsx           # React root
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
```bash
npm install
# or
yarn install
```

### Running the App
```bash
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

### Environment & API
- The frontend expects a backend API (e.g., Django REST) running at `http://127.0.0.1:8000/api/`.
- Update API endpoints in `src/pages/NavyMain.tsx` and other files as needed.
- Authentication uses a Bearer token stored in `localStorage` as `access_token`.

## Customization
- **RTL Support**: The UI is designed for right-to-left languages (e.g., Persian).
- **Branding**: Update logos and styles in `public/` and `src/assets/`.
- **API Endpoints**: Adjust endpoints in the code to match your backend.

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## License
This project is proprietary or internal. Add your license here if needed.

---

**Developed for Fleet Management Solutions.**