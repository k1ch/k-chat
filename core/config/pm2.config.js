module.exports = {
  apps: [{
    name: "k-chat",
    script: "./src/app.js",
    watch: ['src'],
    watch_delay: 2000,
    max_memory_restart: "100M",
    instances: 1,
    exec_mode: "cluster",
    node_args: [
      "--inspect=0.0.0.0:9000"
    ],
    env: {
      "NODE_CONFIG_DIR": __dirname
    }
  }]
}
