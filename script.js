//
//FASE 1: modelagem dos dados (Classe Básica)
//
//A classe funciona como um molde para criar produtos
class Produto {
    #preco;
    #quantidade;
    #nome;

    constructor(nome, preco, quantidade) {
        // Validação do nome
        if (!nome || nome.trim() === "") {
            throw new Error("O nome do produto não pode estar em branco");
        }

        const precoNum = parseFloat(preco);
        const quantNum = parseInt(quantidade);

        // Validação do preço
        if (isNaN(precoNum) || precoNum <= 0) {
            throw new Error("O preço deve ser maior que zero.");
        }

        // Validação da quantidade
        if (isNaN(quantNum) || quantNum <= 0) {
            throw new Error("A quantidade deve ser maior que zero.");
        }

        // Propriedades do objeto recebidas no momento da criação
        this.#nome = nome;
        this.#preco = precoNum;
        this.#quantidade = quantNum;
    }

    get nome() {
        return this.#nome;
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    // método que calcula o subtotal
    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}

//
//FASE 2: Gerenciamento de Estado (memória)
//
//Array global que guardará todas as instâncias da classe Produto
const listaDeProdutos = [];

//
// Calcula o total acumulado usando .reduce() e atualiza a tela
//
function atualizarTotalEstoque() {
    // O .reduce() percorre a lista somando os subtotais de cada produto
    const valorTotal = listaDeProdutos.reduce((acumulador, produto) => {
        return acumulador + produto.calcularSubtotal();
    }, 0);

    // Seleciona o elemento h3 pelo ID
    const elementoTotal = document.getElementById("total-estoque");

    if (elementoTotal) {
        // Atualiza o texto formatado em moeda brasileira (R$ XX,XX)
        elementoTotal.textContent = valorTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

//
//FASE 3: Escuta de Eventos do DOM 
//
//Selecionamos o formulário pelo ID
const formProduto = document.getElementById("produto-form");

// Adicionar um escutador de eventos para quando o formulário for enviado
formProduto.addEventListener("submit", function(event) {
    event.preventDefault();

    // 1. Captura os valores digitados nos campos de input
    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    // 2. Envolve a criação em um bloco try / catch para não travar a aplicação
    try {
        // Cria uma nova instância da Classe Produto com segurança
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);

        // 3. Adiciona o novo produto ao Array
        listaDeProdutos.push(novoProduto);

        // 4. Atualiza a exibição da tabela e limpa o formulário
        renderizarTabela();
        formProduto.reset();

    } catch (error) {
        // Se houver erro nas validações da classe, exibe o alert()
        alert(error.message);
    }
});

//
//FASE 4: Renderização da Interface DOM e Ações de Remoção
//

// Função que remove um produto específico pelo seu índice no array
function removerProduto(index) {
    // Remove 1 elemento na posição informada
    listaDeProdutos.splice(index, 1);
    // Re-renderiza a tabela atualizada
    renderizarTabela();
}

// Função responsável por desenhar na tela o estado atual do array listaDeProdutos
function renderizarTabela() {
    // Seleciona o corpo da tabela (tbody)
    const tabelaBody = document.querySelector("#tabela-produtos tbody");

    // Limpa o conteúdo anterior da tabela
    tabelaBody.innerHTML = "";

    // Percorre o array produtos usando forEach capturando o índice de cada um
    listaDeProdutos.forEach((produto, index) => {
        // Criar uma linha tr dentro da tabela
        const linha = document.createElement("tr");

        // Preenche o conteúdo da linha e insere a chamada dinâmica da função removerProduto(index)
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        // Insere a linha criada dentro do tbody da tabela
        tabelaBody.appendChild(linha);
    });

    // Chama a função para atualizar o h3 do estoque na tela toda vez que a tabela renderizar
    atualizarTotalEstoque();
}

//
// Escuta de Eventos para Limpar toda a tabela
//
const botaoLimpar = document.getElementById("limpar-tabela");

if (botaoLimpar) {
    botaoLimpar.addEventListener("click", function() {
        // Esvazia o array mantendo a mesma referência de memória
        listaDeProdutos.length = 0;
        // Atualiza a tela para exibir a tabela zerada
        renderizarTabela();
    });
}
