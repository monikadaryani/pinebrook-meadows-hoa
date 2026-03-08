-- Pine Brook Meadows HOA — Schema change: add other_email column
-- Run this FIRST in Supabase Dashboard → SQL Editor, before homeowners.sql

-- 1. Add other_email column
ALTER TABLE public.homeowners ADD COLUMN IF NOT EXISTS other_email text;

-- 2. Update is_registered_homeowner to check both emails
CREATE OR REPLACE FUNCTION public.is_registered_homeowner(input_email text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.homeowners
    WHERE lower(email) = lower(input_email)
       OR lower(other_email) = lower(input_email)
  );
$$;
