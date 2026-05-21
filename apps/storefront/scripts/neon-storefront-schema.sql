-- Run in Neon SQL Editor while connected to database: storefront
-- (Create DB first: CREATE DATABASE storefront;)

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id text PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id text PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS galle_quiz_responses (
  id text PRIMARY KEY,
  email varchar(255),
  mood varchar(64) NOT NULL,
  preferred_family varchar(64) NOT NULL,
  occasion varchar(64),
  intensity varchar(32),
  recommended_handle varchar(128),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS galle_concierge_enquiries (
  id text PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(32),
  enquiry_type varchar(64) NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
