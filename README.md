# Narigiri — Task Management App

A full-stack app for managing your own personal tasks. You can sign up, log in, and then create, edit, and delete tasks. Each task can have a due date, a location, and a file attached to it. The app shows the weather for that location, and sends you an email when you create a task and when you mark it as done.

---

## Live links

- **Live app (Vercel):** _add link here after deploying_
- **Backend URL:** _add link here after deploying_
- **GitHub repo:** _add link here_

---

## Tech stack

| Part | What I used | Why |
|---|---|---|
| Database | MongoDB + Mongoose | Stores tasks and users. Each task points back to the user who owns it. |
| Backend | Node.js + Express.js | Handles the API requests. |
| Auth | `jsonwebtoken`, `bcryptjs`, `cookie-parser` | Passwords are hashed, and login gives you a token stored in a cookie. |
| File upload | `multer` + Cloudinary | Lets you attach a file to a task. |
| Email | Nodemailer (Gmail) | Sends the confirmation and completion emails. |
| Weather | OpenWeatherMap API | Looks up the weather for a task's location. |
| Frontend | React (Vite) + React Router | The website itself. |
| Styling | Sass (SCSS, BEM class names) | See below for why I picked this over Tailwind. |
| Forms | `react-hook-form` + `zod` | Handles form input and checks it's filled in correctly. |
| Icons | `lucide-react` | Small icons used across the app. |
| HTTP calls | Axios | Used to talk to the backend from the frontend. |
| Notifications | `react-hot-toast` | Small pop-up messages, like "Task created." |

---

## A note about the stack I used

The original brief asked for a NestJS backend and a Next.js frontend. I built this with plain Express.js and React (Vite) instead. I chose this because I already knew these tools well, and with only 2–3 days, I wanted to spend my time on getting the features working correctly rather than learning a new framework at the same time. I explain more about this in the "What I'd improve" section below.

---

## Why I used Sass instead of Tailwind

I chose Sass mainly because I am not very familiar with Tailwind, and I am much more comfortable writing regular CSS-style code. Sass lets me write normal styles, but with some helpful extras like variables (for colours) and mixins (small reusable style blocks), which I used to keep things consistent and to make the site responsive.

The brief did not say Tailwind was required, so I felt this was a safe choice. I know Tailwind is popular and quick once you know it, so with more time and practice, I would be happy to learn and use it too.

---

## Why I used cookies instead of localStorage

The example reference material stored the login token in `localStorage` and sent it with each request. I instead chose to store the token in a cookie (with the `httpOnly` setting turned on).

In simple terms:

- A token stored in `localStorage` can be read by any JavaScript running on the page. So if the site ever had a security bug that let a bad script run (this is called XSS), that script could read the token and steal it.
- A cookie with `httpOnly` turned on cannot be read by JavaScript at all. The browser sends it automatically with each request, but no script on the page can see or copy it. This makes it harder to steal.

To be fair, this method has one downside: cookies can be affected by something called CSRF (a trick where another website causes your browser to send a request without you meaning to). I reduced this risk by setting the `sameSite` option on the cookie and by only allowing requests from my own frontend's address (using CORS). With more time, I would add extra CSRF protection as well.

---

## Project structure

```
narigiri/
├── backend/
│   ├── config/
│   │   ├── db.js                 # connects to MongoDB
│   │   └── cloudinary.js         # Cloudinary setup
│   ├── controllers/
│   │   ├── authController.js     # register / login / logout / me
│   │   └── taskController.js     # task CRUD, filters, pagination, weather
│   ├── middleware/
│   │   ├── authMiddleware.js     # checks the login cookie
│   │   ├── uploadMiddleware.js   # handles file uploads
│   │   └── errorMiddleware.js    # catches and formats errors
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js         # includes /tasks/weather
│   ├── utils/
│   │   ├── emailService.js       # sends emails, returns true/false
│   │   ├── weatherService.js     # fetches weather
│   │   └── generateToken.js      # creates the login token and cookie
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskFormModal.jsx
    │   │   ├── TaskFilters.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── WeatherBadge.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # keeps track of who is logged in
    │   ├── pages/
    │   │   ├── LandingPage.jsx   # public homepage, shown at "/"
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── DashboardPage.jsx # shown at "/dashboard", login required
    │   ├── services/
    │   │   └── api.js            # Axios setup
    │   ├── styles/                # Sass files, one per component
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── vite.config.js
```

---

## How the app works, in short

- **Login**: when you register or log in, the backend creates a token and stores it in a cookie. This cookie is sent automatically with every request after that, so you stay logged in.
- **Your tasks only**: every task is linked to your account. The backend always checks that a task belongs to you before showing, changing, or deleting it.
- **File attachments**: files are uploaded straight to Cloudinary. Only the file's link is saved on the task, not the file itself.
- **Weather**: the weather is not saved with the task, since it changes over time. Instead, the app asks for the weather again each time a task card is shown, using a separate `/tasks/weather` endpoint.
- **Emails**: the backend tries to send an email on task creation and when a task is marked done. It tells the frontend whether the email actually went through, so the app can show the right message ("email sent" or "task saved, but email failed").
- **Landing page**: when you open the site, you land on a homepage first (not directly on the login form). It has a short description of the app and a login button. If you're already logged in, this button becomes a "Go to Dashboard" button instead.

---

## API endpoints

| Method | Route | Who can use it | What it does |
|---|---|---|---|
| POST | `/auth/register` | Anyone | Create an account |
| POST | `/auth/login` | Anyone | Log in |
| POST | `/auth/logout` | Logged in | Log out |
| GET | `/auth/me` | Logged in | Get your own account info |
| GET | `/tasks` | Logged in | List your tasks (supports `page`, `limit`, `status`, `priority`, `search`, `startDate`, `endDate`) |
| POST | `/tasks` | Logged in | Create a task (can include a file) |
| GET | `/tasks/weather?city=` | Logged in | Get the current weather for a place |
| GET | `/tasks/:id` | Logged in | Get one task |
| PUT | `/tasks/:id` | Logged in | Update a task (can include a new file) |
| DELETE | `/tasks/:id` | Logged in | Delete a task |

---

## Setup instructions

### What you need first
- Node.js v18 or v20
- A MongoDB connection string (from MongoDB Atlas, or a local MongoDB)
- Accounts for: OpenWeatherMap, Cloudinary, and a Gmail address with an app password

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev
```

**`backend/.env.example`**
```
PORT=5000
NODE_ENV=development

MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OPENWEATHER_API_KEY=your_openweathermap_key

EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # then fill in your own value
npm run dev
```

**`frontend/.env.example`**
```
VITE_API_URL=http://localhost:5000
```

---

## What I'd improve with more time

- **Match the original stack**: rebuild the backend in NestJS and the frontend in Next.js, as the brief first asked for.
- **CSRF protection**: add a proper CSRF token for extra safety, on top of the cookie settings I already have.
- **File checks**: currently the backend accepts any file type and size. I'd add limits so only reasonable file types and sizes are allowed.
- **One task status naming**: make sure the task status values (`DONE` vs `COMPLETED`) are named the same way everywhere in the code, instead of being handled in two places.
- **Tests**: add some basic automated tests, especially for login and for making sure users can only see their own tasks.
- **Weather caching**: avoid asking the weather API again and again for the same city in a short time.

---

## Deployment

- **Backend**: deployed on Render/Railway/Fly.io, with the environment variables listed above set in the hosting dashboard, and `NODE_ENV=production` turned on.
- **Frontend**: deployed on Vercel, with `VITE_API_URL` pointing at the live backend address.
- **Database**: MongoDB Atlas.
