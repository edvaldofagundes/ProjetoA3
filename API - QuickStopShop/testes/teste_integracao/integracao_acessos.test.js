import { criarFuncionario, atualizarFuncionario, listarFuncionarios, deletarFuncionario, funcionarios } from '../../regra_de_negocio/administração';
import { editarPermissoesFuncionario } from '../../regra_de_negocio/acessos';

describe('Testes de Integração de Acessos', () => {
  const admin = { isAdmin: true };
  const naoAdmin = { isAdmin: false };
  const funcionario1 = { id: 1, nome: 'Funcionario 1', permissoes: [] };
  const funcionario2 = { id: 2, nome: 'Funcionario 2', permissoes: [] };

  beforeEach(() => {
    // Limpar estado global de funcionários antes de cada teste
    while (funcionarios.length) funcionarios.pop();
  });

  test('Admin pode criar, atualizar, listar, deletar e editar permissões de funcionários', () => {
    // Criar funcionários
    criarFuncionario(admin, funcionario1);
    criarFuncionario(admin, funcionario2);
    
    // Verificar criação
    let lista = listarFuncionarios(admin);
    expect(lista).toHaveLength(2);

    // Atualizar funcionário
    const novosDados = { nome: 'Funcionario 1 Atualizado' };
    atualizarFuncionario(admin, funcionario1.id, novosDados);
    lista = listarFuncionarios(admin);
    expect(lista.find(f => f.id === funcionario1.id).nome).toBe('Funcionario 1 Atualizado');

    // Editar permissões
    const novasPermissoes = ['LER', 'ESCREVER'];
    editarPermissoesFuncionario(admin, funcionarios, funcionario1.id, novasPermissoes);
    lista = listarFuncionarios(admin);
    expect(lista.find(f => f.id === funcionario1.id).permissoes).toEqual(novasPermissoes);

    // Deletar funcionário
    deletarFuncionario(admin, funcionario2.id);
    lista = listarFuncionarios(admin);
    expect(lista).toHaveLength(1);
  });

  test('Não-admin não pode criar, atualizar, listar, deletar ou editar permissões de funcionários', () => {
    // Tentativa de criar funcionário
    expect(() => criarFuncionario(naoAdmin, funcionario1)).toThrow('Acesso negado');

    // Tentativa de listar funcionários
    expect(() => listarFuncionarios(naoAdmin)).toThrow('Acesso negado');

    // Adiciona um funcionário para testar atualizações e deleções
    criarFuncionario(admin, funcionario1);

    // Tentativa de atualizar funcionário
    const novosDados = { nome: 'Funcionario 1 Atualizado' };
    expect(() => atualizarFuncionario(naoAdmin, funcionario1.id, novosDados)).toThrow('Acesso negado');

    // Tentativa de editar permissões
    const novasPermissoes = ['LER', 'ESCREVER'];
    expect(() => editarPermissoesFuncionario(naoAdmin, funcionarios, funcionario1.id, novasPermissoes)).toThrow('Acesso negado');

    // Tentativa de deletar funcionário
    expect(() => deletarFuncionario(naoAdmin, funcionario1.id)).toThrow('Acesso negado');
  });
});
