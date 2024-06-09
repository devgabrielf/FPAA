// Programação dinâmica
// Autores: Ana Júlia Dias Aguiar, Bianca Rangel Albino, Gabriel Ferreira Marques Mendes, Lucas Gabriell Ferreira Souza e Pedro Henrique Alves de Souza
// Versão: 1.0.0
// Data: 09 de junho de 2024

const validateInput = input => {
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
      throw new Error(
        `Valor inválido para o número de dias: ${k}. Deve estar entre 1 e 21.`
      );
    }
    if (n < 1 || n > 50) {
      throw new Error(
        `Valor inválido para o número de pratos: ${n}. Deve estar entre 1 e 50.`
      );
    }
    if (m < 0 || m > 100) {
      throw new Error(
        `Valor inválido para o orçamento: ${m}. Deve estar entre 0 e 100.`
      );
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
        throw new Error(
          `Valor inválido para custo: ${cost}. Deve estar entre 1 e 50.`
        );
      }
      if (profit < 1 || profit > 10000) {
        throw new Error(
          `Valor inválido para lucro: ${profit}. Deve estar entre 1 e 10000.`
        );
      }
    }
    index++;
  }
};

const maxProfitPlan = input => {
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
    const table = Array.from({ length: k + 1 }, () =>
      Array.from({ length: n + 1 }, () =>
        Array.from({ length: 2 }, () =>
          Array(m + 1).fill({ profit: -Infinity, cost: Infinity })
        )
      )
    );

    // Armazena o caminho para reconstruir a solução
    // path[day][lastDish][count][budget] = { lastDish, count, budget }
    const path = Array.from({ length: k + 1 }, () =>
      Array.from({ length: n + 1 }, () =>
        Array.from({ length: 2 }, () => Array(m + 1).fill(null))
      )
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
            if (table[day][lastDish][count][budget].profit === -Infinity)
              continue;

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
      let { day, lastDish, count, budget } = endState;

      while (day > 0) {
        plan.push(lastDish);
        const state = path[day][lastDish][count][budget];
        ({ lastDish, count, budget } = state);
        day--;
      }

      // Adiciona o resultado formatado
      results.push(`${maxProfit.toFixed(1)}`);
      results.push(plan.reverse().join(" "), "");
    }

    index++;
  }

  // Imprime os resultados
  console.log(results.join("\n"));
};

const input = `2 1 5
3 5
3 5 20
2 5
18 6
1 1
3 3
2 3
0 0 0`;

maxProfitPlan(input);
