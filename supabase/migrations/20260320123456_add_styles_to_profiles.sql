-- Adicionar coluna de estilos de dança aos perfis
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS styles text[] DEFAULT '{}';

-- Índice para pesquisa por estilo
CREATE INDEX IF NOT EXISTS idx_profiles_styles ON profiles USING gin(styles);