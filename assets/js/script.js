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

    const infoName = $('span#info-name');
    const infoCPF = $('span#info-CPF');
    const clientName = $('input#client-name');
    const clientCPF = $('input#client-CPF');

    // Add. máscaras
    const initialSizes = {
      'client-name': 20,
      'client-CPF': 14
    }

    $(clientName).mask('S', { translation: { 'S': { pattern: /[A-Za-zÀ-ú ]/, recursive: true } } });
    $(clientCPF).mask('000.000.000-00');
    $(clientCPF).attr('size', initialSizes['client-CPF']);

    // Eventos de escuta
    $('input').on('input', (event) => {
      String(event.target.value).length > 0 && String(event.target.value).length > initialSizes[event.target.id] ? $(event.target).attr('size', event.target.value.length) : $(event.target).attr('size', initialSizes[event.target.id]);
    });

    // Print
    window.onbeforeprint = (event) => {
      $(event.target.document).find('#data').attr('style', 'line-height: 1.5');

      $(clientName).hide();
      $(clientCPF).hide();

      if ($(clientName).val()) {
        if ($(clientName).val().trim().length > 0) {
          $(infoName).text($(clientName).val())
        } else {
          $(infoName).text('__________________________');
        };
      } else {
        $(infoName).text('__________________________');
      };

      if ($(clientCPF).val()) {
        if ($(clientCPF).val().trim().length > 0) {
          $(infoCPF).text($(clientCPF).val());
        } else {
          $(infoCPF).text('___.___.___-__');
        }
      } else {
        $(infoCPF).text('___.___.___-__');
      }

      $(infoName).show();
      $(infoCPF).show();
    }

    window.onafterprint = (event) => {
      $(event.target.document).find('#data').attr('style', 'line-height: 2.25');

      if ($(clientName).val()) {
        if ($(clientName).val().trim().length > 0) {
          $(clientName).val($(infoName).text());
          $(clientName).show();
          $(infoName).text('');
          $(infoName).hide();
        }
      } else if (infoName.text() === '__________________________') {
        $(clientName).val('');
        $(clientName).show();
        $(infoName).text('');
        $(infoName).hide();
      }

      if ($(clientCPF).val()) {
        if ($(clientCPF).val().trim().length > 0) {
          $(clientCPF).val($(infoCPF).text());
          $(clientCPF).show();
          $(infoCPF).text('');
          $(infoCPF).hide('');
        }
      } else if (infoCPF.text() === '___.___.___-__' ) {
        $(clientCPF).val('');
        $(clientCPF).show();
        $(infoCPF).text('');
        $(infoCPF).hide();
      }
    }

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
