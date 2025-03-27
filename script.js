let validator = {
  handleSubmit: (event) => {
    event.preventDefault();
    let send = true;

    let inputs = form.querySelectorAll('input');

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      let check = validator.checkInput(input);
      if (check !== true) {
        send = false;
        console.log(check);
        input.style.borderColor = 'red'; // Exibir erro visual
        let errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.innerHTML = check;
        input.parentElement.appendChild(errorElement);
      } else {
        input.style.borderColor = ''; // Remover erro visual
        let errorElement = input.parentElement.querySelector('.error');
        if (errorElement) {
          errorElement.remove();
        }
      }
    }

    if (send) {
      form.submit();
    }
  },

  checkInput: (input) => {
    let rules = input.getAttribute('data-rules');
    if (rules !== null) {
      rules = rules.split('|');
      for (let k in rules) {
        let rDetails = rules[k].split('=');
        switch (rDetails[0]) {
          case 'required':
            if (input.value == '') {
              return 'Campo obrigatório';
            }
            break;
          case 'min':
            if (input.value.length < rDetails[1]) {
              return `Mínimo de ${rDetails[1]} caracteres`;
            }
            break;
          case 'email':
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
              return 'Email inválido';
            }
            break;
          case 'match':
            let matchField = document.querySelector(`input[name="${rDetails[1]}"]`);
            if (matchField && input.value !== matchField.value) {
              return 'Os campos não coincidem.';
            }
            break;
          case 'password':
            let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
            if (!passwordRegex.test(input.value)) {
              return 'A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, um número e um caractere especial.';
            }
            break;
        }
      }
    }
    return true;
  }
};

let form = document.querySelector('.validator'); // Corrigido o seletor
form.addEventListener('submit', validator.handleSubmit);

document.addEventListener('DOMContentLoaded', () => {
    const toggleLogin = document.getElementById('toggle-login');
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');

    // Alternar entre formulário de cadastro e login
    toggleLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    });

    // Lógica de login
    loginButton.addEventListener('click', () => {
        const email = document.getElementById('login_email').value.trim(); // Remove espaços em branco
        const password = document.getElementById('login_password').value.trim(); // Remove espaços em branco

        // Obtém os dados do localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        if (user && user.email === email && user.password === password) {
            // Redireciona para a página de perfil
            window.location.href = 'perfil.html';
        } else {
            alert('Email ou senha inválidos.');
        }
    });
});