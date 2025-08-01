CREATE database lsm_vs_btree_test;

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
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

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    product_image TEXT NOT NULL,
    price numeric(8, 2),
    discount_percent SMALLINT,
    category INT,
    active BOOLEAN,
    date_created TIMESTAMP
);

CREATE TABLE orders (
    order_id VARCHAR(255) NOT NULL,
    total_price numeric(8, 2) NOT NULL,
    discounted_price numeric(8, 2) NOT NULL,
    user_id int NOT NULL,
    date_placed TIMESTAMP NOT NULL,
    PRIMARY KEY (order_id)
);

CREATE TABLE order_entry (
    order_entry_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    price_per_unit numeric(8, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price numeric(8, 2) NOT NULL,
    discounted_price numeric(8, 2) NOT NULL,
    discount_percent SMALLINT NOT NULL,
    PRIMARY KEY (order_entry_id)
);

CREATE TABLE transactions (
    transaction_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    amount numeric(8, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY (transaction_id)
);

CREATE TABLE reviews (
    review_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    rating SMALLINT NOT NULL,
    review_text TEXT NOT NULL,
    PRIMARY KEY (review_id)
);

-- foreign key constraints
alter table orders
add CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

alter table order_entry
add CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id);

alter table order_entry
add CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (product_id);

alter table reviews
add CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id);

alter table reviews
add CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

alter table transactions
add CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);

alter table transactions
add CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id);

alter table products
add CONSTRAINT fk_category_id FOREIGN KEY (category) REFERENCES category (id);

-- indexing

create index idx_user_email on users (email);

create index idx_user_date_joined on users (date_joined DESC);

create index idx_product_category on products (category);

create index idx_product_price on products (price);

create index idx_order_discountend_and_price on orders (discounted_price, total_price);

create index idx_order_user_id on orders (user_id);

create index idx_order_entry_order_id on order_entry (order_id);

create index idx_order_entry_product_id on order_entry (product_id);

create INDEX idx_reviews_user_id on reviews (user_id);

create INDEX idx_reviews_order_id on reviews (order_id);

create INDEX idx_reviews_rating on reviews (rating);

create INDEX idx_transactions_user_id on transactions (user_id);

CREATE INDEX idx_transactions_order_id on transactions (order_id);