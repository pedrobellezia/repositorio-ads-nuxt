<script setup lang="ts">
definePageMeta({ layout: "admin" });

type ProfessorRow = {
  id: string;
  email?: string;
  role: string;
  displayName?: string | null;
};

const { data: rows, refresh } = await useFetch<ProfessorRow[]>(
  "/api/admin/professors",
  { key: "admin-professors" },
);

const user = useSupabaseUser();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-heading font-bold text-secondary">Professores</h1>
      <p class="text-sm text-slate-500">
        Crie o acesso do professor com e-mail e uma senha inicial — repasse
        a senha a ele e peça para trocá-la no primeiro acesso.
      </p>
    </div>

    <AdminInviteProfessorForm @created="refresh" />

    <div class="space-y-2">
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex items-center justify-between gap-3 rounded-xl border border-accent-border/40 bg-surface p-3"
      >
        <div>
          <p class="text-sm font-medium text-secondary">
            {{ row.displayName || row.email }}
          </p>
          <p class="text-xs text-slate-500">{{ row.email }}</p>
        </div>
        <div class="flex items-center gap-3">
          <UiBadge :variant="row.role === 'admin' ? 'default' : 'secondary'">
            {{ row.role }}
          </UiBadge>
          <AdminUserActions
            v-if="row.id !== user?.sub"
            :user-id="row.id"
            @changed="refresh"
          />
        </div>
      </div>
    </div>
  </div>
</template>
