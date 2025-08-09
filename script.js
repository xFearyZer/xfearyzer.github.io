// Generate simple random key (UUID v4 style, client-side only)
function generateKey(name){
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  }) + (name? '-' + encodeURIComponent(name).slice(0,12) : '');
}

document.getElementById('generateKeyBtn').addEventListener('click', function(){
  const name = document.getElementById('nameInput').value.trim();
  const key = generateKey(name);
  document.getElementById('keyOutput').textContent = key;
});

// Editor -> sandboxed iframe preview
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const preview = document.getElementById('previewFrame');

function buildPreview(html, css, js){
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>
        try{
          ${js}
        }catch(e){
          document.body.insertAdjacentHTML('beforeend','<pre style="color:red;">'+e.toString()+'</pre>');
        }
      <\/script>
    </body>
  </html>`;
}

runBtn.addEventListener('click', function(){
  const html = document.getElementById('htmlArea').value;
  const css  = document.getElementById('cssArea').value;
  const js   = document.getElementById('jsArea').value;
  const doc = buildPreview(html, css, js);
  preview.srcdoc = doc;
});

clearBtn.addEventListener('click', function(){
  document.getElementById('htmlArea').value = '';
  document.getElementById('cssArea').value = '';
  document.getElementById('jsArea').value = '';
  preview.srcdoc = '';
});
