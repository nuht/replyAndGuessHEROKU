<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211113140016 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE app_user (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, gender BOOLEAN DEFAULT NULL, is_pending BOOLEAN NOT NULL, is_valid BOOLEAN NOT NULL, score INT NOT NULL, register_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_update TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, last_connection_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, birthdate DATE DEFAULT NULL, hash VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_88BDF3E9E7927C74 ON app_user (email)');
        $this->addSql('CREATE TABLE choice (id INT NOT NULL, multiple_id INT NOT NULL, property_name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C1AB5A92AEDC4C7D ON choice (multiple_id)');
        $this->addSql('CREATE TABLE company (id INT NOT NULL, name VARCHAR(255) NOT NULL, picture BYTEA DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE multiple (id INT NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE question (id INT NOT NULL, multiple_id INT DEFAULT NULL, text_area_id INT DEFAULT NULL, survey_id INT NOT NULL, text TEXT NOT NULL, is_required BOOLEAN DEFAULT \'false\' NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B6F7494EAEDC4C7D ON question (multiple_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B6F7494E99AE6FA3 ON question (text_area_id)');
        $this->addSql('CREATE INDEX IDX_B6F7494EB3FE509D ON question (survey_id)');
        $this->addSql('CREATE TABLE refresh_tokens (id INT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9BACE7E1C74F2195 ON refresh_tokens (refresh_token)');
        $this->addSql('CREATE TABLE result (id INT NOT NULL, survey_id INT NOT NULL, user_id INT NOT NULL, answer_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, value JSON DEFAULT NULL, value_predict JSON DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_136AC113B3FE509D ON result (survey_id)');
        $this->addSql('CREATE INDEX IDX_136AC113A76ED395 ON result (user_id)');
        $this->addSql('CREATE TABLE survey (id INT NOT NULL, company_id INT NOT NULL, published_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, closed_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, status VARCHAR(255) NOT NULL, config_settings JSON DEFAULT NULL, hash VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AD5F9BFC979B1AD6 ON survey (company_id)');
        $this->addSql('CREATE TABLE text_area (id INT NOT NULL, text_answer TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE choice ADD CONSTRAINT FK_C1AB5A92AEDC4C7D FOREIGN KEY (multiple_id) REFERENCES multiple (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494EAEDC4C7D FOREIGN KEY (multiple_id) REFERENCES multiple (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494E99AE6FA3 FOREIGN KEY (text_area_id) REFERENCES text_area (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494EB3FE509D FOREIGN KEY (survey_id) REFERENCES survey (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE result ADD CONSTRAINT FK_136AC113B3FE509D FOREIGN KEY (survey_id) REFERENCES survey (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE result ADD CONSTRAINT FK_136AC113A76ED395 FOREIGN KEY (user_id) REFERENCES app_user (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE survey ADD CONSTRAINT FK_AD5F9BFC979B1AD6 FOREIGN KEY (company_id) REFERENCES company (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE result DROP CONSTRAINT FK_136AC113A76ED395');
        $this->addSql('ALTER TABLE survey DROP CONSTRAINT FK_AD5F9BFC979B1AD6');
        $this->addSql('ALTER TABLE choice DROP CONSTRAINT FK_C1AB5A92AEDC4C7D');
        $this->addSql('ALTER TABLE question DROP CONSTRAINT FK_B6F7494EAEDC4C7D');
        $this->addSql('ALTER TABLE question DROP CONSTRAINT FK_B6F7494EB3FE509D');
        $this->addSql('ALTER TABLE result DROP CONSTRAINT FK_136AC113B3FE509D');
        $this->addSql('ALTER TABLE question DROP CONSTRAINT FK_B6F7494E99AE6FA3');
        $this->addSql('DROP TABLE app_user');
        $this->addSql('DROP TABLE choice');
        $this->addSql('DROP TABLE company');
        $this->addSql('DROP TABLE multiple');
        $this->addSql('DROP TABLE question');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE result');
        $this->addSql('DROP TABLE survey');
        $this->addSql('DROP TABLE text_area');
    }
}
