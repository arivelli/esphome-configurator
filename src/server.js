const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();
app.use(cors());

app.get('/files/:fileName?', (req, res) => {
  const directoryPath = __dirname + '/../public/projects'; // Directorio actual, puedes cambiarlo según tus necesidades

  //if fileName is not provided, return all files
  if (!req.params.fileName) {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.log('Error al leer el directorio:', err);
        res.status(500).json({ error: 'Error al leer el directorio' });
      } else {
        files = files.filter((file) => file.endsWith('.yaml'));
        res.json({ files });
      }
    });
  } else {
    //if not return the file content 
    const filePath = path.join(directoryPath, req.params.fileName + '.yaml');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log('Error al leer el archivo:', err);
        res.status(500).json({ error: 'Error al leer el archivo' });
      } else {
        data = data.replace(/!secret/g, 'secret');
        const content = yaml.load(data, { schema: yaml.JSON_SCHEMA });

        res.json(content);
      }
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
