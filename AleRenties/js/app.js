// Código para definir o valor máximo para o campo de ano
document.addEventListener('DOMContentLoaded', function () {
    const anoInput = document.getElementById('ano');
    const anoAtual = new Date().getFullYear();
    anoInput.max = anoAtual;
});

// FUNÇÃO CADASTRAR
function enviarFormulario(event) {
    // Restante do seu código de envio
}

// FUNÇÃO CADASTRAR
function enviarFormulario(event) {
    event.preventDefault();

    const form = document.getElementById("veiculoForm");
    const data = {
        locadora: form.locadora.value,
        modelo: form.modelo.value,
        marca: form.marca.value,
        ano: parseInt(form.ano.value),
        motor: form.motor.value,
        portas: parseInt(form.portas.value),
        cambio: form.cambio.value,
        arCondicionado: (form.arCondicionado.value === 'true'),
    };

    fetch('http://localhost:3000/adicionar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            const mensagemSucesso = document.getElementById('mensagemSucesso');
            mensagemSucesso.textContent = 'Sucesso ao cadastrar veículo.';
            mensagemSucesso.style.display = 'block';

            // Limpar o formulário
            form.reset();
        })
        .catch(error => {
            console.error('Erro ao cadastrar veículo:', error);
        });
}


// FUNÇÃO CONSULTAR
function consultarTodos(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    fetch('http://localhost:3000/consultar', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.status === 200) { // Verifica se a resposta tem status 200 (OK)
                return response.json();
            } else {
                throw new Error('Erro ao consultar veículos.');
            }
        })
        .then(data => {
            const dadosVeiculos = document.getElementById('dados');
            let formattedData = '';

            if (Array.isArray(data)) {
                data.forEach((veiculo, index) => {
                    formattedData += `Veiculo id: ${veiculo.id}\n`;
                    formattedData += `Locadora: ${veiculo.locadora || 'Não encontrado'}\n`;
                    formattedData += `Modelo: ${veiculo.modelo || 'Não encontrado'}\n`;
                    formattedData += `Marca: ${veiculo.marca || 'Não encontrado'}\n`;
                    formattedData += `Ano: ${veiculo.ano || 'Não encontrado'}\n`;
                    formattedData += `Motor: ${veiculo.motor || 'Não encontrado'}\n`;
                    formattedData += `Portas: ${veiculo.portas || 'Não encontrado'}\n`;
                    formattedData += `Câmbio: ${veiculo.cambio || 'Não encontrado'}\n`;
                    formattedData += `Ar Condicionado: ${veiculo.arCondicionado ? 'Sim' : 'Não'}\n\n`;

                    // Adiciona uma linha em branco após cada veículo, exceto o último
                    if (index < data.length - 1) {
                        formattedData += '\n';
                    }
                });
            } else {
                formattedData = 'Erro ao consultar veículos.';
            }

            dadosVeiculos.value = formattedData;
        })
        .catch(error => {
            console.error('Erro ao consultar veículos:', error);
        });
}

function consultarId(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    const id = document.getElementById('idVeiculo').value; // Obtém o valor do campo de ID

    if (id) {
        fetch(`http://localhost:3000/consultar/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.status === 200) { // Verifica se a resposta tem status 200 (OK)
                    return response.json();
                } else if (response.status === 404) { // Veículo não encontrado
                    return { status: 'fail', message: 'Veículo não encontrado.' };
                } else {
                    throw new Error('Erro ao consultar veículo');
                }
            })
            .then(veiculo => {
                const dadosVeiculos = document.getElementById('dados');
                if (veiculo && veiculo.id) {
                    let formattedData = `Veiculo id: ${veiculo.id}\n`;
                    formattedData += `Locadora: ${veiculo.locadora || 'Não encontrado'}\n`;
                    formattedData += `Modelo: ${veiculo.modelo || 'Não encontrado'}\n`;
                    formattedData += `Marca: ${veiculo.marca || 'Não encontrado'}\n`;
                    formattedData += `Ano: ${veiculo.ano || 'Não encontrado'}\n`;
                    formattedData += `Motor: ${veiculo.motor || 'Não encontrado'}\n`;
                    formattedData += `Portas: ${veiculo.portas || 'Não encontrado'}\n`;
                    formattedData += `Câmbio: ${veiculo.cambio || 'Não encontrado'}\n`;
                    formattedData += `Ar Condicionado: ${veiculo.arCondicionado ? 'Sim' : 'Não'}\n\n`;
                    dadosVeiculos.value = formattedData;
                } else if (veiculo.message) {
                    dadosVeiculos.value = veiculo.message;
                } else {
                    dadosVeiculos.value = 'Erro ao consultar veículo.';
                }
            })
            .catch(error => {
                console.error('Erro ao consultar veículo:', error);
            });
    } else {
        alert('Por favor, insira um ID válido.');
    }
}


// FUNÇÃO ATUALIZAR
function consultarIdEdit() {
    const id = document.getElementById('id').value;
    if (id) {
        fetch(`http://localhost:3000/consultar/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(veiculo => {
                const form = document.getElementById('veiculoForm');

                if (veiculo && Object.keys(veiculo).length > 0) {
                    form.locadora.value = veiculo.locadora || '';
                    form.modelo.value = veiculo.modelo || '';
                    form.marca.value = veiculo.marca || '';
                    form.ano.value = veiculo.ano || '';
                    form.motor.value = veiculo.motor || '';
                    form.portas.value = veiculo.portas || '';
                    form.cambio.value = veiculo.cambio || '';

                    // Verifique o valor de veiculo.arCondicionado e defina a opção apropriada no <select>
                    if (veiculo.arCondicionado === true) {
                        form.arCondicionado.value = 'true';
                    } else if (veiculo.arCondicionado === false) {
                        form.arCondicionado.value = 'false';
                    } else {
                        form.arCondicionado.value = ''; // Caso o valor não esteja definido
                    }
                } else {                
                    form.reset(); // Limpa os campos do formulário
                    alert('Veículo não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao consultar veículo:', error);
                alert('Erro ao consultar veículo.');
            });
    } else {
        alert('Por favor, insira um ID válido.');
    }
}

function atualizarVeiculo() {
    const id = document.getElementById('id').value;
    const form = document.getElementById('veiculoForm');
    const anoInput = form.ano;

    const anoAtual = new Date().getFullYear();

    const anoDigitado = parseInt(anoInput.value);

    if (anoDigitado < 1990 || anoDigitado > anoAtual) {
        alert('Por favor, insira um ano entre 1990 e ' + anoAtual);
        return;
    }

    const data = {
        locadora: form.locadora.value,
        modelo: form.modelo.value,
        marca: form.marca.value,
        ano: anoDigitado,
        motor: form.motor.value,
        portas: parseInt(form.portas.value),
        cambio: form.cambio.value,
        arCondicionado: (form.arCondicionado.value === 'true' ? true : false),
    };

    fetch(`http://localhost:3000/atualizar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            alert('Veículo atualizado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao atualizar veículo: ', error);
        });
}

// FUNÇÃO REMOVER
function consultarIdRem(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    const id = document.getElementById('idVeiculo').value; // Obtém o valor do campo de ID

    if (id) {
        fetch(`http://localhost:3000/consultar/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.status === 200) { // Verifica se a resposta tem status 200 (OK)
                    return response.json();
                } else if (response.status === 404) { // Veículo não encontrado
                    return { status: 'fail', message: 'Veículo não encontrado.' };
                } else {
                    throw new Error('Erro ao consultar veículo');
                }
            })
            .then(veiculo => {
                const dadosVeiculos = document.getElementById('dados');
                if (veiculo && veiculo.id) {
                    let formattedData = `Veiculo id: ${veiculo.id}\n`;
                    formattedData += `Locadora: ${veiculo.locadora || 'Não encontrado'}\n`; // Verifica se locadora é indefinida
                    formattedData += `Modelo: ${veiculo.modelo || 'Não encontrado'}\n`; // Verifica se modelo é indefinido
                    formattedData += `Marca: ${veiculo.marca || 'Não encontrado'}\n`; // Verifica se marca é indefinida
                    formattedData += `Ano: ${veiculo.ano || 'Não encontrado'}\n`; // Verifica se ano é indefinido
                    formattedData += `Motor: ${veiculo.motor || 'Não encontrado'}\n`; // Verifica se motor é indefinido
                    formattedData += `Portas: ${veiculo.portas || 'Não encontrado'}\n`; // Verifica se portas é indefinida
                    formattedData += `Câmbio: ${veiculo.cambio || 'Não encontrado'}\n`; // Verifica se cambio é indefinida
                    formattedData += `Ar Condicionado: ${veiculo.arCondicionado ? 'Sim' : 'Não'}\n\n`; // Verifica se arCondicionado é indefinido
                    dadosVeiculos.value = formattedData;
                } else if (veiculo.message) {
                    dadosVeiculos.value = veiculo.message;
                } else {
                    dadosVeiculos.value = 'Erro ao consultar veículo.';
                }
            })
            .catch(error => {
                console.error('Erro ao consultar veículo:', error);
            });
    } else {
        alert('Por favor, insira um ID válido.');
    }
}

function removerVeiculo(event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    const id = document.getElementById('idVeiculo').value;

    if (id) {
        if (confirm('Tem certeza de que deseja remover este veículo?')) {
            fetch(`http://localhost:3000/deletar/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'ok') {
                        alert('Veículo removido com sucesso!');
                        // Limpa os dados após a remoção
                        document.getElementById('dados').value = '';
                    } else {
                        alert('Erro ao remover o veículo. Verifique se o id existe');
                    }
                })
                .catch(error => {
                    console.error('Erro ao remover veículo.', error);
                });
        }
    } else {
        alert('Por favor, insira um ID válido.');
    }
}