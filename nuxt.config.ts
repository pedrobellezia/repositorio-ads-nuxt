import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxtjs/supabase"],

  supabase: {
    // A proteção de rotas é feita à mão em app/middleware/auth.global.ts,
    // pra bater exatamente com o comportamento do middleware do projeto Next.
    redirect: false,
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      mockTrue: process.env.NUXT_PUBLIC_MOCK_TRUE === "true",
    },
  },

  app: {
    head: {
      title: "Repositório Acadêmico ADS",
      htmlAttrs: { lang: "pt-BR" },
      meta: [
        {
          name: "description",
          content: "Repositório de links e documentos do curso de ADS da FMP.",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/fmp-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
});
