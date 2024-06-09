import { validateInput } from "./validateInput";

type Table = {
	profit: number;
	cost: number;
}[][][][];

type Path = ({
	lastDish: number;
	count: number;
	budget: number;
} | null)[][][][];

type State = {
	day: number;
	lastDish: number;
	count: number;
	budget: number;
};

export const dynamicMaxProfitPlan = (input: string) => {
	// Valida a entrada
	validateInput(input);

	const lines = input.split("\n");

	let index = 0;
	const results = [];

	while (index < lines.length) {
		const [k, n, m] = lines[index].split(" ").map(Number);
		if (k === 0 && n === 0 && m === 0) break;

		const dishes = [];
		// Lê os pratos disponíveis
		for (let i = 0; i < n; i++) {
			index++;
			const [cost, profit] = lines[index].split(" ").map(Number);
			dishes.push({ cost, profit });
		}

		// Cria uma tabela de programação dinâmica para armazenar os lucros
		// Estrutura: dias x último prato x contagem consecutiva x orçamento
		// table[day][lastDish][count][budget] = { profit, cost }
		const table: Table = Array.from({ length: k + 1 }, () =>
			Array.from({ length: n + 1 }, () =>
				Array.from({ length: 2 }, () => Array(m + 1).fill({ profit: -Infinity, cost: Infinity })),
			),
		);

		// Armazena o caminho para reconstruir a solução
		// path[day][lastDish][count][budget] = { lastDish, count, budget }
		const path: Path = Array.from({ length: k + 1 }, () =>
			Array.from({ length: n + 1 }, () => Array.from({ length: 2 }, () => Array(m + 1).fill(null))),
		);

		// Inicializa o estado base
		table[0][0][0][m] = { profit: 0, cost: 0 };

		// Preenche a tabela dinâmica
		for (let day = 0; day < k; day++) {
			// Itera sobre todos os pratos possíveis como último prato cozinhado no dia anterior
			for (let lastDish = 0; lastDish <= n; lastDish++) {
				// Itera sobre todas as contagens consecutivas possíveis
				for (let count = 0; count < 2; count++) {
					// Itera sobre todos os valores de orçamento possíveis
					for (let budget = 0; budget <= m; budget++) {
						// Pula estados inválidos
						if (table[day][lastDish][count][budget].profit === -Infinity) continue;

						// Tenta cozinhar cada prato disponível no dia atual
						for (let dish = 1; dish <= n; dish++) {
							const { cost, profit } = dishes[dish - 1];
							// Verifica se há orçamento suficiente para cozinhar o prato
							if (budget >= cost) {
								let newProfit = table[day][lastDish][count][budget].profit;
								let newCost = table[day][lastDish][count][budget].cost + cost;
								let newCount = 0;

								// Se o prato atual é o mesmo que o prato cozinhado no dia anterior
								if (dish === lastDish) {
									// Aplica a penalidade de lucro se for a segunda vez consecutiva
									if (count === 0) {
										newProfit += profit * 0.5;
										newCount = 1;
									}
								} else {
									// Caso contrário, adiciona o lucro completo
									newProfit += profit;
								}

								// Obtém o estado atual na tabela para o dia seguinte
								const current = table[day + 1][dish][newCount][budget - cost];
								// Atualiza a tabela se o novo lucro é maior ou se o lucro é igual mas o custo é menor
								if (
									newProfit > current.profit ||
									(newProfit === current.profit && newCost < current.cost)
								) {
									table[day + 1][dish][newCount][budget - cost] = {
										profit: newProfit,
										cost: newCost,
									};
									path[day + 1][dish][newCount][budget - cost] = {
										lastDish,
										count,
										budget,
									};
								}
							}
						}
					}
				}
			}
		}

		let maxProfit = -Infinity;
		let minCost = Infinity;
		let endState = null;

		// Itera sobre todos os estados possíveis no último dia para encontrar o máximo lucro
		for (let lastDish = 1; lastDish <= n; lastDish++) {
			for (let count = 0; count < 2; count++) {
				for (let budget = 0; budget <= m; budget++) {
					const current = table[k][lastDish][count][budget];
					if (
						current.profit > maxProfit ||
						(current.profit === maxProfit && current.cost < minCost)
					) {
						maxProfit = current.profit;
						minCost = current.cost;
						endState = { day: k, lastDish, count, budget };
					}
				}
			}
		}

		// Verifica se encontrou uma solução válida
		if (maxProfit === -Infinity) {
			results.push("0.0", "");
		} else {
			// Reconstrói o plano de pratos a partir do caminho armazenado
			const plan = [];
			let { day, lastDish, count, budget } = endState as State;

			while (day > 0) {
				plan.push(lastDish);
				const state = path[day][lastDish][count][budget];
				({ lastDish, count, budget } = state as State);
				day--;
			}

			// Adiciona o resultado formatado
			results.push(`${maxProfit.toFixed(1)}`);
			results.push(plan.reverse().join(" "), "");
		}

		index++;
	}

	// Retorna os resultados
	return results.join("\n");
};
