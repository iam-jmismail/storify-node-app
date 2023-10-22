module.exports = {
  apps: [
    {
      name: "Storify-APP",
      script: "node app.js",
      // args: "--respawn --transpile-only -r tsconfig-paths/register ./src/app.ts",
      watch: ["src"], // Watch for changes in the current directory and the 'src' directory
      ignore_watch: ["node_modules", "uploads"], // Ignore changes in the 'node_modules' and 'client' directories
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
