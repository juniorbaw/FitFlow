-- P1.2: Nettoyer les leads fantômes
DELETE FROM leads WHERE username IS NULL OR username = '' OR TRIM(username) = '';

-- Ajouter une contrainte pour éviter ça à l'avenir
ALTER TABLE leads 
ADD CONSTRAINT username_not_empty 
CHECK (username IS NOT NULL AND TRIM(username) != '');
