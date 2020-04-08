DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
  id SERIAL PRIMARY KEY NOT NULL,

  first_name TEXT DEFAULT 'N/A',
  last_name TEXT DEFAULT 'N/A',

  email TEXT DEFAULT 'N/A',
  phone TEXT DEFAULT 'N/A',

  street TEXT DEFAULT 'N/A',
  city TEXT DEFAULT 'N/A',
  province TEXT DEFAULT 'N/A',
  country TEXT DEFAULT 'N/A',
  postal_code TEXT DEFAULT 'N/A',

  credit_card TEXT DEFAULT 'N/A',
  credit_card_exp TEXT DEFAULT 'N/A',
  credit_card_code TEXT DEFAULT 'N/A'
);
