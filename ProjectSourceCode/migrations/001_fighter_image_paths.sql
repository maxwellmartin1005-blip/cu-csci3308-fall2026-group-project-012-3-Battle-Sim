BEGIN;

-- Run once on an existing BYTEA database; fresh databases use init_data.
-- Binary image data that is not a UTF-8 path causes a rollback, preserving it.
ALTER TABLE fighters ALTER COLUMN image TYPE TEXT USING convert_from(image, 'UTF8');

UPDATE fighters SET image = CASE name
    WHEN 'The Generic One, Master of None' THEN '/images/Generic.png'
    WHEN 'Speedster the Living Rapid' THEN '/images/water.png'
    WHEN 'Golem Earth''s protector' THEN '/images/earth.png'
    WHEN 'Druid of the Swift Weeds' THEN '/images/grass.png'
    WHEN 'Inferno the Ash Bringer' THEN '/images/fire.png'
    WHEN 'Seraphin of Purification' THEN '/images/Light.png'
    WHEN 'Abyssal Trickster' THEN '/images/shadow.png'
    ELSE image
END
WHERE creator_id = 0 AND image IS NULL;

COMMIT;
