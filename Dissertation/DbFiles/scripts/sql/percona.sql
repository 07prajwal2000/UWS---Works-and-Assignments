CREATE TABLE category (
    id int AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL
);

ALTER TABLE category engine = innodb;

CREATE TABLE users (
    id int auto_increment PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    picture TEXT NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    notifications_allowed BOOLEAN NOT NULL,
    date_joined datetime NOT NULL
);

ALTER TABLE users engine = innodb;

CREATE TABLE products (
    product_id int auto_increment PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT NOT NULL,
    product_image TEXT NOT NULL,
    price numeric(8, 2),
    discount_percent SMALLINT,
    category INT,
    active BOOLEAN,
    date_created datetime
);

alter table products
add CONSTRAINT fk_category_id FOREIGN KEY (category) REFERENCES category (id);

ALTER TABLE products engine = innodb;

CREATE TABLE orders (
    order_id VARCHAR(40) NOT NULL,
    total_price DECIMAL(8, 2) NOT NULL,
    discounted_price DECIMAL(8, 2) NOT NULL,
    user_id int NOT NULL,
    date_placed datetime NOT NULL,
    PRIMARY KEY (order_id)
);

ALTER TABLE orders engine = rocksdb;

CREATE TABLE order_entry (
    order_entry_id VARCHAR(40) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    price_per_unit numeric(8, 2) NOT NULL,
    quantity SMALLINT NOT NULL,
    total_price numeric(8, 2) NOT NULL,
    discounted_price numeric(8, 2) NOT NULL,
    discount_percent SMALLINT NOT NULL,
    PRIMARY KEY (order_entry_id)
);

CREATE TABLE transactions (
    transaction_id VARCHAR(40) NOT NULL,
    order_id VARCHAR(40) NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(8, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(255) NOT NULL,
    date datetime NOT NULL,
    PRIMARY KEY (transaction_id)
);

CREATE TABLE reviews (
    review_id VARCHAR(40) NOT NULL,
    order_id VARCHAR(40) NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL,
    review_text TEXT NOT NULL,
    PRIMARY KEY (review_id)
);

ALTER TABLE order_entry engine = rocksdb;

ALTER TABLE transactions engine = rocksdb;

ALTER TABLE reviews engine = rocksdb;