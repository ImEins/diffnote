module.exports = {
  lawdesk: {
    input: "http://localhost:8000/api/openapi",

    output: {
      mode: "single",
      client: "react-query",
      target: "src/gen/endpoints",
      schemas: "src/gen/models",
      baseUrl: "http://localhost:8000",
      override: {
        mutator: {
          path: "./src/lib/axios.ts",
          name: "api",
        },
      },
    },
  },
  lawdeskZod: {
    input: "http://localhost:8000/api/openapi",
    output: {
      mode: "single",
      client: "zod",
      target: "src/gen/endpoints",
      fileExtension: ".zod.ts",
    },
  },
};
