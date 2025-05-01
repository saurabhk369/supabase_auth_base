const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();
const auth = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const jwt = require('jsonwebtoken');

router.post('/email-signup', auth.signUp);
router.post('/email-login', auth.login);
router.post('/logout', auth.logout);
router.get('/profile', verifyToken, auth.profile);

router.get('/google-login', (req, res) => {
    const redirectTo = encodeURIComponent('http://localhost:3000/supabase-redirect.html');

    const googleOAuthURL = `${process.env.SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;

    res.redirect(googleOAuthURL);
});

router.get('/callback', async (req, res) => {
    const accessToken = req.query.access_token;
    const refreshToken = req.query.refresh_token;

    if (!accessToken) {
        return res.status(400).json({ error: 'Missing access token' });
    }

    // You can verify token and set it as cookie
    res.cookie('sb-access-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
    });

    res.send('Google Login successful! You can now close this window.');
});

// POST /auth/session
router.post('/session', async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return res.status(400).json({ error: 'Missing access token' });
    }

    try {
        const { data, error } = await supabase.auth.getUser(access_token);
        if (error || !data.user) {
            return res.status(401).json({ error: 'Invalid or expired access token' });
        }

        if (!data?.user?.email) {
            return res.status(400).json({ error: 'Email not available in user data' });
        }

        // ✅ Create your own JWT (not Supabase token)
        const payload = {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
        };

        const jwtToken = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET, {
            expiresIn: process.env.SUPABASE_JWT_EXPIRY || '1h',
        });

        // ✅ Set secure, HTTP-only cookie
        res.cookie('auth_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600 * 1000, // 1 hour
            sameSite: 'Lax',
        });

        res.json({ message: 'Authenticated', user: data.user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;