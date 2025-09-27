CREATE OR REPLACE FUNCTION sensor_upsert(p_tag text, p_unit text, p_source jsonb)
RETURNS sensors AS $$
DECLARE rec sensors%ROWTYPE;
BEGIN
  INSERT INTO sensors(tag, unit, source)
  VALUES (p_tag, p_unit, p_source)
  ON CONFLICT (tag)
  DO UPDATE SET unit=EXCLUDED.unit, source=EXCLUDED.source
  RETURNING * INTO rec;
  RETURN rec;
END;
$$ LANGUAGE plpgsql;




