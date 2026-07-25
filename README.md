# Desafio Técnico - Sistema de Agendamento (DevClub)

Este projeto foi desenvolvido como parte do desafio técnico para o processo seletivo do DevClub. Trata-se de uma aplicação web de agendamento de serviços (CRUD) com separação de responsabilidades entre Cliente e Administrador, validação de horários e persistência de dados.

## 🔗 Links do Projeto
- **Deploy (Aplicação em Produção):** [Coloque seu link do Netlify aqui]
- **Repositório GitHub:** [Coloque o link do repositório aqui]

---

## 🛠️ Tecnologias Utilizadas
- **HTML5:** Estruturação semântica das páginas e formulários.
- **CSS3:** Estilização, layout flexível e responsividade para dispositivos móveis.
- **JavaScript (Vanilla):** Lógica de negócios, manipulação do DOM e controle de autenticação.
- **LocalStorage:** Persistência de dados diretamente no navegador do usuário.

---

## 🤖 Ferramentas de IA Utilizadas
Durante o desenvolvimento, utilizei a inteligência artificial **Google Gemini** como um assistente de "pair programming". O uso da IA me auxiliou para:
- Estruturar o escopo inicial do layout em HTML/CSS.
- Refinar e otimizar as funções de lógica de negócios (como a filtragem de horários ocupados no JavaScript).
- Organizar boas práticas no versionamento e documentação do código.

---

## ⚙️ Decisões Técnicas Adotadas
1. **Ausência de Frameworks:** Optei por utilizar HTML, CSS e JavaScript puros (Vanilla) para demonstrar domínio sólido sobre os fundamentos da web, manipulação direta de DOM e eventos, sem depender de abstrações de bibliotecas externas.
2. **Persistência com LocalStorage:** Para atender ao requisito de persistência de forma ágil e rodar 100% no front-end, estruturei o banco de dados no formato JSON salvando-o no `localStorage`. Isso garante que as informações não se percam ao atualizar a página.
3. **Autenticação Simulada:** Criei uma camada de autenticação onde clientes podem se cadastrar. Para a visão administrativa, injetei credenciais estáticas validadas via JavaScript, garantindo a separação de papéis entre visão do Cliente e do Administrador exigida no desafio.
4. **Arquitetura Modular em Camadas Limpas:** O projeto foi intencionalmente dividido em apenas três arquivos centrais (`index.html`, `style.css`, `script.js`), facilitando a leitura por quem for avaliar a estruturação de pastas e a separação de Interface vs Estilo vs Comportamento.

---

## 🔐 Credenciais de Acesso

Para avaliar o sistema, você pode criar uma conta de Cliente no próprio formulário de cadastro da aplicação, ou acessar diretamente a **Área Administrativa** utilizando a conta oculta abaixo:

- **E-mail (Admin):** `jhone.walker@gmail.com`
- **Senha (Admin):** `walker007`

*(Aviso: Se você logar com essas credenciais, o botão para o "Painel Administrativo" será liberado no cabeçalho superior).*

---

## 🚀 Instruções para executar localmente

Siga o passo a passo abaixo para rodar o projeto na sua própria máquina:

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
