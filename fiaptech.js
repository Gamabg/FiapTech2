const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
const port = 3000;
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/FiapTech", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("Erro de conexão com o MongoDB:", err);
});

const usuarioSchema = new mongoose.Schema({
  nome: { type: String },
  email: { type: String, required: true },
  senha: { type: String },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

const produtoSchema = new mongoose.Schema({
  codigo: { type: String, Required: true },
  descricao: { type: String },
  fornecedor: { type: String },
  dataFabricacao: { type: Date },
  quantidadeEstoque: { type: Number },
});

const Produto = mongoose.model("Produto", produtoSchema);

app.post("/cadastrousuario", async (req, res) => {
  const { nome, email, senha } = req.body;

  const hashedPassword = await bcrypt.hash(senha, 10);

  const usuario = new Usuario({
    nome: nome,
    email: email,
    senha: hashedPassword,
  });

  try {
    const newUsuario = await usuario.save();
    res.json({ error: null, msg: "Cadastro Feito", usuarioId: newUsuario._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/cadastroproduto", async (req, res) => {
  const { codigo, descricao, fornecedor, dataFabricacao, quantidadeEstoque } =
    req.body;

  const produto = new Produto({
    codigo: codigo,
    descricao: descricao,
    fornecedor: fornecedor,
    dataFabricacao: dataFabricacao,
    quantidadeEstoque: quantidadeEstoque,
  });

  try {
    const newProduto = await produto.save();
    res.json({ error: null, msg: "Cadastro OK", produtoId: newProduto._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get("/cadastrousuario", async (req, res) => {
  res.sendFile(__dirname + "/cadastrousuario.html");
});

app.get("/cadastroproduto", async (req, res) => {
  res.sendFile(__dirname + "/cadastroproduto.html");
});

app.get("/fiaptech", async (req, res) => {
  res.sendFile(__dirname + "/fiaptech.html");
});

// Configurando a rota para arquivos estáticos (CSS, imagens, etc.)
app.use("/static", express.static(path.join(__dirname, "public")));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
