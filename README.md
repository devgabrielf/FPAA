### 1. Como esse problema pode ser modelado para o paradigma guloso?

A medida de otimização local que utilizamos é a relação lucro/custo de cada prato. A cada dia, escolhemos o prato que oferece a melhor relação lucro/custo, desde que o custo do prato caiba no orçamento restante. Além disso, precisamos considerar as penalidades associadas à repetição dos pratos: o lucro é reduzido em 50% se o mesmo prato for repetido no dia seguinte e se torna zero se for repetido pela terceira vez consecutiva. Assim, após escolher um prato, ajustamos o orçamento e recalculamos a relação lucro/custo desse prato para refletir as penalidades de repetição.

### Tabela de exemplo: 

| Dia  | Prato | Custo (C) | Lucro (L) | Relação Lucro/Custo (L/C) | Penalidade de Repetição | Lucro Ajustado | Relação Lucro/Custo Ajustada | Escolhido |
|------|-------|-----------|-----------|--------------------------|-------------------------|----------------|------------------------------|-----------|
| 1    | 1     | 2         | 5         | 2.50                     | N/A                     | 5              | 2.50                         | Sim       |
|     | 2     | 18        | 6         | 0.33                     | N/A                     | 6              | 0.33                         | Não       |
|     | 3     | 1         | 1         | 1.00                     | N/A                     | 1              | 1.00                         | Não       |
|     | 4     | 3         | 3         | 1.00                     | N/A                     | 3              | 1.00                         | Não       |
|     | 5     | 2         | 3         | 1.50                     | N/A                     | 3              | 1.50                         | Não       |
| 2    | 1     | 2         | 5         | 2.50                     | 50% (repetido)          | 2.5            | 1.25                         | Não       |
|     | 2     | 18        | 6         | 0.33                     | N/A                     | 6              | 0.33                         | Não       |
|     | 3     | 1         | 1         | 1.00                     | N/A                     | 1              | 1.00                         | Não       |
|     | 4     | 3         | 3         | 1.00                     | N/A                     | 3              | 1.00                         | Não       |
|     | 5     | 2         | 3         | 1.50                     | N/A                     | 3              | 1.50                         | Sim       |
| 3    | 1     | 2         | 5         | 2.50                     | N/A                     | 5            | 2.5                        | Sim       |
|     | 2     | 18        | 6         | 0.33                     | N/A                     | 6              | 0.33                         | Não       |
|     | 3     | 1         | 1         | 1.00                     | N/A                     | 1              | 1.00                         | Não       |
|     | 4     | 3         | 3         | 1.00                     | N/A                     | 3              | 1.00                         | Não       |
|     | 5     | 2         | 3         | 1.50                     | 50% (repetido no dia 2) | 1.5            | 0.75                         | Não       |



### 2. Seu algoritmo guloso apresenta a solução ótima? Por quê?

O algoritmo guloso apresentado não garante a solução ótima global para o problema, pois sua abordagem de escolher localmente os pratos que maximizam o lucro imediato dentro do orçamento não considera todas as possíveis combinações de pratos ao longo dos dias. Embora eficiente e capaz de encontrar soluções satisfatórias, especialmente para conjuntos pequenos de dias e pratos, ele pode falhar em encontrar a solução globalmente ótima em casos complexos onde uma análise mais profunda das escolhas é necessária para maximizar o lucro total. No entanto, em níveis individuais de escolha de pratos para cada dia, o algoritmo pode alcançar uma solução ótima local, maximizando o lucro dentro das restrições locais, escolhendo pratos com base na melhor relação custo-benefício imediata, dado o contexto específico de orçamento restante e penalidades por repetição.

### 3. Como esse problema pode ser modelado para o paradigma de programação dinâmica?

Definimos uma tabela `table` onde `table[day][lastDish][count][budget]` representa o lucro máximo que pode ser obtido após `day` dias, onde `lastDish` é o prato cozinhado no último dia, `count` é o número de vezes consecutivas que esse prato foi cozinhado, e `budget` é o orçamento restante. Cada estado da tabela representa uma combinação possível de dias, pratos, contagem consecutiva e orçamento. Inicializamos o estado base `table[0][0][0][m]` para representar o início, onde nenhum dia foi passado, nenhum prato foi cozinhado, e o orçamento inicial é `m`.

Para cada dia, decidimos qual prato cozinhar, levando em consideração o custo, o lucro e a penalidade por cozinhar o mesmo prato consecutivamente. A decisão envolve escolher o prato que maximiza o lucro possível, sem exceder o orçamento.

Se cozinhamos um prato diferente do dia anterior, adicionamos o lucro total desse prato e ajustamos o orçamento. Se cozinhamos o mesmo prato do dia anterior, aplicamos a penalidade de lucro (50% na segunda vez consecutiva) e ajustamos o orçamento.

**Condição de parada:** Preenchemos a tabela para todos os dias e, no último dia, buscamos o estado que proporciona o maior lucro.

### 4. Discuta a subestrutura  ́otima e a sobreposição dos problemas.

**Subestrutura ótima:** No contexto deste problema, a decisão de cozinhar um prato em um dia específico depende do estado ótimo dos dias anteriores. Ou seja, para maximizar o lucro no dia `k`, consideramos os lucros ótimos de todos os dias até `k-1`, adicionando o lucro do prato escolhido no dia `k`. Isso mostra que a solução ótima global pode ser obtida a partir das soluções ótimas de subproblemas menores (dias anteriores).

**Sobreposição de problemas:** O problema apresenta sobreposição de subproblemas porque muitos estados intermediários são recalculados múltiplas vezes. Por exemplo, a decisão de cozinhar um prato específico em um dia pode depender das mesmas combinações de dias anteriores e orçamentos. Em vez de recalcular os lucros para esses estados repetidamente, a programação dinâmica armazena esses resultados em uma tabela (`table`), evitando cálculos redundantes e melhorando a eficiência.

### 5. Algum algoritmo clássico foi adaptado para resolver o problema? Se sim, qual foi ele?

Nenhum algoritmo clássico foi adaptado.

### Executando a aplicação web

Para executar o frontend, abra pasta em um terminal e execute:

```
cd frontend
npm i
npm run dev
```
> É necessário possuir o node (v18+) e npm instalados no computador.
> 
Após isso, acesse http://localhost:5173/
