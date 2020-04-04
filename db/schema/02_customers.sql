DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
  id SERIAL PRIMARY KEY NOT NULL,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,

  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  street TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  country TEXT NOT NULL,
  postal_code TEXT NOT NULL,

  credit_card TEXT NOT NULL,
  credit_card_exp DATE NOT NULL
);
