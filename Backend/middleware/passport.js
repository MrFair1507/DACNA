// middleware/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../models/db');
require('dotenv').config();

// === GOOGLE STRATEGY ===
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;

  try {
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    let user = rows[0];

    if (!user) {
      const [result] = await db.query(
        "INSERT INTO Users (full_name, email, password_hash, is_verified, login_type) VALUES (?, ?, ?, ?, ?)",
        [profile.displayName, email, null, 1, "google"] // hoặc dùng '' nếu cột không cho null
      );
      user = { user_id: result.insertId, email, full_name: profile.displayName };
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));


// === FACEBOOK STRATEGY ===
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/facebook/callback",
  profileFields: ['id', 'name', 'displayName'],
  enableProof: true
}, async (accessToken, refreshToken, profile, done) => {
  const facebookId = profile.id;
  const email = profile.emails?.[0]?.value || `${facebookId}@facebook.com`; // fallback nếu không có email
  const name = profile.displayName || `${profile.name.givenName} ${profile.name.familyName}`;

  try {
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    let user = rows[0];

    if (!user) {
      const [result] = await db.query(
        "INSERT INTO Users (full_name, email, password_hash, is_verified, login_type, facebook_id) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, null, 1, "facebook", facebookId]
      );
      user = { user_id: result.insertId, email, full_name: name };
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await db.query("SELECT * FROM Users WHERE user_id = ?", [id]);
  done(null, rows[0]);
});
