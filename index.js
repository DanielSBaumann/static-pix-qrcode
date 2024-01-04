import express from 'express';
import { gerarEMVPixEstatico } from './utils/QrcodeGenerator.js'

const app = express();
const port = 3000;

app.get('/api/v1', (req, res) => {
    const nome = req.query.nome || '';
    const cidade = req.query.cidade || '';
    const chave = req.query.chave || '';
    const valor = parseFloat(req.query.valor) || 0;
    const mensagem = req.query.mensagem || '';
    const txid = req.query.txid || '';

    const emvPix = gerarEMVPixEstatico(txid,
        valor,
        chave,
        mensagem,
        nome,
        cidade);

    console.log(`Generated EMV: ${emvPix}`);

    res.json(emvPix);

});

app.listen(port, () => {
    console.log(`Service runnig on :${port}`);
});