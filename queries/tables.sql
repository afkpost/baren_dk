SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS used;
DROP TABLE IF EXISTS checkins;
DROP TABLE IF EXISTS app_users;

CREATE TABLE app_users (
    id          VARCHAR(64) PRIMARY KEY,
    gcm_regid   VARCHAR(256),
    apn_token   VARCHAR(64),
    name        TEXT,
    clan        VARCHAR(4),
    updated     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = INNODB;

CREATE TABLE offers (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    product     VARCHAR(32) NOT NULL,
    image       TEXT NOT NULL,
    lim         INT NULL,
    price       INT NULL,
    startDate   DATE,
    endDate     DATE,
    publishDate DATE
) ENGINE = INNODB;

CREATE TABLE used (
    offer       INT NOT NULL,
    usr         VARCHAR(64) NOT NULL,
    used        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = INNODB;

ALTER TABLE used
ADD CONSTRAINT one_offer_pr_user UNIQUE (offer,usr);

CREATE TABLE checkins (
    id              VARCHAR(64),
    token           VARCHAR(72),
    created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = INNODB;

ALTER TABLE checkins
ADD CONSTRAINT one_checkin_pr_day UNIQUE (id, token);

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO offers  (product, image, lim, startDate, endDate, publishDate)
            VALUE   ("Garage", "img/garage.png", 15, CURDATE(), CURDATE(), CURDATE());
INSERT INTO offers  (product, image, price, startDate, endDate, publishDate)
            VALUE   ("Somersby", "img/somersby_apple.png", 15, CURDATE(), CURDATE(), CURDATE());
INSERT INTO offers  (product, image, lim, startDate, endDate, publishDate)
            VALUE   ("Guld Tuborg", "img/guld_tuborg.png", 30, CURDATE() + INTERVAL 1 DAY, CURDATE(), CURDATE());