// Obtém o formulário e a tabela que irá armazenar as transações
const transacaoForm = document.getElementById('transacao-form');
const transacoesTable = document.getElementById('transacoes-table');
let editingIndex = null; // Variável que indica se o formulário está editando uma transação

// Funções para manipular o localStorage
function obterTransacoes() {
  // Lê as transações do localStorage
  const transacoesString = localStorage.getItem('transacoes');
  // console.log(transacoesString);
  // Se as transações existirem, converte a string para um array de objetos
  return transacoesString ? JSON.parse(transacoesString) : [];
}

function salvarTransacoes(transacoes) {
  // Salva as transações no localStorage
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

function carregarTransacoes() {
  // Obtém as transações armazenadas
  const transacoes = obterTransacoes();
  const transacoesTableBody = transacoesTable.querySelector('tbody');
  // Limpa a tabela
  transacoesTableBody.innerHTML = '';

  transacoes.forEach((transacao, index) => {
    // Cria uma nova linha na tabela
    const row = transacoesTableBody.insertRow();
    // Cria células na linha com os dados da transação
    row.insertCell().textContent = index + 1;
    row.insertCell().textContent = transacao.tipo;
    row.insertCell().textContent = transacao.descricao;
    row.insertCell().textContent = transacao.valor;

    // Cria célula com os botões de ação
    const actionsCell = row.insertCell();
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => {
      // Chama a função para editar a transação
      editarTransacao(index);
    });
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
      // Chama a função para excluir a transação
      excluirTransacao(index);
    });
    actionsCell.appendChild(deleteButton);
  });
}

// Adiciona um evento de submissão ao formulário
transacaoForm.addEventListener('submit', (event) => {
  // Impede que a página recarregue
  event.preventDefault();
  // Obtém os valores do formulário
  const tipo = document.getElementById('tipo').value;
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);

  // Obtém as transações armazenadas
  const transacoes = obterTransacoes();

  if (editingIndex !== null) {
    // Se o formulário está editando uma transação, atualiza a transação
    transacoes[editingIndex] = { tipo, descricao, valor };
    // Reseta a variável para indicar que não está mais editando
    editingIndex = null;
    // Atualiza o texto do botão para "Adicionar"
    transacaoForm.querySelector('button[type="submit"]').textContent = 'Adicionar';
  } else {
    // Se o formulário não está editando nenhuma transação, adiciona uma nova
    transacoes.push({ tipo, descricao, valor });
  }

  // Salva as transações atualizadas
  salvarTransacoes(transacoes);
  // Carrega as transações novamente para atualizar a tabela
  carregarTransacoes();
  // Limpa o formulário
  transacaoForm.reset();
});

// Função para editar uma transação
function editarTransacao(index) {
  // Obtém as transações armazenadas
  const transacoes = obterTransacoes();
  const transacao = transacoes[index];
  // Atualiza os campos do formulário com os dados da transação
  document.getElementById('tipo').value = transacao.tipo;
  document.getElementById('descricao').value = transacao.descricao;
  document.getElementById('valor').value = transacao.valor;
  // Atualiza a variável para indicar que o formulário está editando uma transação
  editingIndex = index;
  // Atualiza o texto do botão para "Atualizar"
  transacaoForm.querySelector('button[type="submit"]').textContent = 'Atualizar';
}

// Função para excluir uma transação
function excluirTransacao(index) {
  if (confirm('Tem certeza de que deseja excluir esta transação?')) {
    // Obtém as transações armazenadas
    const transacoes = obterTransacoes();
    // Remove a transação da lista
    // O splice remove um elemento da lista, a partir do índice especificado, e retorna o elemento removido
    // Nesse caso, remove a transação no índice especificado e remove apenas uma transação (o segundo parâmetro é 1)
    transacoes.splice(index, 1);
    // Salva as transações atualizadas
    salvarTransacoes(transacoes);
    // Carrega as transações novamente para atualizar a tabela
    carregarTransacoes();
  }
}

// Carrega as transações para preencher a tabela
carregarTransacoes();

