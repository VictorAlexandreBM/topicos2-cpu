package org.acme.cpu.cliente.dtos.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Credenciais para autenticação e obtenção do Token JWT")
public record UsuarioLoginDTO(

        @Schema(
                description = "E-mail cadastrado",
                example = "admin@acme.org",
                format = "email",
                required = true
        )
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @Schema(
                description = "Senha de acesso",
                example = "123456",
                writeOnly = true,
                required = true
        )
        @NotBlank(message = "A senha é obrigatória")
        String senha
) {}