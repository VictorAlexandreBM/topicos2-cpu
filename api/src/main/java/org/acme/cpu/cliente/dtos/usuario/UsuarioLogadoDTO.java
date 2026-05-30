package org.acme.cpu.cliente.dtos.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Objeto utilizado para gerenciar a sessão (Renovar Token ou Deslogar)")
public record UsuarioLogadoDTO (

        @Schema(
                description = "E-mail do usuário dono do token",
                example = "usuario@acme.org",
                format = "email",
                required = true
        )
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @Schema(
                description = "Token de longa duração (Refresh Token) que será renovado ou invalidado",
                example = "550e8400-e29b-41d4-a716-446655440000",
                format = "uuid",
                required = true
        )
        @NotBlank(message = "O token de refresh é obrigatório")
        String refreshToken
) {}
