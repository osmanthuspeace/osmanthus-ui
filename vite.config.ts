import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      outDir: "dist",
      insertTypesEntry: true,
      rollupTypes: true, //将所有的类型合并到一个文件中
      tsconfigPath: "./tsconfig.app.json", //如果从vite模版开始则需要指定tsconfig路径
      include: ["src/**/*"],
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      filename: "stats.html",
    }),
  ],
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        unused: true,
      },
    },
    lib: {
      entry: "src/index.ts",
      name: "OsmanthusUI",
      formats: ["es"],
      fileName: (format) => `osmanthus-ui.${format}.js`,
    },
    sourcemap: true,
    minify: "terser",
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        compact: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
