DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS black_list;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(15) NOT NULL UNIQUE,
    password  VARCHAR(20) NOT NULL,
    role VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS black_list(
    token VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rooms(
    id SERIAL PRIMARY KEY
);

INSERT INTO users(username, password,role)
    VALUES
        ('cfabrica46',      '01234',        'member'),
        ('arthurnavah',     '12345',        'member'),
        ('carlos',          'abcd',         'member'),
        ('luis',            'lolsito123',   'member');
