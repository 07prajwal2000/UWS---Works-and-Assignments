CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    picture TEXT NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(255) NOT NULL,
    notifications_allowed BOOLEAN NOT NULL,
    date_joined TIMESTAMP NOT NULL
);

CREATE TABLE category (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    category VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    product_id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    product_image TEXT NOT NULL,
    price numeric(8, 2),
    discount_percent SMALLINT,
    category uuid,
    active BOOLEAN,
    date_created TIMESTAMP
);

alter table products
ADD CONSTRAINT fk_category_id FOREIGN KEY (category) REFERENCES category (id);

CREATE TABLE orders (
    order_id uuid DEFAULT gen_random_uuid (),
    total_price numeric(8, 2) NOT NULL,
    discounted_price numeric(8, 2) NOT NULL,
    user_id uuid NOT NULL,
    date_placed TIMESTAMP NOT NULL,
    PRIMARY KEY (order_id)
);

alter table orders
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

CREATE TABLE order_entry (
    order_entry_id uuid DEFAULT gen_random_uuid (),
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    price_per_unit numeric(8, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price numeric(8, 2) NOT NULL,
    discounted_price numeric(8, 2) NOT NULL,
    discount_percent SMALLINT NOT NULL,
    PRIMARY KEY (order_entry_id)
);

alter table order_entry
ADD CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (product_id);

alter table order_entry
ADD CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id);

CREATE TABLE transactions (
    transaction_id uuid DEFAULT gen_random_uuid (),
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(8, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY (transaction_id)
);

alter table transactions
ADD CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id);

alter table transactions
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

CREATE TABLE reviews (
    review_id uuid DEFAULT gen_random_uuid (),
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating SMALLINT NOT NULL,
    review_text TEXT NOT NULL,
    PRIMARY KEY (review_id)
);

alter table reviews
ADD CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id);

alter table reviews
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);