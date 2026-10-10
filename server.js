const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.get('/', (req,res)=>{res.sendFile(path.join(__dirname,'app.html'))});
app.get('/api/buscar', async (req,res)=>{
  const q=req.query.q; const site=req.query.site||'MLV';
  try{
    const r=await fetch(`https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(q)}&limit=20`);
    const d=await r.json(); res.json(d);
  }catch(e){res.json({results:[]});}
});
app.get('/api/item/:id', async (req,res)=>{
  try{
    const r=await fetch(`https://api.mercadolibre.com/items/${req.params.id}`);
    const d=await r.json(); res.json(d);
  }catch(e){res.json({});}
});
app.listen(PORT, ()=>console.log('ok '+PORT));
