<template>
  <div class="flex flex-1 flex-col items-center justify-center bg-section px-4 py-10">
    <div class="w-full max-w-sm rounded-2xl border border-accent-border/30 bg-white p-8 shadow-sm">
      <img
        src="/fmp-logo.png"
        alt="FMP — Faculdade Municipal de Palhoça"
        width="180"
        height="36"
        class="mb-6 h-8 w-auto"
      />
      <h1 class="mb-1 text-xl font-bold text-secondary">Área do professor</h1>
      <p class="mb-6 text-sm text-slate-500">
        Entre com seu e-mail e senha para gerenciar itens e tags.
      </p>
      <AuthLoginForm />
    </div>
  </div>
</template>
