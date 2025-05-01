const supabase = require('../supabaseClient');
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers.authorization?.split('Bearer ')[1];
    const sbToken = req.cookies['sb-access-bearerToken'];
    const appJwt = req.cookies['auth_token'];

    try {
        // 1. Try verifying app's JWT
        if (appJwt) {
            req.user = jwt.decode(appJwt, process.env.SUPABASE_JWT_SECRET);
            return next();
        }

        // 2. fallback to Supabase access token
        const token = bearerToken || sbToken;
        if (!token) {
            return res.status(401).json({ error: 'No auth token provided' });
        }

        const { data, error } = await supabase.auth.getUser(token);
        if(error || !data?.user) {
            return res.status(401).json({ error: 'Invalid or expired Supabase token' });
        }

        req.user = data.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken;