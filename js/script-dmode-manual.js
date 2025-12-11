// Função para lidar com imagens de logo (fundo transparente)
function removeWhiteBackground(imgElement) {
  const img = imgElement;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Se o pixel é branco ou quase branco
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0; // torna transparente
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Substitui a imagem pelo canvas com fundo transparente
  img.src = canvas.toDataURL('image/png');
}

// Inicialização dos scripts quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  // Lógica para limpar fundo dos logos
  const logos = document.querySelectorAll('.brand-logo');
  logos.forEach(img => {
    if (img.complete) {
      removeWhiteBackground(img);
    } else {
      img.onload = () => removeWhiteBackground(img);
    }
  });

  // --- LÓGICA DO MODO ESCURO (DARK MODE) ---
  // Seleciona o botão pelo ID
  const btn = document.getElementById("toggleDark");

  if (btn) { 
    // Adiciona o evento de clique
    btn.addEventListener("click", () => {
      // Alterna a classe 'dark' no corpo do documento (body)
      document.body.classList.toggle("dark");

      // Verificação para trocar o ícone do botão (Lua/Sol)
      if (document.body.classList.contains("dark")) {
        btn.textContent = "☀️"; // Muda para sol se estiver escuro
      } else {
        btn.textContent = "🌙"; // Muda para lua se estiver claro
      }

      // Salva a preferência do usuário no localStorage para persistir após recarregar
      localStorage.setItem("theme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );
    });

    // Ao carregar a página, verifica se o usuário já tinha escolhido o tema escuro
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      btn.textContent = "☀️"; // Garante que o ícone esteja correto
    }
  }
});
