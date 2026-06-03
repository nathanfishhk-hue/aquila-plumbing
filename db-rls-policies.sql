-- Enable RLS on all tables
alter table tenants enable row level security;
alter table profiles enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table availability enable row level security;
alter table reviews enable row level security;
alter table tenant_members enable row level security;
alter table notifications enable row level security;
alter table payment_methods enable row level security;

-- TENANTS: authenticated users can read tenants; owner can manage their tenant
create policy "Tenants readable by authenticated" on tenants for select to authenticated using (true);
create policy "Tenants insertable by authenticated" on tenants for insert to authenticated with check (true);
create policy "Tenants updatable by owner" on tenants for update to authenticated using (
  exists (select 1 from tenant_members where tenant_members.tenant_id = tenants.id and tenant_members.user_id = auth.uid() and tenant_members.role = 'owner')
);
create policy "Tenants deletable by owner" on tenants for delete to authenticated using (
  exists (select 1 from tenant_members where tenant_members.tenant_id = tenants.id and tenant_members.user_id = auth.uid() and tenant_members.role = 'owner')
);

-- PROFILES: users manage own profile; tenant members see each other
create policy "Profiles view own" on profiles for select to authenticated using (auth.uid() = id);
create policy "Profiles view tenant members" on profiles for select to authenticated using (
  exists (select 1 from tenant_members tm where tm.user_id = profiles.id and tm.tenant_id in (
    select tenant_id from tenant_members where user_id = auth.uid()
  ))
);
create policy "Profiles insert on signup" on profiles for insert to authenticated with check (auth.uid() = id);
create policy "Profiles update own" on profiles for update to authenticated using (auth.uid() = id);

-- SERVICES: public can read active; tenant owner/admin manage
create policy "Services public read active" on services for select using (is_active = true);
create policy "Services tenant manage" on services for all to authenticated using (
  exists (select 1 from tenant_members where tenant_members.tenant_id = services.tenant_id and tenant_members.user_id = auth.uid() and tenant_members.role in ('owner', 'admin'))
);

-- BOOKINGS: users see own; plumbers see assigned; tenant-based management
create policy "Bookings view own" on bookings for select to authenticated using (user_id = auth.uid());
create policy "Bookings view as plumber" on bookings for select to authenticated using (
  plumber_id in (select id from profiles where id = auth.uid() and role = 'plumber')
);
create policy "Bookings view tenant" on bookings for select to authenticated using (
  exists (select 1 from tenant_members where tenant_members.tenant_id = bookings.tenant_id and tenant_members.user_id = auth.uid())
);
create policy "Bookings insert authenticated" on bookings for insert to authenticated with check (user_id = auth.uid());
create policy "Bookings update tenant staff" on bookings for update to authenticated using (
  exists (select 1 from tenant_members where tenant_members.tenant_id = bookings.tenant_id and tenant_members.user_id = auth.uid() and tenant_members.role in ('owner', 'admin', 'plumber'))
);

-- AVAILABILITY: plumbers manage own; tenant reads
create policy "Availability view tenant" on availability for select to authenticated using (
  exists (select 1 from tenant_members where tenant_members.tenant_id = availability.tenant_id and tenant_members.user_id = auth.uid())
);
create policy "Availability manage own" on availability for all to authenticated using (
  plumber_id in (select id from profiles where id = auth.uid() and role = 'plumber')
);

-- REVIEWS: booking user can read/write; tenant views
create policy "Reviews view booking user" on reviews for select to authenticated using (
  exists (select 1 from bookings where bookings.id = reviews.booking_id and bookings.user_id = auth.uid())
);
create policy "Reviews view tenant" on reviews for select to authenticated using (
  exists (select 1 from bookings join tenant_members on tenant_members.tenant_id = bookings.tenant_id where bookings.id = reviews.booking_id and tenant_members.user_id = auth.uid())
);
create policy "Reviews insert booking user" on reviews for insert to authenticated with check (
  exists (select 1 from bookings where bookings.id = reviews.booking_id and bookings.user_id = auth.uid())
);

-- TENANT_MEMBERS: tenant members see each other; owner manages
create policy "TenantMembers view own tenant" on tenant_members for select to authenticated using (
  exists (select 1 from tenant_members tm2 where tm2.tenant_id = tenant_members.tenant_id and tm2.user_id = auth.uid())
);
create policy "TenantMembers manage by owner" on tenant_members for all to authenticated using (
  exists (select 1 from tenant_members tm2 where tm2.tenant_id = tenant_members.tenant_id and tm2.user_id = auth.uid() and tm2.role = 'owner')
);

-- NOTIFICATIONS: plumbers see own; tenant staff see tenant notifications
create policy "Notifications view own" on notifications for select to authenticated using (
  plumber_id in (select id from profiles where id = auth.uid())
);
create policy "Notifications insert tenant staff" on notifications for insert to authenticated with check (
  exists (select 1 from tenant_members where tenant_members.tenant_id = notifications.tenant_id and tenant_members.user_id = auth.uid() and tenant_members.role in ('owner', 'admin'))
);
create policy "Notifications update own" on notifications for update to authenticated using (
  plumber_id in (select id from profiles where id = auth.uid())
);

-- PAYMENT_METHODS: users manage own
create policy "PaymentMethods view own" on payment_methods for select to authenticated using (
  profile_id in (select id from profiles where id = auth.uid())
);
create policy "PaymentMethods manage own" on payment_methods for all to authenticated using (
  profile_id in (select id from profiles where id = auth.uid())
);
