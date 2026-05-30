package org.acme.cpu.cliente.dtos.usuario;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

public record UsuarioLogadoResponseDTO (
    @Schema(
            description = "E-mail do usuário autenticado",
            example = "usuario@acme.org",
            format = "email"
    )
    String email,

    @Schema(
            description = "Token JWT de acesso (curta duração). Deve ser enviado no Header 'Authorization: Bearer <token>' nas próximas requisições que requerem autorização.",
            example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cG4iOiJqb2F...",
            required = true
    )
    String accessToken,

    @Schema(
            description = "Token opaco para renovação (longa duração). Use este token no endpoint /refresh quando o accessToken expirar.",
            example = "550e8400-e29b-41d4-a716-446655440000",
            format = "uuid",
            required = true
    )
    String refreshToken
){}
