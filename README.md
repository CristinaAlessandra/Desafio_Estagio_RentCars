# Desafio_RentCars_Ale

## DESAFIO ESTÁGIO RENTCARS - PROJETO DE LOCADORA DE VEÍCULOS
## CANDITADA: ALESSANDRA CRISTINA


O projeto consiste em um aplicativo CRUD (Create, Read, Update, Delete) desenvolvido em Node.js, que permitirá a gestão de veículos em uma locadora de carros. Cada veículo terá informações detalhadas, incluindo ID, locadora, modelo, marca, ano, motor, número de portas, tipo de câmbio, presença de ar-condicionado e datas de criação e atualização.


## OBJETIVO:
1. Configurar o ambiente de desenvolvimento.
2. Criar um banco de dados utilizando o MySQL.
3. Desenvolver endpoints de API para realizar as operações CRUD dos veículos.
4. Implementar a estrutura de dados.
5. Testar API.
6. Documentar projeto (instruções de uso e configurações)


## SETUP DO AMBIENTE:
- Node.js
- Express
- MySQL
- Sequelize
- VS Code
- Linux Ubuntu


## COMO RODAR NA MÁQUINA:
- clone o projeto git clone https://github.com/....
- crie: 
`mkdir /tmp/mysql-data`

- rode: 
`docker run --name basic-mysql --rm -v /tmp/mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=ANSKk08aPEDbFjDO -e MYSQL_DATABASE=testing -p 3307:3306 -it mysql:8.0 `

- crie um diretório: 
`mkdir my_app`

- entre na raiz do projeto: 
`cd my_app`

- faça as instalações necessárias:
	`npm install express`
	`npm install sequelize`	
	`npm install nodemon`

- dentro de package.json: 
```
	...
	"scripts": {
		"start": "./node_modules/nodemon/bin/nodemon.js index.js"
	},
	"dependencies": 
	...
```
- rode: 
`sudo docker start basic-mysql`

- rode: 
`npm run start`

- pronto, subiu a API.
- estrutura do código está em: `./index.js`


## ALTERAÇÕES NO ARQUIVO INDEX.JS:
Para realizar as solicitações propostas pelo desafio, tomei a liberdade de realizar tais modificações:

### Para a criação do bda, troquei o 'firm' por 'Veiculo' e alterei os atributos, segue novo modelo:
```
	...
	const Veiculo = connection.define('veiculo', {
	    id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	    },
	    locadora: {
		type: Sequelize.STRING,
	    },
	    modelo: {
		type: Sequelize.STRING,
	    },
	    marca: {
		type: Sequelize.STRING,
	    },
	    ano: {
		type: Sequelize.INTEGER,
	    },
	    motor: {
		type: Sequelize.STRING,
	    },
	    portas: {
		type: Sequelize.INTEGER,
	    },
	    cambio: {
		type: Sequelize.STRING,
	    },
	    arCondicionado: {
		type: Sequelize.BOOLEAN,
	    },
    updatedAt: {
        type: Sequelize.DATE,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
})
...
```

### Modificações método POST: adicionei '/adiciona', troquei o 'firm' por 'Veiculo':
```
...
app.post('/adicionar', express.urlencoded({ extended: true }), (req, res) => {
    const resp = {};
    try {
        Veiculo.create(req.body)
            .then(veiculo => {
                resp.status = "ok";
                res.json(resp);
            })
            .catch(error => {
                resp.status = 'fail';
                res.json(resp);
            });
    } catch (error) {
        resp.status = 'fail';
        res.json(resp);
    }
})
...
```
### Curl POST
```
curl --location 'localhost:3000/adicionar' \
--header 'Content-Type: application/json' \
--data '{
 "locadora": "Movida",
 "modelo": "V40",
 "marca": "Volvo",
 "ano": 2023,
 "motor": "2.0",
 "portas": 4,
 "cambio": "Automatico",
 "arCondicionado": true
}'
```

### Modificações método GET: adicionei '/consultar' para chamá-lo na ação e troquei o 'firm' por 'Veiculo', além de algumas melhorias:
```
...
app.get('/consultar', (req, res) => {
    const resp = {};

    try {
	Veiculo.findAll()
	    .then(veiculos => {
	        res.json(veiculos);
	    })
	    .catch(error => {
	        console.log(error);
	        resp.status = 'fail';
	        res.json(resp);
	    });
    } catch (error) {
	console.log(error);
	resp.status = 'fail';
	res.json(resp);
    }
})
...
```
### CURL GET
`curl --location 'http://localhost:3000/consultar' \
--header 'Content-Type: application/json' \
--data ''`

### Modificações método GET por ID: adicionei '/consultar/:id' para chamá-lo na ação e troquei 'firm' por 'Veiculo', além de algumas melhorias::
```
...
app.get('/consultar/:id', (req, res) => {
    const resp = {};

    try {
	Veiculo.findByPk(req.params.id)
	    .then(veiculo => {
	        if (veiculo) {
	            res.json(veiculo);
	        } else {
	            resp.status = 'fail';
	            resp.message = 'Veículo não encontrado.';
	            res.json(resp);
	        }
	    })
	    .catch(error => {
	        console.log(error);
	        resp.status = 'fail';
	        res.json(resp);
	    });
    } catch (error) {
	console.log(error);
	resp.status = 'fail';
	res.json(resp);
    }
})
...
```
### CURL GET/ID
```
curl --location 'localhost:3000/consultar/1' \
--header 'Content-Type: application/json' \
--data ''
```

### Modificações método PUT: adicionei '/atualizar/:id', troquei o 'firm' por 'Veiculo':
```
...
app.put('/atualizar/:id', (req, res) => {
    const resp = {}
    try {
        Veiculo.findOne({
            where: {
                id: req.params.id
            }
        })
            .then(e => {
                e.update(req.body)
                res.json(e)
            })

    } catch (error) {
        resp.status = 'fail'
        res.json(resp)
    }
})
...
```
### CURL PUT
```
curl --location 'localhost:3000/adicionar' \
--header 'Content-Type: application/json' \
--data '{
 "locadora": "Movida",
 "modelo": "V40",
 "marca": "Volvo",
 "ano": 2022,
 "motor": "2.0",
 "portas": 4,
 "cambio": "Automatico",
 "arCondicionado": true
}'
```

### Modificações método DELETE: adicionei '/deletar/:id', troquei o 'Campus' por 'Veiculo':
```
...
app.delete('/deletar/:id', (req, res) => {
    const resp = {};

    try {
        Veiculo.findByPk(req.params.id)
            .then(veiculo => {
                if (veiculo) {
                    veiculo.destroy(); // Exclui o registro se ele existe
                    resp.status = 'ok';
                    res.json(resp);
                } else {
                    resp.status = 'fail';
                    resp.message = 'Registro não encontrado.';
                    res.status(404).json(resp); // Retorna um status HTTP 404 (Not Found)
                }
            })
            .catch(error => {
                console.log(error);
                resp.status = 'fail';
                res.json(resp);
            });
    } catch (error) {
        console.log(error);
        resp.status = 'fail';
        res.json(resp);
    }
});
...
```
### CURL DELETE
`curl --location --request DELETE 'localhost:3000/deletar/1'`


## ESTRUTURA PÁGINA WEB MY_APP/AleRenties:
- ./AleRenties: 	possui toda estrutura da página web
- .//css/style.css: possui os estilos de cada elemento construído
- .//js/app.js: 	possui o javascript 
- .//img: 			possui a imagem de logo
- /node_modules:	possui todos os pacotes necesários para execução
- index.js: 		possui toda a estrutura 
- package-lock.json: possui informações envolvendo a versão dos pacotes, comandos de execução, entre outras questões que situam a aplicação.
- package.json:		possui um atributo scripts com o apontamento para script de nodemon. A subida da API se dá por executar `npm run start` na raiz do projeto


## COMO SE LOCALIZAR NO PROJETO:
- Toda configuração da página web (html/css/js) está em ./AleRenties
- Rode no terminal:
	`docker run --name basic-mysql --rm -v /tmp/mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=ANSKk08aPEDbFjDO -e MYSQL_DATABASE=testing -p 3307:3306 -it mysql:8.0`
	`cd my_app`
	`sudo docker start basic-mysql`
	`npm run start`
- Para rodar o projeto na web copie o caminho do index.html e cole do seu navegador


## COMO É COMPOSTA A PÁGINA WEB:
Ela é composta por 6 htmls:
- "Home", index.html: página principal, com botões de ação para CRUD.  
- "About", about.html: página com dados sobre mim
- "CREAT/POST", form.html: página de cadastro de veículo
- "READ/GET", read.html: página de consultar todos ou por id
- "UPDATE/PUT", update.html: página para atualizar veículo
- "DELETE", delete.html: página para remover veículo
