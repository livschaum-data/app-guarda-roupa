create table if not exists public.wardrobe_sync (
    user_id uuid primary key references auth.users(id) on delete cascade,
    historico jsonb not null default '[]'::jsonb,
    looks_favoritos jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now()
);

alter table public.wardrobe_sync enable row level security;

drop policy if exists "Usuários leem os próprios dados" on public.wardrobe_sync;
create policy "Usuários leem os próprios dados"
on public.wardrobe_sync
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Usuários criam os próprios dados" on public.wardrobe_sync;
create policy "Usuários criam os próprios dados"
on public.wardrobe_sync
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Usuários atualizam os próprios dados" on public.wardrobe_sync;
create policy "Usuários atualizam os próprios dados"
on public.wardrobe_sync
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
