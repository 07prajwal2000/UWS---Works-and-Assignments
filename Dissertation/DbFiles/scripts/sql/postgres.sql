CREATE TABLE `category`(
    `id` SERIAL UNSIGNED NOT NULL PRIMARY KEY,
    `category` VARCHAR(255) NOT NULL
);

CREATE TABLE `users`(
    `id` SERIAL UNSIGNED NOT NULL PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `picture` TEXT NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `notifications_allowed` BOOLEAN NOT NULL,
    `date_joined` DATETIME NOT NULL
);

CREATE TABLE `products`(
    `id` SERIAL UNSIGNED NOT NULL PRIMARY KEY,
    `product_name` VARCHAR(255) NOT NULL,
    `product_description` TEXT NOT NULL,
    `product_image` TEXT NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `discount_percent` TINYINT NOT NULL,
    `category` INT NOT NULL,
    `active` BOOLEAN NOT NULL,
    `date_created` DATETIME NOT NULL
);

CREATE TABLE `orders`(
    `order_id` VARCHAR(255) NOT NULL,
    `total_price` DECIMAL(8, 2) NOT NULL,
    `discounted_price` DECIMAL(8, 2) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `date_placed` DATETIME NOT NULL,
    PRIMARY KEY(`order_id`)
);

CREATE TABLE `order_entry`(
    `order_entry_id` VARCHAR(255) NOT NULL,
    `order_id` VARCHAR(255) NOT NULL,
    `product_id` INT NOT NULL,
    `price_per_unit` DECIMAL(8, 2) NOT NULL,
    `quantity` INT NOT NULL,
    `total_price` DECIMAL(8, 2) NOT NULL,
    `discounted_price` DECIMAL(8, 2) NOT NULL,
    `discount_percent` TINYINT NOT NULL,
    PRIMARY KEY(`order_entry_id`)
);

CREATE TABLE `transactions`(
    `transaction_id` VARCHAR(255) NOT NULL,
    `order_id` VARCHAR(255) NOT NULL,
    `user_id` INT NOT NULL,
    `amount` DECIMAL(8, 2) NOT NULL,
    `payment_method` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `date` DATETIME NOT NULL,
    PRIMARY KEY(`transaction_id`)
);

CREATE TABLE `reviews`(
    `review_id` VARCHAR(255) NOT NULL,
    `order_id` VARCHAR(255) NOT NULL,
    `user_id` INT NOT NULL,
    `rating` TINYINT NOT NULL,
    `review_text` TEXT NOT NULL,
    PRIMARY KEY(`review_id`)
);