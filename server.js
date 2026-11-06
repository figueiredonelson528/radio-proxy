const express = require('express');
const http = require('http');
const app = express();

const STREAM_URL = 'http://109.169.23.84:25501/;';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Connection': 'keep-alive'
    });

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': '*/*'
        }
    };

    http.get(STREAM_URL, options, (stream) => {
        stream.pipe(res);
    }).on('error', (err) => {
        console.error("Erro no proxy:", err.message);
        if (!res.headersSent) {
            res.status(500).send("Erro ao ligar ao fluxo da rádio.");
        }
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Proxy HTTPS ativo na porta ${PORT}`);
});
