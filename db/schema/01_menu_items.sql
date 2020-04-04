DROP TABLE IF EXISTS menu_items CASCADE;
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,

  name TEXT NOT NULL,

  price INTEGER NOT NULL,
  prep_time INTEGER NOT NULL,

  category TEXT NOT NULL,
  description TEXT NOT NULL,
  photo TEXT NOT NULL
);
