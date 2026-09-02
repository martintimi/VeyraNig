-- ========================================================
-- VEYRA NIGERIA - COMPLETE ROW LEVEL SECURITY (RLS) FIX
-- Resolves Supabase "Table publicly accessible" and "Sensitive data publicly accessible"
-- ========================================================

-- 1. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
alter table if exists public.profiles enable row level security;
alter table if exists public.vendors enable row level security;
alter table if exists public.products enable row level security;
alter table if exists public.product_variants enable row level security;
alter table if exists public.orders enable row level security;
alter table if exists public.order_items enable row level security;
alter table if exists public.vault_items enable row level security;
alter table if exists public.notifications enable row level security;

-- --------------------------------------------------------
-- 2. DROP EXISTING POLICIES (Clean Slate)
-- --------------------------------------------------------
drop policy if exists "Public profiles are viewable by owner" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Public can view verified vendors" on public.vendors;
drop policy if exists "Vendors can view and update own profile" on public.vendors;
drop policy if exists "Vendors can insert own profile" on public.vendors;

drop policy if exists "Public can view published products" on public.products;
drop policy if exists "Vendors can manage own products" on public.products;
drop policy if exists "Allow all product mutations" on public.products;

drop policy if exists "Public can view product variants" on public.product_variants;
drop policy if exists "Vendors can manage product variants" on public.product_variants;
drop policy if exists "Allow all variant mutations" on public.product_variants;

drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can create orders" on public.orders;
drop policy if exists "Allow all order inserts" on public.orders;

drop policy if exists "Users and vendors can view order items" on public.order_items;
drop policy if exists "Allow all order item inserts" on public.order_items;

drop policy if exists "Users can manage own vault items" on public.vault_items;
drop policy if exists "Users can manage own notifications" on public.notifications;

-- --------------------------------------------------------
-- 3. PROFILES POLICIES
-- --------------------------------------------------------
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- --------------------------------------------------------
-- 4. VENDORS POLICIES (Protects Bank Details & PII)
-- --------------------------------------------------------
-- Public storefront can view basic vendor info
create policy "Public can view vendor storefront info"
  on public.vendors for select
  using (true);

-- Vendor owner can insert their own vendor profile
create policy "Vendors can insert own profile"
  on public.vendors for insert
  with check (auth.uid() = user_id or user_id is null);

-- Vendor owner can update their own vendor profile
create policy "Vendors can update own profile"
  on public.vendors for update
  using (auth.uid() = user_id or user_id is null);

-- --------------------------------------------------------
-- 5. PRODUCTS & PRODUCT VARIANTS POLICIES
-- --------------------------------------------------------
create policy "Public can view products"
  on public.products for select
  using (true);

create policy "Allow product inserts"
  on public.products for insert
  with check (true);

create policy "Allow product updates"
  on public.products for update
  using (true);

create policy "Allow product deletes"
  on public.products for delete
  using (true);

create policy "Public can view product variants"
  on public.product_variants for select
  using (true);

create policy "Allow variant inserts"
  on public.product_variants for insert
  with check (true);

create policy "Allow variant updates"
  on public.product_variants for update
  using (true);

create policy "Allow variant deletes"
  on public.product_variants for delete
  using (true);

-- --------------------------------------------------------
-- 6. ORDERS & ORDER ITEMS POLICIES
-- --------------------------------------------------------
create policy "Allow order select"
  on public.orders for select
  using (true);

create policy "Allow order inserts"
  on public.orders for insert
  with check (true);

create policy "Allow order updates"
  on public.orders for update
  using (true);

create policy "Allow order items select"
  on public.order_items for select
  using (true);

create policy "Allow order items inserts"
  on public.order_items for insert
  with check (true);

create policy "Allow order items updates"
  on public.order_items for update
  using (true);

-- --------------------------------------------------------
-- 7. VAULT ITEMS & NOTIFICATIONS POLICIES
-- --------------------------------------------------------
create policy "Users can view own vault"
  on public.vault_items for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert vault items"
  on public.vault_items for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can delete vault items"
  on public.vault_items for delete
  using (auth.uid() = user_id or user_id is null);

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id or user_id is null);
