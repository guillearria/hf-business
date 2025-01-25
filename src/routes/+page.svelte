<script lang="ts">
	import { onMount } from 'svelte';

	let models: any[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/models');
			if (!response.ok) throw new Error('Failed to fetch models');
			models = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Hugging Face for Business</title>
</svelte:head>

<main class="container">
	<h1>Welcome to Hugging Face for Business</h1>
	
	{#if loading}
		<p>Loading models...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else}
		<div class="models-grid">
			{#each models as model}
				<div class="model-card">
					<h3>{model.name}</h3>
					<p>{model.description}</p>
				</div>
			{/each}
		</div>
	{/if}
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #2d3748;
		text-align: center;
		margin-bottom: 2rem;
	}

	.models-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.model-card {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.error {
		color: #e53e3e;
		text-align: center;
	}
</style>
