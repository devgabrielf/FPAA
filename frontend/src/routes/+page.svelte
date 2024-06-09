<script lang="ts">
	import { Plus, X } from "lucide-svelte";
	import { Field, SelectField } from "$components";
	import { dynamicMaxProfitPlan, greedyMaxProfitPlan } from "$functions";

	let selectedAlgorithm = "greedy";

	type SelectType = {
		value: string;
		label: string;
	};

	const days: SelectType[] = Array.from({ length: 21 }, (_, i) => ({
		label: `${i + 1}`,
		value: `${i + 1}`,
	}));

	let selectedDaysAmount = days[2];
	let budget: string = "20";

	type Dish = {
		name: string;
		cost: string;
		profit: string;
	};

	const initialDishes: Dish[] = [
		{
			name: "Prato 1",
			cost: "2",
			profit: "5",
		},
		{
			name: "Prato 2",
			cost: "18",
			profit: "6",
		},
		{
			name: "Prato 3",
			cost: "1",
			profit: "1",
		},
		{
			name: "Prato 4",
			cost: "3",
			profit: "3",
		},
		{
			name: "Prato 5",
			cost: "2",
			profit: "3",
		},
	];

	let dishes: { name: string; cost: string; profit: string }[] = initialDishes;

	const fixValue = (value: string, min: number, max: number): string => {
		let cleanedValue = value.replace(/\D/g, "");

		const numericInput = parseInt(cleanedValue);

		if (isNaN(numericInput) || numericInput < min) {
			return min.toString();
		}

		if (numericInput > max) {
			return max.toString();
		}

		return cleanedValue;
	};

	$: budget = fixValue(budget, 0, 100);

	$: dishes = dishes.map((dish) => {
		const cost = fixValue(dish.cost, 1, 50);
		const profit = fixValue(dish.profit, 1, 10000);

		return { ...dish, cost, profit };
	});

	const addDish = () => {
		dishes = [...dishes, { name: `Prato ${dishes.length + 1}`, cost: "1", profit: "1" }];
	};

	const prepareDataForFunction = (
		dishes: { name: string; cost: string; profit: string }[],
		budget: string,
		daysAmount: string,
	) => {
		let input = `${daysAmount} ${dishes.length} ${budget}`;

		dishes.forEach((dish) => {
			input += `\n${dish.cost} ${dish.profit}`;
		});

		input += "\n0 0 0";

		return input;
	};

	const processDataAndReturn = (
		dishes: { name: string; cost: string; profit: string }[],
		budget: string,
		daysAmount: string,
	) => {
		const input = prepareDataForFunction(dishes, budget, daysAmount);

		const algorithm = selectedAlgorithm === "greedy" ? greedyMaxProfitPlan : dynamicMaxProfitPlan;

		const result = algorithm(input);

		if (result.replace("\n", "") === "0.0") {
			return { maxProfit: 0, dishesByDay: [] };
		}

		const lines = result.trim().split("\n");
		const maxProfit = parseFloat(lines[0]);

		const dishesByDay = lines[1].split(" ").map((dishIndex) => {
			const index = parseInt(dishIndex) - 1;
			return dishes[index];
		});

		return { maxProfit, dishesByDay };
	};

	let maxProfit: number;
	let dishesByDay: Dish[];
	let totalCost: number;

	$: isSubmitButtonDisabled = dishes.some(
		(dish) => !dish.name || dishes.filter((_dish) => _dish.name === dish.name).length > 1,
	);

	const handleCalculate = () => {
		({ maxProfit, dishesByDay } = processDataAndReturn(dishes, budget, selectedDaysAmount.value));
		totalCost = dishesByDay.reduce((acc, dish) => acc + (dish ? parseInt(dish.cost) : 0), 0);
	};
</script>

<div class="min-h-screen flex">
	<div class="flex-1 flex flex-col py-20 items-center bg-gray-200">
		<div class="flex flex-col gap-8">
			<div class="flex">
				<button
					class="py-2 px-3 border border-slate-300 rounded-l-lg font-bold"
					class:bg-white={selectedAlgorithm !== "greedy"}
					class:bg-blue-500={selectedAlgorithm === "greedy"}
					class:text-white={selectedAlgorithm === "greedy"}
					on:click={() => (selectedAlgorithm = "greedy")}
				>
					Algoritmo guloso
				</button>
				<button
					class="py-2 px-3 border border-l-0 border-slate-300 rounded-r-lg font-bold"
					class:bg-white={selectedAlgorithm !== "dynamic"}
					class:bg-blue-500={selectedAlgorithm === "dynamic"}
					class:text-white={selectedAlgorithm === "dynamic"}
					on:click={() => (selectedAlgorithm = "dynamic")}
				>
					Programação dinâmica
				</button>
			</div>
			<div class="flex gap-8">
				<SelectField
					name="days"
					label="Número de dias:"
					items={days}
					bind:value={selectedDaysAmount}
					clearable={false}
					searchable={false}
					className="w-40"
				/>
				<Field name="budget" label="Orçamento:" bind:value={budget} className="w-40" />
			</div>
			<div class="flex flex-col gap-4">
				<p class="text-lg">Pratos:</p>
				{#each dishes as dish, index}
					<div class="flex gap-4 items-center group">
						<Field
							name="dish.name"
							label={index === 0 ? "Nome" : undefined}
							bind:value={dish.name}
							className="w-40"
						/>
						<Field
							name="dish.value"
							label={index === 0 ? "Custo" : undefined}
							bind:value={dish.cost}
							className="w-40"
						/>
						<Field
							name="dish.profit"
							label={index === 0 ? "Lucro" : undefined}
							bind:value={dish.profit}
							className="w-40"
						/>
						<button
							class="text-gray-400 invisible {dishes.length > 1 &&
								'group-hover:visible'} hover:text-gray-500"
							class:mt-8={index === 0}
							on:click={() => (dishes = dishes.filter((_dish) => _dish !== dish))}
						>
							<X />
						</button>
					</div>
				{/each}
				{#if dishes.length < 50}
					<button
						class="transition-all p-2 self-center rounded-full hover:bg-gray-300 active:bg-gray-300 active:opacity-60"
						on:click={addDish}
					>
						<Plus />
					</button>
				{/if}
			</div>
			<button
				class="bg-blue-500 text-white text-xl self-center font-bold transition-all py-2 px-8 rounded-lg hover:bg-blue-600 active:bg-blue-600 active:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:active:opacity-100"
				disabled={isSubmitButtonDisabled}
				on:click={handleCalculate}
			>
				Calcular
			</button>
		</div>
	</div>
	<div class="flex-1">
		{#if maxProfit !== undefined}
			{#if maxProfit === 0}
				<div class="flex flex-col gap-8 p-20">
					<div class="p-4 rounded-lg bg-red-100 border border-red-400">
						<p class="text-2xl font-bold">Orçamento insuficiente</p>
					</div>
				</div>
			{:else}
				<div class="flex flex-col gap-8 p-20">
					<div class="p-4 rounded-lg bg-lime-100 border border-lime-400">
						<p class="text-2xl font-bold">
							Lucro máximo: R${maxProfit.toFixed(2).replace(".", ",")}
						</p>
					</div>
					<table class="w-full text-lg border-collapse">
						<thead>
							<tr>
								<th class="py-2 px-4 text-start">Dia</th>
								<th class="py-2 px-4 text-start">Prato</th>
							</tr>
						</thead>
						<tbody>
							{#each dishesByDay as dish, index}
								<tr class={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
									<td class="py-2 px-6">{index + 1}</td>
									<td class="py-2 px-4">{dish?.name ?? "-"}</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<p class="text-lg font-bold">Custo total: R${totalCost.toFixed(2).replace(".", ",")}</p>
				</div>
			{/if}
		{/if}
	</div>
</div>
