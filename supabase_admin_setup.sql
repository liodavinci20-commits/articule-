-- =============================================================
-- SUPABASE ADMIN SETUP — Articule +
-- Colle tout ce fichier dans Supabase > SQL Editor > New query
-- puis clique sur Run
-- =============================================================


-- -------------------------------------------------------------
-- ÉTAPE 1 : Table admins
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_self_read" ON admins
  FOR SELECT USING (user_id = auth.uid());


-- -------------------------------------------------------------
-- ÉTAPE 2 : RLS sur profiles — l'admin peut lire tous les profils
-- -------------------------------------------------------------
CREATE POLICY "admin_read_all_profiles" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );


-- -------------------------------------------------------------
-- ÉTAPE 3 : RLS sur progress — l'admin peut lire toute la progression
-- -------------------------------------------------------------
CREATE POLICY "admin_read_all_progress" ON progress
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );


-- -------------------------------------------------------------
-- ÉTAPE 4 : Fonction — récupérer tous les utilisateurs + progression
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_users_with_progress()
RETURNS TABLE (
  user_id                  UUID,
  prenom                   TEXT,
  email                    TEXT,
  created_at               TIMESTAMPTZ,
  stars                    INT,
  completed_phonemes_count INT,
  syllables_viewed_count   INT,
  words_viewed_count       INT,
  breath_cycles            INT,
  earned_badges_count      INT
)
SECURITY DEFINER
LANGUAGE sql AS $$
  SELECT
    p.id,
    p.prenom,
    u.email,
    u.created_at,
    COALESCE(pr.stars, 0),
    COALESCE(array_length(pr.completed_phonemes, 1), 0),
    COALESCE(array_length(pr.syllables_viewed,   1), 0),
    COALESCE(array_length(pr.words_viewed,       1), 0),
    COALESCE(pr.breath_cycles, 0),
    COALESCE(array_length(pr.earned_badges,      1), 0)
  FROM profiles p
  JOIN auth.users u ON u.id = p.id
  LEFT JOIN progress pr ON pr.user_id = p.id
  WHERE EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  ORDER BY u.created_at DESC;
$$;


-- -------------------------------------------------------------
-- ÉTAPE 5 : Fonction — supprimer un utilisateur (admin seulement)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION delete_user_by_admin(target_id UUID)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Non autorisé';
  END IF;
  DELETE FROM auth.users WHERE id = target_id;
END;
$$;


-- -------------------------------------------------------------
-- ÉTAPE 6 : Fonction — lister tous les admins
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_all_admins()
RETURNS TABLE (user_id UUID, email TEXT, created_at TIMESTAMPTZ)
SECURITY DEFINER
LANGUAGE sql AS $$
  SELECT a.user_id, u.email, a.created_at
  FROM admins a
  JOIN auth.users u ON u.id = a.user_id
  WHERE EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  ORDER BY a.created_at ASC;
$$;


-- -------------------------------------------------------------
-- ÉTAPE 7 : Fonction — nommer un admin par UUID (clic direct)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION grant_admin(target_id UUID)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Non autorisé';
  END IF;
  INSERT INTO admins (user_id) VALUES (target_id) ON CONFLICT DO NOTHING;
END;
$$;


-- -------------------------------------------------------------
-- ÉTAPE 8 : Fonction — retirer les droits admin
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION revoke_admin(target_id UUID)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Non autorisé';
  END IF;
  IF target_id = auth.uid() THEN
    RAISE EXCEPTION 'Impossible de retirer vos propres droits admin';
  END IF;
  DELETE FROM admins WHERE user_id = target_id;
END;
$$;


-- -------------------------------------------------------------
-- ÉTAPE 9 : Ton compte admin (UUID déjà rempli)
-- -------------------------------------------------------------
INSERT INTO admins (user_id)
VALUES ('8eaf1c0d-d537-4f72-a4e9-ab614c1ec10b')
ON CONFLICT DO NOTHING;
