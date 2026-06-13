package org.acme.cpu.cliente.dtos.usuario;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.acme.cpu.cliente.dtos.telefone.TelefoneDTO;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

public record UsuarioUpdateDTO(
        @Schema(description = "Nome atualizado", example = "Camila")
        @NotBlank(message = "O nome não pode ser vazio")
        @Size(max = 50)
        String nome,

        @Schema(description = "Sobrenome atualizado", example = "Brito Souza")
        @NotBlank(message = "O sobrenome não pode ser vazio")
        @Size(max = 100)
        String sobrenome,

        @Schema(
                description = "Nova lista de contatos. Atenção: Esta lista substitui a anterior.",
                nullable = true
        )
        @Valid
        List<TelefoneDTO> telefones,

        @Schema(description = "Senha atual para confirmação da alteração")
        @NotBlank(message = "A senha atual é obrigatória para confirmar as alterações")
        String senhaAtual
){
}