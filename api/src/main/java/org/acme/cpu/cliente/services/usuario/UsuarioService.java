package org.acme.cpu.cliente.services.usuario;

import org.acme.cpu.cliente.dtos.usuario.*;

public interface UsuarioService {
    UsuarioResponseDTO findByLogin(String email);

    UsuarioLogadoResponseDTO logar(UsuarioLoginDTO dto);

    UsuarioResponseDTO cadastrar(UsuarioCadastroDTO dto);

    void atualizar(UsuarioUpdateDTO dto);
}
