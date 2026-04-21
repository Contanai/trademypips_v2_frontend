-- Keep account_type aligned with actual copy-group ownership after link deletions.
-- This is especially important when a copier account is removed and its links
-- are cascade-deleted from copy_configurations.

CREATE OR REPLACE FUNCTION public.reconcile_master_role_after_copy_link_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the previous master account no longer has any copier links,
  -- demote it back to copier/slave.
  IF OLD.master_account_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.copy_configurations cc
      WHERE cc.master_account_id = OLD.master_account_id
      LIMIT 1
    ) THEN
      UPDATE public.trading_accounts ta
      SET account_type = 'slave'
      WHERE ta.id = OLD.master_account_id
        AND ta.account_type = 'master';
    END IF;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_reconcile_master_role_after_copy_link_delete ON public.copy_configurations;

CREATE TRIGGER trg_reconcile_master_role_after_copy_link_delete
AFTER DELETE ON public.copy_configurations
FOR EACH ROW
EXECUTE FUNCTION public.reconcile_master_role_after_copy_link_delete();

COMMENT ON FUNCTION public.reconcile_master_role_after_copy_link_delete() IS
  'Demotes a master account to slave when its final copy_configurations link is removed.';
