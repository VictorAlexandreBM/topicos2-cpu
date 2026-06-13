package org.acme.cpu.cliente.services.usuario;

import jakarta.transaction.Transactional;
import org.acme.cpu.admin.dto.cpu.CpuListDTO;
import org.acme.cpu.cliente.dtos.usuario.*;
import org.acme.cpu.core.dtos.respostaPaginada.RespostaPaginadaDTO;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO findByLogin(String email);

    UsuarioLogadoResponseDTO logar(UsuarioLoginDTO dto);

    UsuarioResponseDTO cadastrar(UsuarioCadastroDTO dto);

    UsuarioResponseDTO atualizar(UsuarioUpdateDTO dto);

    RespostaPaginadaDTO<UsuarioListDTO> listarUsuarios(Integer pagina, Integer tamanho, String filtro, Boolean ativo, String campoOrdenacao, String direcao);

    @Transactional
    void alterarStatus(Long id, boolean ativo);

    @Transactional
    void alterarPerfil(Long id, char siglaPerfil);

    @Transactional
    void adicionarFavorito(Long cpuId);

    @Transactional
    void removerFavorito(Long cpuId);

    List<CpuListDTO> listarFavoritos();
}
