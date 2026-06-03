-- Seed initial data for Aquila Plumbing
-- Run this in Supabase Dashboard → SQL Editor after the main schema

-- 1. Default tenant (single-business setup)
insert into tenants (name, slug, email, subscription_plan, subscription_status) values
  ('Aquila Plumbing', 'aquila', 'nathan.fish.hk@gmail.com', 'free', 'active')
on conflict (slug) do nothing;

-- 2. Default services
insert into services (name, description, base_price, duration_minutes, is_active) values
  ('Emergency Repair', 'Burst pipes, leaks, urgent fixes handled fast', 150, 60, true),
  ('Fixture Installation', 'Faucets, sinks, toilets, water heaters', 100, 90, true),
  ('Drain Cleaning', 'Professional drain unclogging and maintenance', 80, 45, true),
  ('Bathroom Remodeling', 'Complete bathroom renovations with modern fixtures', 500, 240, true),
  ('Pipe Replacement', 'Replace old or damaged pipes with modern solutions', 200, 180, true),
  ('Maintenance Check', 'Regular plumbing inspections to prevent costly repairs', 75, 60, true)
on conflict do nothing;

-- 3. Link the first signed-up user as owner of the default tenant (if not already linked)
insert into tenant_members (tenant_id, user_id, role)
select t.id, auth.uid(), 'owner'
from tenants t
where t.slug = 'aquila'
  and not exists (
    select 1 from tenant_members tm
    where tm.tenant_id = t.id and tm.user_id = auth.uid()
  )
on conflict (tenant_id, user_id) do nothing;
