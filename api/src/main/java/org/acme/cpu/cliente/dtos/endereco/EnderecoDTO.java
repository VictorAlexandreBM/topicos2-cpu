package org.acme.cpu.cliente.dtos.endereco;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Dados de endereço para entrega e faturamento")
public record EnderecoDTO(

        @Schema(description = "Código Postal (CEP)", example = "77020-123", pattern = "^\\d{5}-\\d{3}$", required = true)
        @NotBlank(message = "O CEP é obrigatório")
        @Pattern(regexp = "^\\d{5}-?\\d{3}$", message = "O CEP deve estar no formato 00000-000 ou 00000000")
        String cep,

        @Schema(description = "Nome da rua, avenida ou logradouro", example = "Alameda 03", required = true)
        @NotBlank(message = "O logradouro é obrigatório")
        @Size(max = 255, message = "O logradouro não pode passar de 255 caracteres")
        String logradouro,

        @Schema(description = "Nome da quadra", example = "804 sul", required = true)
        @NotBlank(message = "A quadra é obrigatória")
        @Size(max = 100, message = "A quadra não pode passar de 100 caracteres")
        String quadra,

        @Schema(description = "Número do imóvel. Use 'S/N' se não houver.", example = "7", required = true)
        @NotBlank(message = "O número é obrigatório")
        @Size(max = 20, message = "O número é muito longo")
        String numero,

        @Schema(description = "Informações adicionais (Opcional)", example = "Bloco C, Apto 402", nullable = true)
        @Size(max = 100, message = "O complemento não pode passar de 100 caracteres")
        String complemento,

        @Schema(description = "Bairro ou Setor", example = "Plano Diretor Sul", required = true)
        @NotBlank(message = "O bairro é obrigatório")
        @Size(max = 100, message = "O bairro não pode passar de 100 caracteres")
        String bairro,

        @Schema(description = "ID da cidade normalizada", example = "1", required = true)
        @NotNull(message = "A cidade é obrigatória")
        Long cidadeId
) {}