INSERT INTO Users (username, email, password_hash, role)
VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner'), 
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'), 
('doglover69', 'doglover@example.com', 'hashed321', 'owner'),
('bob2', 'bob2@example.com', 'hashed222', 'owner');

INSERT INTO Dogs (name, size, owner_id)
VALUES ('Max', 'medium', (SELECT user_id FROM Users WHERE username = 'alice123')),
('Bella', 'small', (SELECT user_id FROM Users WHERE username = 'carol123')),
('Dawg', 'large', (SELECT user_id FROM Users WHERE username = 'doglover69')),
('TheDawg', 'small', (SELECT user_id FROM Users WHERE username = 'bob2')),
('Zane', 'medium', (SELECT user_id FROM Users WHERE username = 'doglover69'));

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'Dawg'), '2025-06-11 04:00:00', 69, 'Glenelg', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'TheDawg'), '2025-06-12 04:00:00', 420, 'North Tce', 'completed'),
((SELECT dog_id FROM Dogs WHERE name = 'Zane'), '2025-06-13 06:00:00', 40, 'Port Noarlunga', 'cancelled');