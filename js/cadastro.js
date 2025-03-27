document.addEventListener('DOMContentLoaded', () => {
    const userInfoDiv = document.getElementById('user-info');

    // Obtém os dados enviados pelo formulário
    const urlParams = new URLSearchParams(window.location.search);
    const nome = urlParams.get('nome') || 'Não informado';
    const email = urlParams.get('email') || 'Não informado';
    const password = urlParams.get('password') || '';

    // Salva os dados no localStorage
    localStorage.setItem('user', JSON.stringify({ nome, email, password }));

    // Exibe as informações do usuário
    userInfoDiv.innerHTML = `
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
    `;
});
