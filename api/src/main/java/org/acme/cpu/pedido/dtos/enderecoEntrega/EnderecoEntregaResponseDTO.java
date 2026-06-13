package org.acme.cpu.pedido.dtos.enderecoEntrega;

import org.acme.cpu.pedido.models.EnderecoEntrega;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Detalhes do de uma entrega registrado no sistema. Esse endereço não tem ID, e é uma snapshot criada a partir de um endereço de usuário")
public record EnderecoEntregaResponseDTO(

        @Schema(
                description = "Código Postal (CEP)",
                example = "77020-123"
        )
        String cep,

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
                nullable = true
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
    public EnderecoEntregaResponseDTO(EnderecoEntrega e) {
        this(
                e.getCep(),
                e.getLogradouro(),
                e.getNumero(),
                e.getComplemento(),
                e.getBairro(),
                e.getCidade(),
                e.getEstado()
        );
    }
}
