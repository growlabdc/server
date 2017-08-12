module.exports = {
  apps: [{
    name: 'growlab',
    script: './index.js',
    ignore_watch: ['./alerts.log', './state.json'],
    max_memory_restart: '80M',
    watch: true
  }]
}
