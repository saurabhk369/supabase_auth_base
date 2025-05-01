# Supabase Auth Base (Node.js Backend)

A boilerplate backend using Node.js and Supabase for email/password and Google OAuth authentication. Designed to be secure, minimal, and extensible for production use.

## 🔧 Features

- ✅ Email/Password Sign Up & Login
- ✅ Google OAuth Login
- ✅ JWT-based session token
- ✅ HTTP-only cookie storage for access tokens
- ✅ Protected profile route
- ✅ Logout support
- ✅ Easily pluggable into any frontend
- ✅ Testing setup using `jest` and `supertest`

## 📦 Tech Stack

- Node.js
- Express
- Supabase Auth
- JWT
- Cookie Parser
- dotenv

## 🛠️ Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/saurabhk369/supabase_auth_base.git
   cd supabase_auth_base

2. Install dependencies:

   ```bash
   npm install

3. Create a .env file:

   ```bash
   SUPABASE_URL=<supabase_url>
   SUPABASE_ANON_KEY=<supabase_anon_key>
   SUPABASE_JWT_SECRET=<supabase_jwt_key>
   SUPABASE_SERVICE_ROLE_KEY=<supabase_service_role_key>

4. Run the server:

   ```bash
   npm run dev

## 🧪 Testing

1. Run the tests:

   ```bash
   npm run test

## 📁 Project Structure

```
├── controllers/
├── middleware/
├── routes/
├── supabaseClient.js
├── server.js
├── .env
└── public/
```

## 🔐 Security Notes

* Tokens are stored securely in HTTP-only cookies.
* Supabase is used only for authentication; the app creates its own JWT for session control.
* Google OAuth must be configured correctly in Supabase & Google Console.


## 🧰 Future Ideas

* Add rate limiting
* Integrate email verification
* Multi-provider support (GitHub, Twitter, etc.)
* Frontend in React or Svelte

License
MIT © Saurabh K
