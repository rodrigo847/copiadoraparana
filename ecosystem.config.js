module.exports = {
  apps: [
    {
      name: "copiadora-parana-laser",
      script: "npm",
      args: "start",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Restart policy
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      
      // Error and output logs
      error_file: "/var/log/pm2/copiadora-error.log",
      out_file: "/var/log/pm2/copiadora-out.log",
      log_file: "/var/log/pm2/copiadora-combined.log",
      time: true,

      // Auto-restart on file changes (development only)
      watch: false,
      ignore_watch: ["node_modules", ".next", "public"],

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: false,
    },
  ],

  // Deploy configuration
  deploy: {
    production: {
      user: "root", // Change to your Hostinger user
      host: "your-server-ip", // Change to your Hostinger server IP
      ref: "origin/main",
      repo: "your-github-repo", // Optional: if using Git
      path: "/home/username/copiadora-parana-laser", // Change path as needed
      "post-deploy":
        "npm ci && npm run build && pm2 restart ecosystem.config.js --env production",
    },
  },
};
