export const validateInput = (input: string) => {
	const data = input.split("\n");

	// Valida que cada caso de teste termina com "0 0 0"
	if (data[data.length - 1].trim() !== "0 0 0") {
		throw new Error("O input deve terminar com '0 0 0'.");
	}

	let index = 0;

	while (index < data.length - 1) {
		const [k, n, m] = data[index].split(" ").map(Number);

		// Verifica se k, n, m estão dentro dos limites
		if (k < 1 || k > 21) {
			throw new Error(`Valor inválido para o número de dias: ${k}. Deve estar entre 1 e 21.`);
		}
		if (n < 1 || n > 50) {
			throw new Error(`Valor inválido para o número de pratos: ${n}. Deve estar entre 1 e 50.`);
		}
		if (m < 0 || m > 100) {
			throw new Error(`Valor inválido para o orçamento: ${m}. Deve estar entre 0 e 100.`);
		}

		// Se k, n, m são todos zeros, quebra o loop (final do input)
		if (k === 0 && n === 0 && m === 0) break;

		// Verifica se há exatamente n linhas de pratos após a linha inicial
		for (let i = 1; i <= n; i++) {
			index++;
			if (index >= data.length) {
				throw new Error("Dados de prato faltando.");
			}
			const [cost, profit] = data[index].split(" ").map(Number);

			// Verifica se custo e lucro estão dentro dos limites
			if (cost < 1 || cost > 50) {
				throw new Error(`Valor inválido para custo: ${cost}. Deve estar entre 1 e 50.`);
			}
			if (profit < 1 || profit > 10000) {
				throw new Error(`Valor inválido para lucro: ${profit}. Deve estar entre 1 e 10000.`);
			}
		}
		index++;
	}
};
