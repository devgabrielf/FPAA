<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Select from 'svelte-select';

	type SelectProps = ComponentProps<Select>;

	type $$Props = SelectProps & {
		name: string;
		label?: string;
		value: SelectType;
		error?: string;
		className?: string;
		selectClass?: string;
		slots?: {
			empty?: string;
		};
	};

	type SelectType =
		| {
				value: string;
				label: string;
		  }
		| undefined;

	export let name: string;
	export let label: string = '';
	export let value: SelectType;
	export let error: string = '';
	export let selectClass: string = '';
	export let className: string = '';
</script>

<div class="flex flex-col {className}">
	{#if label}
		<label for={name} class="mb-2 text-lg">{label}</label>
	{/if}
	<Select
		id={name}
		{name}
		{value}
		on:change={({ detail }) => (value = detail)}
		on:clear={() => (value = undefined)}
		class={selectClass}
		{...$$restProps}
		><div slot="empty" class="p-4 text-center text-zinc-400"><slot name="empty" /></div></Select
	>
	{#if error}
		<span class="text-sm text-red-500">{error}</span>
	{/if}
</div>

<style lang="postcss">
	:global(.svelte-select.focused) {
		border-color: rgb(59, 130, 246) !important;
	}

	:global(.svelte-select-list div.active) {
		background: rgb(59, 130, 246) !important;
	}

	:global(.svelte-select-list div:not(.active).hover) {
		background: rgb(240, 240, 243) !important;
	}

	:global(.clear-select) {
		cursor: pointer !important;
	}
</style>
