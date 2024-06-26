const apresentarDadosProjeto = (dados_do_projeto, novas_funcionalidades) => {
  // Exibindo dados
  console.groupCollapsed(`${dados_do_projeto['Project name'] ?? 'Projeto'}, Version ${dados_do_projeto.Version ?? '-'}`);
  console.table(dados_do_projeto);
  console.groupEnd();

  console.groupCollapsed('New features');
  novas_funcionalidades.toSorted((a, b) => a.localeCompare(b)).forEach((feature) => { console.info(`${feature}`); });
  console.groupEnd();
  // Fim da apresentação do projeto
}

// Apresentação do Projeto no console
let dados_do_projeto = {
  Hostname: new URL(window.location).hostname,
  Origin: new URL(window.location).origin,
  Status: 'Active',
};

const novas_funcionalidades = [
  // Lista de novas funcionalidades
  'Adicionado suporte a Web Components',
  'Adicionado download da carta de cancelamento com Print.js',
  'Validação dos dados preenchidos no formulário de cancelamento',
  'Feedback dos dados preenchidos no formulário com SweetAlert2',
  'Recebimento de dados do formulário de cancelamento via parâmetro GET na URL',
];

// Carregando dados do arquivo de manifest.json
export default async () => {
  // Import manifest.json no diretório raiz do projeto
  await fetch('manifest.json')
  .then((response) => {
    return response.json();
  })
  .then((manifest) => {
    const dados_manifest = {
      'Project name': manifest.name,
      'Developer': manifest.developer,
      'Version': manifest.version,
      'Release Date': manifest.release_date
    };
    dados_do_projeto = (Object.assign({}, dados_manifest, dados_do_projeto));

    Object.freeze(novas_funcionalidades);
    Object.freeze(dados_do_projeto);

    apresentarDadosProjeto(dados_do_projeto, novas_funcionalidades);
    return true;
  })
  .catch((error) => {
    console.info('Não foi possível carregar o arquivo de manifest.json.');
    console.error(error);
    return false;
  });
};
