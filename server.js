const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'app.html'));
});

app.get('/api/buscar', async (req,res)=>{
  const q = req.query.q;
  const site = req.query.site || 'MLV';
  const url = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=20`;
  console.log('Buscando:', url);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 8000);
    const r = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeout);
    const d = await r.json();
    console.log('Encontrados:', d.results ? d.results.length : 0);
    res.json(d);
  } catch(e){
    console.log('Error ML:', e.message);
    res.json({results:[], error: e.message});
  }
});

app.get('/api/item/:id', async (req,res)=>{
  try{
    const r = await fetch(`https://api.mercadolibre.com/items/${req.params.id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const d = await r.json(); 
    res.json(d);
  }catch(e){res.json({});}
});

app.listen(PORT, ()=>console.log('ok '+PORT));
