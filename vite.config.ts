import { defineConfig } from "vite";
import { apiPrefix } from "./shared/api.ts";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    proxy: {
      [apiPrefix]: "http://127.0.0.1:5174",
    },
  },
});
