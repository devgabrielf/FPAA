### 1. Como esse problema pode ser modelado para o paradigma guloso?

A medida de otimização local que utilizamos é a relação lucro/custo de cada prato. A cada dia, escolhemos o prato que oferece a melhor relação lucro/custo, desde que o custo do prato caiba no orçamento restante. Além disso, precisamos considerar as penalidades associadas à repetição dos pratos: o lucro é reduzido em 50% se o mesmo prato for repetido no dia seguinte e se torna zero se for repetido pela terceira vez consecutiva. Assim, após escolher um prato, ajustamos o orçamento e recalculamos a relação lucro/custo desse prato para refletir as penalidades de repetição.

### 2. Seu algoritmo guloso apresenta a solução ótima? Por quê?

O algoritmo guloso utilizado para resolver este problema não garante uma solução ótima. O principal motivo é a natureza das penalidades de repetição e a interdependência das escolhas de pratos ao longo dos dias. As penalidades fazem com que uma decisão localmente ótima em um dia possa resultar em uma significativa redução de lucros nos dias seguintes, algo que a abordagem gulosa não consegue prever adequadamente. Além disso, o orçamento pode não ser eficientemente aproveitado devido ao limite de dias, o que pode fazer com que um prato valioso não seja escolhido nunca se houver uma relação lucro/custo mais baixa que as dos demais.

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
