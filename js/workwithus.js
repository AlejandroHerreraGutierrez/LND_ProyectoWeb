function updateText(valor) {
      valor = valor == 0 ? ":(" : valor;
      document.getElementById('textValue').textContent = valor + "%";
    }