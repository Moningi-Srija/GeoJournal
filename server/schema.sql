-- GeoJournal Database Schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE friendship_status AS ENUM ('pending', 'accepted');

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    addressee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status friendship_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_friendship UNIQUE (requester_id, addressee_id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    location_name VARCHAR(255),
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_photos (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);
