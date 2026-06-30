module.exports = {
  apps: [
    {
      name: "skku-backend",
      cwd: "/var/www/MiniProject/backend",
      script: "app.js",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "skku-frontend",
      cwd: "/var/www/MiniProject/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};