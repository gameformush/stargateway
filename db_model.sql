-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema devchallenge
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema devchallenge
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `devchallenge` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `devchallenge` ;

-- -----------------------------------------------------
-- Table `devchallenge`.`Starship`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devchallenge`.`Starship` (
  `starship_name` VARCHAR(45) NOT NULL,
  `currentSector` INT(11) NULL,
  PRIMARY KEY (`starship_name`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `devchallenge`.`History`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devchallenge`.`History` (
  `idHistory` INT NOT NULL AUTO_INCREMENT,
  `date` TIMESTAMP NULL,
  `paths` TEXT NULL,
  `sector` INT(11) NULL,
  `starship_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idHistory`),
  INDEX `fk_History_Starship_idx` (`starship_name` ASC),
  CONSTRAINT `fk_History_Starship`
    FOREIGN KEY (`starship_name`)
    REFERENCES `devchallenge`.`Starship` (`starship_name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `devchallenge` ;

-- -----------------------------------------------------
-- Placeholder table for view `devchallenge`.`last_position`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devchallenge`.`last_position` (`starship_name` INT, `currentSector` INT);

-- -----------------------------------------------------
-- Placeholder table for view `devchallenge`.`request_chrono`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `devchallenge`.`request_chrono` (`date` INT, `sector` INT, `paths` INT, `starship_name` INT);

-- -----------------------------------------------------
-- View `devchallenge`.`last_position`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `devchallenge`.`last_position`;
USE `devchallenge`;
CREATE  OR REPLACE VIEW `last_position` AS SELECT starship_name, currentSector FROM Starship;


-- -----------------------------------------------------
-- View `devchallenge`.`request_chrono`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `devchallenge`.`request_chrono`;
USE `devchallenge`;
CREATE  OR REPLACE VIEW `request_chrono` AS SELECT date, sector, paths, starship_name FROM History ORDER BY date;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
