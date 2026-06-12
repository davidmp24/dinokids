# 🦕 DinoKids

**Um Sistema Educacional Gamificado para a Primeira Infância**

![DinoKids](https://img.shields.io/badge/Status-MVP%20Conclu%C3%ADdo-brightgreen)
![Vanilla JS](https://img.shields.io/badge/Tecnologia-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-orange)
![Offline First](https://img.shields.io/badge/Suporte-100%25%20Offline-blue)

O **DinoKids** é um sistema web lúdico e progressivo desenvolvido especialmente para introduzir crianças pequenas (a partir de 4 anos) ao uso do computador (mouse e teclado). Com foco em acessibilidade motora, o projeto foi desenhado do zero para rodar perfeitamente de forma local e offline, sendo ultraleve (ideal para computadores antigos, como Windows 7 com 2 GB de RAM).

---

## 🎯 Objetivo

Criar uma experiência segura, sem anúncios e divertida que permita à criança:
1. Aprender a controlar o cursor do mouse (com um mouse físico/USB).
2. Treinar precisão de clique (point-and-click).
3. Desenvolver raciocínio espacial e lógico através de mecânicas de *Drag & Drop* (Arrastar e Soltar).
4. Ter o primeiro contato produtivo com o teclado.
5. Desenvolver a criatividade em um ambiente de exploração livre.

## ✨ Funcionalidades Principais

* 🎮 **Módulos Progressivos**: A criança avança gradualmente, começando pela simples compreensão de "causa e efeito" de um clique, até conseguir completar sequências lógicas.
* 🦖 **Mascote Interativo (Dino Rex)**: O Rex acompanha a criança em todas as atividades, reagindo a cliques e fornecendo feedback positivo contínuo.
* 🌟 **Sistema de Recompensas (Estrelinhas)**: Gamificação simples com som e visual para celebrar cada pequena vitória, sem nunca punir os erros.
* 🖱️ **UX Adaptada para Mãos Pequenas**:
  * Cursor grande e customizado (para não perder de vista).
  * Tolerância estendida (*snap tolerance*) no Drag & Drop para compensar a imprecisão motora.
  * Botões extra grandes.
  * Prevenção de "clique duplo" acidental (Debounce).
* 🔊 **Engine de Áudio Nativa**: Sons gerados em tempo real pela `Web Audio API`, garantindo uma resposta sonora gratificante sem a necessidade de baixar dezenas de arquivos MP3, ajudando na performance em máquinas lentas.
* 💾 **Progresso Salvo (Local)**: Utilização do `localStorage` para que a criança continue de onde parou sem necessidade de banco de dados ou internet.
* ⏱️ **Timer de Sessão**: Um pequeno contador na tela que avisa quando é hora de "descansar os olhinhos".

---

## 🗺️ Mapa de Aventuras (Módulos)

1. **Módulo 0: Olá, Mundo!** - Introdução ao clique básico no Rex.
2. **Módulo 1: Movendo o Mouse** - Acompanhar um alvo em movimento pelo mapa.
3. **Módulo 2: Clique Certeiro** - Clicar em ovos trêmulos para chocar filhotes.
4. **Módulo 3: Arrastar e Soltar (Drag & Drop)** - Quebra-cabeças de peças grandes.
5. **Módulo 4: Sequência Lógica** - Organizar a ordem correta para alimentar o Rex.
6. **Módulo 5: Teclado Mágico** - Encontrar letras e números específicos no teclado.
7. **Módulo 6: Mundo Criativo** - Uma lousa digital simplificada para desenhar livremente com cores variadas.

---

## 🚀 Como Executar o Projeto

Como o projeto foi desenvolvido focado na simplicidade e em rodar sem conexões externas, para executá-lo basta:

1. Fazer o clone ou download deste repositório.
2. Abrir o arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Firefox, Edge).
3. **Pronto!** O jogo começará a rodar imediatamente.

*Nenhum servidor web, Node.js ou dependência complexa é necessária!*

---

## 💻 Arquitetura e Stack Tecnológica

O sistema foi montado como uma **Single Page Application (SPA)** puramente em código nativo, visando altíssima performance:

* **HTML5**: Estrutura das telas dividida por camadas virtuais (`divs` com mudança de opacidade).
* **CSS3**: Layout, animações por *keyframes*, gradientes visuais vibrantes e suporte responsivo.
* **JavaScript (Vanilla)**: Toda a regra de negócio, gestão de telas, progresso (`localStorage`) e engine visual (via Canvas e DOM puro).

---

## 👶 Recomendações de Uso para os Pais

Para garantir a melhor experiência para a criança:
* **Configuração do Windows**: Se estiver usando Windows, recomenda-se entrar em `Painel de Controle > Mouse` e abaixar a velocidade do ponteiro, desativando a opção "Aprimorar precisão do ponteiro".
* **Mousepad**: Utilize uma superfície lisa e clara.
* **Acompanhamento**: Fique por perto nas primeiras vezes para celebrar junto com a criança!

---

*Projeto criado com muito carinho para unir tecnologia, aprendizado infantil e acessibilidade digital.* ❤️
