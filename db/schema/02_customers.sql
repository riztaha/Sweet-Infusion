DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
  id SERIAL PRIMARY KEY NOT NULL,

  name TEXT DEFAULT 'N/A',
  phone TEXT DEFAULT 'N/A',

  address TEXT DEFAULT 'N/A',
  zip_code TEXT DEFAULT 'N/A',

  credit_card TEXT DEFAULT 'N/A',
  credit_card_exp TEXT DEFAULT 'N/A',
  credit_card_code TEXT DEFAULT 'N/A'
);
