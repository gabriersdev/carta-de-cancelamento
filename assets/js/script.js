import exibirDadosProjeto from './modules/about.js';
import { criarTooltips, popovers, tooltips, verificarInputsRecarregamento } from './modules/util.js';
import dados from './modules/data.js';
import fns from './modules/functions.js';

(() => {
  function atribuirLinks() {
    const linkElementos = document.querySelectorAll('[data-link]');

    linkElementos.forEach((link) => {
      if(link.dataset.link && dados.links.find((e) => e.id === link.dataset.link)){
        link.setAttribute('href', dados.links.find((e) => e.id === link.dataset.link).link);
        link.setAttribute('rel', 'noopener noreferrer');
      }else{
        console.warn('O link não foi implementado.');
      }

      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function atribuirAcoes() {
    const elementos = document.querySelectorAll('[data-action]');

    const acoes = {
      'acao': fns.action
    }

    elementos.forEach((acao) => {
      switch (acao.dataset.action) {
        case 'acao':
          $(acao).on('click', () => {
            acoes.acao();
          });
        break;

        default:
          console.warn('A ação %s não foi implementada.', acao.dataset.action);
        break;
      }
    });
  }

  window.addEventListener('load', () => {
    $('.overlay').hide();
    exibirDadosProjeto();
    atribuirLinks();
    atribuirAcoes();
    criarTooltips();
    document.querySelectorAll('[data-recarrega-pagina]').forEach((botao) => {
      botao.addEventListener('click', () => {
        window.location.reload();
      });
    });
    verificarInputsRecarregamento();
  });

  window.addEventListener('DOMContentLoaded', () => {
    tooltips();
    popovers();
  });
})();
