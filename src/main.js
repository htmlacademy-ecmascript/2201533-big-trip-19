console.log('main.js');

DATA_URL = 'https://19.ecmascript.pages.academy/big-trip/destinations';

const loadData = (renderAds)=>
  fetch(DATA_URL,{
  headers: {
    Authorization: 'Basic er8hg83jdr543w',
  }
  })
    .then((response)=>{
      if (response.ok){
        return response.text();
      }
      throw `status: ${response.status},
        statusText: ${response.statusText}`;
    })
    .then(console.log)
    .catch(console.log);


loadData()
  .then(r => console.log(r))
