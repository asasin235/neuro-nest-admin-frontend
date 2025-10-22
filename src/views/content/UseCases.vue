<template>
  <div class="view-placeholder">
    <h1>Use Cases Management</h1>
    <p class="coming-soon">Coming Soon - Use template from Solutions.vue</p>
    <div class="instructions">
      <h3>Implementation Instructions:</h3>
      <ol>
        <li>Copy <code>Solutions.vue</code> as template</li>
        <li>Update API imports to use <code>use-cases.ts</code></li>
        <li>Update TypeScript types to <code>UseCase</code></li>
        <li>Modify form fields for use case entity</li>
        <li>See ADMIN_PANEL_IMPLEMENTATION_GUIDE.md for details</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Implement using Solutions.vue as template
</script>

<style scoped>
.view-placeholder {
  padding: 2rem;
  text-align: center;
}

.coming-soon {
  color: #64748b;
  font-size: 1.25rem;
  margin: 2rem 0;
}

.instructions {
  max-width: 600px;
  margin: 2rem auto;
  text-align: left;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 8px;
}

.instructions h3 {
  margin-bottom: 1rem;
}

.instructions ol {
  margin-left: 1.5rem;
}

.instructions li {
  margin-bottom: 0.5rem;
}

code {
  background: #e2e8f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>

