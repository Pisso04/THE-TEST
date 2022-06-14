CREATE DATABASE IF NOT EXISTS parking_company;

use parking_company;

CREATE TABLE Users
(
  id bigint NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  firstname varchar(255) NOT NULL,
  lastname varchar(255) NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at datetime NOT NULL DEFAULT NOW(),
  CONSTRAINT id PRIMARY KEY (id)
);

CREATE TABLE Parkings
(
  id bigint NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  adress varchar(255) NOT NULL,
  nbr_place integer NOT NULL,
  available_place integer NOT NULL,
  created_at datetime NOT NULL DEFAULT NOW(),
  CONSTRAINT id PRIMARY KEY (id)
);

CREATE TABLE Reservations
(
  id bigint NOT NULL AUTO_INCREMENT,
  u_id bigint NOT NULL,
  parking_id bigint NOT NULL,
  parking_place bigint NOT NULL,
  date_start datetime NOT NULL,
  end_date datetime NOT NULL,
  price integer NOT NULL,
  created_at datetime NOT NULL DEFAULT NOW(),
  CONSTRAINT id PRIMARY KEY (id),
  CONSTRAINT FK_UserReservation FOREIGN KEY (u_id) REFERENCES Users(id),
  CONSTRAINT FK_ParkingReservation FOREIGN KEY (parking_id) REFERENCES Parkings(id)
)