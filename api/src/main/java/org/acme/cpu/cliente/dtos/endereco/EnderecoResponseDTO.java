package org.acme.cpu.cliente.dtos.endereco;

import org.acme.cpu.cliente.models.Endereco;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Detalhes do endereço registrado no sistema")
public record EnderecoResponseDTO(

        Long id,
        String cep,
        String quadra,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        Long cidadeId,
        String cidade,
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
                e.getCidade().getId(),
                e.getCidade().getNome(),
                e.getCidade().getEstado().getSigla()
        );
    }
}