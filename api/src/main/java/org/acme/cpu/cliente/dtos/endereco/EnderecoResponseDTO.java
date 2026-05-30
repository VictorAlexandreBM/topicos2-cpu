package org.acme.cpu.cliente.dtos.endereco;

import org.acme.cpu.cliente.models.Endereco;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Detalhes do endereço registrado no sistema")
public record EnderecoResponseDTO(

        Long id,

        @Schema(
                description = "Código Postal (CEP)",
                example = "77020-123"
        )
        String cep,

        String quadra,

        @Schema(
                description = "Nome do logradouro",
                example = "Avenida Teotônio Segurado"
        )
        String logradouro,

        @Schema(
                description = "Número do imóvel",
                example = "1500"
        )
        String numero,

        @Schema(
                description = "Complemento (se houver)",
                example = "Bloco C, Apto 402",
                nullable = true // Importante avisar que pode vir null
        )
        String complemento,

        @Schema(
                description = "Bairro ou setor",
                example = "Plano Diretor Sul"
        )
        String bairro,

        @Schema(
                description = "Cidade",
                example = "Palmas"
        )
        String cidade,

        @Schema(
                description = "Sigla do Estado (UF)",
                example = "TO"
        )
        String estado
) {
    public EnderecoResponseDTO(Endereco e) {
        this(
                e.getId(),
                e.getCep(),
                e.getQuadra(),
                e.getLogradouro(),
                e.getNumero(),
                e.getComplemento(),
                e.getBairro(),
                e.getCidade(),
                e.getEstado()
        );
    }

}

