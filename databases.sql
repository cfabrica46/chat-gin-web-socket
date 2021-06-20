CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS black_list(
    token TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rooms(
    id INTEGER PRIMARY KEY
);

INSERT INTO users(username, password,role)
    VALUES
        ('cfabrica46',  '01234',        'member'),
        ('arturo',      '12345',        'member'),
        ('carlos',      'abcd',         'member'),
        ('luis',        'lolsito123',   'member');

