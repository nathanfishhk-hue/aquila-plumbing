-- Notifications table
create table notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id),
  plumber_id uuid references profiles(id) not null,
  booking_id uuid references bookings(id),
  title text not null,
  message text not null,
  type text not null check (type in ('urgent', 'schedule', 'payment', 'general')),
  read boolean default false,
  sent_at timestamp default now(),
  created_at timestamp default now()
);

create index idx_notifications_plumber on notifications(plumber_id);
create index idx_notifications_unread on notifications(plumber_id, read);

-- Payment methods table
create table payment_methods (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) not null,
  type text not null check (type in ('credit_card', 'bank_transfer', 'bitcoin')),
  provider text,
  details jsonb,
  is_default boolean default false,
  is_active boolean default true,
  created_at timestamp default now()
);

create index idx_payment_methods_profile on payment_methods(profile_id);
create unique index idx_payment_methods_default on payment_methods(profile_id) where is_default = true;
-- Insert sample plumbers
insert into profiles (id, full_name, role) values
('plumber-1', 'John Doe', 'plumber'),
('plumber-2', 'Jane Smith', 'plumber'),
('plumber-3', 'Bob Johnson', 'plumber'),
('plumber-4', 'Alice Brown', 'plumber'),
('plumber-5', 'Charlie Wilson', 'plumber');
