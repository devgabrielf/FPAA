// Algoritmo guloso
// Autores: Ana Júlia Dias Aguiar, Bianca Rangel Albino, Gabriel Ferreira Marques Mendes, Lucas Gabriell Ferreira Souza e Pedro Henrique Alves de Souza
// Versão: 1.0.0
// Data: 08 de junho de 2024

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

class Greedy {
  constructor(input) {
    // Estrutura para armazenar dados de planejamento
    this.planning = {
      days: [], // Dias de planejamento para cada menu
      numDishes: [], // Número de pratos disponíveis para cada menu
      budget: [], // Orçamento disponível para cada menu
      dishes: {
        cost: [], // Custo de cada prato
        profit: [], // Lucro de cada prato
        profitPerCost: [], // Lucro por custo de cada prato
      },
    };

    this.numMenu = 0; // Número de menus

    // Chama funções para processar entrada e executar análise gulosa
    this.dataInput(input);
    this.greedyAnalysis();
  }

  dataInput(input) {
    validateInput(input);

    const data = input.split("\n"); // Divide a entrada em linhas
    let index = 0;
    let dataCollector = true;

    while (dataCollector && index < data.length) {
      // Processa a linha atual para obter dias, número de pratos e orçamento
      let response = data[index].split(" ");

      let days = parseInt(response[0]);
      let dishes = parseInt(response[1]);
      let budget = parseInt(response[2]);

      // Valida se os valores são positivos e adiciona ao planejamento
      if (days > 0 && dishes > 0 && budget > 0) {
        this.numMenu++;

        this.planning.days.push(days);
        this.planning.numDishes.push(dishes);
        this.planning.budget.push(budget);

        let cost = [];
        let profit = [];
        let profitPerCost = [];

        // Processa cada prato para coletar custo e lucro
        for (let dish = 0; dish < dishes; dish++) {
          index++;
          response = data[index].split(" ");

          cost.push(parseInt(response[0]));
          profit.push(parseInt(response[1]));
          profitPerCost.push(
            Math.round((parseInt(response[1]) / parseInt(response[0])) * 100) /
              100
          ); // Calcula a relação custo/lucro e arredonda para 2 casas decimais
        }

        this.planning.dishes.cost.push(cost);
        this.planning.dishes.profit.push(profit);
        this.planning.dishes.profitPerCost.push(profitPerCost);
      } else {
        dataCollector = false; // Encerra a coleta de dados se os valores forem inválidos
      }
      index++;
    }
  }

  greedyAnalysis() {
    if (this.planning.dishes.profitPerCost.length === 0) {
      console.log("0.0"); // Imprime 0 se não houver pratos disponíveis
      return;
    }

    for (let menu = 0; menu < this.numMenu; menu++) {
      let combination = [];
      let choice = -1;
      let cp = -1; // Valor de lucro por custo
      let sumCost = 0;
      let achievableProfit = 0;
      let ppcCopy = this.planning.dishes.profitPerCost[menu].slice(); // Cópia dos valores de lucro por custo

      // Itera por cada dia do planejamento
      for (let day = 0; day < this.planning.days[menu]; day++) {
        // Encontra o prato com a melhor relação lucro/custo que cabe no orçamento restante
        for (let dish = 0; dish < this.planning.numDishes[menu]; dish++) {
          if (cp < ppcCopy[dish]) {
            if (
              sumCost + this.planning.dishes.cost[menu][dish] <
              this.planning.budget[menu]
            ) {
              cp = ppcCopy[dish];
              choice = dish + 1;
            }
          }
        }

        if (choice > 0) {
          combination.push(choice);
          sumCost += this.planning.dishes.cost[menu][choice - 1];
          let additionalProfit = this.planning.dishes.profit[menu][choice - 1];

          ppcCopy = this.planning.dishes.profitPerCost[menu].slice(); // Reseta os valores de lucro por custo

          // Recalcula o valor de lucro por custo para o prato escolhido
          ppcCopy[choice - 1] =
            (this.planning.dishes.profit[menu][choice - 1] * 0.5) /
            this.planning.dishes.cost[menu][choice - 1];

          // Aplica penalidade se o prato for escolhido consecutivamente
          if (day === 1) {
            if (combination[day] === combination[day - 1]) {
              additionalProfit *= 0.5;
              ppcCopy[choice - 1] = 0;
            }
          } else if (day > 1) {
            if (
              combination[day] === combination[day - 1] &&
              combination[day - 1] === combination[day - 2]
            ) {
              achievableProfit = 0;
              ppcCopy[choice - 1] = 0;
            } else if (combination[day] === combination[day - 1]) {
              additionalProfit *= 0.5;
              ppcCopy[choice - 1] = 0;
            }
          }

          achievableProfit += additionalProfit;

          choice = -1;
          cp = -1;
        } else {
          // Caso não seja possível encontrar um prato dentro do custo em algum dos dias, encerra o algoritmo
          combination = [];
          achievableProfit = 0;
          break;
        }
      }

      // Imprime o lucro alcançável e a combinação de pratos escolhida
      console.log(
        [achievableProfit.toFixed(1), combination.join(" ")].join("\n")
      );
      console.log("");
    }
  }
}

// Exemplo de entrada
const input = `2 1 5
3 5
3 5 20
2 5
18 6
1 1
3 3
2 3
0 0 0`;

new Greedy(input);
