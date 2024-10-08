const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();
// Analizar las solicitudes con 'Content-Type: application/x-www-form-urlencoded'
app.use(bodyParser.urlencoded({ extended: false }));

// Analizar las solicitudes con 'Content-Type: application/json'
app.use(bodyParser.json());

app.use(cors());

const directoryPath = __dirname + '/../public/projects'; 
app.get('/files/:fileName?', (req, res) => {

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

        if (req.params.fileName == 'new') {
          const crypto = require('crypto');
          content.api.encryption.key = crypto.randomBytes(32).toString('hex');
          content.ota.password = crypto.randomBytes(8).toString('hex');
          content.wifi.ap.password = crypto.randomBytes(8).toString('hex');
        }
        
        res.json(content);
      }
    });
  }
});

app.post('/files/:fileName?', (req, res) => {
  const filePath = path.join(directoryPath, req.params.fileName + '.yaml');
  let data = yaml.dump(req.body);
  data = data.replace(/secret/g, '!secret');
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.log('Error al escribir el archivo:', err);
      res.status(500).json({ error: 'Error al escribir el archivo' });
    } else {
      res.json({ success: true });
    }
  });
});

app.get('/setup', (req, res) => { 
  const filePath = path.join(directoryPath, 'setup.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      const emptySetup = {
        wifi: {
          ssid: '',
          password: '',
        },
        api: {
          encryption: {
            key: '',
          }
        },
        logger: {
          level: 'VERY_VERBOSE',
        },
        ota: {
          password: '',
        }
      };
        fs.writeFile(filePath, JSON.stringify(emptySetup), (err) => {
          if (err) {
            console.log('Error al crear el archivo:', err);
            res.status(500).json({ error: 'Error al crear el archivo' });
          } else {
            res.json(emptySetup);
          }
        });
        
        
      } else {
        data = data.replace(/!secret/g, 'secret');

        res.json(JSON.parse(data));
      }
    });
});

app.post('/setup', (req, res) => {
  const content = req.body;
  const filePath = path.join(directoryPath, 'setup.json');
  fs.writeFile(filePath, JSON.stringify(content), (err) => {
    if (err) {
      console.log('Error al crear el archivo:', err);
      res.status(500).json({ error: 'Error al guardar el archivo' });
    } else {
      res.json(content);
    }
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor escuchando en todas las interfaces de red en el puerto 3000');
});
