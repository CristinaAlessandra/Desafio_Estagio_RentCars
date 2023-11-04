const sequelize = require('sequelize')
const express = require('express')
const cors = require('cors');

const Sequelize = sequelize.Sequelize

const connection = new Sequelize(
    'testing',
    'root',
    'ANSKk08aPEDbFjDO',
    {
        dialect: "mysql",
        host: 'localhost',
        port: 3307
    }
);
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
connection.sync({ force: true }) //sync to your database!

const app = express()
app.use(cors());
app.use(express.json());

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


const port = 3000

app.listen(port, () => {
    console.log(`On port ${port}`)
})
