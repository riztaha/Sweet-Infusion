DROP TABLE IF EXISTS order_menu_item CASCADE;
CREATE TABLE order_menu_item (
  id SERIAL PRIMARY KEY NOT NULL,

  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,

  item_quantity INTEGER NOT NULL
);
