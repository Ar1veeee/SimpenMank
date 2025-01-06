CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,  
    `username` VARCHAR(255) NOT NULL,     
    `email` VARCHAR(255) NOT NULL UNIQUE, 
    `password` VARCHAR(255) DEFAULT NULL, 
    `google_id` VARCHAR(255) DEFAULT NULL, 
    `auth_method` ENUM('email', 'google') NOT NULL, 
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);


CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,  
    `user_id` INT NULL,
    `name` VARCHAR(255) NOT NULL,     
    `type` ENUM('income', 'expense') NOT NULL, 
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `wallet_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `amount` DECIMAL(15,2) NOT NULL,
    `description` TEXT,
    `transaction_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE `wallets` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,  
    `user_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `balance` DECIMAL NULL,       
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE    
);
