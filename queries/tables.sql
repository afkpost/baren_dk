SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS used;
DROP TABLE IF EXISTS checkins;
DROP TABLE IF EXISTS app_users;
DROP VIEW IF EXISTS current_offers_view;
DROP VIEW IF EXISTS used_view;
DROP VIEW IF EXISTS upcomming_offers_view;

CREATE TABLE app_users (
    id          VARCHAR(64) PRIMARY KEY,
    gcm_regid   VARCHAR(256),
    apn_token   VARCHAR(64),
    name        TEXT,
    clan        VARCHAR(4),
    updated     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
);

ALTER TABLE checkins
ADD CONSTRAINT one_checkin_pr_day UNIQUE (id, token);

CREATE VIEW used_view AS
    SELECT DISTINCT offer, count(offer) AS cnt FROM used GROUP BY offer;

CREATE VIEW current_offers_view AS
    SELECT id, product, image, (lim - IFNULL(cnt, 0)) AS remains, price
    FROM offers LEFT JOIN used_view ON id = offer
    WHERE
        startDate <= DATE(SUBTIME(NOW(), MAKETIME(7,0,0))) AND /*Date ends at 5am*/
        endDate   >= DATE(SUBTIME(NOW(), MAKETIME(7,0,0)));

CREATE VIEW upcomming_offers_view AS
    SELECT id, product, image, lim AS remains, price, startDate
    FROM offers
    WHERE
        startDate    > DATE(SUBTIME(NOW(), MAKETIME(7,0,0))) AND
        publishDate <= DATE(SUBTIME(NOW(), MAKETIME(7,0,0)));

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO offers  (product, image, lim, startDate, endDate, publishDate)
            VALUE   ("Garage", "img/garage.png", 15, CURDATE(), CURDATE(), CURDATE());
INSERT INTO offers  (product, image, price, startDate, endDate, publishDate)
            VALUE   ("Somersby", "img/somersby_apple.png", 15, CURDATE(), CURDATE(), CURDATE());
INSERT INTO offers  (product, image, lim, startDate, endDate, publishDate)
            VALUE   ("Guld Tuborg", "img/guld_tuborg.png", 30, CURDATE() + INTERVAL 1 DAY, CURDATE());