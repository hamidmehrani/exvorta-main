import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "payload-types.ts",
      "scripts/**/*",
      "migrations/**/*",
      ".next/**/*",
      "chunks-before/**/*",
      "chunks-after/**/*",
      "*.js"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // CMS templates heavily rely on generic polymorphic types and partial data structures from Payload.
      "@typescript-eslint/no-explicit-any": "off",
      
      // Auto-generated Payload types and dynamic Next.js layouts often enforce unused prop declarations.
      "@typescript-eslint/no-unused-vars": "off",
      
      // GSAP and Framer Motion often rely on DOM refs inside hooks where updating deps causes infinite loops or double-mounting.
      "react-hooks/exhaustive-deps": "off",
      
      // Apostrophes in CMS fallback content shouldn't fail build.
      "react/no-unescaped-entities": "off",
      
      // forwardRef wrappers in custom UI components.
      "react/display-name": "off",
      
      // Generic component props often start as empty objects in this boilerplate.
      "@typescript-eslint/no-empty-object-type": "off"
    }
  }
];

export default eslintConfig;
