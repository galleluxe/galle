/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "galle-medusa",
      cwd: "/srv/galle/apps/medusa",
      script: "node_modules/.bin/medusa",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        NODE_OPTIONS: "--max-old-space-size=512",
      },
      max_memory_restart: "600M",
      error_file: "/var/log/galle/medusa-error.log",
      out_file: "/var/log/galle/medusa-out.log",
      merge_logs: true,
      autorestart: true,
      watch: false,
    },
    {
      name: "galle-medusa-worker",
      cwd: "/srv/galle/apps/medusa",
      script: "node_modules/.bin/medusa",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        MEDUSA_WORKER_MODE: "worker",
        NODE_OPTIONS: "--max-old-space-size=384",
      },
      max_memory_restart: "450M",
      error_file: "/var/log/galle/medusa-worker-error.log",
      out_file: "/var/log/galle/medusa-worker-out.log",
      merge_logs: true,
      autorestart: true,
      watch: false,
    },
  ],
};
