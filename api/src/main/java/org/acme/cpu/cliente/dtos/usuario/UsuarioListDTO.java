package org.acme.cpu.cliente.dtos.usuario;


import org.acme.cpu.cliente.dtos.endereco.EnderecoResponseDTO;
import org.acme.cpu.cliente.dtos.telefone.TelefoneResponseDTO;
import org.acme.cpu.cliente.models.Usuario;
import org.acme.cpu.pedido.dtos.cartao.CartaoResponseDTO;
import org.acme.cpu.pedido.models.Cartao;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@Schema(description = "Perfil completo do cliente (Visão Administrativa ou do Próprio Usuário)")
public record UsuarioListDTO(

        Long id,

        @Schema(example = "joao.silva@gmail.com", format = "email")
        String email,

        @Schema(example = "João")
        String nome,

        @Schema(example = "da Silva")
        String sobrenome,

        @Schema(description = "Todos os telefones cadastrados")
        List<TelefoneResponseDTO> telefones,

        char perfil,

        Boolean ativo
) {
    public UsuarioListDTO(Usuario u) {
        this(
                u.getId(),
                u.getEmail(),
                u.getPrimeiroNome(),
                u.getSobrenome(),
                u.getTelefones().stream().map(TelefoneResponseDTO::new).toList(),
                u.getPerfil().getSigla(),
                u.isAtivo()
        );
    }

}