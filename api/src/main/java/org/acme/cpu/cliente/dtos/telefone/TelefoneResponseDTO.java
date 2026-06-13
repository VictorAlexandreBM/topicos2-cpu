package org.acme.cpu.cliente.dtos.telefone;

import org.acme.cpu.cliente.models.Telefone;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Contato telefônico cadastrado")
public record TelefoneResponseDTO(

        @Schema(
                description = "Número (Sem formatação)",
                example = "984961810"
        )
        String numero,

        Boolean principal
){
    public TelefoneResponseDTO(Telefone t ) {
        this(
                t.getNumero(),
                t.isPrincipal()
        );
    }
}
