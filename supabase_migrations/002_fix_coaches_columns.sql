-- Migration pour corriger les colonnes manquantes dans coaches
-- À exécuter dans Supabase SQL Editor

-- Ajouter facebook_page_id si manquant
ALTER TABLE public.coaches 
ADD COLUMN IF NOT EXISTS facebook_page_id TEXT;

-- Ajouter access_token si manquant (stockage token Instagram/Facebook)
ALTER TABLE public.coaches 
ADD COLUMN IF NOT EXISTS access_token TEXT;

-- Ajouter token_expires_at si manquant
ALTER TABLE public.coaches 
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;

-- Refresh le schema cache PostgREST
NOTIFY pgrst, 'reload schema';
