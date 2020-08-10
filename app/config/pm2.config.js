module.exports = {
  apps: [{
    name: "k-chat",
    script: "./build/src/app.js",
    watch: ['./build'],
    instance_var: "INSTANCE_ID",
    source_map_support: true,
    watch_delay: 2000,
    max_memory_restart: "100M",
    instances: 1,
    exec_mode: process.env.NODE_ENV === 'production' ? "cluster" : "fork",
    node_args: [
      "--inspect=0.0.0.0:9229"
    ],
    env: {
      "NODE_CONFIG_DIR": __dirname
    }
  }]
}