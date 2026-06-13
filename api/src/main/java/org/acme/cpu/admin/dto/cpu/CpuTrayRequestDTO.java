    package org.acme.cpu.admin.dto.cpu;
    
    import jakarta.validation.constraints.*;
    import java.math.BigDecimal;
    
    public record CpuTrayRequestDTO(
    
            @NotBlank String tipo,
    
            @NotBlank @Size(max = 20) String sku,
            @NotNull @PositiveOrZero BigDecimal preco,
            @NotNull @PositiveOrZero Integer estoque,
            @NotNull @Positive Long modeloId,
            @Size(max = 100) String nomeComercial,
            @NotNull boolean emVenda,
    
    
            @NotBlank @Size(max = 50) String loteFabricacao
    ) implements CpuRequestDTO {}