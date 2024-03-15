import exibirDadosProjeto from './modules/about.js';
import { SwalAlert, criarTooltips, popovers, tooltips, verificarCPF, verificarInputsRecarregamento } from './modules/util.js';
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
    const btnPrint = $('#btn-print');

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

      if (event.target.id === 'client-CPF') {
        if (verificarCPF(event.target.value)) {
          event.target.setAttribute('title', 'CPF válido!');
          event.target.classList.remove('is-invalid');
          event.target.classList.add('is-valid');
        } else {
          event.target.setAttribute('title', 'CPF inválido!');
          event.target.classList.add('is-invalid');
          event.target.classList.remove('is-valid');
        }
      }
    });

    // Informando data e hora
    if (moment()) {
      $('#operation-datetime').text(moment().format('DD/MM/YYYY HH:mm:ss'));
      $('#operation-date').text(moment().format('DD/MM/YYYY'));
    } else {
      Swal.fire({
        title: 'Atenção!',
        text: 'Não foi possível atualizar a data e hora. Recarregue a página e tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }

    const verifyURLParams = () => {
      // Verifica parâmetros de URL
      const urlParams = new URLSearchParams(window.location.search.replaceAll('+', ' '));
      const params = {
        nome: urlParams.get('nome') ? decodeURIComponent(urlParams.get('nome')).match(/[A-zÀ-ú ]/gi) : null,
        ide: urlParams.get('ide') ? decodeURIComponent(urlParams.get('ide')).match(/\d/gi) : null,
      }

      if (params.nome && params.ide) {
        params.nome = params.nome.join('').substring(0, initialSizes['client-name']);

        try {
          params.ide = params.ide.join('').match("(?<part1>[0-9]{3})(?<part2>[0-9]{3})(?<part3>[0-9]{3})(?<part4>[0-9]{2})").groups;
          params.ide = `${params.ide.part1}.${params.ide.part2}.${params.ide.part3}-${params.ide.part4}`;
        } catch (error) {
          params.ide = '';
        }

        if (params.ide.length === 14 && verificarCPF(params.ide)) {
          // $('#client-name').val(params.nome);
          // $('#client-CPF').val(params.ide);
          return { nome: params.nome, ide: params.ide };
        } else {
          // Informar que os parâmetros não foram definidos corretamente
          Swal.fire({
            title: 'Atenção!',
            text: 'CPF informado não é válido!',
            icon: 'warning',
            confirmButtonText: 'OK'
          })
        }

      } else if (params.nome || params.ide) {
        // Informar que os parâmetros não foram definidos corretamente
        Swal.fire({
          title: 'Atenção!',
          text: 'Os parâmetros de URL não foram definidos corretamente.',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
      }
      return null;
    };

    const showOnlyInfos = (data) => {
      if (data.nome) {
        if (data.nome.trim().length > 0) {
          $(infoName).text(data.nome);
          $(clientName).hide();
          $(infoName).show();
        } else {
          $(infoName).text('__________________________');
        }
      } else {
        $(infoName).text('__________________________');
      }

      if (data.ide) {
        if (data.ide.trim().length > 0 && verificarCPF(data.ide)) {
          $(infoCPF).text(data.ide);
          $(clientCPF).hide();
          $(infoCPF).show();
        } else {
          Swal.fire({
            title: 'Atenção!',
            text: 'CPF informado não é válido!',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          $(infoCPF).text('___.___.___-__');
        }
      } else {
        $(infoCPF).text('___.___.___-__');
      }
    }

    const showOnlyInputs = () => {
      $(clientName).show();
      $(infoName).text('');
      $(infoName).hide();
      $(clientCPF).show();
      $(infoCPF).text('');
      $(infoCPF).hide();
    }

    // Print
    window.onbeforeprint = (event) => {
      $(event.target.document).find('#data').attr('style', 'line-height: 1.5');

      $(clientName).hide();
      $(clientCPF).hide();

      showOnlyInfos({ nome: $(clientName).val(), ide: $(clientCPF).val() });

      const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // Add. e exibindo ID
      const id = shuffle(String(Date.now()).split('').concat($(clientName).val().match(/\b\w{1}/gi))).join('').toUpperCase().substr(0, 15);
      const operationID = $(event.target.document).find('#operation-ID');

      if (operationID.length !== 0) {
        $('#aditional-infos').prepend(`<span class="text-uppercase" id="operation-ID">${id}</span>`);
      } else {
        $(operationID).text(id);
        $(operationID).show();
      }

      // Atualizando data e hora
      if (moment()) {
        $('#operation-datetime').text(moment().format('DD/MM/YYYY HH:mm:ss'));
        $('#operation-date').text(moment().format('DD/MM/YYYY'));
      } else {
        Swal.fire({
          title: 'Atenção!',
          text: 'Não foi possível atualizar a data e hora. Recarregue a página e tente novamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }

      $(infoName).show();
      $(infoCPF).show();
      $(btnPrint).hide();
    }

    window.onafterprint = (event) => {
      $(event.target.document).find('#data').attr('style', 'line-height: 2.25');

      $(event.target.document).find('#operation-ID').hide();
      $(btnPrint).show();

      if (verifyURLParams()) {
        return false;
      }

      // TODO - Refatorar
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
        if ($(clientCPF).val().trim().length > 0 && verificarCPF($(clientCPF).val())) {
          $(clientCPF).val($(infoCPF).text());
          $(clientCPF).show();
          $(infoCPF).text('');
          $(infoCPF).hide();
        } else {
          $(clientCPF).val('');
          $(clientCPF).show();
          $(infoCPF).text('');
          $(infoCPF).hide();
        }
      } else if (infoCPF.text() === '___.___.___-__' ) {
        $(clientCPF).val('');
        $(clientCPF).show();
        $(infoCPF).text('');
        $(infoCPF).hide();
      }
    }

    if (verifyURLParams()) {
      const { nome, ide } = verifyURLParams();
      showOnlyInfos({ nome, ide });
      $('#client-name').val(nome);
      $('#client-CPF').val(ide);
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
