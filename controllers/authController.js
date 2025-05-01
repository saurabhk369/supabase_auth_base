const supabase = require('../supabaseClient');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
        return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data?.user) return res.status(400).json({ error: error.message || 'Sign Up Failed' });

    const insertError = await supabase.from('profiles').insert([{ id: data.user.id, full_name }]);
    if(insertError.error) {
        return res.status(500).json({ error: 'User created, but profile insert failed' });
    }

    res.json({ user: data.user });
};

exports.login = async (req, res) => {
    const { email, password, remember_me } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || data?.user) return res.status(401).json({ error: error.message });

    const payload = {
        id: data.user.id,
        email: data.user.email,
    };

    const expiry = remember_me ? '30d' : '1h';
    const maxAgeMs = remember_me ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

    const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET, { expiresIn: expiry });

    res.cookiw('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAgeMs,
    });

    res.cookie('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAgeMs,
    });

    res.json({ user: data.user });
};

exports.logout = async (req, res) => {
    res.clearCookie('sb-access-token');
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
};

exports.profile = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

    if(error) return res.status(404).json({ error: error.message });
    res.json(data);
}