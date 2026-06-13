package org.acme.cpu.cliente.dtos.usuario;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.acme.cpu.cliente.dtos.telefone.TelefoneDTO;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

public record UsuarioCadastroDTO(

        @Schema(
                description = "E-mail principal (será usado como Login)",
                example = "victoralexandre@unitins.br",
                format = "email",
                required = true
        )
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "O formato do e-mail é inválido")
        String email,

        @Schema(
                description = "Confirmação do e-mail (deve ser idêntico ao anterior)",
                example = "victoralexandre@unitins.br",
                format = "email"
        )
        @NotBlank(message = "A confirmação de e-mail é obrigatória")
        @Email(message = "O formato do e-mail de confirmação é inválido")
        String confirmarEmail,

        @Schema(
                description = "Senha de acesso",
                example = "SenhaForte@123",
                minLength = 8,
                writeOnly = true,
                required = true
        )
        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        @Size(max = 255, message = "A senha é muito longa")
        String senha,

        @Schema(
                description = "Confirmação da senha (deve ser idêntica à anterior)",
                example = "SenhaForte@123",
                writeOnly = true
        )
        @NotBlank(message = "A confirmação de senha é obrigatória")
        String confirmarSenha,

        @Schema(
                description = "Primeiro nome",
                example = "João",
                required = true
        )
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 50)
        String primeiroNome,

        @Schema(
                description = "Sobrenome(s)",
                example = "da Silva",
                required = true
        )
        @NotBlank(message = "O sobrenome é obrigatório")
        @Size(max = 100)
        String sobrenome,

        @Schema(
                description = "Lista de contatos telefônicos",
                required = true
        )
        @NotNull(message = "A lista de telefones não pode ser nula")
        @NotEmpty(message = "A lista de telefones não pode ser vazia")
        @Valid
        List<TelefoneDTO> telefones
) {
}
