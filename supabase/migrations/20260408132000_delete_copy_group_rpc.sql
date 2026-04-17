-- RPC: delete a copy group (all configurations for a master account owned by requester)
-- and demote the master account back to slave when it no longer has any master relationships.

CREATE OR REPLACE FUNCTION public.delete_copy_group(
  p_master_account_id uuid,
  p_user_id uuid
)
RETURNS TABLE (deleted_count integer, demoted boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count integer := 0;
  v_demoted boolean := false;
BEGIN
  -- Hard auth guard: caller can only act on their own user id.
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized request';
  END IF;

  -- Ensure the master account belongs to the requester.
  IF NOT EXISTS (
    SELECT 1
    FROM public.trading_accounts ta
    WHERE ta.id = p_master_account_id
      AND ta.user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Master account not found for this user';
  END IF;

  -- Delete all links for this master account under this user.
  WITH deleted AS (
    DELETE FROM public.copy_configurations cc
    WHERE cc.user_id = p_user_id
      AND cc.master_account_id = p_master_account_id
    RETURNING 1
  )
  SELECT count(*)::int INTO v_deleted_count FROM deleted;

  -- If no remaining group keeps this account as master, demote to slave.
  IF NOT EXISTS (
    SELECT 1
    FROM public.copy_configurations cc
    WHERE cc.user_id = p_user_id
      AND cc.master_account_id = p_master_account_id
    LIMIT 1
  ) THEN
    UPDATE public.trading_accounts
    SET account_type = 'slave'
    WHERE id = p_master_account_id
      AND user_id = p_user_id;
    v_demoted := true;
  END IF;

  RETURN QUERY SELECT v_deleted_count, v_demoted;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_copy_group(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_copy_group(uuid, uuid) TO authenticated;

COMMENT ON FUNCTION public.delete_copy_group(uuid, uuid) IS
  'Deletes all copy_configurations rows for (user_id, master_account_id) and demotes master to slave if no remaining master links.';
