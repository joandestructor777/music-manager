-- =========================================
-- BANDAS
-- =========================================

INSERT INTO bandas (nombre, genero, descripcion)
VALUES
('Arctic Monkeys', 'Indie Rock', 'Banda británica de indie rock formada en Sheffield.'),
('Tame Impala', 'Psychedelic Rock', 'Proyecto musical australiano liderado por Kevin Parker.'),
('Pink Floyd', 'Rock Progresivo', 'Banda británica reconocida por su rock progresivo y psicodélico.'),
('The Strokes', 'Indie Rock', 'Banda estadounidense de rock alternativo formada en Nueva York.'),
('Radiohead', 'Alternative Rock', 'Banda británica conocida por su rock experimental y alternativo.'),
('The Beatles', 'Rock', 'Banda británica considerada una de las más influyentes de la historia.'),
('Nirvana', 'Grunge', 'Banda estadounidense fundamental para el movimiento grunge de los años 90.'),
('The Cure', 'Post-Punk', 'Banda británica conocida por su sonido oscuro y atmosférico.'),
('Mac DeMarco', 'Indie Rock', 'Músico canadiense reconocido por su estilo indie y psicodélico.'),
('King Gizzard & The Lizard Wizard', 'Psychedelic Rock', 'Banda australiana conocida por su experimentación y gran variedad de estilos.');

-- =========================================
-- CANCIONES
-- =========================================

INSERT INTO canciones (titulo, duracion, album, banda_id)
VALUES

-- Arctic Monkeys
('Do I Wanna Know?', '4:32', 'AM', 1),
('R U Mine?', '3:21', 'AM', 1),
('Arabella', '3:27', 'AM', 1),
('505', '4:13', 'Favourite Worst Nightmare', 1),
('Fluorescent Adolescent', '2:57', 'Favourite Worst Nightmare', 1),

-- Tame Impala
('The Less I Know the Better', '3:36', 'Currents', 2),
('Borderline', '3:58', 'The Slow Rush', 2),
('Let It Happen', '7:46', 'Currents', 2),
('Feels Like We Only Go Backwards', '3:12', 'Lonerism', 2),
('Elephant', '3:31', 'Lonerism', 2),

-- Pink Floyd
('Comfortably Numb', '6:23', 'The Wall', 3),
('Time', '7:05', 'The Dark Side of the Moon', 3),
('Money', '6:22', 'The Dark Side of the Moon', 3),
('Wish You Were Here', '5:34', 'Wish You Were Here', 3),
('Shine On You Crazy Diamond', '13:31', 'Wish You Were Here', 3),

-- The Strokes
('Last Nite', '3:13', 'Is This It', 4),
('Reptilia', '3:39', 'Room on Fire', 4),
('Someday', '3:07', 'Is This It', 4),
('Hard to Explain', '3:47', 'Is This It', 4),
('Under Cover of Darkness', '3:57', 'Angles', 4),

-- Radiohead
('Creep', '3:56', 'Pablo Honey', 5),
('Karma Police', '4:21', 'OK Computer', 5),
('No Surprises', '3:48', 'OK Computer', 5),
('Paranoid Android', '6:23', 'OK Computer', 5),
('High and Dry', '4:17', 'The Bends', 5),

-- The Beatles
('Come Together', '4:20', 'Abbey Road', 6),
('Hey Jude', '7:11', 'Past Masters', 6),
('Let It Be', '4:03', 'Let It Be', 6),
('Something', '3:03', 'Abbey Road', 6),
('Yesterday', '2:05', 'Help!', 6),

-- Nirvana
('Smells Like Teen Spirit', '5:01', 'Nevermind', 7),
('Come as You Are', '3:39', 'Nevermind', 7),
('Lithium', '4:17', 'Nevermind', 7),
('Heart-Shaped Box', '4:41', 'In Utero', 7),
('About a Girl', '2:48', 'Bleach', 7),

-- The Cure
('Boys Don''t Cry', '2:49', 'Three Imaginary Boys', 8),
('Just Like Heaven', '3:45', 'Kiss Me, Kiss Me, Kiss Me', 8),
('Friday I''m in Love', '3:41', 'Wish', 8),
('Lovesong', '3:29', 'Disintegration', 8),

-- Mac DeMarco
('Chamber of Reflection', '3:51', 'Salad Days', 9),
('My Kind of Woman', '3:11', '2', 9),
('Freaking Out the Neighborhood', '2:54', '2', 9),
('Ode to Viceroy', '3:55', '2', 9),

-- King Gizzard & The Lizard Wizard
('Rattlesnake', '7:48', 'Flying Microtonal Banana', 10),
('Gamma Knife', '4:21', 'Nonagon Infinity', 10),
('Robot Stop', '5:22', 'Nonagon Infinity', 10),
('The River', '10:10', 'Quarters!', 10);

-- =========================================
-- INTEGRANTES
-- =========================================

INSERT INTO integrantes (nombre, rol, anio_ingreso, banda_id)
VALUES

-- Arctic Monkeys
('Alex Turner', 'Voz y Guitarra', 2002, 1),
('Jamie Cook', 'Guitarra', 2002, 1),
('Nick O''Malley', 'Bajo', 2006, 1),
('Matt Helders', 'Batería', 2002, 1),

-- Tame Impala
('Kevin Parker', 'Voz, Guitarra y Producción', 2007, 2),
('Dominic Simper', 'Guitarra y Sintetizador', 2007, 2),
('Jay Watson', 'Batería y Sintetizador', 2007, 2),
('Cam Avery', 'Bajo y Voz', 2012, 2),

-- Pink Floyd
('David Gilmour', 'Guitarra y Voz', 1968, 3),
('Roger Waters', 'Bajo y Voz', 1965, 3),
('Nick Mason', 'Batería', 1965, 3),
('Richard Wright', 'Teclados y Voz', 1965, 3),

-- The Strokes
('Julian Casablancas', 'Voz', 1998, 4),
('Nick Valensi', 'Guitarra', 1998, 4),
('Albert Hammond Jr.', 'Guitarra', 1998, 4),
('Nikolai Fraiture', 'Bajo', 1998, 4),
('Fabrizio Moretti', 'Batería', 1998, 4),

-- Radiohead
('Thom Yorke', 'Voz y Guitarra', 1985, 5),
('Jonny Greenwood', 'Guitarra y Teclados', 1985, 5),
('Colin Greenwood', 'Bajo', 1985, 5),
('Ed O''Brien', 'Guitarra', 1985, 5),
('Philip Selway', 'Batería', 1985, 5),

-- The Beatles
('John Lennon', 'Voz y Guitarra', 1960, 6),
('Paul McCartney', 'Voz y Bajo', 1960, 6),
('George Harrison', 'Guitarra', 1960, 6),
('Ringo Starr', 'Batería', 1962, 6),

-- Nirvana
('Kurt Cobain', 'Voz y Guitarra', 1987, 7),
('Krist Novoselic', 'Bajo', 1987, 7),
('Dave Grohl', 'Batería', 1990, 7),

-- The Cure
('Robert Smith', 'Voz y Guitarra', 1976, 8),
('Simon Gallup', 'Bajo', 1979, 8),
('Roger O''Donnell', 'Teclados', 1987, 8),
('Jason Cooper', 'Batería', 1995, 8),

-- Mac DeMarco
('Mac DeMarco', 'Voz, Guitarra y Producción', 2010, 9),
('Andy White', 'Batería', 2012, 9),
('Pierce McGarry', 'Bajo', 2012, 9),

-- King Gizzard & The Lizard Wizard
('Stu Mackenzie', 'Voz y Guitarra', 2010, 10),
('Ambrose Kenny-Smith', 'Armónica y Voz', 2010, 10),
('Cook Craig', 'Guitarra', 2010, 10),
('Lucas Skinner', 'Bajo', 2010, 10),
('Michael Cavanagh', 'Batería', 2010, 10);
