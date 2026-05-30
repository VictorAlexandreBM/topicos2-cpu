package org.acme.cpu.cliente.services.usuario;

import org.acme.cpu.cliente.dtos.usuario.UsuarioCadastroDTO;
import org.acme.cpu.cliente.dtos.usuario.UsuarioLogadoResponseDTO;
import org.acme.cpu.cliente.dtos.usuario.UsuarioLoginDTO;
import org.acme.cpu.cliente.dtos.usuario.UsuarioResponseDTO;

public interface UsuarioService {
    UsuarioResponseDTO findByLogin(String email);

    UsuarioLogadoResponseDTO logar(UsuarioLoginDTO dto);

    UsuarioResponseDTO cadastrar(UsuarioCadastroDTO dto);
}
